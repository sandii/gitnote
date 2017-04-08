const parseParam = o => {
    return Object.keys(o).map(k => k +'='+ o[k]).join('&');
};
const get = (url, param) => {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.open('GET', url +'?'+ parseParam(param));
        req.onreadystatechange = () => {
            if (req.readyState !== 4) return;
            if (req.status === 200) {
                resolve(JSON.parse(req.response));
            }else{
                reject();
            }
        }
        req.send();
    });
};
const getText = (url, param) => {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.open('GET', url +'?'+ parseParam(param));
        req.onreadystatechange = () => {
            if (req.readyState !== 4) return;
            if (req.status === 200) {
                resolve(req.response);
            }else{
                reject();
            }
        }
        req.send();
    });
};
const post = (url, param) => {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.open('POST', url);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.onreadystatechange = () => {
            if (req.readyState !== 4 ) return;
            if (req.status === 200 ) {
                resolve(JSON.parse(req.response));
            }else{
                reject();
            }
        }
        param = parseParam(param);
        req.send(param);
    });
};
let jsonpId = 0;
const jsonp = (url, param) => {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script');
        document.body.appendChild(script);

        // set callback name
        jsonpId++;
        param.callback = `jsonp${jsonpId++}`;

        // set callback
        window[param.callback] = data => {
            resolve(data);
            delete window[param.callback];
            document.body.removeChild(script);
        };
        script.onerror = reject;
        script.src = url +'?'+ parseParam(param);
    });
};
const getScript = (url, param) => {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script');
        document.body.appendChild(script);
        script.onload = resolve;
        script.onerror = reject;
        script.src = url +'?'+ parseParam(param);
    });
};

export default { get, post, jsonp, getScript, getText };
