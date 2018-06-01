/**
 * Created by 23535 on 2018/3/24.
 */
// import Vue from 'vue'
import stores from 'store'
import axios from 'axios'
// 拦截请求
// axios.interceptors.request.use(function (config) {
//   LoadingBar.start()
//   return config
// })
axios.interceptors.request.use(
  config => {
    if (stores.get('tokenData').token) {
      config.headers.Authorization = `JWT ${stores.get('tokenData').token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })
// 拦截相应
// axios.interceptors.response.use(function (config) {
//   LoadingBar.finish()
//   return config
// })
axios.interceptors.response.use(
  response => {
    // console.log(response, '响应正确')
    return response
  },
  error => {
    // console.log(error.response, '响应错误拦截')
    if (error.response.status === 500 || error.response.status === 501 || error.response.status === 502) {
      return Message.error('服务器响应错误')
    }
    if (error.response.status === 400 || error.response.status === 401 || error.response.status === 403) {
      return Message.error('请求有误')
    }
    return Promise.reject(error.response.data)
  })
