import fetch from 'util/fetch';
import AsideList from 'component/aside-list';

class Main extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			pathArr : [],

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
			this.updateDirList(this.dirTree.root);
		});
	}

	updateDirList (obj) {
		let dirList = [];
		let isPic = name => {
			let lower = name.toLowerCase();
			if (lower.includes('.jpg')) return true;
			if (lower.includes('.png')) return true;
			return false;
		};
		for (let name in obj) {
			let type = obj[name] ? 'dir' : 'file';
			type = type === 'file' && isPic(name) ? 'pic' : type;
			dirList.push({ type, name });
		}

	}

	changeChecked (index) { this.setState({ index }); }

	forward (index) {}

	cat (index) {}

	render () {
		return (
			<section className="full">
				<header>
					<a className="icon" target="_blank" href="https://github.com/sandii"></a>
				</header>
				<aside>
					<ul className="aside-ctrl">
						<li className="back"></li>
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
					/ <span>root</span>
					/ <span>repo</span>
					/ <span>dir</span>
					/ <span>file</span>
					/
				</nav>
				<article></article>
			</section>
		);
	}
};

ReactDOM.render(<Main />, document.body);
