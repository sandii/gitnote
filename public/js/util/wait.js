let sect = null;
const stopKey = e => e.stopPropagation();

function wait (t = 'loading..') {
	let text = document.createTextNode(t);
	let span = document.createElement('span');
	sect = document.createElement('section');
	sect.className = 'wait-box';
	span.appendChild(text);
	sect.appendChild(span);
	document.body.appendChild(sect);
	document.body.addEventListener('keydown', stopKey, false);
};
wait.remove = () => {
	document.body.removeEventListener('keydown', stopKey);
	if (!sect || !sect.parentNode) return;
	sect.parentNode.removeChild(sect);
	sect = null;
};
export default wait;