<template>
  <div class="container lm-font-default lm-text-text">

    <div class="content-container">
      <div >
        <div style="padding: 1rem">1. 联系电池租赁网点管理员</div>
        <div style="padding: 1rem">2. 点击下方"扫码租赁"按钮扫描电池二维码进入商品详情</div>
        <div style="padding: 1rem 1rem 4rem 1rem">3. 选择租赁套餐完成支付后即可拥有超高续航的高能锂电池</div>
      </div>
    </div>


    <div class="h-btn-container">
      <div @click="scan"  class="action-btn" style="text-align: center">扫码租赁</div>
    </div>

  </div>
</template>

<script>
  import {Indicator, Toast} from 'mint-ui'
  export default{
    name: 'rent-battery',
    data () {
      return {
        ccuSn: null,
        productId: null
      }
    },
    methods: {
      scan () {
        // JS 调用本地方法完成扫码
        /* eslint-disable no-undef */
        if (window.hasOwnProperty('nativeObj')) {
          nativeObj.scan()
        } else {
          window.webkit.messageHandlers.scan.postMessage('')
        }
      },
      fillSnFromScan (sn) {
        this.ccuSn = sn
        this.loadProductList()
      },
      loadProductList () {
        Indicator.open('获取产品信息...')
        this.axios.get('/api-ebike/v3.1/ues/' + this.ccuSn).then((res) => {
          Indicator.close()
          if (res.data) {
            this.productId = res.data.productId
            this.$router.push({
              name: 'ProductDetail',
              params: {id: this.productId},
              query: {token: this.$store.state.token, firm: this.$store.state.firm, ccuSn: this.ccuSn, pay2: true}
            })
          } else {
            Toast(res.data.msg)
          }
        })
          .catch(error => {
            Indicator.close()
            if (error.response.data && error.response.data.error) {
              Toast(error.response.data.error.msg)
            }
          })
      }
    },
    mounted () {
      window.productDetail = this
      document.title = '扫码租赁'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
      }
    }
  }
</script>

<style scoped>
  .container{
    height: 100vh;
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

  .content-container{
    height: 100vh;
    width: 100vw;
    top: 0;
    position: fixed;
    display: -webkit-flex;
    display:         flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
    padding: 1rem;
  }
</style>
