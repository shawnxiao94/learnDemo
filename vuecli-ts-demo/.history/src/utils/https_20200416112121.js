/*
 * @Author: your name
 * @Date: 2020-04-15 14:14:57
 * @LastEditTime: 2020-04-16 11:17:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vuecli-ts-demo/src/utils/https.js
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import ErrorMessage from '@/common/utils/errorMessage';
import { Message, MessageBox } from 'element-ui';

export interface ResponseData {
  code: number;
  data?: any;
  message: string;
}

// 创建 axios 实例
let service: AxiosInstance | any;
if (process.env.NODE_ENV === 'development') {
  service = axios.create({
    baseURL: '/api', // api 的 base_url
    timeout: 50000 // 请求超时时间
  });
} else {
  // 生产环境下
  service = axios.create({
    baseURL: '/api',
    timeout: 50000
  });
}

// request 拦截器 axios 的一些配置
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // token
    // if (getStorage()) {
    //   config.headers['Authorization'] = getStorage()
    // }
    config.headers['version'] = '1';
    return config;
  },
  (error: any) => {
    // Do something with request error
    console.error('error:', error); // for debug
    Promise.reject(error);
  }
);

// respone 拦截器 axios 的一些配置
service.interceptors.response.use(
  (res: AxiosResponse) => {
    // Some example codes here:
    // code == 0: success
    if (res.status === 200) {
      const data: ResponseData = res.data;
      if (data.code === '000000') {
        return Promise.resolve(data);
      } else {
        // return Promise.reject(data)
        Message({
          message: data.message || '接口code错误',
          type: 'error'
        });
      }
    } else {
      Message({
        message: '网络错误!',
        type: 'error'
      });
      return Promise.reject(new Error(res.data.message || 'Error'));
    }
  },
  (error: any) => {
    if (!error.response) {
      // 服务器请求失败时错误提示
      MessageBox({
        message: `请求超时${ErrorMessage.API_ERROR_LOAD}`,
        showCancelButton: false,
        confirmButtonText: '确定',
        type: 'error',
        callback() {}
      });
    } else {
      switch (error.response.status) {
        case 400:
          error.message = ErrorMessage.STATUS_400;
          break;
        case 401:
          MessageBox({
            message: '失效，请再次登录！',
            showCancelButton: false,
            confirmButtonText: '确定',
            type: 'error',
            callback() {}
          });
          break;
        case 403:
          error.message = ErrorMessage.STATUS_403;
          break;
        case 404:
          error.message = ErrorMessage.STATUS_404;
          break;
        case 408:
          error.message = ErrorMessage.STATUS_408;
          break;
        case 500:
          error.message = ErrorMessage.STATUS_500;
          break;
        case 501:
          error.message = ErrorMessage.STATUS_501;
          break;
        case 502:
          error.message = ErrorMessage.STATUS_502;
          break;
        case 503:
          error.message = ErrorMessage.STATUS_503;
          break;
        case 504:
          error.message = ErrorMessage.STATUS_504;
          break;
        case 505:
          error.message = ErrorMessage.STATUS_505;
          break;
        default:
      }
      MessageBox({
        message: `请求失败-${error.message}`,
        showCancelButton: false,
        confirmButtonText: '确定',
        type: 'error',
        callback() {}
      });
    }
    return Promise.reject(error);
  }
);

export default service;
