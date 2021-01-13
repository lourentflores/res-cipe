const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  target: 'web',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  devServer: {
    hot: true,
    port: 8080,
    proxy: {
      '/dashboard': 'http://localhost:3000/',
      '/login': 'http://localhost:3000/',
      '/signup': 'http://localhost:3000/',
    },
    publicPath: '/build',
  },
  module: {
    rules: [
      {
        test: /\.(js)x?$/,
        exclude: /(node_modules)/,
        include: [path.resolve(__dirname, 'src')],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
        resolve: {
          extensions: ['.js', '.jsx', '.json'],
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
