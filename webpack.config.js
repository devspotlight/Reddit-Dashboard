const path = require('path')
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')

const PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: PRODUCTION ? 'source-map' : 'cheap-module-source-map',
  mode: PRODUCTION ? 'production' : 'development', // See https://webpack.js.org/concepts/mode/
  // entry: path.join(__dirname, 'src', 'index.js'), // ./src/index.js is already the default.
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `app${PRODUCTION ? '.[hash]' : ''}.js`
  },
  stats: 'minimal',
  module: {
    // Loaders https://webpack.js.org/concepts/#loaders
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['lodash'],
              presets: ['@babel/preset-env']
            }
          }
        ]
      },
      {
        test: /.pug$/,
        use: ['pug-loader'] // See https://github.com/pugjs/pug-loader
      },
      {
        test: /\.css$/,
        use: [
          PRODUCTION
            ? {
                loader: MiniCssExtractPlugin.loader
              }
            : 'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader', // See https://www.npmjs.com/package/postcss-loader
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('postcss-import')({ root: loader.resourcePath }),
                require('postcss-preset-env')(),
                require('precss')()
              ]
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          output: {
            comments: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    // See https://webpack.js.org/concepts/plugins
    new HtmlPlugin({
      // See https://github.com/jantimon/html-webpack-plugin#options
      production: PRODUCTION,
      minify: PRODUCTION ? { collapseWhitespace: true } : false,
      filename: 'index.html',
      title: 'Reddit Comment Analytics',
      inject: false,
      template: path.join(__dirname, 'views', 'index.pug'),
      bodyClass: 'heroku'
    }),
    new CleanPlugin(['dist'], { root: __dirname, verbose: false }),
    new webpack.DefinePlugin({
      'process.env.KAFKA_TOPIC': JSON.stringify(
        process.env.KAFKA_PREFIX + process.env.KAFKA_TOPIC
      )
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    // // Add other themes in dev mode for easier viewing
    // ...(PRODUCTION
    //   ? []
    //   : THEMES.map((theme) =>
    //       htmlPlugin({
    //         filename: `${theme}.html`,
    //         bodyClass: theme
    //       })
    //     )),
    // Live reload for dev
    !PRODUCTION && new LiveReloadPlugin({ quiet: true })
  ].filter(Boolean)
}
