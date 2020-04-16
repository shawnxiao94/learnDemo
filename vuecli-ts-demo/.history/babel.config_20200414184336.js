/*
 * @Author: your name
 * @Date: 2020-04-14 17:51:01
 * @LastEditTime: 2020-04-14 18:43:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vuecli-ts-demo/babel.config.js
 */
module.exports = {
  presets: ["@vue/app"],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk"
      }
    ]
  ]
};
