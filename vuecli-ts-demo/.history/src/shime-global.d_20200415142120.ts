/*
 * @Author: your name
 * @Date: 2020-04-15 14:21:09
 * @LastEditTime: 2020-04-15 14:21:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vuecli-ts-demo/src/shime-global.d.ts
 */
// 声明全局的 window ，不然使用 window.XX 时会报错
// declare var window: Window;
declare var document: Document;
declare var THREE: any;

// interface THREE extends Window {}

declare module "element-ui/lib/transitions/collapse-transition";
declare module "element-ui";