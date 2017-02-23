function AsideList (props) {
	if (!props.data) return null;
	let items = props.data.map((o, i) => {
		let checked = i == props.index ? ' checked' : '';
		return (
			<li 
				className={o.type + checked}
				data-i={i}
				onClick={handleClick}>{o.name}</li>
		);
	});

	function handleClick (e) {
		let el = e.currentTarget;
		let className = el.className;
		let index = parseInt(el.getAttribute('data-i'));
		if (!className.includes('checked')) {
			props.changeChecked(index);
			return;
		}
		if (className.includes('pic')) return;
		if (className.includes('dir')) props.forward(index);
		if (className.includes('rep')) props.forward(index);
		if (className.includes('file'))props.cat(index);
	}

	return (<ul className="aside-list">{items}</ul>);
}

export default AsideList;