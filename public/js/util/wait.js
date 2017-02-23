let sect = null;
function wait (t = 'loading..') {
	let text = document.createTextNode(t);
	let span = document.createElement('span');
	sect = document.createElement('section');
	sect.className = 'wait-box';
	span.appendChild(text);
	sect.appendChild(span);
	document.body.appendChild(sect);
};
wait.remove = () => {
	if (!sect || !sect.parentNode) return;
	sect.parentNode.removeChild(sect);
	sect = null;
};
export default wait;