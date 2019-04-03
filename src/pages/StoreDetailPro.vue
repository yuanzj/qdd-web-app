<template>
  <div class="container">
    <div :class="{ 'full-screen-box' : isFullScreen, 'cabinet-img-box': !isFullScreen}" style="">
      <img :src="cabinetImg" :class="{ 'full-screen' : isFullScreen, 'cabinet-img': !isFullScreen}" @click="fullScreen"/>
    </div>
    <div style="height: 65vh;width:100vw;overflow: scroll;position: absolute;margin-top: 35vh;padding: 1.5em 0">
      <div style="height: 30vh;padding: 1em">
        <div style="width: 100%;height: 100%;padding: 2.5em 1.5em;background-color: white;box-shadow: 2px 2px 10px rgba(0,0,0,0.2);border-radius: 5px;display: flex;flex-direction: column">
          <div style="flex: 2;display: flex;">
            <div style="flex: 4;font-size: 1.3em;color: black;font-family: '黑体'">{{ city }}{{ area }}{{ address }}</div>
            <div style="flex: 1">
              <div style="margin-top: -0.5em;width: 5em;height: 5em;background-color: #2ec4b6;border-radius: 2.5em;box-shadow: 1px 1px 10px rgba(0,0,0,0.4);display: flex;justify-content: center;align-items: center;" @click="navigation">
                <div>
                  <img src="/static/images/navigation.png" style="width: 2em;height: auto"/>
                  <div style="color: white;font-size: 0.8em">导航</div>
                </div>

              </div>
            </div>
          </div>
          <div style="flex: 1;color: rgba(128,128,128,0.9);font-size: 0.6em;line-height: 1em">
            <img src="/static/images/icon_details.png" style="width: 1em;height: 1em"/>&nbsp; 编号：{{ code }}</div>
          <div style="flex: 1;color: rgba(128,128,128,0.9);font-size: 0.6em;line-height: 1em">
            <img src="/static/images/icon_principal.png" style="width: 1em;height: 1em"/> &nbsp;联系人：</div>
          <div style="flex: 1;color: rgba(128,128,128,0.9);font-size: 0.6em;line-height: 1em">
            <img src="/static/images/icon_phone.png" style="width: 1em;height: 1em;"/> &nbsp;联系电话：{{ tel }}</div>
        </div>
      </div>
      <!--<div style="height: 40vh;padding: 1em;margin-top: -1em">
        <div style="width: 100%;height: 100%;background-color: white;box-shadow: 2px 2px 10px rgba(0,0,0,0.2);border-radius: 5px"></div>
      </div>-->
    </div>
  </div>
</template>

<script>
  import {MessageBox} from 'mint-ui'
  // import {GPS} from '../components/gps'
  export default {
    name: 'product-detail',
    data () {
      return {
        reTryCount0: 0,
        reTryCount2: 0,
        isFullScreen: false,
        image: '../static/images/store-icon.png',
        cabinetImg: '',
        name: '',
        province: '',
        city: '',
        area: '',
        code: '',
        tel: '',
        address: '',
        id: null,
        productValue: -1,
        productList: [],
        lat: null,
        lon: null
      }
    },
    methods: {
      fullScreen () {
        this.isFullScreen = !this.isFullScreen
      },
      navigation () {
        let params = {
          action: 'navigation',
          lat: this.lat,
          lon: this.lon,
          address: this.address,
          name: this.name
        }
        window.ReactNativeWebView.postMessage(JSON.stringify(params))
      },
      loadStoreDetail () {
        this.axios.get('/api-user/v3.1/ebikestores/' + this.$route.params.id).then((res) => {
          let product = res.data
          if (product) {
            this.name = product.name
            this.code = product.code
            this.tel = product.contact
            this.province = product.province
            this.city = product.city
            this.area = product.county
            this.address = product.address
            this.cabinetImg = product.snapshot
            // let gpsValue = GPS.bd_decrypt_gps(product.lat, product.lon)
            this.lat = product.lat
            this.lon = product.lon
          }
        })
          .catch(error => {
            console.log(error)
            if (this.reTryCount0 < 3) {
              this.reTryCount0 += 1
              this.loadStoreDetail()
            }
          })
      },
      loadProductList () {
        this.axios.get('/api-order/v3.1/products',
          {
            params: {
              page: 1,
              limit: 20,
              sidx: 'price',
              order: 'asc',
              storeId: this.$route.params.id
            }
          }
        ).then((res) => {
          if (res.data.list) {
            let index = 0
            this.productValue = 0
            this.productList = res.data.list.map(function (item) {
              item.label = item.name
              item.value = String(index++)
              item.disabled = false

              return item
            })
          }
        })
          .catch(error => {
            console.log(error)
            if (this.reTryCount2 < 3) {
              this.reTryCount2 += 1
              this.loadProductList()
            }
          })
      },
      showDetail (id) {
        this.id = id
        if (this.$store.state.token && this.$store.state.firm) {
          if (this.$store.state.ccuSn) {
            if (this.$store.state.orderId) {
              this.$router.push({
                name: 'ProductDetail',
                params: {id: this.id},
                query: {
                  token: this.$store.state.token,
                  firm: this.$store.state.firm,
                  ccuSn: this.$store.state.ccuSn,
                  orderId: this.$store.state.orderId,
                  pay2: true
                }
              })
            } else {
              this.$router.push({
                name: 'ProductDetail',
                params: {id: this.id},
                query: {token: this.$store.state.token, firm: this.$store.state.firm, ccuSn: this.$store.state.ccuSn, pay2: true}
              })
            }
          } else {
            this.$router.push({name: 'ProductDetail', params: { id: this.id }, query: {token: this.$store.state.token, firm: this.$store.state.firm, pay2: true}})
          }
        } else {
          if (this.$store.state.orderId) {
            this.$router.push({name: 'ProductDetail', params: { id: this.id }, query: {orderId: this.$store.state.orderId, pay2: true}})
          } else {
            this.$router.push({name: 'ProductDetail', params: { id: this.id }, query: {pay2: true}})
          }
        }
      }
    },
    mounted () {
      window.productDetail = this

      if (!this.$route.query.token) {
        MessageBox.alert('您还没有登录，请先登录').then(action => {
          this.$router.go(-1)
          // JS 调用本地方法完成扫码
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.refreshToken()
          } else {
            window.webkit.messageHandlers.refreshToken.postMessage('')
          }
        })
      }
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.$store.commit('setEnterModel', this.$route.query.model)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
      }
      document.title = '站点详情'
      this.loadStoreDetail()
      // this.loadProductList()
    }
  }
</script>

<style scoped>
  .cabinet-img-box{
    width: 100vw;
    height: 40vh;
    overflow: hidden;
    position: absolute
  }

  .full-screen-box{
    width: auto;
    height: 100vh;
    position: absolute;
    z-index: 999;
  }

  .cabinet-img{
    width: 100vw;
    height: auto;
    position: absolute;
  }

  .full-screen{
    width: auto;
    height: 100vh;
    position: absolute;
    z-index: 999;
  }

  .table-head-title {
    margin-left: 1rem;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
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

  .p-container {
    flex: 1;
    -webkit-flex: 1;
    display: -webkit-flex;
    display: flex;
    background: white;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
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

  .p-content {
    width: 100%;
    -webkit-flex: 1;
    flex: 1;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
    margin-left: 1rem;
    padding-right: 2rem;
    margin-bottom: 1rem;
  }

  .p-price {
    text-align: left;
    color: #757575;
    font-size: 0.875rem;
  }

  .p-desc {
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    max-height: 3.75rem;
    font-size: 0.875rem;
    color: #757575;
    margin: 1rem;
  }

  .options-container {
    width: 100%;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    background-color: white;
    padding-right: 1rem;
  }
</style>
