function tip (t, delay = 5000) {
	let text = document.createTextNode(t);
	let span = document.createElement('span');
	let sect = document.createElement('section');
	sect.className = 'tip-box';
	span.appendChild(text);
	sect.appendChild(span);
	document.body.appendChild(sect);

	let timer = setTimeout(remove, delay);
	sect.addEventListener('click', remove, false);
	document.body.addEventListener('keydown', remove, false);
	function remove (e) {
		clearTimeout(timer);
		if (e) e.stopPropagation();
		document.body.removeEventListener('keydown', remove);
		if (!sect.parentNode) return;
		sect.parentNode.removeChild(sect);
	}
};
export default tip;