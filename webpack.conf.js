var path = require('path');

module.exports = {
  entry: ['./src/parchment.ts'],
  output: {
    filename: 'parchment.js',
    library: 'Parchment',
    libraryTarget: 'umd',
    path: path.join(__dirname, 'dist')
  },
  resolve: {
    extensions: ['', '.js', '.ts']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  ts: {
    silent: true
  }
};
