/*
 * @Author: your name
 * @Date: 2020-04-16 14:12:03
 * @LastEditTime: 2020-04-16 15:18:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /cell-project/src/App.js
 */
import React from 'react'
import { hot } from 'react-hot-loader'

import { DatePicker } from 'antd'

function App() {
  return (
    <div className="App">
      <DatePicker />
      Edit <code>src/App.js</code> and save to reload.
    </div>
  )
}

// 热更新
export default hot(module)(App)
