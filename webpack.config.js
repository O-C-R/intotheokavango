var debug = process.env.NODE_ENV !== 'production'
var webpack = require('webpack')
var path = require('path')

module.exports = {
  context: path.join(__dirname, ''),
  devtool: debug ? 'inline-sourcemap' : null,
  entry: ['babel-polyfill', './static/js/index.js'],
  resolve: {
    alias: {
      'webworkify': 'webworkify-webpack',
      'sinon': 'sinon/pkg/sinon'
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
      }, {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        include: path.resolve('node_modules/mapbox-gl-shaders/index.js'),
        loader: 'transform/cacheable?brfs'
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
  devServer: {
    host: '0.0.0.0',
    proxy: {
      '/api/v1/*': 'http://localhost:3000'
    },
    historyApiFallback: true
  },
  output: {
    path: __dirname + '/static/js/',
    filename: 'index-babel.js'
  },
  stylus: {
    use: [require('nib')()],
    import: ['~nib/lib/nib/index.styl']
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ]
}
