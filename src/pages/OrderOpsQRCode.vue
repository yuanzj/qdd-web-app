<template>
  <div>
    <div class="container">
      <div style="text-align: center">
        <div id="qrcode"></div>
        <div style="margin-top: 1rem;margin-bottom: 48px" class="lm-text-text">
          <span style="font-size: 1.5rem;font-weight: bold;"> {{ ccuSn }}</span>
          <br/>
          <span class="lm-text-text lm-font-second">网点：{{ storeName }}</span>
        </div>

        <div class="lm-font-second lm-text-second" style="padding: 0 1rem 0 1rem;line-height: 1.5rem">租赁管理员<br/>扫描后即可完成相应的操作</div>
        <div class="lm-font-second lm-text-red" style="margin-top: 0.5rem" v-if="type === 0">押金将退还到余额，余额可提现</div>
      </div>
    </div>
    <!--<div style="position: fixed;bottom: 1rem;width: 100%;text-align: center">-->

      <!--<mt-button type="default" @click="back">返回</mt-button>-->
    <!--</div>-->

  </div>
</template>

<script>
  import {Indicator, Toast} from 'mint-ui'
  import QRCode from 'qrcodejs2'

  export default {
    name: 'order-ops-q-r-code',
    data () {
      return {
        storeName: null,
        ccuSn: null,
        orderId: null,
        code: '',
        myQrcode: null,
        type: null
      }
    },
    methods: {
      qrcode () {
        let qrcode = new QRCode('qrcode', {
          width: 250,
          height: 250,
          text: this.code
        })
        return qrcode
      },
      genCode () {
        Indicator.open('生成中...')
        this.axios.get('/api-order/v3.1/rent-orders/voucher-v2', {params: {'ccuSn': this.ccuSn, 'orderId': this.orderId, 'type': this.type}}).then((res) => {
          Indicator.close()
          console.log(res)
          this.code = res.data
          if (this.myQrcode) {
            this.myQrcode.clear()
            this.myQrcode.makeCode(res.data)
          } else {
            this.myQrcode = this.qrcode()
          }
        })
          .catch(error => {
            Indicator.close()
            console.log(error)
            if (error.response.data && error.response.data.error) {
              Toast(error.response.data.error.msg)
            }
            this.$router.back(-1)
          })
      },
      back () {
        this.$router.back(-1)
      }
    },
    mounted () {
      window.productDetail = this
      if (this.$route.query) {
        document.title = this.$route.query.title
        this.ccuSn = this.$route.query.ccuSn
        this.orderId = this.$route.query.orderId
        this.storeName = this.$route.query.storeName
        this.type = this.$route.query.type
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
      }
      this.genCode()
      // auto refresh
      this.IntervalId = window.setInterval(this.genCode, 30 * 1000)
    },
    destroyed () {
      window.clearInterval(this.IntervalId)
      console.log('destroyed')
    }
  }
</script>

<style scoped>
  #qrcode{
    height: 250px;
    width: 250px;
    margin: auto;
  }
  .container{
    height: 100vh;
    width: 100%;
    top: 0;
    position: fixed;
    display: -webkit-flex;
    display:         flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
  }
</style>
