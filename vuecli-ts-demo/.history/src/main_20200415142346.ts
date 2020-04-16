/*
 * @Author: your name
 * @Date: 2020-04-14 17:51:01
 * @LastEditTime: 2020-04-15 14:23:46
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /vuecli-ts-demo/src/main.ts
 */
import Vue from "vue";
import Component from "vue-class-component";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
