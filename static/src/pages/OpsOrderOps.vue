<template>
  <div>
    <div  class="lm-font-default">
      <div style="padding: 1rem;background: white;margin-top: 1rem">
        <div class="lm-text-second" >电池SN号：</div>
        <div class="lm-text-text" style="margin-top: 1rem;margin-bottom: 1rem;min-height: 1rem;text-align: center">{{ ccuSn }}</div>
        <div style="text-align: right"><mt-button style="width: 220px" type="default" @click="scanOldSn">扫描电池二维码</mt-button></div>
      </div>
    </div>
    <div  class="lm-font-default">
      <div style="padding: 1rem;background: white;margin-top: 1rem">
        <div class="lm-text-second" >授权码：</div>
        <div class="lm-text-text" style="margin-top: 1rem;margin-bottom: 1rem;min-height: 1rem;text-align: center;width: 100%;word-wrap:break-word">{{ code }}</div>
        <div style="text-align: right"><mt-button style="width: 220px" type="default" @click="scanCode">扫描用户出示的二维码</mt-button></div>
      </div>
    </div>

    <div v-if="enterModel === 1" class="lm-font-default">
      <div style="padding: 1rem;background: white;margin-top: 1rem">
        <div class="lm-text-second" >新电池SN号：</div>
        <div class="lm-text-text" style="margin-top: 1rem;margin-bottom: 1rem;min-height: 1rem;text-align: center">{{ newSn }}</div>
        <div style="text-align: right"><mt-button style="width: 220px" type="default" @click="scanNewSn">扫描新电池二维码</mt-button></div>
      </div>
    </div>

    <div class="h-container">
      <div style="flex: 1">
        <mt-button type="default" @click="back" style="width: 100%">返回</mt-button>
      </div>
      <div style="width: 1rem"></div>
      <div style="flex: 1">
        <mt-button type="primary" @click="submit" style="width: 100%">提交</mt-button>
      </div>
    </div>

  </div>
</template>

<script>
  import {Indicator, Toast} from 'mint-ui'

  export default {
    name: 'ops-order-ops',
    data () {
      return {
        enterModel: -1,
        scanModel: -1,
        ccuSn: null,
        newSn: null,
        code: '',
        myQrcode: null
      }
    },
    methods: {
      scanOldSn () {
        this.scanModel = 0
        // JS 调用本地方法完成扫码
        /* eslint-disable no-undef */
        if (window.hasOwnProperty('nativeObj')) {
          nativeObj.scan()
        } else {
          window.webkit.messageHandlers.scan.postMessage('')
        }
      },
      scanCode () {
        this.scanModel = 1
        // JS 调用本地方法完成扫码
        /* eslint-disable no-undef */
        if (window.hasOwnProperty('nativeObj')) {
          nativeObj.scanForVoucher()
        } else {
          window.webkit.messageHandlers.scanForVoucher.postMessage('')
        }
      },
      scanNewSn () {
        this.scanModel = 2
        // JS 调用本地方法完成扫码
        /* eslint-disable no-undef */
        if (window.hasOwnProperty('nativeObj')) {
          nativeObj.scan()
        } else {
          window.webkit.messageHandlers.scan.postMessage('')
        }
      },
      fillSnFromScan (sn) {
        switch (this.scanModel) {
          case 0:
            this.ccuSn = sn
            break
          case 1:
            this.code = sn
            break
          case 2:
            this.newSn = sn
            break
          default:
            break
        }
      },
      submit () {
        if (this.enterModel === 0) {
          if (!this.ccuSn) {
            Toast('请扫描电池二维码')
            return
          }
          if (!this.code) {
            Toast('请扫描用户出示的二维码')
            return
          }
          // 退租
          Indicator.open('提交中...')
          this.axios({
            method: 'put',
            url: '/api-order/v3.1/rent-orders/finish-use-voucher?ccuSn=' + this.ccuSn,
            data: this.code,
            headers: {'Content-Type': 'text/plain'}
          }).then((res) => {
            Indicator.close()
            Toast('退租成功')
            this.loadOrderDetail()
          })
            .catch(error => {
              Indicator.close()
              console.log(error)
              if (error.response.data && error.response.data.error) {
                Toast(error.response.data.error.msg)
              }
            })
        } else if (this.enterModel === 1) {
          // 换电池
          if (!this.ccuSn) {
            Toast('请扫描旧电池二维码')
            return
          }
          if (!this.code) {
            Toast('请扫描用户出示的二维码')
            return
          }
          if (!this.newSn) {
            Toast('请扫描新电池二维码')
            return
          }
          Indicator.open('提交中...')
          this.axios({
            method: 'put',
            url: '/api-order/v3.1/rent-orders/replace-use-voucher?oldSn=' + this.ccuSn + '&newSn=' + this.newSn,
            data: this.code,
            headers: {'Content-Type': 'text/plain'}
          }).then((res) => {
            Indicator.close()
            Toast('退租成功')
            this.loadOrderDetail()
          })
            .catch(error => {
              Indicator.close()
              console.log(error)
              if (error.response.data && error.response.data.error) {
                Toast(error.response.data.error.msg)
              }
            })
        }
      },
      back () {
        this.$router.back(-1)
      }
    },
    mounted () {
      window.productDetail = this
      document.title = '退租二维码'
      if (this.$route.query) {
        this.enterModel = this.$route.query.model
        this.ccuSn = this.$route.query.ccuSn
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
      }
    }
  }
</script>

<style scoped>

  .h-container {
    width: 100%;
    height: 3rem;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 3rem;
  }
</style>
