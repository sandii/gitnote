process是一个全局变量 常用的属性和方法：


1. `.argv`  后参数 常写作`.argv.slice( 2 )`
1. `.execArgv`  前参数
1. `.env`  当前环境信息
- `.kill( pid, [signal] )`  向进程发信息 默认为SIGTERM
- `.send( msg )` 利用ipc信道发消息
- `.connected`  与父进程的ipc信道是否通畅
返回true时可以使用process.send()方法发送消息
- `.disconnect()`  关闭与父进程的ipc信道
在父进程中使用child_process.disconnect()效果一样
- `.cwd()`  当前目录
- `.chdir( dir )`  改变当前目录
- `.exit( code )`  退出当前进程  状态码默认0
- `.exitCode`  可设置的退出状态码
- `.platform`  操作系统
- `.stdin` ` .stdout` ` .stderr` 
当做流操作即可
```
// 例 实现console.log
function log(...args){
    let s = args.join(' ') +'\n';

    process.stdout.write( str );

}
```