const fs = require('fs');
const express = require('express');
const fileRouter = require('./router/file');

const app = express();
app.listen(9000);
app.use('/public', express.static('./public'));
app.use('/file', fileRouter);
app.get('/favicon.ico', (req, res) => {
	fs.createReadStream('./favicon.ico').pipe(res);
});

