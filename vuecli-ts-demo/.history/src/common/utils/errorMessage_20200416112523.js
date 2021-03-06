/*
 * @Author: your name
 * @Date: 2020-04-16 11:25:15
 * @LastEditTime: 2020-04-16 11:25:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vuecli-ts-demo/src/common/utils/errorMessage.js
 */
const ErrorMessage = {
  // 服务器无响应时错误提示
  API_ERROR_LOAD: '服务器无响应！',
  // 服务器请求失败
  STATUS_400: '请求错误！',
  STATUS_401: '登录超时！',
  STATUS_403: '拒绝访问！',
  STATUS_404: '请求地址出错！',
  STATUS_408: '请求超时！',
  STATUS_500: '服务器内部错误！',
  STATUS_501: '服务未实现！',
  STATUS_502: '网关错误！',
  STATUS_503: '服务不可用！',
  STATUS_504: '网关超时！',
  STATUS_505: 'HTTP版本不受支持！'
};
export default ErrorMessage;
