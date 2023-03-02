const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container

const shared = {
  vue: {
    singleton: true,
  },
  'vue-demi': {},
  '@vue/composition-api': {
    singleton: true,
  },
}

const swcLoader = {
  test: /\.m?js$/,
  exclude: /(node_modules)/,
  use: {
    loader: 'swc-loader'
  },
}

module.exports = (env = {}) => ({
  mode: 'development',
  cache: true,
  target: 'web',
  devtool: false,
  entry: path.resolve(__dirname, './src/main.js'),
  output: {
    publicPath: '/',
  },
  resolve: {
    extensions: ['.vue', '.jsx', '.js', '.json'],
    alias: {
      // this isn't technically needed, since the default `vue` entry for bundlers
      // is a simple `export * from '@vue/runtime-dom`. However having this
      // extra re-export somehow causes webpack to always invalidate the module
      // on the first HMR update and causes the page to reload.
      // vue: "@vue/runtime-dom",
    },
  },
  module: {
    rules: [
      swcLoader,
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'vue-demi-test',
      library: { type: 'var', name: 'o2_mkt' },
      filename: 'remoteEntry.js',
      shared,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname),
    },
    compress: true,
    port: 5001,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },
})
