<template>
  <div>
    <div class="container">
      <div style="text-align: center">
        <div id="qrcode"></div>
        <div style="margin-top: 1rem;margin-bottom: 48px" class="lm-text-text">
          <span style="font-size: 1.5rem;font-weight: bold;"> {{ nikeName }}</span>
          <br/>
          <span class="lm-text-text lm-font-second" style="margin-top: 0.5rem">{{ phoneNumber }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {Indicator, Toast} from 'mint-ui'
  import QRCode from 'qrcodejs2'
  import { Base64 } from 'js-base64'

  export default {
    name: 'my-qrcode',
    data () {
      return {
        phoneNumber: null,
        nikeName: null,
        code: '',
        myQrcode: null
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
        this.axios.get('/api-user/v3.1/users/info').then((res) => {
          Indicator.close()
          this.nikeName = res.data.nickname
          this.phoneNumber = res.data.phoneNumber
          console.log(res)
          this.code = Base64.encode(this.phoneNumber)
          if (this.myQrcode) {
            this.myQrcode.clear()
            this.myQrcode.makeCode(this.code)
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
      }
    },
    mounted () {
      window.productDetail = this
      document.title = '二维码名片'
      if (this.$route.query) {
        this.ccuSn = this.$route.query.ccuSn
        this.orderId = this.$route.query.orderId
        this.storeName = this.$route.query.storeName
        this.type = this.$route.query.type
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
        this.genCode()
      }
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
