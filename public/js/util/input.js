function input (
	t,
	value = '',
	okftn = () => {},
	noftn = () => {},
	oktext = 'Yes',
	notext = 'Cancel'
) {
	let text = document.createTextNode(t);
	let not  = document.createTextNode(notext);
	let okt  = document.createTextNode(oktext);
	let p 	 = document.createElement('p');
	let input= document.createElement('input');
	let wrap = document.createElement('div');
	let sect = document.createElement('section');
	let nobtn= document.createElement('div');
	let okbtn= document.createElement('div');

	sect.className = 'input-box';
	wrap.className = 'input-wrap';
	okbtn.className = 'input-ok';
	nobtn.className = 'input-no';
	p.appendChild(text);
	nobtn.appendChild(not);
	okbtn.appendChild(okt);
	wrap.appendChild(p);
	wrap.appendChild(input);
	wrap.appendChild(nobtn);
	wrap.appendChild(okbtn);
	sect.appendChild(wrap);
	document.body.appendChild(sect);
	input.value = value;
	input.spellcheck = false;
	input.focus();
	
	let okcbk = () => {
		let v = input.value.trim();
		if (!v) return;
		okftn(v); remove();
	}; 
	let nocbk = () => {
		noftn(); remove();
	}; 
	okbtn.addEventListener('click', okcbk, false);
	nobtn.addEventListener('click', nocbk, false);
	let keydownHandler = e => {
		if (e.key === 'Enter') 	{ okcbk(); }
		if (e.key === 'Escape')	{ nocbk(); }
		e.stopPropagation();
	}
	document.body.addEventListener('keydown', keydownHandler, false);
	function remove () {
		if (!sect.parentNode) return;
		sect.parentNode.removeChild(sect);
		document.body.removeEventListener('keydown', keydownHandler);
	}
};
export default input;