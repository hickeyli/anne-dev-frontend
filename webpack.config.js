const path = require('path');

module.exports = {
  mode: 'development', // or 'production' for production builds
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // cleans the output directory before each build
  },
  devServer: {
    static: './dist',
    allowedHosts: 'localhost',
    port: 3000, // or any port you prefer
    hot: true, // enables hot module replacement
  },
  module: {
    rules: [
      // loaders for processing different file types
    ],
  },
  plugins: [
    // plugins for additional functionality
  ],
};
