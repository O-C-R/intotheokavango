var development = process.env.NODE_ENV !== 'production'
var webpack = require('webpack')
var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin');

function isExternal(module) {
  var userRequest = module.userRequest;

  if (typeof userRequest !== 'string') {
    return false;
  }

  return userRequest.indexOf('bower_components') >= 0 ||
         userRequest.indexOf('node_modules') >= 0 ||
         userRequest.indexOf('libraries') >= 0;
}

module.exports = {
  context: path.join(__dirname, ''),
  devtool: development ? 'inline-sourcemap' : null,
  entry: ['./static/js/index.js'],
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
        test: /\.hbs$/,
        loader: 'handlebars-loader'
      },
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
    path: path.join(__dirname),
    filename: '[name].'+(development ? '[hash]' : '[chunkhash]')+'.js'
  },
  stylus: {
    use: [require('nib')()],
    import: ['~nib/lib/nib/index.styl']
  },
  plugins: development ? [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: function(module) {
        return isExternal(module);
      }
    }),
    new HtmlWebpackPlugin({
      'title': 'INTO THE OKAVANGO',
      'filename': 'index.html',
      'template': 'templates/index.hbs',
      'hash': true
    })
  ] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: function(module) {
        return isExternal(module);
      }
    }),
    new webpack.optimize.UglifyJsPlugin({ minimize: true, comments: false, mangle: false, sourcemap: false }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': (function(){
          return JSON.stringify(process.env.NODE_ENV)
        })()
      }
    }),
    new HtmlWebpackPlugin({
      'title': 'INTO THE OKAVANGO',
      'filename': 'index.html',
      'template': 'templates/index.hbs',
      'hash': true
    })
  ]
}
