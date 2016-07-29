// var debug = process.env.NODE_ENV !== "production";
var debug = false
var webpack = require('webpack');
var path = require('path');

module.exports = {
  // context: path.join(__dirname, "src"),
  devtool: debug ? "inline-sourcemap" : null,
  entry: ['./static/js/index.js'],
  resolve: {
    alias: {
      'webworkify': 'webworkify-webpack',
      'sinon': 'sinon/pkg/sinon',
      'react': path.resolve('./node_modules/react'),
    }
  },
  module: {
    noParse: [
      /node_modules\/sinon\//
    ],
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      }, 
      {
          test: /render[\/\\]shaders\.js$/,
          loader: 'transform/cacheable',
          query: "brfs"
      },
      {
          test: /[\/\\]webworkify[\/\\]index.js\.js$/,
          loader: 'worker'
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
        }
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        test: /\.(eot|svg|ttf|otf|woff|woff2)$/,
        loader: 'file?name=fonts/[name].[ext]'
      }
    ],
    postLoaders: [
      {
        include: /node_modules\/mapbox-gl-shaders/,
        loader: 'transform',
        query: 'brfs'
      }
    ]
  },
  output: {
    path: __dirname + "/static/js/",
    filename: "index-babel.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ]
};


