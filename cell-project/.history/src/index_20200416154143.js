/*
 * @Author: your name
 * @Date: 2020-04-16 14:12:03
 * @LastEditTime: 2020-04-16 15:41:43
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /cell-project/src/index.js
 */
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <React.Component>
    <App />
  </React.Component>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
