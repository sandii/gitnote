function tip (t) {
	let text = document.createTextNode(t);
	let span = document.createElement('span');
	let sect = document.createElement('section');
	sect.className = 'tip-box';
	span.appendChild(text);
	sect.appendChild(span);
	document.body.appendChild(sect);

	let timer = setTimeout(remove, 1500);
	sect.addEventListener('click', remove, false);
	document.addEventListener('keydown', remove, false);
	function remove () {
		clearTimeout(timer);
		document.removeEventListener('keydown', remove);
		if (!sect.parentNode) return;
		sect.parentNode.removeChild(sect);
	}
};
export default tip;