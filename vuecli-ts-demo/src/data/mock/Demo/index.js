/*
 * @Author: your name
 * @Date: 2020-04-16 11:54:21
 * @LastEditTime: 2020-04-16 11:54:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vuecli-ts-demo/src/data/api/Cell/index.js
 */
import Mock from 'mockjs';

// 格子图 列表
const getCellList = {
  code: '000000',
  mesg: '处理成功',
  'data|6': [
    {
      'id|+1': 1,
      'area|1': ['东非', '中西非', '西非', '东南非', '亚太', '其他'],
      'aa|6': {
        'list|8': [
          {
            'id|+1': 1,
            name: '@cname()',
            danger: 1,
            number: '@dateTime', // 编号
            'total|10-100000': 10,
            step: Mock.Random.integer(0, 1), // 应对措施 无 => 0, 有 => 1
            plan: Mock.Random.integer(0, 1), // 应急预案
            living: Mock.Random.integer(0, 1), // 生活物质,
            substance: Mock.Random.integer(0, 1) // 防疫物质
          }
        ]
      }
    }
  ]
};
Mock.mock(/\/gridList/, getCellList);
