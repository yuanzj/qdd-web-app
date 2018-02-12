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
      <div>{{ orderStatusDesc }}</div>
    </div>

    <div class="h-btn-container">
      <mt-button @click.native="finish" class="action-btn">归还</mt-button>
      <mt-button @click.native="topUp" type="primary" class="action-btn" >续租</mt-button>
    </div>

    <div class="hide" v-html="alipay"></div>
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
        // ali支付form表单信息
        alipay: ''
      }
    },
    computed: {
      orderStatusDesc () {
        switch (this.orderStatus) {
          case -1:
            return ''
          case 0:
            return '待激活'
          case 1:
            return '租用中'
          case 2:
            return '已提交归还请求，待审核'
          case 3:
            return '已归还'
          case 4:
            return '已支付，待审核'
          default:
            return ''
        }
      }
    },
    methods: {
      finish () {
        Indicator.open('提交中...')
        this.axios.put('/api-order/v3.1/rent-orders/' + this.$route.params.orderId + '/finish?status=2').then((res) => {
          Indicator.close()
          Toast('提交成功，待管审核')
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
                orderId: this.orderId
              }
            })
          } else {
          }
        }
      },
      loadOrderDetail () {
        this.axios.get('/api-order/v3.1/rent-orders/' + this.$route.params.orderId,
          {
            params: {
              page: 1,
              limit: 20,
              sidx: 'id',
              order: 'asc'
            }
          }
        ).then((res) => {
          console.log(res)
          let order = res.data
          if (order) {
            this.orderStatus = order.status
            this.orderId = order.id
            this.ccuSn = order.ccuSn.toUpperCase()
            this.productId = order.productId
            this.startTime = order.startTime
            this.endTime = order.endTime
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
    bottom: 0;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem 1rem 1rem;
  }

  .action-btn{
    width: 7rem;
  }

  .hide {
    display: none;
  }
</style>
