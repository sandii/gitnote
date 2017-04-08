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
    '/file': {
      target: 'http://localhost:9000',
      changeOrigin: true
    }
  },
}).listen(config.devPort, config.devHost, (err, result) => {
  if (err) return console.log(err);
  console.log(`Listening http://${config.devHost}:${config.devPort}/`);
});