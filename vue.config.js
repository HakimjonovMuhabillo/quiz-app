const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  base: '/quiz-app/',
  transpileDependencies: true
})

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
};
