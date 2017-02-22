const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  contentBase: __dirname,
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  proxy: {
    '/city': {
      target: 'http://m.gugusuyun.com',
      changeOrigin: true
    },
    '/test': {
      target: 'http://chenzhi.bid:9000',
      changeOrigin: true
    },
    '/OneMenu' : {
      target : 'http://172.18.24.35:8080',
      changeOrigin: true
    }
  },
}).listen(config.devPort, config.devHost, (err, result) => {
  if (err) return console.log(err);
  console.log(`Listening http://${config.devHost}:${config.devPort}/`);
});