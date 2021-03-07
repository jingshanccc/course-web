'use strict'
const path = require('path')
const setting = require('./src/settings')

const title = setting.title
const port = 8000

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    // 解决 Invalid Host Header
    disableHostCheck: true,
    port: port,
    open: true, // 运行之后是否自动打开浏览器
    overlay: { // 浏览器是否显示警告/错误
      warnings: false,
      errors: true
    },
    proxy: {
      'api': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/api': 'api'
        }
      }
      // 'auth': {
      //     target: process.env.VUE_APP_BASE_API,
      //     changeOrigin: true,
      //     pathRewrite: {
      //         '^/auth': 'auth'
      //     }
      // },
    }
  },
  configureWebpack: {
    name: title,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}
