import axiosApi from '@/common/utils/axiosApi';
import * as model from './model';
export function getCellList(params) {
  return axiosApi(process.env.VUE_APP_BASE_API + '/gridList', 'get', model.cellList, params);
}
