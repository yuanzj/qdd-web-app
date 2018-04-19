<template>
  <div class="container">


    <div style="background: white">

      <div class="p-head">
        <img class="p-image" :src="image"/>
        <span class="p-title" >{{ name }}</span>
      </div>
      <div class="p-desc"  style="margin: 0 1rem 0 1rem" >网点编号：{{ code }}
      </div>
      <div class="p-desc">联系方式：{{ tel }}</div>
      <div class="p-desc">{{ city }}{{ area }}{{ address }}</div>
      <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    </div>


    <div class="table-head-title">产品列表</div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    <div class="lm-text-text lm-font-second" style="background-color: white" v-for="(option,index) in productList">

      <div class="options-container" @click="showDetail(option.id)">
        <div class="p-container">
          <div class="p-title" style="margin-top: 1rem">
            {{ option.name }}
          </div>
          <div class="p-desc" >{{ option.desc }}</div>
          <div class="p-content">

            <div class="p-price">
              最高续航 <span style="font-size: 1.25rem;color: #E64E42;font-weight: bold">{{option.remark}}</span> km
            </div>
            <div style="-webkit-flex:1;flex: 1"></div>
            <div class="p-price" style="text-align: right">
              <span style="font-size: 1.25rem;color: #E64E42;font-weight: bold">{{ option.price }}</span> 元/日起
            </div>
          </div>
        </div>

        <img style="width: 25px;height: 25px" src="../assets/icons8-right_4.png"/>
      </div>
      <div style="margin-left: 1rem" v-if="index < (productList.length - 1)">
        <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
      </div>
    </div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    <div style="height: 25px"></div>
  </div>
</template>

<script>
  import {MessageBox} from 'mint-ui'
  export default {
    name: 'product-detail',
    data () {
      return {
        reTryCount0: 0,
        reTryCount2: 0,
        image: '../static/images/store-icon.png',
        name: '',
        province: '',
        city: '',
        area: '',
        code: '',
        tel: '',
        address: '',
        id: null,
        productValue: -1,
        productList: []
      }
    },
    methods: {
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
      this.loadProductList()
    }
  }
</script>

<style scoped>

  .container{
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
