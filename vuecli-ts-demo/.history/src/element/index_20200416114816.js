/*
 * @Author: your name
 * @Date: 2020-04-16 11:48:03
 * @LastEditTime: 2020-04-16 11:48:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vuecli-ts-demo/src/element/index.js
 */
import Vue from 'vue';
// 导入自己需要的组件
import { Tooltip, Notification } from 'element-ui';
Vue.prototype.$notify = Notification;
const element = {
  install: function(Vue) {
    Vue.use(Tooltip);
    // Vue.use(Notification)
  }
};
export default element;
