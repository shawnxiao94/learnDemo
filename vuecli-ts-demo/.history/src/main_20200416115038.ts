/*
 * @Author: your name
 * @Date: 2020-04-14 17:51:01
 * @LastEditTime: 2020-04-16 11:50:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vuecli-ts-demo/src/main.ts
 */
import Vue from 'vue';
import Component from 'vue-class-component';
import App from './App.vue';
import router from './router';
import store from './data/store';

Vue.config.productionTip = false;

// https://www.npmjs.com/package/vue-class-component#adding-custom-hooks
Component.registerHooks(['beforeRouteEnter', 'beforeRouteLeave', 'beforeRouteUpdate']);

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
