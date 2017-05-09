var webpack = require('webpack')
var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  cache: true,
  context: path.join(__dirname, ''),
  devtool: 'eval',
  entry: ['./static/js/index.js'],
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
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        include: [
          path.join(__dirname, 'static', 'js')
        ],
        query: {
          cacheDirectory: true,
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
    filename: '[name].[hash].js'
  },
  stylus: {
    use: [require('nib')()],
    import: ['~nib/lib/nib/index.styl']
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: path.join(__dirname),
      manifest: require('./dll/vendor-manifest.json')
    }),
    new HtmlWebpackPlugin({
      'title': 'INTO THE OKAVANGO',
      'filename': 'index.html',
      'template': 'templates/index.hbs',
      'hash': true
    })
  ],
  resolve: {
    root: path.resolve(__dirname, 'src', 'js'),
    modulesDirectories: ['node_modules'],
    'gl-matrix': path.resolve('./node_modules/gl-matrix/dist/gl-matrix.js'),
    'mapbox-gl/js/geo/transform': path.join(__dirname, '/node_modules/mapbox-gl/js/geo/transform'),
    'mapbox-gl': path.join(__dirname, '/node_modules/mapbox-gl/dist/mapbox-gl.js')
  }
}
