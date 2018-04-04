import tip from './util/tip';
import ask from './util/ask';
import wait from './util/wait';
import input from './util/input';
import fetch from './util/fetch';
import url from './config/url';
import AsideList from './component/aside-list';

class Main extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			pathArr : [],
			dirList : null,
			index : -1,

			md : '',
			c : false,  
		};
		this.dirTree = null;
		this.textarea = null;
	}

	componentDidMount () {
		this.getDirTree();
		document.addEventListener('keydown', this.iconShortcut.bind(this));
		document.addEventListener('keydown', this.listShortcut.bind(this));
	}

	getDirTree () {
		fetch.get(url.tree, {}).then(dirTree => {
			this.dirTree = dirTree;
			this.cd(this.state.pathArr);
		});
	}

	getDirList (pathArr) {
		let dirObj = this.dirTree;
		pathArr.forEach(name => (dirObj = dirObj[name]));
		let isPic = name => {
			let lower = name.toLowerCase();
			if (lower.includes('.jpg')) return true;
			if (lower.includes('.png')) return true;
			return false;
		};
		let dirList = [];
		for (let name in dirObj) {
			let type = dirObj[name] ? 'dir' : 'file';
			type = type === 'file' && isPic(name) ? 'pic' : type;
			dirList.push({ type, name });
		}
		return dirList;
	}

	changeChecked (index) {
		this.setState({	index, md : '',	editable : false, }); 
		setTimeout(() => this.cat());
	}

	forward (index) {
		let { dirList, pathArr } = this.state;
		if (!dirList.length) return;
		let ul = document.querySelector('.aside-list');
		let { className } = ul.childNodes[index];
		if (className.includes('file')) return;
		if (className.includes('pic'))  return;
		let name = dirList[index].name;
		pathArr = pathArr.concat([name]);
		this.cd(pathArr);
	}

	back () {
		let { pathArr } = this.state;
		if (!pathArr.length) return;
		pathArr = pathArr.slice(0, pathArr.length - 1);
		this.cd(pathArr);
	}

	home () { this.cd([]); }
	jump (e) {
		let i = e.currentTarget.getAttribute('data-i');
		this.cd(this.state.pathArr.slice(0, i + 1));
	}

	cd (pathArr) {
		let dirList = this.getDirList(pathArr);
		this.setState({
			pathArr,
			dirList,
			index : 0,
			md : '',
			editable : false
		});
		setTimeout(() => this.cat());
	}

	cat () {
		let { dirList, index } = this.state;
		if (!dirList.length) return;
		if (dirList[index].type !== 'file') return;
		let pathname = this.pwd();
		pathname = encodeURIComponent(pathname);
		fetch.get(url.cat, { pathname }).then(d => {
			if (d.code === 0) {
				this.setState({ md : d.content, editable : false })
			} else {
				tip(d.err);
			}
		});
	}

	pwd () {
		let { pathArr, dirList, index } = this.state;
		let name = dirList.length ? dirList[index].name : '';
		let path = pathArr.join('/');
		return `${path}/${name}`;
	}

	edit () {
		let { dirList, index, editable } = this.state;
		if (!dirList.length) return;
		if (dirList[index].type !== 'file') return;
		if (editable) return;
		this.setState({ editable : true });
		setTimeout(() => {
			this.textarea.spellcheck = false;
			this.textarea.focus();
		}, 0);
	}

	view () {
		if (!this.state.editable) return;
		this.save();
		this.setState({ editable : false });
	}

	save () {
		let { editable, dirList, index } = this.state;
		if (!editable) return;
		if (dirList[index].type !== 'file') return;
		let pathname = this.pwd();
		if (!pathname) return;
		let { md } = this.state;
		md = encodeURIComponent(md);
		fetch.get(url.save, { pathname, md });
	}

	sync () {
		wait('sync..');
		fetch.get(url.sync, {}).then(d => {
			wait.remove();
			tip(d.code === 0 ? 'Sync success! '+ d.msg : d.msg, 30000);
		});
	}

	newfile () {
		input('new file', '', name => {
			if (this.nameExist(name)) return;
			let pathname = this.pwd();
			let index = pathname.lastIndexOf('/');
			pathname = pathname.slice(0, index);
			pathname += '/'+ name;
			fetch.get(url.newfile, { pathname }).then(() => {
				this.updateTree(name, 'add', null);
				this.updateDirList(name, 'add', {type : 'file', name });
			});
		});
	}

	newdir () {
		input('new directory', '', name => {
			if (this.nameExist(name)) return;
			let pathname = this.pwd();
			let index = pathname.lastIndexOf('/');
			pathname = pathname.slice(0, index);
			pathname += '/'+ name;
			fetch.get(url.newdir, { pathname }).then(() => {
				this.updateTree(name, 'add', {});
				this.updateDirList(name, 'add', {type : 'dir', name });
			});
		});
	}

	rename () {
		let { dirList, index } = this.state;
		if (!dirList.length) return;
		let { name } = dirList[index];
		input('rename', name, newname => {
			if (this.nameExist(newname)) return;
			let pathname = this.pwd();
			fetch.get(url.rename, { pathname, newname }).then(d => {
				if (d.code === 0) {
					this.updateTree(name, 'rename', newname);
					this.updateDirList(name, 'rename', newname);
				} else {
					console.log(d.err);
				}
			});
		});
	}

	nameExist (name) {
		for (let o of this.state.dirList) {
			if (o.name === name) return true;
		}
		return false;
	}

	del () {
		let { dirList, index } = this.state;
		if (!dirList.length) return;
		let { name } = dirList[index];
		let pathname = this.pwd();
		if (!pathname) return;

		ask(`DELETE ${name} ?`, () => {
			fetch.get(url.del, { pathname }).then(() => {
				this.updateTree(name, 'del');
				this.updateDirList(name, 'del');
				this.changeChecked(0);
			});
		}); 
	}

	updateTree (name, action, info) {
		let dirObj = this.dirTree;
		this.state.pathArr.forEach(k => (dirObj = dirObj[k]));
		if (action === 'del') 	delete dirObj[name];
		if (action === 'add') 	dirObj[name] = info;
		if (action === 'rename') {
			dirObj[info] = dirObj[name];
			delete dirObj[name];
		}
	}

	updateDirList (name, action, info) {
		let _dirList = [];
		let { dirList } = this.state;
		if (action === 'del') {
			_dirList = dirList.filter(o => (o.name !== name));
		}
		if (action === 'add') {
			_dirList = dirList.concat(info);
		}
		if (action === 'rename') {
			_dirList = dirList.map(o => {
				if (o.name === name) o.name = info;
				return o;
			});
		}
		this.setState({ dirList : _dirList });
	}

	handleMdChange (e) { this.setState({ md : e.currentTarget.value }); }

	handleAreaKeydown (e) {
		if (e.keyCode !== 9) return;
		let str = '  ';
		let obj = e.currentTarget;
        if (document.selection) {
            var sel = document.selection.createRange();  
            sel.text = str;  
        } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {  
            var startPos = obj.selectionStart,  
                endPos = obj.selectionEnd,  
                cursorPos = startPos,  
                tmpStr = obj.value;  
            obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);  
            cursorPos += str.length;  
            obj.selectionStart = obj.selectionEnd = cursorPos;  
        } else {  
            obj.value += str;  
        }
        this.stopEvent(e);
	}

	iconShortcut (e) {
		if (e.ctrlKey && e.key === 's') {
			this.stopEvent(e);
			this.save();
		}
		if (!e.altKey) return;
		let { editable } = this.state;
		switch (e.key) {
			case 'e':
				this.stopEvent(e);
				if (editable) 	this.view();
				else 			this.edit();
				break;
			case 'F9': 	this.stopEvent(e); this.sync(); 	break;
			case 'n': 	this.stopEvent(e); this.newfile();	break;
			case 'm': 	this.stopEvent(e); this.newdir(); 	break;
			case 'r': 	this.stopEvent(e); this.rename(); 	break;
			case 'd':	this.stopEvent(e); this.del(); 		break;
			case 's': 	this.stopEvent(e); this.save(); 	break;
		}
	}

	listShortcut (e) {
		let { dirList, index, editable } = this.state;
		if (editable) return;
		let len = dirList.length;
		switch (e.key) {
			case 'ArrowUp':
				if (!len) return;
				this.stopEvent(e);
				this.changeChecked(index ? index - 1 : len - 1);
				break;
			case 'ArrowDown':
				if (!len) return;
				this.stopEvent(e);
				this.changeChecked(index === len - 1 ? 0 : index + 1);
				break;
			case 'Backspace': 	this.stopEvent(e); this.back(); 		break;
			case 'Enter': 		this.stopEvent(e); this.forward(index);	break;	
		}

		let num = Number(e.key);
		if (isNaN(num)) return;
		if (num === 0 || num > len) return;
		this.changeChecked(num - 1);
		this.stopEvent(e);
	}

	stopEvent (e) {
		e.preventDefault();
		e.stopPropagation();
	}

	render () {
		return (
<section className="full">
	<header>
		<a 
			className="icon" 
			target="_blank" 
			href="https://github.com/sandii"></a>
	</header>
	<aside>
		<ul className="aside-ctrl">
			<li 
				className="back"
				title="back - Backspace"
				onClick={this.back.bind(this)}></li>
			<li 
				className="sync"
				title="sync - Alt+F9"
				onClick={this.sync.bind(this)}></li>
			<li 
				className="newfile"
				title="newfile - Alt+n"
				onClick={this.newfile.bind(this)}></li>
			<li 
				className="newdir"
				title="newdir - Alt+m"
				onClick={this.newdir.bind(this)}></li>
			<li 
				className="rename"
				title="rename - Alt+r"
				onClick={this.rename.bind(this)}></li>
			<li 
				className="del"
				title="del - Alt+d"
				onClick={this.del.bind(this)}></li>
			<li 
				className={this.state.editable ? 'hide' : 'edit'}
				title="edit - Alt+e"
				onClick={this.edit.bind(this)}></li>
			<li 
				className={this.state.editable ? 'view' : 'hide'}
				title="view - Alt+e"
				onClick={this.view.bind(this)}></li>
		</ul>
		<AsideList 
			data={this.state.dirList}
			index={this.state.index}
			forward={this.forward.bind(this)}
			cat={this.cat.bind(this)}
			changeChecked={this.changeChecked.bind(this)} />
	</aside>
	<nav>
		<span onClick={this.home.bind(this)}>/ ROOT / </span>
		{this.state.pathArr.map((name, i) => (
			<span 
				data-i={i}
				onClick={this.jump.bind(this)}>
				{name +' / '}
			</span>
		))}
	</nav>
	<article>{
		this.state.editable ? <textarea
			value={this.state.md}
			onChange={this.handleMdChange.bind(this)}
			onKeydown={this.handleAreaKeydown.bind(this)}
			ref={textarea => this.textarea = textarea}></textarea>
		: <div dangerouslySetInnerHTML={{
			__html : new Remarkable().render(this.state.md)
		}}/>
	}</article>
</section>
		);
	}
};

ReactDOM.render(<Main />, document.body);
