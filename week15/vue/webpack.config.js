module.exports = {
  entry: './main.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            ['@babel/plugin-transform-react-jsx', { pragma: 'create' }],
          ]
        }
      },
      {
        test: /\.view$/,
        loader: './view-loader'
      }
    ]
  },
  mode: 'development',
  optimization: {
    minimize: false
  }
}