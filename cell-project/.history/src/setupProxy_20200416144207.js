/*
 * @Author: your name
 * @Date: 2020-04-16 14:40:43
 * @LastEditTime: 2020-04-16 14:42:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /cell-project/src/setupProxy.js
 */
// 配置代理,无需单独应用，webpack会自动引入文件此文件
const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(proxy('/house', { target: 'https://evaluatepre.jd.com' }))
  app.use(proxy('/vehicle', { target: 'https://evaluatepre.jd.com' }))
  app.use(
    proxy('/user', {
      target: 'https://test.com',
      changeOrigin: true,
    }),
  )
}
