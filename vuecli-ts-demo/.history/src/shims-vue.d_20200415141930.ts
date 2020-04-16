/*
 * @Author: your name
 * @Date: 2020-04-14 17:51:01
 * @LastEditTime: 2020-04-15 14:19:30
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /vuecli-ts-demo/src/shims-vue.d.ts
 */
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
declare module "vue/types/vue" {
  interface Vue {
    $router: VueRouter; // 这表示this下有这个东西
    $route: Route;
    $https: any;
    $urls: any;
    $Message: any;
    $Modal: any;
  }
}