import fetch from './util/fetch';
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
	}

	componentDidMount () {
		this.getDirTree();
		window.addEventListener('keydown', this.handleKeyDown.bind(this));
	}

	getDirTree () {
		fetch.get('../data/dir-tree.json', {}).then(dirTree => {
			this.dirTree = dirTree;
			this.cd(this.state.pathArr);
		});
	}

	getDirList (pathArr) {
		let dirObj = this.dirTree;
		pathArr.forEach(name => {
			dirObj = dirObj[name];
		});
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
		let path = this.pwd();
		path = '../data/md.md'; //todo
		fetch.getText(path, {}).then(md => {
			this.setState({ md, editable : false })
		});
	}

	pwd () {
		let { pathArr, dirList, index } = this.state;
		if (!dirList.length) return '';
		let { name } = dirList[index];
		let path = pathArr.join('/');
		return `../repo/${path}/${name}`;
	}

	edit () {
		if (this.state.editable) return;
		this.setState({ editable : true });
	}

	view () {
		if (!this.state.editable) return;
		this.save();
		this.setState({ editable : false });
	}

	save () {
		let path = this.pwd();
		if (!path) return;
		let { md } = this.state;
		fetch.post('../data/ok.json', { path, md });
	}

	sync () {}
	niu () {}
	rename () {}
	del () {}

	handleMdChange (e) { this.setState({ md : e.currentTarget.value }); }

	handleKeyDown (e) {
		if (!e.ctrlKey) return;
		let { dirList, index, editable } = this.state;
		switch (e.key) {
			case 'ArrowUp':
				if (!index) return;
				this.changeChecked(index - 1);
				break;
			case 'ArrowDown':
				if (index >= dirList.length - 1) return;
				this.changeChecked(index + 1);
				break;
			case 'b':
				if (editable) 	this.view();
				else 			this.edit();
				break;

			case 'Backspace': 	this.back(); 		break;
			case 'Enter': 		this.forward(index);break;	
			case 'F9': 			this.sync(); 		break;
			case 'n': 			this.niu(); 		break;
			case 'm': 			this.rename(); 		break;
			case 'Delete':		this.del(); 		break;
			case 's': 			e.preventDefault(); this.save(); break;
		}		
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
				onClick={this.back.bind(this)}></li>
			<li className="sync"></li>
			<li className="add"></li>
			<li className="rename"></li>
			<li className="del"></li>
			<li 
				className={this.state.editable ? 'hide' : 'edit'}
				onClick={this.edit.bind(this)}></li>
			<li 
				className={this.state.editable ? 'view' : 'hide'}
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
			onChange={this.handleMdChange.bind(this)}></textarea>
		: <div dangerouslySetInnerHTML={{
			__html : new Remarkable().render(this.state.md)
		}}/>
	}</article>
</section>
		);
	}
};

ReactDOM.render(<Main />, document.body);
