import fetch from './util/fetch';
import AsideList from './component/aside-list';

class Main extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			pathArr : ['root'],
			dirList : null,
			// dirList : [{
			// 	type : 'repo',
			// 	name : 'testtest'
			// }],
			index : -1,

			md : '',
			editable : false,
		};
		this.dirTree = null;
	}

	componentDidMount () {
		this.getDirTree();
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

	changeChecked (index) { this.setState({ index }); }

	forward (index) {
		let name = this.state.dirList[index].name;
		let pathArr = this.state.pathArr.concat([name]);
		this.cd(pathArr);
	}

	back () {
		let len = this.state.pathArr.length;
		if (len <= 1) return;
		let pathArr = this.state.pathArr.slice(0, len - 1);
		this.cd(pathArr);
	}

	cd (pathArr) {
		let dirList = this.getDirList(pathArr);
		let md = '';
		this.setState({ pathArr, dirList, md });
	}

	cat (index) {
		let name = this.state.dirList[index];
		let path = this.state.pathArr.join('/');
		path = path.replace('root/', '../repo');
		path += '/' + name
		path = '../data/md.md';
		fetch.getText(path, {}).then(md => {
			this.setState({ md, editable : false })
		});
	}

	edit () {
		if (this.state.editable) return;
		this.setState({ editable : true });
	}

	save () {
		if (!this.state.editable) return;
		this.setState({ editable : false });
	}

	render () {
		return (
<section className="full">
	<header>
		<a className="icon" target="_blank" href="https://github.com/sandii"></a>
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
				className={this.state.editable ? 'save' : 'hide'}
				onClick={this.save.bind(this)}></li>
		</ul>
		<AsideList 
			data={this.state.dirList}
			index={this.state.index}
			forward={this.forward.bind(this)}
			cat={this.cat.bind(this)}
			changeChecked={this.changeChecked.bind(this)} />
	</aside>
	<nav>
		{this.state.pathArr.map(name => (
			<span>{'/ '+ name}</span>
		))}
	</nav>
	<article>
		<div dangerouslySetInnerHTML={{
			__html : this.state.editable ? new Remarkable().render(this.state.md)
		}}/>
		{}
		{ 
			? this.state.md.replace('\n', '\n\r')
			: 
		}
	</article>
</section>
		);
	}
};

ReactDOM.render(<Main />, document.body);
