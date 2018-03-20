<template>
  <div class="container lm-font-default lm-text-text">
    <div class="h-container">
      <div class="lm-text-second" >{{deviceTypeName}}</div>
      <div>{{ ccuSn }}</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">租赁状态</div>
      <div :class="{ 'lm-text-red': days < 0 }">{{ orderStatusDesc }}</div>
    </div>
    <div class="h-container" v-if="this.deviceTypeName === '电池编号'">
      <div class="lm-text-second">禁用模式</div>
      <div style="flex: 1"></div>
      <span v-bind:class="{ 'lm-text-text': !modelSwitch,'lm-text-hint': modelSwitch }">关</span><mt-switch style="margin: 0 0.5rem 0 0.5rem;" v-model="modelSwitch" @change="handleChange"></mt-switch><span v-bind:class="{ 'lm-text-text': modelSwitch,'lm-text-hint': !modelSwitch }">开</span>
    </div>
    <div class="h-container">
      <div class="lm-text-second">开始时间</div>
      <div>{{ startTime }}</div>
    </div>

    <div class="h-container">
      <div class="lm-text-second">到期时间</div>
      <div>{{ endTime }}</div>
    </div>

    <div style="height: 1rem"></div>

    <div class="h-container">
      <div class="lm-text-second">网点编号</div>
      <div>{{ storeCode }}</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">网点名称</div>
      <div>  {{ storeName }} ({{ storeType }})</div>
    </div>

    <div class="h-container">
      <div class="lm-text-second">联系电话</div>
      <div>{{ storePhone }}</div>
    </div>

    <div class="h-container">
      <div class="lm-text-second">网点地址</div>
      <div >{{ province + city + county  }}</div>
    </div>
    <div class="h-container-1"  >
      <div class="lm-text-second"></div>
      <div >{{ storeAddress  }}</div>
    </div>

    <div style="height: 4rem"></div>

    <div class="h-btn-container" v-if="days >= 0">
      <div @click="finish"  class="action-btn">退租</div>
      <span style="width: 1px;height: 16px;background-color: #BDBDBD;margin: 1.5rem 0 1.5rem 0"></span>
      <div @click="change"  class="action-btn">更换</div>
      <span style="width: 1px;height: 16px;background-color: #BDBDBD;margin: 1.5rem 0 1.5rem 0"></span>
      <div @click="topUp"  class="action-btn" >续租</div>
    </div>
    <div class="h-btn-container" v-else>
      <div @click="pay"  class="action-btn lm-text-red">补缴欠费</div>
    </div>

  </div>
</template>

<script>
  import {Indicator, Toast} from 'mint-ui'
  export default {
    name: 'order-detail',
    data () {
      return {
        modelSwitch: false,
        deviceTypeName: null,
        province: null,
        city: null,
        county: null,
        type: null,
        storeID: null,
        storeName: null,
        storeContact: null,
        storeAddress: null,
        storePhone: null,
        storeCode: null,
        orderStatus: -1,
        orderId: null,
        productId: null,
        ccuSn: null,
        startTime: '',
        endTime: '',
        days: null,
        // ali支付form表单信息
        alipay: '',
        opsModel: -1
      }
    },
    computed: {
      storeType () {
        switch (this.type) {
          case 2:
            return '美团'
          case 3:
            return '饿了么'
          default:
            return '维修网点'
        }
      },
      orderStatusDesc () {
        if (this.orderStatus === 3) {
          return '已退租'
        } else {
          if (this.days < 0) {
            return '欠费'
          } else {
            return '正常'
          }
        }
      }
    },
    methods: {
      handleChange (event) {
        console.log(event)
        if (event) {
          Indicator.open('开启禁用模式...')
          this.axios.put('/api-ebike/v3.1/ues/update-use-status?ccuSn=' + this.ccuSn + '&useStatus=0').then((res) => {
            console.log(res)
            Indicator.close()
          })
            .catch(error => {
              console.log(error)
              Indicator.close()
              this.modelSwitch = false
            })
        } else {
          Indicator.open('关闭禁用模式...')
          this.axios.put('/api-ebike/v3.1/ues/update-use-status?ccuSn=' + this.ccuSn + '&useStatus=1').then((res) => {
            console.log(res)
            Indicator.close()
          })
            .catch(error => {
              console.log(error)
              Indicator.close()
              this.modelSwitch = true
            })
        }
      },
      change () {
        if (this.orderStatus === 3) {
          Toast('已退租')
          return
        }
        this.$router.push({
          name: 'OrderOpsQRCode',
          query: {
            token: this.$store.state.token,
            firm: this.$store.state.firm,
            ccuSn: this.ccuSn,
            orderId: this.orderId,
            title: '更换二维码',
            storeName: this.storeName,
            type: 1
          }
        })
      },
      finish () {
        if (this.orderStatus === 3) {
          Toast('已退租')
          return
        }
        this.$router.push({
          name: 'OrderOpsQRCode',
          query: {
            token: this.$store.state.token,
            firm: this.$store.state.firm,
            ccuSn: this.ccuSn,
            orderId: this.orderId,
            title: '退租二维码',
            storeName: this.storeName,
            type: 0
          }
        })
      },
      topUp () {
        if (this.orderStatus === 3) {
          Toast('已退租')
          return
        }
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
                orderId: this.orderId,
                days: this.days
              }
            })
          } else {
          }
        }
      },
      pay () {
        if (this.orderStatus === 3) {
          Toast('已退租')
          return
        }
        if (this.$store.state.token && this.$store.state.firm) {
          if (this.orderId) {
            this.$router.push({
              name: 'PayArrearage',
              params: {id: this.productId},
              query: {
                token: this.$store.state.token,
                firm: this.$store.state.firm,
                ccuSn: this.ccuSn,
                orderId: this.orderId,
                days: this.days
              }
            })
          } else {
          }
        }
      },
      loadOrderDetail () {
        this.axios.get('/api-order/v3.1/rent-orders/' + this.$route.params.orderId).then((res) => {
          console.log(res)
          let order = res.data
          if (order) {
            this.orderStatus = order.status
            this.orderId = order.id
            this.ccuSn = order.ccuSn.toUpperCase()
            this.productId = order.productId
            this.startTime = order.startTime
            this.endTime = order.endTime
            if (order.days) {
              this.days = order.days
            }
            if (order.ebikeStoreEntity) {
              this.storeName = order.ebikeStoreEntity.name
              this.storeContact = order.ebikeStoreEntity.linkman
              this.storeAddress = order.ebikeStoreEntity.address
              this.storePhone = order.ebikeStoreEntity.contact
              this.storeID = order.ebikeStoreEntity.id
              this.type = order.ebikeStoreEntity.type
              this.province = order.ebikeStoreEntity.province
              this.city = order.ebikeStoreEntity.city
              this.county = order.ebikeStoreEntity.county
              this.storeCode = order.ebikeStoreEntity.code
            }

            if (this.ccuSn.slice(0, 1) === 'B' || this.ccuSn.slice(0, 1) === 'P') {
              this.deviceTypeName = '电池编号'
              this.loadEbikeDetail()
            } else {
              this.deviceTypeName = '充电器编号'
            }
          }
        })
          .catch(error => {
            console.log(error)
          })
      },
      loadEbikeDetail () {
        this.axios.get('/api-ebike/v3.0/app/get_car_info?ueSn=' + this.ccuSn).then((res) => {
          console.log(res)
          let data = res.data
          if (data) {
            if (data.data) {
              if (data.data.configGear) {
                let gear = data.data.configGear
                if (gear === '17') {
                  this.modelSwitch = true
                } else {
                  this.modelSwitch = false
                }
              }
            }
          }
        })
          .catch(error => {
            console.log(error)
          })
      }
    },
    mounted () {
      window.productDetail = this
      document.title = '详情'
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

  .h-container-1 {
    background-color: #ffffff;
    width: 100%;
    height: 2rem;
    padding: 0 1rem 1rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
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

</style>
