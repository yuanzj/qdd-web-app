
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 定义数据源
const state = {
  token: null,
  firm: null,
  enterModel: null,
  ccuSn: null,
  orderId: null
}

// 定义方法
const mutations = {
  setEnterModel (state, ll) {
    state.enterModel = ll
    console.log(state.enterModel)
  },
  setToken (state, ll) {
    state.token = ll
    console.log(state.token)
  },
  setFirm (state, ll) {
    state.firm = ll
    console.log(state.firm)
  },
  setCcuSn (state, ll) {
    state.ccuSn = ll
    console.log(state.ccuSn)
  },
  setOrderId (state, ll) {
    state.orderId = ll
    console.log(state.orderId)
  }
}

export default new Vuex.Store({
  state,
  mutations
})
