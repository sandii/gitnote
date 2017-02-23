import getType from './get-type';

let extend = (dst, src) => {
    if (src === null) { dst = null; return; }
    for (let k in src) {
    	let v = src[k];
    	let type = getType(v);
    	if (type !== 'array' && type !== 'object') {
    		dst[k] = v;
    	} else {
    		dst[k] = type === 'array' ? [] : {};
    		extend(dst[k], v);
    	}
    }
};

export default extend;