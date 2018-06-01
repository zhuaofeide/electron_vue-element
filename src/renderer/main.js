import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
import '../../theme/index.css'
import './common/stylus/index.styl'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(VueLazyload, {
  loading: require('../../static/defalut/default.png'), // 加载的图片
  error: require('../../static/defalut/default.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
