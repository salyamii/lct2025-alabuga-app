const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "util": require.resolve("util/"),
        "zlib": require.resolve("browserify-zlib"),
        "stream": require.resolve("stream-browserify"),
        "url": require.resolve("url/"),
        "crypto": require.resolve("crypto-browserify"),
        "assert": require.resolve("assert/"),
      };
      return webpackConfig;
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://91.219.150.15',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};
