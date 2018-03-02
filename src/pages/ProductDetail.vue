<template>
  <div class="container">

    <div style="background: white">

      <div class="p-head">
        <img class="p-image" :src="image"/>
        <span class="p-title" >{{ title }}</span>
      </div>
      <div class="p-desc"  style="margin: 0 1rem 0 1rem" v-if="categoryId === 1">
        最高续航 {{ remark }}km
      </div>
      <div class="p-desc">{{ description }}</div>

      <div v-if="orderId > 0" class="p-detail-text lm-text-second">电池编号 {{ ccuSn }}</div>
      <div style="height: 1rem"></div>
      <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    </div>

    <div v-if="days < 0">
      <div class="table-head-title">欠费信息</div>
      <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
      <div class="lm-text-text lm-font-second" style="background-color: white;height: 3rem;line-height: 3rem;padding-left: 1rem">
        欠费 <span class="lm-text-red">{{ Math.abs(days) }}</span> 天
      </div>
      <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    </div>

    <div class="table-head-title">租赁套餐</div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    <div class="lm-text-text lm-font-second" style="background-color: white" v-for="(option,index) in options">

      <div class="options-container">
        <label class="mint-radiolist-label">
            <span
              :class="{'is-right': false}"
              class="mint-radio">
              <input
                class="mint-radio-input"
                type="radio"
                v-model="optionValue"
                :disabled="option.disabled"
                :value="option.value || option">
              <span class="mint-radio-core"></span>
            </span>
          <span class="mint-radio-label" v-text="option.label || option"></span>
        </label>
        <span  v-text="option.desc || option"></span>
      </div>
      <div style="margin-left: 1rem" v-if="index < (options.length - 1)">
        <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
      </div>
    </div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>

    <div class="table-head-title">优惠券<span class="lm-text-red lm-font-sm" style="margin-left: 1rem">{{ subtractPrice }}</span></div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    <div class="options-container lm-text-text lm-font-second" @click="showCoupon">
      <div style="margin-left: 0.5rem">{{ couponInfo }}</div><div><img style="width: 25px;height: 25px" src="../assets/icons8-right_4.png"/></div>
    </div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>


    <div class="table-head-title">支付方式</div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
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
      <div style="margin-left: 1rem" v-if="index < (payOptions.length - 1)">
        <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
      </div>
    </div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>

    <label class="p-detail-container lm-font-sm" v-if="isShowAgreement">
      <span class="mint-checkbox">
        <input class="mint-checkbox-input" type="checkbox" v-model="agreement">
        <span class="mint-checkbox-core"></span>
      </span>
      <span style="margin-left: 0.5rem;">已阅读理解并接受<a class="p-link" href="http://cjl3.rokyinfo.net:8200/res/xy/ddd-xy20180212.html">《用户服务协议》</a>。</span>
    </label>

    <div style="height: 4rem"></div>
    <div class="settlement">
      <div>
        <div class="lm-font-default"><span class="lm-text-red lm-font-head">{{ finalPrice }}</span>元 {{ faceValue }}天</div>
      </div>

      <div class="tobuy" @click="createOrder">{{ orderBtnTile }}</div>
    </div>

    <div class="hide" v-html="alipay"></div>

    <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">
      <mt-picker :slots="dateSlots" value-key="name" @change="onDateChange" :visible-item-count="5" :show-toolbar="true"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
  import {Indicator, Toast, MessageBox} from 'mint-ui'
  export default {
    name: 'product-detail',
    data () {
      return {
        couponId: null,
        popupVisible: false,
        categoryId: 1,
        isShowAgreement: true,
        agreement: false,
        reTryCount0: 0,
        reTryCount1: 0,
        orderId: null,
        days: null,
        product: null,
        image: '../static/images/p-b.png',
        ccuSn: null,
        count: 1,
        price: null,
        title: '产品名称',
        description: '产品描述',
        remark: '',
        optionValue: '0',
        options: [],
        currentValue: '',
        payOptionValue: '0',
        payOptions: [{label: '支付宝', value: '0', disabled: false}],
        // ali支付form表单信息
        alipay: '',
        couponList: [],
        selectedCouponIndex: -1,
        subtractPrice: null,
        dateSlots: [
          {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center',
            key: 'name'
          }
        ]
      }
    },
    computed: {
      finalPrice: function () {
        if (this.options && this.options.length > 0) {
          if (this.couponList.length > 0 && this.selectedCouponIndex >= 0) {
            return this.options[Number(this.optionValue)].price - this.couponList[this.selectedCouponIndex].amount
          } else {
            return this.options[Number(this.optionValue)].price
          }
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
          if (this.days >= 0) {
            return '续租'
          } else {
            return '补缴欠费'
          }
        } else {
          return '扫码租赁'
        }
      },
      couponInfo: function () {
        if (this.couponList.length > 0) {
          if (this.selectedCouponIndex < 0) {
            this.subtractPrice = ''
            return (this.couponList.length - 1) + '个优惠券可用'
          } else {
            this.subtractPrice = '-' + this.couponList[this.selectedCouponIndex].amount
            return this.couponList[this.selectedCouponIndex].name
          }
        }
        this.subtractPrice = ''
        return '无'
      }
    },
    methods: {
      showCoupon () {
        if (this.couponList && this.couponList.length > 0) {
          this.popupVisible = true
        } else {
          this.popupVisible = false
          Toast('暂无可用优惠券')
        }
      },
      onDateChange (picker, values) {
        console.log(values)
        if (values && values[0] && values[0].index) {
          this.selectedCouponIndex = values[0].index
          this.couponId = values[0].id
          console.log(values + '-' + this.selectedCouponIndex)
        }
      },
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
            this.remark = product.remark
            this.categoryId = product.categoryId
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
      loadCouponList () {
        this.axios.get('/api-order/v3.1/coupons',
          {
            params: {
              page: 1,
              limit: 999,
              sidx: 'id',
              order: 'asc',
              status: '1'
            }
          }
        ).then((res) => {
          this.couponList = res.data.list
          if (this.couponList && this.couponList.length > 0) {
            let index = 1
            this.couponList = this.couponList.map(function (item) {
              item.index = index++
              return item
            })
            this.dateSlots[0].values = this.couponList
            this.dateSlots[0].values.unshift({id: null, name: '不使用优惠券', index: -1, amount: 0})
          }
        })
          .catch(error => {
            console.log(error)
          })
      },
      loadSolutionList () {
        this.axios.get('/api-order/v3.1/products',
          {
            params: {
              page: 1,
              limit: 20,
              sidx: 'face_value',
              order: 'asc',
              categoryIds: '2,4',
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
          if (!this.agreement) {
            Toast('请勾选 已阅读理解并接受《租赁协议》')
            return false
          }
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
        this.axios.post('/api-order/v3.1/rent-orders/?' + 'productId=' + this.options[Number(this.optionValue)].id + '&count=' + String(this.count) + '&ccuSn=' + this.ccuSn + (this.couponId ? ('&couponId=' + this.couponId) : ''))
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
        this.axios.post('/api-order/v3.1/rent-orders/' + this.orderId + '/topup?' + 'productId=' + this.options[Number(this.optionValue)].id + '&count=' + String(this.count) + '&ccuSn=' + this.ccuSn + (this.couponId ? ('&couponId=' + this.couponId) : ''))
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

      if (!this.$route.query.token) {
        MessageBox.alert('您还没有登录，请先登录').then(action => {
          this.$router.go(-1)
          /* eslint-disable no-undef */
          nativeObj.login()
        })
      }
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.$store.commit('setEnterModel', this.$route.query.model)
        this.$store.commit('setCcuSn', this.$route.query.ccuSn)
        this.orderId = this.$route.query.orderId
        if (this.$route.query.days) {
          this.days = this.$route.query.days
        }
        if (this.$route.query.ccuSn) {
          this.ccuSn = this.$route.query.ccuSn
        }

        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
      }
      if (this.orderId) {
        this.isShowAgreement = false
        if (this.days && this.days >= 0) {
          document.title = '续租'
        } else {
          document.title = '补缴欠费'
        }
      } else {
        document.title = '详情'
      }
      this.loadSolutionList()
      this.loadProductDetail()
      this.loadCouponList()
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

  .p-link{
    color: #3B9AD9;
  }

  .p-detail-container {
    display: -webkit-flex;
    display: flex;
    height: 3rem;
    /*横向*/
    flex-direction: row;
    /*不换行*/
    flex-wrap: nowrap;
    /*排列 起始端对齐*/
    justify-content: flex-start;
    /*对齐 居中对齐*/
    align-items: center;
    align-content: flex-start;
    padding: 0 1rem 0 1.1rem;
    margin-top: 1rem;
  }

  .mint-popup-4 {
    width: 100%;
  }
</style>
