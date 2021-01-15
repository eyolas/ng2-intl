var path = require('path');
var webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}

module.exports = {

  mode: 'production',

  resolve: {
    extensions: ['.ts', '.js', '.html']
  },

  devtool: 'cheap-module-source-map',

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: /(node_modules)/
      }
    ]
  },

  entry: {
    app: './src/bootstrap.ts'
  },

  devServer: {
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunks: false
    },
    disableHostCheck: true
  },

  output: {
    path: root('dist'),
    filename: '[name].[hash].js',
    sourceMapFilename: '[name].[hash].map',
    chunkFilename: '[id].[hash].chunk.js'
  },

  plugins: [
    // fix the warning in ./~/@angular/core/src/linker/system_js_ng_module_factory_loader.js
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      root('./src')
    ),

    new HtmlWebpackPlugin({
      template: 'index.html',
      chunksSortMode: 'auto'
    }),

    new webpack.optimize.OccurrenceOrderPlugin(true)
  ]
};
