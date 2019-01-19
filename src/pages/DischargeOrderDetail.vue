<template>
  <div class="container lm-font-default lm-text-text">
    <div class="h-container">
      <div class="lm-text-second">联系人</div>
      <div>{{ orderInfo.userName }}</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">联系方式</div>
      <div>{{ orderInfo.phoneNumber }}</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">详细地址</div>
      <div>{{ orderInfo.location }}</div>
    </div>
    <div style="height: 1rem"></div>
    <div class="h-container">
      <div class="lm-text-second">订单编号</div>
      <div>{{ this.orderId }}</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">下单时间</div>
      <div>{{ orderInfo.createTime }}</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">订单状态</div>
      <div>{{ orderStatusDesc }}</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">发电开始时间</div>
      <div>{{ orderInfo.startTime }}</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">发电结束时间</div>
      <div>{{ orderInfo.endTime }}</div>
    </div>
    <div class="h-container" v-if="orderInfo.status >= 3">
      <div class="lm-text-second">订单金额</div>
      <div :class="orderInfo.status === 3 ? 'lm-text-blue ' : ''">{{ '￥' + orderInfo.amount }}</div>
    </div>

    <div style="height: 1rem"></div>
    <div v-if="orderInfo.status === 3">
      <div class="table-head-title">支付方式</div>
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

      </div>
    </div>
    <div class="hide" v-html="alipay"></div>
    <div style="height: 4rem"></div>
    <div class="h-btn-container" v-if="orderInfo.status === 0">
      <div @click="cancelOrder" class="action-btn">取消订单</div>
    </div>
    <div class="h-btn-container" v-if="orderInfo.status === 3">
      <div @click="toPay" class="action-btn">确认付款</div>
    </div>

  </div>
</template>

<script>
  import {Indicator, Toast} from 'mint-ui'

  export default {
    name: 'discharge-order-detail',
    data () {
      return {
        orderId: null,
        orderInfo: {},
        payOptions: [{label: '支付宝', value: '2', disabled: false}, {label: '微信', value: '3', disabled: false}],
        payOptionValue: '2',
        // ali支付form表单信息
        alipay: ''
      }
    },
    computed: {
      orderStatusDesc () {
        switch (this.orderInfo.status) {
          case -1:
            return '已取消'
          case 0:
            return '待接单'
          case 1:
            return '已接单，待发电'
          case 2:
            return '发电中'
          case 3:
            return '发电结束，待付款'
          case 4:
            return '已付款'
          default:
            return ''
        }
      }
    },
    methods: {
      cancelOrder () {
        Indicator.open('请稍候...')
        this.axios.get('/api-order/v3.1/discharge-orders/user-cancel/' + this.orderId)
          .then((res) => {
            console.log(res)
            Indicator.close()
            Toast('取消成功')
            this.loadOrderDetail()
          }).catch(error => {
            Indicator.close()
            if (error.response.data && error.response.data.error) {
              Toast(error.response.data.error.msg)
            }
          })
      },
      toPay () {
        Indicator.open('请稍候...')
        this.axios.get('/api-order/v3.1/discharge-orders/' + this.orderId + '/pay-info?' + 'payChannelId=' + this.payOptionValue)
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
              Toast(res.data.msg)
            }
          }).catch(error => {
            Indicator.close()
            if (error.response.data && error.response.data.error) {
              Toast(error.response.data.error.msg)
            }
          })
      },
      loadOrderDetail () {
        this.axios.get('/api-order/v3.1/discharge-orders/' + this.orderId).then((res) => {
          console.log(res)
          this.orderInfo = res.data
        })
          .catch(error => {
            console.log(error)
          })
      }
    },
    mounted () {
      window.productDetail = this
      document.title = '订单详情'
      this.orderId = this.$route.params.id
      if (this.$route.query) {
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
      }
      this.loadOrderDetail()
    }
  }
</script>

<style scoped>
  .container {
    height: 100vh;
  }

  .h-container {
    background-color: #ffffff;
    width: 100%;
    height: 3rem;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .h-container-1 {
    background-color: #ffffff;
    width: 100%;
    height: 2rem;
    padding: 0 1rem 1rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .h-btn-container {
    width: 100%;
    height: 3rem;
    display: flex;
    position: fixed;
    box-shadow: 0 -1px 15px #888888;
    background-color: #fff;
    bottom: 0;
    align-items: center;
    justify-content: space-between;
    line-height: 3rem;
  }

  .action-btn {
    height: 3rem;
    flex: 1;
    font-size: 0.875rem;
    text-align: center;
    color: #3B9AD9;
    font-weight: bold;
  }

  .table-head-title {
    margin-left: 1rem;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
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

</style>
