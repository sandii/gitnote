let parseParam = o => {
    let arr = [];
    for (let k in o) {
        arr.push(`${k}=${o[k]}`);
    }
    return arr.join('&');
};
let get = (url, param) => {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        param = parseParam(param);
        url = url +'?'+ param;
        req.open('GET', url);
        req.onreadystatechange = () => {
            if (req.readyState !== 4 ) return;
            if (req.status === 200 ) {
                let data = JSON.parse(req.response);
                resolve(data);
            }else{
                reject();
            }
        }
        req.send();
    });
};
let getText = (url, param) => {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        param = parseParam(param);
        url = url +'?'+ param;
        req.open('GET', url);
        req.onreadystatechange = () => {
            if (req.readyState !== 4 ) return;
            if (req.status === 200 ) {
                resolve(req.response);
            }else{
                reject();
            }
        }
        req.send();
    });
};
let post = (url, param) => {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.open('POST', url);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.onreadystatechange = () => {
            if (req.readyState !== 4 ) return;
            if (req.status === 200 ) {
                let data = JSON.parse(req.response);
                resolve(data);
            }else{
                reject();
            }
        }
        param = parseParam(param);
        req.send(param);
    });
};
let jsonpId = 0;
let jsonp = (url, param) => {
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
let getScript = (url, param) => {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script');
        document.body.appendChild(script);
        script.onload = resolve;
        script.onerror = reject;
        script.src = url +'?'+ parseParam(param);
    });
};

export default { get, post, jsonp, getScript, getText };
