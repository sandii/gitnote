const fs = require('fs');
const express = require('express');
const opn = require('opn');
const fileRouter = require('./router/file');

const app = express();
app.listen(9000);
app.use('/public', express.static('./public'));
app.use('/repos',  express.static('./repos'));
app.use('/file', fileRouter);
app.get('/favicon.ico', (req, res) => {
	fs.createReadStream('./favicon.ico').pipe(res);
});

const DEBUG = process.env.NODE_ENV === 'DEBUG';
const port = DEBUG ? 3000 : 9000;
opn('http://localhost:'+ port +'/public/main-dev.html');