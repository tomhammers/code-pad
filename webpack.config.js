module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'public/bundle.js'
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
      { test: /\.useable\.css$/, loader: "style/useable!css" },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.png$/, loader: "url-loader?limit=100000" },
      { test: /\.jpg$/, loader: "file-loader" },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  externals: {
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
  devServer: {
    hot: true,
    inline: true,
    port: 7700,
    historyApiFallback: true,
    contentBase: './public'
  },
};
