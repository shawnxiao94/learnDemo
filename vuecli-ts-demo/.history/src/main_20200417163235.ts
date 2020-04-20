/*
 * @Author: your name
 * @Date: 2020-04-14 17:51:01
 * @LastEditTime: 2020-04-17 16:31:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vuecli-ts-demo/src/main.ts
 */
import Vue from 'vue';
import Component from 'vue-class-component';
import App from './App.vue';
import router from './router';
import store from './data/store';

/*
 * UI框架相关
 *
 */
// 注册按需引入的element-ui组件
import element from './element/index';
Vue.use(element);
// import 'element-ui/lib/theme-chalk/index.css'
// 翻译库
// import i18n from './common/lang'

/*
 * 样式相关
 *
 */
// 初始化样式
import 'normalize.css/normalize.css';
import '@/assets/styles';
// SVG 图标
// import '@/assets/icons'

/*
 * JS相关
 *
 */

// 权限拦截器
// import './common/permission'
// Mock Server
import './data/mock/index';
// 全局vue模板filters过滤器
// import filters from '@/common/filters';
// console.log(filters);
// 本页全局directive指令
// import directives from './common/directives'
// 引入正则校验
// import Validate from '@/common/validate/index.js'

// 引入自定义 全局组件
import 'components';

// 注册vue模板过滤器
// Object.keys(filters).forEach((key) => {
//   Vue.filter(key, filters[key]);
// });

// 注册全局指令方法
// Object.keys(directives).forEach(key => {
//   Vue.directive(key, directives[key])
// })

// 全局验证
// Vue.use(Validate)

Vue.config.productionTip = false;

// https://www.npmjs.com/package/vue-class-component#adding-custom-hooks
Component.registerHooks(['beforeRouteEnter', 'beforeRouteLeave', 'beforeRouteUpdate']);

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
