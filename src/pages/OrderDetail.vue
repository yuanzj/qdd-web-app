<template>
  <div class="container lm-font-default lm-text-text">
    <div class="h-container">
      <div class="lm-text-second">电池编号</div>
      <div>{{ ccuSn }}</div>
    </div>

    <div class="h-container">
      <div class="lm-text-second">租赁时间</div>
      <div>{{ startTime }}</div>
    </div>

    <div class="h-container">
      <div class="lm-text-second">到期时间</div>
      <div>{{ endTime }}</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">订单状态</div>
      <div :class="{ 'lm-text-red': days < 0 }">{{ orderStatusDesc }}</div>
    </div>

    <div class="h-btn-container" v-if="days >= 0">
      <div @click="finish"  class="action-btn">退租</div>
      <span style="width: 1px;height: 16px;background-color: #BDBDBD;margin: 1.5rem 0 1.5rem 0"></span>
      <div @click="topUp"  class="action-btn" >续租</div>
    </div>
    <div class="h-btn-container" v-else>
      <div @click="pay"  class="action-btn lm-text-red">补缴欠费</div>
    </div>

  </div>
</template>

<script>
  import {Indicator, Toast} from 'mint-ui'
  export default {
    name: 'order-detail',
    data () {
      return {
        orderStatus: -1,
        orderId: null,
        productId: null,
        ccuSn: null,
        startTime: '',
        endTime: '',
        days: null,
        // ali支付form表单信息
        alipay: ''
      }
    },
    computed: {
      orderStatusDesc () {
        if (this.days < 0) {
          return '欠费'
        } else {
          return '正常'
        }
      }
    },
    methods: {
      finish () {
        Indicator.open('提交中...')
        this.axios.put('/api-order/v3.1/rent-orders/' + this.$route.params.orderId + '/finish?status=2').then((res) => {
          Indicator.close()
          Toast('提交成功，待管理员审核')
          this.loadOrderDetail()
        })
          .catch(error => {
            Indicator.close()
            if (error.response.data && error.response.data.error) {
              Toast(error.response.data.error.msg)
            }
          })
      },
      topUp () {
        console.log(this.$store.state.token + '' + this.$store.state.firm + '' + this.$store.state.orderId)
        if (this.$store.state.token && this.$store.state.firm) {
          if (this.orderId) {
            this.$router.push({
              name: 'ProductDetail',
              params: {id: this.productId},
              query: {
                token: this.$store.state.token,
                firm: this.$store.state.firm,
                ccuSn: this.ccuSn,
                orderId: this.orderId,
                days: this.days
              }
            })
          } else {
          }
        }
      },
      pay () {
        if (this.$store.state.token && this.$store.state.firm) {
          if (this.orderId) {
            this.$router.push({
              name: 'PayArrearage',
              params: {id: this.productId},
              query: {
                token: this.$store.state.token,
                firm: this.$store.state.firm,
                ccuSn: this.ccuSn,
                orderId: this.orderId,
                days: this.days
              }
            })
          } else {
          }
        }
      },
      loadOrderDetail () {
        this.axios.get('/api-order/v3.1/rent-orders/' + this.$route.params.orderId).then((res) => {
          console.log(res)
          let order = res.data
          if (order) {
            this.orderStatus = order.status
            this.orderId = order.id
            this.ccuSn = order.ccuSn.toUpperCase()
            this.productId = order.productId
            this.startTime = order.startTime
            this.endTime = order.endTime
            if (order.days) {
              this.days = order.days
            }
          }
        })
          .catch(error => {
            console.log(error)
          })
      }
    },
    mounted () {
      document.title = '订单详情'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.$store.commit('setEnterModel', this.$route.query.model)
        this.$store.commit('setCcuSn', this.$route.query.ccuSn)
        this.$store.commit('setOrderId', this.$route.params.orderId)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
      }
      this.loadOrderDetail()
    }
  }
</script>

<style scoped>
  .container{
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

  .action-btn{
    height: 3rem;
    flex: 1;
    font-size: 0.875rem;
    text-align: center;
    color: #3B9AD9;
    font-weight: bold;
  }

</style>
