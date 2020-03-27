const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    createProxyMiddleware('/system', {
      target: 'http://192.168.2.82:9527',
      changeOrigin: true,
      pathRewrite: {
        '^/system': '/'
      }
    })
  )
  app.use(
    createProxyMiddleware('/adc', {
      target: 'http://192.168.2.82:8010',
      changeOrigin: true,
      pathRewrite: {
        '^/adc': '/'
      }
    })
  )
}
