module.exports = {
  entry: './src/main.js',
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
      }
    ]
  },
  plugins: [
    new (require('html-webpack-plugin'))(
      {
        template: 'index.html',
        filename: 'index.html'
      }
    )
  ],
  mode: 'development',
  optimization: {
    minimize: false
  }
};
