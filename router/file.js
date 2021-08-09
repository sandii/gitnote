const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const express = require('express');
const prom = require('../lib/prom');
const fileRouter = express.Router();
const base = './repos/';

const ignoreList = [/^\./, /^README/, /\.sh$/, /\.doc$/, /\.docx$/];
const ignore = name => {
	for (let reg of ignoreList) {
		if (reg.test(name)) return true;
	}
	return false;
};
const getTree = (tree, dir) => {
	fs.readdirSync(dir).forEach(name => {
		let pathname = path.join(dir, name);
		
		// dir
		if (fs.lstatSync(pathname).isDirectory()) {
			if (name[0] === '.') return;
			tree[name] = {};
			getTree(tree[name], pathname);

		// file
		} else {
			if (ignore(name)) return;
			tree[name] = null;
		}
	});
};
fileRouter.get('/tree', (req, res) => {
	let tree = {};
	getTree(tree, base);
	res.send(tree);
});

fileRouter.get('/cat', (req, res) => {
	let pathname = path.join(base, req.query.pathname);
	fs.readFile(pathname, (err, file) => {
		res.send(err 
			? {code : -1, err} 
			: {code : 0, content : file.toString()}
		);
	});
});

fileRouter.get('/rename', (req, res) => {
	let { pathname, newname } = req.query;
	let index = pathname.lastIndexOf('/');
	let newpath = path.join(base, pathname.slice(0, index), newname);
	let oldpath = path.join(base, pathname);
	fs.rename(oldpath, newpath, err => {
		res.send(err ? {code : -1, err} : {code : 0});
	});
});

fileRouter.get('/newfile', (req, res) => {
	let { pathname } = req.query;
	pathname = path.join(base, pathname);
	fs.writeFile(pathname, '', err => {
		res.send(err ? {code : -1, err} : {code : 0});
	});
});

fileRouter.get('/newdir', (req, res) => {
	let { pathname } = req.query;
	pathname = path.join(base, pathname);
	fs.mkdir(pathname, err => {
		res.send(err ? {code : -1, err} : {code : 0});
	});
});

fileRouter.get('/del', (req, res) => {
	let { pathname } = req.query;
	pathname = path.join(base, pathname);
	child_process.exec(`rm -rf ${pathname}`, err => {
		res.send(err ? {code : -1, err} : {code : 0});
	});
	if (fs.lstatSync(pathname).isDirectory()) {
		fs.rmdir(pathname, err => {});
	}
});

fileRouter.get('/save', (req, res) => {
	let { pathname, md } = req.query;
	pathname = path.join(base, pathname);
	let str = fs.readFileSync(pathname).toString();
	if (str === md) {
		res.send({code : 0});
		return;
	}
	fs.writeFile(pathname, md, err => {
		res.send(err ? {code : -1, err} : {code : 0});
	});
});

fileRouter.get('/sync', (req, res) => {
	let cmds = fs.readdirSync(base).map(name => {
		// let pathname = path.join(process.cwd(), base, name);
		return [
			// `cd ${pathname}`,
			'git add -A',
			// 'git commit -m \"update\"',
			// 'git fetch',
			// 'git rebase origin/master',
			// 'git push origin master',
		].join(' && ');
	});	
	console.log(cmds);
	Promise.all(
		cmds.map(cmd => prom.exec(cmd))
	).then(stdouts => {
		res.send({code : 0, msg : stdouts});
	}).catch((err, stderr) => {
		res.send({code : -1, err, msg : stderr});
	});
});

module.exports = fileRouter;
