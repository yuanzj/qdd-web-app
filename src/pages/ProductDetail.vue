<template>
  <div class="container">

    <div style="background: white">

      <div class="p-head">
        <img class="p-image" :src="image"/>
        <span class="p-title" >{{ title }}</span>
      </div>
      <div class="p-desc"  style="margin: 0 1rem 0 1rem">
        最高续航 80km
      </div>
      <div class="p-desc">{{ description }}</div>

      <div v-if="orderId > 0" class="p-detail-text lm-text-second">电池编号 {{ ccuSn }}</div>
      <div style="height: 1rem"></div>
      <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    </div>

    <div class="table-head-title">租赁套餐</div>

    <mt-radio
      align="right"
      class="page-part"
      v-model="optionValue"
      :options="options">
    </mt-radio>

    <div class="table-head-title">支付方式</div>
    <mt-radio
      align="right"
      class="page-part"
      v-model="payOptionValue"
      :options="payOptions">
    </mt-radio>

    <div style="height: 4rem"></div>
    <div class="settlement">
      <div>
        <div class="lm-font-default"><span class="lm-text-red lm-font-head">{{ finalPrice }}</span>元 {{ faceValue }}天</div>
      </div>

      <div class="tobuy" @click="createOrder">{{ orderBtnTile }}</div>
    </div>

    <div class="hide" v-html="alipay"></div>


  </div>
</template>

<script>
  import {Indicator, Toast, MessageBox} from 'mint-ui'
  export default {
    name: 'product-detail',
    data () {
      return {
        reTryCount0: 0,
        reTryCount1: 0,
        orderId: null,
        disabled: false,
        product: null,
        image: '../static/images/p-b.png',
        ccuSn: null,
        count: 1,
        price: null,
        title: '产品名称',
        description: '产品描述',
        optionValue: '0',
        options: [],
        payOptionValue: '0',
        payOptions: [{label: '支付宝', value: '0', disabled: false}],
        // ali支付form表单信息
        alipay: ''
      }
    },
    computed: {
      finalPrice: function () {
        if (this.options && this.options.length > 0) {
          return this.options[Number(this.optionValue)].price
        } else {
          return ''
        }
      },
      faceValue: function () {
        if (this.options && this.options.length > 0) {
          return this.options[Number(this.optionValue)].faceValue
        } else {
          return ''
        }
      },
      orderBtnTile: function () {
        if (this.orderId) {
          return '续费'
        } else {
          return '扫码下单'
        }
      }
    },
    methods: {
      fillSnFromScan (sn) {
        this.ccuSn = sn
        this.addOrder()
      },
      loadProductDetail () {
        this.axios.get('/api-order/v3.1/products/' + this.$route.params.id).then((res) => {
          let product = res.data
          if (product) {
            this.image = product.image
            this.title = product.name
            this.description = product.desc
            this.price = product.price
          }
        })
          .catch(error => {
            console.log(error)
            if (this.reTryCount0 < 3) {
              this.reTryCount0 += 1
              this.loadProductDetail()
            }
          })
      },
      loadSolutionList () {
        this.axios.get('/api-order/v3.1/products',
          {
            params: {
              page: 1,
              limit: 20,
              sidx: 'id',
              order: 'asc',
              categoryId: '2',
              parentId: this.$route.params.id
            }
          }
        ).then((res) => {
          if (res.data.list) {
            let index = 0
            this.options = res.data.list.map(function (item) {
              item.label = item.name
              item.value = String(index++)
              item.disabled = false

              return item
            })
          }
        })
          .catch(error => {
            console.log(error)
            if (this.reTryCount1 < 3) {
              this.reTryCount1 += 1
              this.loadSolutionList()
            }
          })
      },
      createOrder () {
        if (this.orderId) {
          this.reChargeOrder()
        } else {
          // JS 调用本地方法完成扫码
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.scan()
          } else {
            window.webkit.messageHandlers.scan.postMessage('')
          }
        }
      },
      addOrder () {
        console.log(this.agreement)
        if (!this.ccuSn) {
          Toast('请输入设备SN号！')
          return false
        }
        Indicator.open('提交中...')
        this.axios.post('/api-order/v3.1/rent-orders/?' + 'productId=' + this.options[Number(this.optionValue)].id + '&count=' + String(this.count) + '&ccuSn=' + this.ccuSn)
          .then((res) => {
            console.log(res)
            Indicator.close()
            if (res.data) {
              if (res.data.error) {
                Toast(res.data.error.msg)
              } else {
                this.alipay = res.data
                setTimeout(function () {
                  document.forms['_alipaysubmit_'].submit()
                }, 0)
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
      reChargeOrder () {
        console.log(this.agreement)
        if (!this.ccuSn) {
          Toast('请输入设备SN号！')
          return false
        }
        Indicator.open('提交中...')
        this.axios.post('/api-order/v3.1/rent-orders/' + this.orderId + '/topup?' + 'productId=' + this.options[Number(this.optionValue)].id + '&count=' + String(this.count) + '&ccuSn=' + this.ccuSn)
          .then((res) => {
            console.log(res)
            Indicator.close()
            if (res.data) {
              if (res.data.error) {
                Toast(res.data.error.msg)
              } else {
                this.alipay = res.data
                setTimeout(function () {
                  document.forms['_alipaysubmit_'].submit()
                }, 0)
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
      document.title = '电池详情'
      if (!this.$route.query.token) {
        MessageBox.alert('您还没有登录，请先登录').then(action => {
          this.$router.go(-1)
          /* eslint-disable no-undef */
          nativeObj.login()
        })
      }
      if (this.$route.query.ccuSn) {
        this.ccuSn = this.$route.query.ccuSn
      }
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.$store.commit('setEnterModel', this.$route.query.model)
        this.$store.commit('setCcuSn', this.$route.query.ccuSn)
        this.orderId = this.$route.query.orderId
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
      }
      this.loadSolutionList()
      this.loadProductDetail()

      if (this.orderId || this.$route.query.ccuSn) {
        this.disabled = true
      }
    }
  }
</script>

<style scoped>

  .container{
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
</style>
