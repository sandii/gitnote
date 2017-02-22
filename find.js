const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
const dir = argv[0] || './';
const target = argv[1];
if (!target) {
	console.warn('nothing to find..');
	return;
}
const reg = new RegExp(target);
const needReplace = argv[2] === 'to';
const rep = argv[3];

traverse(dir, (str, pathname) => {
	console.log(pathname);
	if (!needReplace) return;
	str = str.replace(reg, rep);
	fs.writeFileSync(pathname, str);
});
function traverse (dir, cbk) {
	fs.readdirSync(dir).forEach(name => {
		let pathname = path.join(dir, name);
		if (fs.lstatSync(pathname).isDirectory()) {
			traverse(pathname, cbk);
		} else {
			let str = fs.readFileSync(pathname).toString();
			if (str.match(reg)) {
				cbk(str, pathname);
			}
		}
	});
}
