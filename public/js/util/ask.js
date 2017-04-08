function ask (
	t,
	okftn = () => {},
	noftn = () => {},
	oktext = 'Yes',
	notext = 'Cancel'
) {
	let text = document.createTextNode(t);
	let not  = document.createTextNode(notext);
	let okt  = document.createTextNode(oktext);
	let p 	 = document.createElement('p');
	let wrap = document.createElement('div');
	let sect = document.createElement('section');
	let nobtn= document.createElement('div');
	let okbtn= document.createElement('div');

	sect.className = 'ask-box';
	wrap.className = 'ask-wrap';
	okbtn.className = 'ask-ok';
	nobtn.className = 'ask-no';
	p.appendChild(text);
	nobtn.appendChild(not);
	okbtn.appendChild(okt);
	wrap.appendChild(p);
	wrap.appendChild(nobtn);
	wrap.appendChild(okbtn);
	sect.appendChild(wrap);
	document.body.appendChild(sect);
	
	okbtn.addEventListener('click', () => { okftn(); remove(); }, false);
	nobtn.addEventListener('click', () => { noftn(); remove(); }, false);
	let keydownHandler = e => {
		if (e.key === 'Enter') 	{ okftn(); remove(); }
		if (e.key === 'Escape')	{ noftn(); remove(); }
		e.stopPropagation();
	}
	document.body.addEventListener('keydown', keydownHandler, false);
	function remove () {
		if (!sect.parentNode) return;
		sect.parentNode.removeChild(sect);
		document.body.removeEventListener('keydown', keydownHandler);
	}
};
export default ask;