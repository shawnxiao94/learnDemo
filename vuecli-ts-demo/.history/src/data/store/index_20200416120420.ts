/*
 * @Author: your name
 * @Date: 2020-04-14 17:51:01
 * @LastEditTime: 2020-04-16 12:04:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vuecli-ts-demo/src/store/index.ts
 */
import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';

// 全局APP 信息
import app from './common/app';
// 权限数据
import permission from './common/permission';
// tagsView
import tagsView from './common/tagsView';
// 用户信息
import user from './common/user';

//页面仓库
import views from './views/index';

/**
 * 手机端适配
 *   */
import mobileApp from './common/mobile/app';
/* End */

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    tagsView,
    user,
    mobileApp,
    ...views
  },
  getters
});

export default store;
