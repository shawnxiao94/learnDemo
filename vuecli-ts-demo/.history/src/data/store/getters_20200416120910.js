/*
 * @Author: your name
 * @Date: 2020-04-16 12:05:04
 * @LastEditTime: 2020-04-16 12:09:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vuecli-ts-demo/src/data/store/getters.js
 */
//页面仓库
import views from './modules/views/index';
let viewsGetters = {};
Object.keys(views).forEach((item) => {
  viewsGetters[item] = (state) => state[item];
});
const getters = {
  app: (state) => state.app,
  permission: (state) => state.permission,
  tagsView: (state) => state.tagsView,
  user: (state) => state.user,
  mobileApp: (state) => state.mobileApp,
  ...viewsGetters
};
export default getters;
