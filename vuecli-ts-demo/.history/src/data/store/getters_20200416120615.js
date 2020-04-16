/*
 * @Author: your name
 * @Date: 2020-04-16 12:05:04
 * @LastEditTime: 2020-04-16 12:06:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vuecli-ts-demo/src/data/store/getters.js
 */
//页面仓库
import views from './modules/views/index';
let pagesGetters = {};
Object.keys(pages).forEach((item) => {
  pagesGetters[item] = (state) => state[item];
});
const getters = {
  app: (state) => state.app,
  permission: (state) => state.permission,
  tagsView: (state) => state.tagsView,
  user: (state) => state.user,
  mobileApp: (state) => state.mobileApp,
  ...pagesGetters
};
export default getters;
