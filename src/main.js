// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import router from './router'
import Vue from 'vue'
import store from './store/index'

import axios from 'axios'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App.vue'
// 引入样式
import 'vue-easytable/libs/themes-base/index.css'
// 导入 table 和 分页组件
import {VTable, VPagination} from 'vue-easytable'
// 导入图表组件
import VeLine from 'v-charts/lib/line'
import VeHistogram from 'v-charts/lib/histogram'

Vue.use(MintUI)
Vue.prototype.axios = axios

// 注册到全局
Vue.component(VTable.name, VTable)
Vue.component(VPagination.name, VPagination)
// 注册图表组件
Vue.component(VeLine.name, VeLine)
Vue.component(VeHistogram.name, VeHistogram)

// 添加一个返回拦截器
axios.interceptors.response.use(function (response) {
  // 对返回的数据进行一些处理
  return response
}, function (err) {
  if (err.response.status === 401) {
    console.log(err)
    // JS 调用本地方法完成扫码
    /* eslint-disable no-undef */
    if (window.hasOwnProperty('nativeObj')) {
      nativeObj.refreshToken()
    } else {
      window.webkit.messageHandlers.refreshToken.postMessage('')
    }
  } else {
    return Promise.reject(err)
  }
})

// axios.defaults.baseURL = 'http://cjl3.rokyinfo.net:8010'
// axios.defaults.baseURL = 'http://www.ttdianbao.com:10666'
// axios.defaults.baseURL = 'http://localhost:10666'
axios.defaults.baseURL = 'http://lxd.rokyinfo.net:7200'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: store,
  template: '<App/>',
  components: { App },
  methods: {
  },
  mounted () {
  }
})
