/*
 * @Author: your name
 * @Date: 2020-04-16 10:58:00
 * @LastEditTime: 2020-04-16 11:00:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vuecli-ts-demo/src/filters/index.js
 */
//  通用过滤 常用方法
import * as commons from './common';
// 状态
import * as status from './status';
export default {
  ...commons,
  ...status
};
