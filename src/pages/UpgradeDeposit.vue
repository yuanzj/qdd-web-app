<template>
  <div class="container">

    <div class="p-detail-text lm-text-text">电池编号 {{ ccuSn }}</div>

    <div class="table-head-title">已交押金</div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    <div class="lm-text-text lm-font-second"
         style="background-color: white;height: 3rem;line-height: 3rem;padding-left: 1rem">
      {{ deposit }} 元
    </div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>

    <div class="table-head-title">全国范围使用押金</div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    <div class="lm-text-text lm-font-second"
         style="background-color: white;height: 3rem;line-height: 3rem;padding-left: 1rem">
      {{upToDeposit}} 元
    </div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>

    <div class="table-head-title">待补交金额</div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    <div class="lm-text-text lm-font-second"
         style="background-color: white;height: 3rem;line-height: 3rem;padding-left: 1rem">
      {{ finalPrice }} 元
    </div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>

    <div class="table-head-title">支付方式</div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    <div class="lm-text-text lm-font-second" style="background-color: white" v-for="(option,index) in payOptions">

      <div class="options-container">
        <label class="mint-radiolist-label">
            <span
              :class="{'is-right': false}"
              class="mint-radio">
              <input
                class="mint-radio-input"
                type="radio"
                v-model="payOptionValue"
                :disabled="option.disabled"
                :value="option.value || option">
              <span class="mint-radio-core"></span>
            </span>
          <span class="mint-radio-label" v-text="option.label || option"></span>
        </label>
      </div>
      <div style="margin-left: 1rem" v-if="index < (payOptions.length - 1)">
        <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
      </div>
    </div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>


    <div style="height: 4rem"></div>
    <div class="settlement">
      <div>
        <div class="lm-font-default"><span class="lm-text-red lm-font-head">{{ finalPrice }}</span> 元</div>
      </div>

      <div class="tobuy" @click="createOrder">立即升级</div>
    </div>

    <div class="hide" v-html="alipay"></div>

  </div>
</template>

<script>
  import {Indicator, Toast, MessageBox} from 'mint-ui'

  export default {
    name: 'upgrade-deposit',
    data () {
      return {
        deposit: 0,
        productId: null,
        upToDeposit: 0,
        reTryCount0: 0,
        reTryCount1: 0,
        reTryCount2: 0,
        orderId: null,
        ccuSn: null,
        payOptionValue: '2',
        payOptions: [{label: '支付宝', value: '2', disabled: false}],
        // ali支付form表单信息
        alipay: ''
      }
    },
    computed: {
      finalPrice: function () {
        return this.upToDeposit - this.deposit
      }
    },
    methods: {
      loadOrderDetail () {
        this.axios.get('/api-order/v3.1/rent-orders/' + this.orderId).then((res) => {
          console.log(res)
          let order = res.data
          if (order) {
            this.orderId = order.id
            this.ccuSn = order.ccuSn.toUpperCase()
            this.deposit = order.deposit
            this.productId = order.productId

            this.loadDepositConfig()
          }
        })
          .catch(error => {
            console.log(error)
          })
      },
      loadDepositConfig () {
        this.axios.get('/api-order/v3.1/depositconfigs',
          {
            params: {
              productId: this.productId,
              type: 1,
              sort: 'amount,desc'
            }
          }).then((res) => {
            console.log(res)
            if (res.data.list && res.data.list.length > 0) {
              let data = res.data.list[0]
              this.upToDeposit = data.amount
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      createOrder () {
        Indicator.open('提交中...')
        this.axios.post('/api-order/v3.1/rent-orders/' + this.orderId + '/upgrade-deposit?' + '&payChannelId=' + this.payOptionValue)
          .then((res) => {
            console.log(res)
            Indicator.close()
            if (res.data) {
              if (res.data.error) {
                Toast(res.data.error.msg)
              } else {
                if (res.data === 'success') {
                  this.$router.push({
                    name: 'PayComplete'
                  })
                } else if (res.data.indexOf('_alipaysubmit_') !== -1) {
                  this.alipay = res.data
                  setTimeout(function () {
                    document.forms['_alipaysubmit_'].submit()
                  }, 0)
                } else {
                  location.href = res.data
                }
              }
            } else {
              Toast('系统异常')
            }
          }).catch(error => {
            Indicator.close()
            if (error.response.data && error.response.data.error) {
              Toast(error.response.data.error.msg)
            }
          })
      }
    },
    mounted () {
      window.productDetail = this

      if (!this.$route.query.token) {
        MessageBox.alert('您还没有登录，请先登录').then(action => {
          this.$router.go(-1)
          /* eslint-disable no-undef */
          nativeObj.login()
        })
      }
      if (this.$route.query) {
        if (this.$route.query.pay2) {
          this.payOptions = [{label: '支付宝', value: '2', disabled: false}, {label: '微信', value: '3', disabled: false}]
        }
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.$store.commit('setEnterModel', this.$route.query.model)
        this.$store.commit('setCcuSn', this.$route.query.ccuSn)
        this.orderId = this.$route.query.orderId
        this.ccuSn = this.$route.query.ccuSn

        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
      }
      document.title = '升级押金'
      this.loadOrderDetail()
    }
  }
</script>

<style scoped>

  .container {
  }

  .hide {
    display: none;
  }

  .p-detail-text {
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    margin: 1rem 1rem 0 1rem;
    font-size: 0.875rem;
    color: #212121;
  }

  .table-head-title {
    margin-left: 1rem;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
  }

  .settlement {
    width: 100%;
    bottom: 0;
    position: fixed;
    height: 3rem;
    padding-left: 1rem;
    box-shadow: 0 -1px 15px #888888;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .settlement > div:first-child {
    display: flex;
    align-items: center;
  }

  .settlement .tobuy {
    text-align: center;
    line-height: 3rem;
    color: #ffffff;
    width: 7rem;
    height: 100%;
    background-color: #3B9AD9;
    font-size: 0.9375rem;
  }

  .p-head {
    height: 4.5rem;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
    padding: 1rem;
  }

  .p-image {
    width: 2.5rem;
    height: 2.5rem;
  }

  .p-title {
    margin-left: 1rem;
    color: #212121;
    font-size: 1rem;
    flex-grow: 1;
  }

  .p-desc {
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    max-height: 3.75rem;
    font-size: 0.875rem;
    color: #757575;
    margin: 1rem 1rem 0 1rem;
  }

  .options-container {
    height: 3rem;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    background-color: white;
    padding-right: 1rem;
    padding-left: 0.5rem;
  }

  .p-link {
    color: #3B9AD9;
  }

  .p-detail-container {
    display: -webkit-flex;
    display: flex;
    height: 3rem;
    /*横向*/
    flex-direction: row;
    /*不换行*/
    flex-wrap: nowrap;
    /*排列 起始端对齐*/
    justify-content: flex-start;
    /*对齐 居中对齐*/
    align-items: center;
    align-content: flex-start;
    padding: 0 1rem 0 1.1rem;
    margin-top: 1rem;
  }
</style>
