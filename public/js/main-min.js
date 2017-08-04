!function(e){function t(a){if(n[a])return n[a].exports;var i=n[a]={exports:{},id:a,loaded:!1};return e[a].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="/public/js/",t(0)}([function(e,t,n){e.exports=n(1)},function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function c(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var d=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),s=n(2),o=a(s),l=n(3),u=a(l),h=n(4),f=a(h),p=n(5),m=a(p),v=n(6),y=a(v),b=n(7),k=a(b),E=n(8),w=a(E),g=function(e){function t(e){i(this,t);var n=r(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={pathArr:[],dirList:null,index:-1,md:"",c:!1},n.dirTree=null,n.textarea=null,n}return c(t,e),d(t,[{key:"componentDidMount",value:function(){this.getDirTree(),document.addEventListener("keydown",this.iconShortcut.bind(this)),document.addEventListener("keydown",this.listShortcut.bind(this))}},{key:"getDirTree",value:function(){var e=this;y.default.get(k.default.tree,{}).then(function(t){e.dirTree=t,e.cd(e.state.pathArr)})}},{key:"getDirList",value:function(e){var t=this.dirTree;e.forEach(function(e){return t=t[e]});var n=function(e){var t=e.toLowerCase();return!!t.includes(".jpg")||!!t.includes(".png")},a=[];for(var i in t){var r=t[i]?"dir":"file";r="file"===r&&n(i)?"pic":r,a.push({type:r,name:i})}return a}},{key:"changeChecked",value:function(e){var t=this;this.setState({index:e,md:"",editable:!1}),setTimeout(function(){return t.cat()})}},{key:"forward",value:function(e){var t=this.state,n=t.dirList,a=t.pathArr;if(n.length){var i=document.querySelector(".aside-list"),r=i.childNodes[e].className;if(!r.includes("file")&&!r.includes("pic")){var c=n[e].name;a=a.concat([c]),this.cd(a)}}}},{key:"back",value:function(){var e=this.state.pathArr;e.length&&(e=e.slice(0,e.length-1),this.cd(e))}},{key:"home",value:function(){this.cd([])}},{key:"jump",value:function(e){var t=e.currentTarget.getAttribute("data-i");this.cd(this.state.pathArr.slice(0,t+1))}},{key:"cd",value:function(e){var t=this,n=this.getDirList(e);this.setState({pathArr:e,dirList:n,index:0,md:"",editable:!1}),setTimeout(function(){return t.cat()})}},{key:"cat",value:function(){var e=this,t=this.state,n=t.dirList,a=t.index;if(n.length&&"file"===n[a].type){var i=this.pwd();i=encodeURIComponent(i),y.default.get(k.default.cat,{pathname:i}).then(function(t){0===t.code?e.setState({md:t.content,editable:!1}):(0,o.default)(t.err)})}}},{key:"pwd",value:function(){var e=this.state,t=e.pathArr,n=e.dirList,a=e.index,i=n.length?n[a].name:"",r=t.join("/");return r+"/"+i}},{key:"edit",value:function(){var e=this,t=this.state,n=t.dirList,a=t.index,i=t.editable;n.length&&"file"===n[a].type&&(i||(this.setState({editable:!0}),setTimeout(function(){e.textarea.focus()},0)))}},{key:"view",value:function(){this.state.editable&&(this.save(),this.setState({editable:!1}))}},{key:"save",value:function(){var e=this.state,t=e.editable,n=e.dirList,a=e.index;if(t&&"file"===n[a].type){var i=this.pwd();if(i){var r=this.state.md;r=encodeURIComponent(r),y.default.get(k.default.save,{pathname:i,md:r})}}}},{key:"sync",value:function(){(0,f.default)("sync.."),y.default.get(k.default.sync,{}).then(function(e){f.default.remove(),(0,o.default)(0===e.code?"Sync success! "+e.msg:e.msg,3e4)})}},{key:"newfile",value:function(){var e=this;(0,m.default)("new file","",function(t){if(!e.nameExist(t)){var n=e.pwd(),a=n.lastIndexOf("/");n=n.slice(0,a),n+="/"+t,y.default.get(k.default.newfile,{pathname:n}).then(function(){e.updateTree(t,"add",null),e.updateDirList(t,"add",{type:"file",name:t})})}})}},{key:"newdir",value:function(){var e=this;(0,m.default)("new directory","",function(t){if(!e.nameExist(t)){var n=e.pwd(),a=n.lastIndexOf("/");n=n.slice(0,a),n+="/"+t,y.default.get(k.default.newdir,{pathname:n}).then(function(){e.updateTree(t,"add",{}),e.updateDirList(t,"add",{type:"dir",name:t})})}})}},{key:"rename",value:function(){var e=this,t=this.state,n=t.dirList,a=t.index;if(n.length){var i=n[a].name;(0,m.default)("rename",i,function(t){if(!e.nameExist(t)){var n=e.pwd();y.default.get(k.default.rename,{pathname:n,newname:t}).then(function(n){0===n.code?(e.updateTree(i,"rename",t),e.updateDirList(i,"rename",t)):console.log(n.err)})}})}}},{key:"nameExist",value:function(e){var t=!0,n=!1,a=void 0;try{for(var i,r=this.state.dirList[Symbol.iterator]();!(t=(i=r.next()).done);t=!0){var c=i.value;if(c.name===e)return!0}}catch(e){n=!0,a=e}finally{try{!t&&r.return&&r.return()}finally{if(n)throw a}}return!1}},{key:"del",value:function(){var e=this,t=this.state,n=t.dirList,a=t.index;if(n.length){var i=n[a].name,r=this.pwd();r&&(0,u.default)("DELETE "+i+" ?",function(){y.default.get(k.default.del,{pathname:r}).then(function(){e.updateTree(i,"del"),e.updateDirList(i,"del"),e.changeChecked(0)})})}}},{key:"updateTree",value:function(e,t,n){var a=this.dirTree;this.state.pathArr.forEach(function(e){return a=a[e]}),"del"===t&&delete a[e],"add"===t&&(a[e]=n),"rename"===t&&(a[n]=a[e],delete a[e])}},{key:"updateDirList",value:function(e,t,n){var a=[],i=this.state.dirList;"del"===t&&(a=i.filter(function(t){return t.name!==e})),"add"===t&&(a=i.concat(n)),"rename"===t&&(a=i.map(function(t){return t.name===e&&(t.name=n),t})),this.setState({dirList:a})}},{key:"handleMdChange",value:function(e){this.setState({md:e.currentTarget.value})}},{key:"handleAreaKeydown",value:function(e){if(9===e.keyCode){var t="  ",n=e.currentTarget;if(document.selection){var a=document.selection.createRange();a.text=t}else if("number"==typeof n.selectionStart&&"number"==typeof n.selectionEnd){var i=n.selectionStart,r=n.selectionEnd,c=i,d=n.value;n.value=d.substring(0,i)+t+d.substring(r,d.length),c+=t.length,n.selectionStart=n.selectionEnd=c}else n.value+=t;this.stopEvent(e)}}},{key:"iconShortcut",value:function(e){if(e.ctrlKey&&"s"===e.key&&(this.stopEvent(e),this.save()),e.altKey){var t=this.state.editable;switch(e.key){case"e":this.stopEvent(e),t?this.view():this.edit();break;case"F9":this.stopEvent(e),this.sync();break;case"n":this.stopEvent(e),this.newfile();break;case"m":this.stopEvent(e),this.newdir();break;case"r":this.stopEvent(e),this.rename();break;case"d":this.stopEvent(e),this.del();break;case"s":this.stopEvent(e),this.save()}}}},{key:"listShortcut",value:function(e){var t=this.state,n=t.dirList,a=t.index,i=t.editable;if(!i){var r=n.length;switch(e.key){case"ArrowUp":if(!r)return;this.stopEvent(e),this.changeChecked(a?a-1:r-1);break;case"ArrowDown":if(!r)return;this.stopEvent(e),this.changeChecked(a===r-1?0:a+1);break;case"Backspace":this.stopEvent(e),this.back();break;case"Enter":this.stopEvent(e),this.forward(a)}var c=Number(e.key);isNaN(c)||0===c||c>r||(this.changeChecked(c-1),this.stopEvent(e))}}},{key:"stopEvent",value:function(e){e.preventDefault(),e.stopPropagation()}},{key:"render",value:function(){var e=this;return React.createElement("section",{className:"full"},React.createElement("header",null,React.createElement("a",{className:"icon",target:"_blank",href:"https://github.com/sandii"})),React.createElement("aside",null,React.createElement("ul",{className:"aside-ctrl"},React.createElement("li",{className:"back",title:"back - Backspace",onClick:this.back.bind(this)}),React.createElement("li",{className:"sync",title:"sync - Alt+F9",onClick:this.sync.bind(this)}),React.createElement("li",{className:"newfile",title:"newfile - Alt+n",onClick:this.newfile.bind(this)}),React.createElement("li",{className:"newdir",title:"newdir - Alt+m",onClick:this.newdir.bind(this)}),React.createElement("li",{className:"rename",title:"rename - Alt+r",onClick:this.rename.bind(this)}),React.createElement("li",{className:"del",title:"del - Alt+d",onClick:this.del.bind(this)}),React.createElement("li",{className:this.state.editable?"hide":"edit",title:"edit - Alt+e",onClick:this.edit.bind(this)}),React.createElement("li",{className:this.state.editable?"view":"hide",title:"view - Alt+e",onClick:this.view.bind(this)})),React.createElement(w.default,{data:this.state.dirList,index:this.state.index,forward:this.forward.bind(this),cat:this.cat.bind(this),changeChecked:this.changeChecked.bind(this)})),React.createElement("nav",null,React.createElement("span",{onClick:this.home.bind(this)},"/ ROOT / "),this.state.pathArr.map(function(t,n){return React.createElement("span",{"data-i":n,onClick:e.jump.bind(e)},t+" / ")})),React.createElement("article",null,this.state.editable?React.createElement("textarea",{value:this.state.md,onChange:this.handleMdChange.bind(this),onKeydown:this.handleAreaKeydown.bind(this),ref:function(t){return e.textarea=t}}):React.createElement("div",{dangerouslySetInnerHTML:{__html:(new Remarkable).render(this.state.md)}})))}}]),t}(React.Component);ReactDOM.render(React.createElement(g,null),document.body)},function(e,t){"use strict";function n(e){function t(e){clearTimeout(c),e&&e.stopPropagation(),document.body.removeEventListener("keydown",t),r.parentNode&&r.parentNode.removeChild(r)}var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:5e3,a=document.createTextNode(e),i=document.createElement("span"),r=document.createElement("section");r.className="tip-box",i.appendChild(a),r.appendChild(i),document.body.appendChild(r);var c=setTimeout(t,n);r.addEventListener("click",t,!1),document.body.addEventListener("keydown",t,!1)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=n},function(e,t){"use strict";function n(e){function t(){u.parentNode&&(u.parentNode.removeChild(u),document.body.removeEventListener("keydown",p))}var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){},a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){},i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"Yes",r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"Cancel",c=document.createTextNode(e),d=document.createTextNode(r),s=document.createTextNode(i),o=document.createElement("p"),l=document.createElement("div"),u=document.createElement("section"),h=document.createElement("div"),f=document.createElement("div");u.className="ask-box",l.className="ask-wrap",f.className="ask-ok",h.className="ask-no",o.appendChild(c),h.appendChild(d),f.appendChild(s),l.appendChild(o),l.appendChild(h),l.appendChild(f),u.appendChild(l),document.body.appendChild(u),f.addEventListener("click",function(){n(),t()},!1),h.addEventListener("click",function(){a(),t()},!1);var p=function(e){"Enter"===e.key&&(n(),t()),"Escape"===e.key&&(a(),t()),e.stopPropagation()};document.body.addEventListener("keydown",p,!1)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=n},function(e,t){"use strict";function n(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"loading..",t=document.createTextNode(e),n=document.createElement("span");a=document.createElement("section"),a.className="wait-box",n.appendChild(t),a.appendChild(n),document.body.appendChild(a),document.body.addEventListener("keydown",i,!1)}Object.defineProperty(t,"__esModule",{value:!0});var a=null,i=function(e){return e.stopPropagation()};n.remove=function(){document.body.removeEventListener("keydown",i),a&&a.parentNode&&(a.parentNode.removeChild(a),a=null)},t.default=n},function(e,t){"use strict";function n(e){function t(){f.parentNode&&(f.parentNode.removeChild(f),document.body.removeEventListener("keydown",b))}var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){},i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(){},r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"Yes",c=arguments.length>5&&void 0!==arguments[5]?arguments[5]:"Cancel",d=document.createTextNode(e),s=document.createTextNode(c),o=document.createTextNode(r),l=document.createElement("p"),u=document.createElement("input"),h=document.createElement("div"),f=document.createElement("section"),p=document.createElement("div"),m=document.createElement("div");f.className="input-box",h.className="input-wrap",m.className="input-ok",p.className="input-no",l.appendChild(d),p.appendChild(s),m.appendChild(o),h.appendChild(l),h.appendChild(u),h.appendChild(p),h.appendChild(m),f.appendChild(h),document.body.appendChild(f),u.value=n,u.focus();var v=function(){var e=u.value.trim();e&&(a(e),t())},y=function(){i(),t()};m.addEventListener("click",v,!1),p.addEventListener("click",y,!1);var b=function(e){"Enter"===e.key&&v(),"Escape"===e.key&&y(),e.stopPropagation()};document.body.addEventListener("keydown",b,!1)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=n},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){return Object.keys(e).map(function(t){return t+"="+e[t]}).join("&")},a=function(e,t){return new Promise(function(a,i){var r=new XMLHttpRequest;r.open("GET",e+"?"+n(t)),r.onreadystatechange=function(){4===r.readyState&&(200===r.status?a(JSON.parse(r.response)):i())},r.send()})},i=function(e,t){return new Promise(function(a,i){var r=new XMLHttpRequest;r.open("GET",e+"?"+n(t)),r.onreadystatechange=function(){4===r.readyState&&(200===r.status?a(r.response):i())},r.send()})},r=function(e,t){return new Promise(function(a,i){var r=new XMLHttpRequest;r.open("POST",e),r.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),r.onreadystatechange=function(){4===r.readyState&&(200===r.status?a(JSON.parse(r.response)):i())},t=n(t),r.send(t)})},c=0,d=function(e,t){return new Promise(function(a,i){var r=document.createElement("script");document.body.appendChild(r),c++,t.callback="jsonp"+c++,window[t.callback]=function(e){a(e),delete window[t.callback],document.body.removeChild(r)},r.onerror=i,r.src=e+"?"+n(t)})},s=function(e,t){return new Promise(function(a,i){var r=document.createElement("script");document.body.appendChild(r),r.onload=a,r.onerror=i,r.src=e+"?"+n(t)})};t.default={get:a,post:r,jsonp:d,getScript:s,getText:i}},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={tree:"/file/tree",cat:"/file/cat",save:"/file/save",sync:"/file/sync",newfile:"/file/newfile",newdir:"/file/newdir",rename:"/file/rename",del:"/file/del"}},function(e,t){"use strict";function n(e){function t(t){var n=t.currentTarget,a=n.className,i=parseInt(n.getAttribute("data-i"));return a.includes("checked")?void(a.includes("pic")||(a.includes("dir")&&e.forward(i),a.includes("rep")&&e.forward(i))):void e.changeChecked(i)}if(!e.data)return null;var n=e.data.map(function(n,a){var i=a==e.index?" checked":"";return React.createElement("li",{className:n.type+i,title:n.name,"data-i":a,onClick:t},n.name)});return React.createElement("ul",{className:"aside-list"},n)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=n}]);