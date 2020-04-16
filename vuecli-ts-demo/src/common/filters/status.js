/*
 * @Author: your name
 * @Date: 2020-04-16 11:00:51
 * @LastEditTime: 2020-04-16 11:01:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vuecli-ts-demo/src/filters/status.js
 */
// 未生效、生效中、已生效
export function statusFilters(val) {
  if (Number(val) === 1) {
    return '生效中';
  } else if (Number(val) === 2) {
    return '未生效';
  } else if (Number(val) === 0) {
    return '已失效';
  }
}
