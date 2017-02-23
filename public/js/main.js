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
		};
		this.dirTree = null;
	}

	componentDidMount () {
		this.getDirTree();
	}

	getDirTree () {
		fetch.get('../data/dir-tree.json', {}).then(dirTree => {
			this.dirTree = dirTree;
			let dirList = this.getDirList(this.state.pathArr);
			this.setState({ dirList });
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
		let dirList = this.getDirList(pathArr);
		this.setState({ pathArr, dirList });
	}

	back () {
		let len = this.state.pathArr.length;
		if (len <= 1) return;
		let pathArr = this.state.pathArr.slice(0, len - 1);
		let dirList = this.getDirList(pathArr);
		this.setState({ pathArr, dirList });
	}

	cat (index) {}

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
			<li className="edit"></li>
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
	<article></article>
</section>
		);
	}
};

ReactDOM.render(<Main />, document.body);
