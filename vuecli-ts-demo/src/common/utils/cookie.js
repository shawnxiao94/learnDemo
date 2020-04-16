/*
 * @Author: your name
 * @Date: 2020-04-16 11:26:51
 * @LastEditTime: 2020-04-16 11:27:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vuecli-ts-demo/src/common/utils/cookie.js
 */
export function setCookie(name, value, expires) {
  expires = expires || 300; //未传多少天则默认300天
  var expDays = expires * 24 * 60 * 60 * 1000;
  var expDate = new Date();
  expDate.setTime(expDate.getTime() + expDays);
  var expString = expires ? ';expires=' + expDate.toGMTString() : '';
  document.cookie = name + '=' + encodeURI(value) + expString + ';path=/';
}
//读取cookies
export function getCookie(name) {
  var arr,
    reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  if ((arr = document.cookie.match(reg))) {
    return decodeURI(arr[2]);
  } else {
    return null;
  }
}
//删除cookies
export function delCookie(name) {
  var exp = new Date(new Date().getTime() - 1);
  var cval = getCookie(name);
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toUTCString() + ';path=/';
  }
}
