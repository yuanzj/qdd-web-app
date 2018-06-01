<template>
  <div class="container">

    <div style="background: white">

      <div class="p-head">
        <img class="p-image" :src="image"/>
        <span class="p-title" >{{ title }}</span>
      </div>
      <!--<div class="p-desc"  style="margin: 0 1rem 0 1rem">-->
        <!--可租赁 {{ inventory >= 5 ? 5 : inventory }}-->
      <!--</div>-->
      <div class="p-desc">{{ description }}</div>

      <div v-if="ccuSn" class="p-detail-text lm-text-second">设备编号 {{ ccuSn }}</div>
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

    <div v-if="depositAmount !== null">
      <div class="table-head-title">押金</div>
      <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
      <div class="lm-text-text lm-font-second" style="background-color: white" v-for="(option,index) in depositOptions">

        <div class="options-container">
          <label class="mint-radiolist-label">
            <span
              :class="{'is-right': false}"
              class="mint-radio">
              <input
                class="mint-radio-input"
                type="radio"
                v-model="depositAmount"
                :disabled="option.disabled"
                :value="option.value || option">
              <span class="mint-radio-core"></span>
            </span>
            <span class="mint-radio-label" v-text="option.amount + '元'"></span>
          </label>
          <span  v-text="option.description"></span>
        </div>
        <div style="margin-left: 1rem" v-if="index < (depositOptions.length - 1)">
          <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
        </div>
      </div>
      <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
      <div class="p-desc lm-text-text" style="padding-bottom: 1rem" v-if="depositDescription != null">{{ depositDescription }}</div>
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

    <div class="table-head-title">余额</div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    <div class="lm-text-text lm-font-second" style="background-color: white" v-for="(option,index) in balanceOptions">

      <div class="options-container">
        <label class="mint-radiolist-label">
            <span
              :class="{'is-right': false}"
              class="mint-radio">
              <input
                class="mint-radio-input"
                type="radio"
                v-model="balanceOptionValue"
                :disabled="option.disabled"
                :value="option.value || option">
              <span class="mint-radio-core"></span>
            </span>
          <span class="mint-radio-label" v-text="balance + '元'"></span>
        </label>
      </div>
      <div style="margin-left: 1rem" v-if="index < (balanceOptions.length - 1)">
        <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
      </div>
    </div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>

    <div v-if="showInviteLayout">
      <div class="table-head-title">邀请码<span class="lm-text-red lm-font-sm" style="margin-left: 1rem">{{ inviteSubtractPrice }}</span></div>
      <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
      <div class="options-container lm-text-text lm-font-second" @click="scanInviteCode">
        <div style="margin-left: 0.5rem">{{ inviteInfo }}</div><div><img style="width: 25px;height: 25px" src="../assets/icons8-right_4.png"/></div>
      </div>
      <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    </div>

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
        <div class="lm-font-default"><span class="lm-text-red lm-font-head">{{ finalPrice >=0 ? finalPrice : 0 }}</span>元
          <!--<span v-if="depositAmount !== null">+押金<span class="lm-text-red lm-font-head">{{ depositAmount }}</span>元</span>-->
        </div>
      </div>

      <div class="tobuy" @click="createOrder">{{ orderBtnTile }}</div>
    </div>

    <div class="hide" v-html="alipay"></div>

    <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">
      <div style="height: 360px">
        <div style="height: 48px;text-align: center">
          <span style="padding-top: 0.5rem;font-size: 1rem;" class="lm-text-text">优惠券</span>
          <br/>
          <span class="lm-text-second lm-font-sm">满足条件可使用</span>
        </div>
        <div style="height: 264px;overflow: auto">
          <div class="lm-text-text lm-font-second" style="background-color: white" v-for="(option,index) in couponList">

            <div class="options-container-1">
              <label class="mint-radiolist-label">
              <span
                :class="{'is-right': false}"
                class="mint-radio">
                <input
                  class="mint-radio-input"
                  type="radio"
                  v-model="selectedCouponIndex"
                  :disabled="option.disabled"
                  :value="option.value || option">
                <span class="mint-radio-core"></span>
              </span>
              </label>
              <div style="text-align: left;flex: 1" @click="onClickCoupon(option,index)">
                <div class="lm-text-blue lm-font-default"> {{option.name}}</div>
                <div class="lm-text-text lm-font-second" style="margin-top: 0.25rem"> {{option.ruleDescription}}</div>
                <div class="lm-text-text lm-font-second" style="margin-top: 0.25rem"> 有效期至：{{option.endTime}}</div>
              </div>
            </div>
            <div style="margin-left: 1rem" v-if="index < (couponList.length - 1)">
              <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
            </div>
          </div>
        </div>
        <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
        <div style="height: 48px;width: 100%;text-align: center" @click="notUseCoupon">
          <span style="padding-top: 0.7rem;font-size: 1rem;color: #757575">不使用优惠券</span>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import {Indicator, Toast, MessageBox} from 'mint-ui'
  import { Base64 } from 'js-base64'
  export default {
    name: 'product-detail',
    data () {
      return {
        balance: 0,
        depositAmount: null,
        fromScanModel: false,
        couponId: null,
        popupVisible: false,
        categoryId: 1,
        isShowAgreement: true,
        agreement: true,
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
        inventory: '',
        optionValue: -1,
        options: [],
        currentValue: '',
        payOptionValue: '2',
        payOptions: [{label: '支付宝', value: '2', disabled: false}],
        depositOptions: [{label: '押金', value: '0', disabled: false}],
        balanceOptionValue: '0',
        balanceOptions: [{label: '0元', value: '0', disabled: false}],
        // ali支付form表单信息
        alipay: '',
        couponList: [],
        selectedCouponIndex: -1,
        subtractPrice: null,
        specificationCode: null,
        canUseCouponCount: 0,
        showInviteLayout: false,
        inviteSubtractPrice: null,
        scanModel: 0,
        inviterPhoneNumber: null,
        userFee: null,
        practicalUserFee: 0,
        inviteInfo: '扫描推荐人二维码名片获取优惠'
      }
    },
    computed: {
      depositDescription: function () {
        for (let i = 0; i < this.depositOptions.length; i++) {
          if (this.depositAmount === this.depositOptions[i].amount) {
            return this.depositOptions[i].remark
          }
        }
        return null
      },
      finalPrice: function () {
        if (this.options && this.options.length > 0) {
          if (this.couponList.length > 0 && this.selectedCouponIndex >= 0) {
            let lastTotalPrice = Number((this.options[this.optionValue].price - this.couponList[this.selectedCouponIndex].amount).toFixed(2))
            if (lastTotalPrice > 0) {
              if (this.depositAmount) {
                return lastTotalPrice + this.depositAmount - this.balance - this.practicalUserFee
              } else {
                return lastTotalPrice - this.balance - this.practicalUserFee
              }
            } else {
              if (this.depositAmount) {
                return this.depositAmount - this.balance
              } else {
                return 0
              }
            }
          } else {
            let tempPrice = this.options[Number(this.optionValue)].price
            if (this.depositAmount) {
              return tempPrice + this.depositAmount - this.balance - this.practicalUserFee
            } else {
              return tempPrice - this.balance - this.practicalUserFee
            }
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
          if (this.fromScanModel) {
            return '租赁'
          } else {
            return '扫码租赁'
          }
        }
      },
      couponInfo: function () {
        if (this.couponList.length > 0) {
          if (this.selectedCouponIndex < 0) {
            this.subtractPrice = ''
            return this.canUseCouponCount + '个优惠券可用'
          } else {
            this.subtractPrice = '-' + this.couponList[this.selectedCouponIndex].amount
            return this.couponList[this.selectedCouponIndex].name
          }
        }
        this.subtractPrice = ''
        return '无'
      }
    },
    watch: {
      optionValue (val, oldval) {
        if (this.couponList && this.couponList.length > 0) {
          let index = 0
          let tempSpecificationCode = this.specificationCode
          let cpId = null
          if (this.optionValue >= 0) {
            cpId = this.options[this.optionValue].id
          }
          let temCanUseCouponCount = 0
          this.couponList = this.couponList.map(function (item) {
            item.label = item.name
            item.value = String(index++)
            item.disabled = false
            if (item.couponRuleEntity) {
              item.ruleDescription = item.couponRuleEntity.desc

              if (item.couponRuleEntity.chargeProductId && cpId && cpId !== item.couponRuleEntity.chargeProductId) {
                item.disabled = true
              }
              if (item.couponRuleEntity.specificationCode && tempSpecificationCode && tempSpecificationCode !== item.couponRuleEntity.specificationCode) {
                item.disabled = true
              }
            } else {
              item.ruleDescription = item.desc
            }
            if (!item.disabled) {
              temCanUseCouponCount++
            }
            return item
          })
          this.canUseCouponCount = temCanUseCouponCount
        }
      }
    },
    methods: {
      getPayAccount () {
        this.axios.get('/api-pay/v3.1/accounts/detail').then((res) => {
          let data = res.data
          if (data) {
            this.balance = data.unlockBalance
          }
        })
          .catch(error => {
            console.log(error)
          })
      },
      onClickCoupon (item, index) {
        if (!item.disabled) {
          this.selectedCouponIndex = index
          this.popupVisible = false
        } else {
          this.popupVisible = true
        }
      },
      notUseCoupon () {
        this.couponId = null
        this.selectedCouponIndex = -1
        this.popupVisible = false
      },
      showCoupon () {
        if (this.couponList && this.couponList.length > 0) {
          this.popupVisible = true
        } else {
          this.popupVisible = false
          Toast('暂无可用优惠券')
        }
      },
      scanInviteCode () {
        this.scanModel = 1
        // JS 调用本地方法完成扫码
        /* eslint-disable no-undef */
        if (window.hasOwnProperty('nativeObj')) {
          nativeObj.scan()
        } else {
          window.webkit.messageHandlers.scan.postMessage('')
        }
      },
      fillSnFromScan (sn) {
        if (this.scanModel === 0) {
          this.ccuSn = sn.split(' ')[0]
          this.addOrder()
        } else {
          let temp = Base64.decode(sn.split(' ')[0])
          if (temp && temp.length === 11) {
            this.inviterPhoneNumber = temp
            this.inviteInfo = '优惠' + this.userFee + '元,推荐人：' + this.inviterPhoneNumber
            this.practicalUserFee = this.userFee
            this.inviteSubtractPrice = '-' + this.practicalUserFee
          }
        }
      },
      loadDeposit () {
        console.log('depositconfigs')
        this.axios.get('/api-order/v3.1/depositconfigs?sort=amount,asc',
          {
            params: {
              productId: this.$route.params.id
            }
          }
        ).then((res) => {
          let data = res.data
          console.log(data)
          if (data && data.list.length > 0) {
            // depositOptions: [{label: '押金', value: '0', disabled: false}]
            data.list.map(function (item) {
              item.label = '押金'
              item.value = item.amount
              item.disabled = false
              if (item.description === undefined) {
                item.description = '仅限本区域使用'
              }
            })
            this.depositAmount = data.list[0].amount
            this.depositOptions = data.list
          }
        })
          .catch(error => {
            console.log(error)
          })
      },
      loadUserRentStatus () {
        console.log('depositconfigs')
        this.axios.get('/api-order/v3.1/rent-orders/rent-status-4-current-user').then((res) => {
          let data = res.data
          if (data !== '租赁中' && data !== '租赁过') {
            this.showInviteLayout = true
          }
        })
          .catch(error => {
            console.log(error)
          })
      },
      loadProductDetail () {
        this.axios.get('/api-order/v3.1/products/' + this.$route.params.id).then((res) => {
          let product = res.data
          if (product) {
            this.image = product.image
            this.title = product.name
            this.description = product.desc
            this.price = product.price
            this.inventory = product.inventory
            this.categoryId = product.categoryId
            this.specificationCode = product.specificationCode
            this.userFee = product.userFee
            if (this.userFee && this.userFee > 0) {
              this.loadUserRentStatus()
            }
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
          console.log(this.couponList)
          if (this.couponList && this.couponList.length > 0) {
            let index = 0
            let tempSpecificationCode = this.specificationCode
            let cpId = null
            if (this.optionValue >= 0) {
              cpId = this.options[this.optionValue].id
            }
            let temCanUseCouponCount = 0
            this.couponList = this.couponList.map(function (item) {
              item.label = item.name
              item.value = String(index++)
              item.disabled = false
              if (item.couponRuleEntity) {
                item.ruleDescription = item.couponRuleEntity.desc

                if (item.couponRuleEntity.chargeProductId && cpId && cpId !== item.couponRuleEntity.chargeProductId) {
                  item.disabled = true
                }
                if (item.couponRuleEntity.specificationCode && tempSpecificationCode && tempSpecificationCode !== item.couponRuleEntity.specificationCode) {
                  item.disabled = true
                }
              } else {
                item.ruleDescription = item.desc
              }
              if (!item.disabled) {
                temCanUseCouponCount++
              }
              return item
            })
            this.canUseCouponCount = temCanUseCouponCount
          }
        })
          .catch(error => {
            console.log(error)
          })
      },
      loadSolutionList () {
        this.axios.get('/api-order/v3.1/chargeproducts',
          {
            params: {
              page: 1,
              limit: 20,
              sidx: 'face_value',
              order: 'asc',
              parentId: this.$route.params.id
            }
          }
        ).then((res) => {
          if (res.data.list) {
            let index = 0
            this.optionValue = 0
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
          if (this.fromScanModel && this.ccuSn) {
            this.addOrder()
          } else {
            this.scanModel = 0
            // JS 调用本地方法完成扫码
            /* eslint-disable no-undef */
            if (window.hasOwnProperty('nativeObj')) {
              nativeObj.scan()
            } else {
              window.webkit.messageHandlers.scan.postMessage('')
            }
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
        if (this.selectedCouponIndex >= 0) {
          this.couponId = this.couponList[this.selectedCouponIndex].id
        }
        this.axios.post('/api-order/v3.1/rent-orders/?' + 'productId=' + this.options[Number(this.optionValue)].id + '&count=' + String(this.count) + '&ccuSn=' + this.ccuSn + (this.couponId ? ('&couponId=' + this.couponId) : '') + '&payChannelId=' + this.payOptionValue + '&depositAmount=' + this.depositAmount + (this.inviterPhoneNumber ? ('&inviterPhoneNumber=' + this.inviterPhoneNumber) : ''))
          .then((res) => {
            console.log(res)
            Indicator.close()
            if (res.data) {
              if (res.data.error) {
                Toast(res.data.error.msg)
              } else {
                if (res.data === 'success') {
                  this.$router.push({
                    name: 'PayComplete'
                  })
                } else if (res.data.indexOf('_alipaysubmit_') !== -1) {
                  this.alipay = res.data
                  setTimeout(function () {
                    document.forms['_alipaysubmit_'].submit()
                  }, 0)
                } else {
                  location.href = res.data
                }
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
        if (this.selectedCouponIndex >= 0) {
          this.couponId = this.couponList[this.selectedCouponIndex].id
        }
        this.axios.post('/api-order/v3.1/rent-orders/' + this.orderId + '/topup?' + 'productId=' + this.options[Number(this.optionValue)].id + '&count=' + String(this.count) + '&ccuSn=' + this.ccuSn + (this.couponId ? ('&couponId=' + this.couponId) : '') + '&payChannelId=' + this.payOptionValue + (this.depositAmount ? '&depositAmount=' + this.depositAmount : ''))
          .then((res) => {
            console.log(res)
            Indicator.close()
            if (res.data) {
              if (res.data.error) {
                Toast(res.data.error.msg)
              } else {
                if (res.data === 'success') {
                  this.$router.push({
                    name: 'PayComplete'
                  })
                } else if (res.data.indexOf('_alipaysubmit_') !== -1) {
                  this.alipay = res.data
                  setTimeout(function () {
                    document.forms['_alipaysubmit_'].submit()
                  }, 0)
                } else {
                  location.href = res.data
                }
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
        if (this.$route.query.pay2) {
          this.payOptions = [{label: '支付宝', value: '2', disabled: false}, {label: '微信', value: '3', disabled: false}]
        }

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
        if (this.$route.query.noDeposit) {
          this.loadDeposit()
        }
      } else {
        document.title = '产品详情'
        if (this.$route.query.ccuSn) {
          this.fromScanModel = true
        }
        // 获取押金
        this.loadDeposit()
      }
      this.loadSolutionList()
      this.loadProductDetail()
      this.loadCouponList()
      this.getPayAccount()
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

  .options-container-1 {
    height: 5.5rem;
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
