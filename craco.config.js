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
        secure: false,
        pathRewrite: {
          '^/api': ''
        },
        bypass: function(req, res, proxyOptions) {
          // Обрабатываем preflight OPTIONS запросы локально
          if (req.method === 'OPTIONS') {
            res.writeHead(200, {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              'Access-Control-Max-Age': '86400',
            });
            res.end();
            return false;
          }
        },
        onProxyRes: (proxyRes, req, res) => {
          // Добавляем CORS заголовки к ответу
          proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
          proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
        }
      }
    }
  }
};
