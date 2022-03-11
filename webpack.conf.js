module.exports = {
  entry: {
    parchment: './src/parchment.ts',
  },
  output: {
    filename: '[name].js',
    library: {
      name: 'Parchment',
      type: 'umd',
    },
    path: __dirname + '/dist',
    // https://github.com/webpack/webpack/issues/6525
    globalObject: `(() => {
        if (typeof self !== 'undefined') {
            return self;
        } else if (typeof window !== 'undefined') {
            return window;
        } else if (typeof global !== 'undefined') {
            return global;
        } else {
            return Function('return this')();
        }
    })()`,
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [{ test: /\.ts$/, use: 'ts-loader' }],
  },
  devtool: 'source-map',
  mode: 'production',
};
