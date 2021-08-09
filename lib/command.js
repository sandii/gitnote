const { promisify } = require('util');
const child_process = require('child_process');

const exec = promisify(child_process.exec);
const filter = str => str.replace(/[\n\r]/g, '');

module.exports = cmd => exec(cmd, {
	cwd: process.cwd(),
}).then(res => {
	const data = filter(res.stdout.toString());
	return Promise.resolve(data);
}).catch(err => {
	const data = JSON.stringify(err);
	return Promise.resolve(data);
});
