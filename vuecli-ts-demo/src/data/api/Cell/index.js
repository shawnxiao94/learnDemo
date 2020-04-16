/*
 * @Author: your name
 * @Date: 2020-04-16 11:54:21
 * @LastEditTime: 2020-04-16 11:56:51
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /vuecli-ts-demo/src/data/api/Cell/index.js
 */
import axiosApi from '@/common/utils/axiosApi';
import * as model from './model';
export function getCellList(params) {
  return axiosApi(process.env.VUE_APP_BASE_API + '/gridList', 'get', model.cellList, params);
}
