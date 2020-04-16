/*
 * @Author: your name
 * @Date: 2020-04-14 17:51:01
 * @LastEditTime: 2020-04-15 15:27:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vuecli-ts-demo/babel.config.js
 */
const plugins = [
  [
    'component',
    {
      libraryName: 'element-ui',
      styleLibraryName: 'theme-chalk'
    }
  ]
]
if (['production', 'prod'].includes(process.env.NODE_ENV)) {
  // 生产环境去除console.log
  plugins.push('transform-remove-console')
}
module.exports = {
  //  IE 兼容配置
  presets: [['@vue/app', { useBuiltIns: 'entry' }]],
  plugins: plugins
};
