/**
 * Adapted from angular2-webpack-starter
 */

const webpack = require('webpack');

/**
 * Webpack Plugins
 */
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

module.exports = {
  devtool: 'inline-source-map',

  resolve: {
    extensions: ['.ts', '.js']
  },

  entry: './module/index.ts',

  output: {
    path: 'dist/bundles',
    publicPath: '/',
    filename: 'ng2-intl.umd.js',
    libraryTarget: 'umd',
    library: 'ng2-intl'
  },

  // require those dependencies but don't bundle them
  externals: [
    /^\@angular\//,
    /^rxjs\//
  ],

  module: {
    rules: [{
      enforce: 'pre',
      test: /\.ts$/,
      loader: 'tslint-loader',
      exclude: ['./node_modules']
    }, {
      test: /\.ts$/,
      loader: 'awesome-typescript-loader?declaration=false',
      exclude: [/\.e2e\.ts$/]
    }]
  },

  plugins: [
    // fix the warning in ./~/@angular/core/src/linker/system_js_ng_module_factory_loader.js
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      './module'
    ),

    new webpack.LoaderOptionsPlugin({
      options: {
        tslintLoader: {
          emitErrors: false,
          failOnHint: false
        }
      }
    })
  ]
};
