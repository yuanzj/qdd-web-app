// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import router from './router'
import Vue from 'vue'
import store from './store/index'

import axios from 'axios'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App.vue'

Vue.use(MintUI)
Vue.prototype.axios = axios

// axios.defaults.baseURL = 'http://cjl3.rokyinfo.net:8110'
// axios.defaults.baseURL = 'http://localhost:10666'
axios.defaults.baseURL = 'http://cjl3.rokyinfo.net:7200'

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
