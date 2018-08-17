<template>
  <div class="container">

    <div class="h-buttons-container"  style="background-color: #666f76;height: 33.333333vw">

      <div class="v-button"  @click="finish">
        <img src="../assets/icons8-refund.png" class="v-button-icon"/>
        <p class="v-button-title" style="color: white">退租退电</p>
      </div>
      <div class="v-button"  @click="replace">
        <img src="../assets/icons8-replace.png" class="v-button-icon"/>
        <p class="v-button-title" style="color: white">售后换电</p>
      </div>
    </div>
    <div style="height: 1rem"></div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    <div class="table-head-title">设备管理</div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    <div v-if="role === 'ADMIN'">
      <div class="h-buttons-container">
        <div class="v-button"  @click="batteryStatistics">
          <img src="../assets/icons8-positive_dynamic.png" class="v-button-icon"/>
          <p class="v-button-title">设备统计</p>
        </div>

        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  @click="search">
          <img src="../assets/icons8-search.png" class="v-button-icon"/>
          <p class="v-button-title">设备查询</p>
        </div>
        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  @click="batteryDistribution">
          <img src="../assets/icons8-scan_stock.png" class="v-button-icon"/>
          <p class="v-button-title">设备调拨</p>
        </div>
      </div>
      <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
      <div class="h-buttons-container">
        <div class="v-button"  @click="rentedList">
          <img src="../assets/icons8-car_battery.png" class="v-button-icon"/>
          <p class="v-button-title">在租查询</p>
        </div>
        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  @click="overdueOrderList">
          <img src="../assets/icons8-expired.png" class="v-button-icon"/>
          <p class="v-button-title">逾期查询</p>
        </div>
        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  @click="repairList">
          <img src="../assets/icons8-maintenance.png" class="v-button-icon"/>
          <p class="v-button-title">售后查询</p>
        </div>
      </div>
      <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
      <div class="h-buttons-container">
        <div class="v-button"  @click="runModelSwitch">
          <img src="../assets/icons8-charge_battery.png" class="v-button-icon"/>
          <p class="v-button-title">租前充电</p>
        </div>
        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  >
        </div>
        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  >
        </div>
      </div>
    </div>
    <div v-else-if="role === 'DEALER'">
      <div class="h-buttons-container">
        <div class="v-button"  @click="batteryStatistics">
          <img src="../assets/icons8-positive_dynamic.png" class="v-button-icon"/>
          <p class="v-button-title">设备统计</p>
        </div>

        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  @click="search">
          <img src="../assets/icons8-search.png" class="v-button-icon"/>
          <p class="v-button-title">设备查询</p>
        </div>
        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  @click="batteryDistribution">
          <img src="../assets/icons8-scan_stock.png" class="v-button-icon"/>
          <p class="v-button-title">设备调拨</p>
        </div>
      </div>
      <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
      <div class="h-buttons-container">
        <div class="v-button"  @click="rentedList">
          <img src="../assets/icons8-car_battery.png" class="v-button-icon"/>
          <p class="v-button-title">在租查询</p>
        </div>
        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  @click="overdueOrderList">
          <img src="../assets/icons8-expired.png" class="v-button-icon"/>
          <p class="v-button-title">逾期查询</p>
        </div>
        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  @click="repairList">
          <img src="../assets/icons8-maintenance.png" class="v-button-icon"/>
          <p class="v-button-title">售后查询</p>
        </div>
      </div>
      <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
      <div class="h-buttons-container">
        <div class="v-button"  @click="runModelSwitch">
          <img src="../assets/icons8-charge_battery.png" class="v-button-icon"/>
          <p class="v-button-title">租前充电</p>
        </div>
        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  >
        </div>
        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  >
        </div>
      </div>
    </div>
    <div v-else>
      <div class="h-buttons-container">
        <div class="v-button"  @click="batteryStatistics">
          <img src="../assets/icons8-positive_dynamic.png" class="v-button-icon"/>
          <p class="v-button-title">设备统计</p>
        </div>

        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  @click="search">
          <img src="../assets/icons8-search.png" class="v-button-icon"/>
          <p class="v-button-title">设备查询</p>
        </div>
        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  @click="batteryDistribution">
          <img src="../assets/icons8-scan_stock.png" class="v-button-icon"/>
          <p class="v-button-title">设备调拨</p>
        </div>
      </div>
      <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
      <div class="h-buttons-container">
        <div class="v-button"  @click="rentedList">
          <img src="../assets/icons8-car_battery.png" class="v-button-icon"/>
          <p class="v-button-title">在租查询</p>
        </div>
        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  @click="overdueOrderList">
          <img src="../assets/icons8-expired.png" class="v-button-icon"/>
          <p class="v-button-title">逾期查询</p>
        </div>
        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  @click="repairList">
          <img src="../assets/icons8-maintenance.png" class="v-button-icon"/>
          <p class="v-button-title">售后查询</p>
        </div>
      </div>
      <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
      <div class="h-buttons-container">
        <div class="v-button"  @click="runModelSwitch">
          <img src="../assets/icons8-charge_battery.png" class="v-button-icon"/>
          <p class="v-button-title">租前充电</p>
        </div>
        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  >
        </div>
        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  >
        </div>
      </div>
    </div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>

    <div style="height: 1rem"></div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    <div class="table-head-title">财务管理</div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    <div >
      <div class="h-buttons-container">

        <div class="v-button"  @click="balance">
          <img src="../assets/icons8-money.png" class="v-button-icon"/>
          <p class="v-button-title">账户余额</p>
        </div>
        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  @click="earningsList">
          <img src="../assets/icons8-investment_portfolio.png" class="v-button-icon"/>
          <p class="v-button-title">收益查询</p>
        </div>
        <div style="width: 1px; height: 100%;background-color: #e2e2e2"></div>
        <div class="v-button"  @click="payOrderList">
          <img src="../assets/icons8-purchase_order.png" class="v-button-icon"/>
          <p class="v-button-title">订单查询</p>
        </div>
      </div>
      <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    </div>

    <!--<div class="table-head-title">用户中心</div>-->
    <!--<div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>-->
    <!--<div class="h-buttons-container">-->

      <!--<div class="v-button"  @click="setting">-->
        <!--<img src="../assets/icons8-settings.png" class="v-button-icon"/>-->
        <!--<p class="v-button-title">设置</p>-->
      <!--</div>-->
      <!--<div class="v-button"  @click="about">-->
        <!--<img src="../assets/icons8-info.png" class="v-button-icon"/>-->
        <!--<p class="v-button-title">关于</p>-->
      <!--</div>-->
      <!--<div class="v-button"  >-->
      <!--</div>-->
      <!--<div class="v-button"></div>-->
    <!--</div>-->
    <!--<div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>-->

    <div style="height: 48px"></div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'
  export default {
    name: 'ops-main',
    data () {
      return {
        ccuSn: null,
        role: 'USER',
        user: null,
        model: null,
        host: 'http://cjl3.rokyinfo.net:8200/#/'
      }
    },
    methods: {
      loadUserDetail () {
        this.axios.get('/api-user/v3.1/users/info').then((res) => {
          let user = res.data
          if (user) {
            this.user = user
            console.log(user)
            for (let i = 0; i < user.roles.length; i++) {
              let item = user.roles[i]
              if (item.name === 'ADMIN') {
                this.role = 'ADMIN'
              } else if (item.name === 'DEALER') {
                if (this.role !== 'ADMIN') {
                  this.role = 'DEALER'
                }
              } else if (item.name === 'STATION') {
                if (this.role !== 'ADMIN' && this.role !== 'DEALER') {
                  this.role = 'STATION'
                }
              } else {
                if (this.role !== 'ADMIN' && this.role !== 'DEALER' && this.role !== 'STATION') {
                  this.role = 'USER'
                }
              }
            }
          }
        })
          .catch(error => {
            console.log(error)
          })
      },
      setting () {
        if (this.model === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage(this.host + 'ops-user-psw?')
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage(this.host + 'ops-user-psw?')
          }
        } else {
          this.$router.push({
            name: 'OpsUserPsw',
            query: {
              token: this.$store.state.token,
              firm: this.$store.state.firm,
              userName: this.user.username
            }
          })
        }
      },
      about () {
        if (this.model === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage(this.host + 'ops-about?')
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage(this.host + 'ops-about?')
          }
        } else {
          this.$router.push({
            name: 'OpsAbout',
            query: {
              token: this.$store.state.token,
              firm: this.$store.state.firm
            }
          })
        }
      },
      finish () {
        if (this.model === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage(this.host + 'ops-order-ops-step?model=0&')
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage(this.host + 'ops-order-ops-step?model=0&')
          }
        } else {
          this.$router.push({
            name: 'OpsOrderOpsStep',
            query: {
              token: this.$store.state.token,
              firm: this.$store.state.firm,
              model: 0
            }
          })
        }
      },
      replace () {
        if (this.model === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage(this.host + 'ops-order-ops-step?model=1&')
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage(this.host + 'ops-order-ops-step?model=1&')
          }
        } else {
          this.$router.push({
            name: 'OpsOrderOpsStep',
            query: {
              token: this.$store.state.token,
              firm: this.$store.state.firm,
              model: 1
            }
          })
        }
      },
      batteryStatistics () {
        if (this.model === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage(this.host + 'store-statistics?')
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage(this.host + 'store-statistics?')
          }
        } else {
          if (this.user) {
            this.$router.push({
              name: 'StoreStatistics',
              query: {
                token: this.$store.state.token,
                firm: this.$store.state.firm,
                storeId: this.user.storeId
              }
            })
          } else {
            Toast('用户信息未加载成功，请下拉刷新或重新登录！')
          }
        }
      },
      runModelSwitch () {
        if (this.model === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage(this.host + 'run-model-switch?')
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage(this.host + 'run-model-switch?')
          }
        } else {
          if (this.user) {
            this.$router.push({
              name: 'RunModelSwitch',
              query: {
                token: this.$store.state.token,
                firm: this.$store.state.firm,
                storeId: this.user.storeId
              }
            })
          } else {
            Toast('用户信息未加载成功，请下拉刷新或重新登录！')
          }
        }
      },
      rentedList () {
        if (this.model === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage(this.host + 'rented-list?')
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage(this.host + 'rented-list?')
          }
        } else {
          if (this.user) {
            this.$router.push({
              name: 'RentedList',
              query: {
                token: this.$store.state.token,
                firm: this.$store.state.firm,
                storeId: this.user.storeId
              }
            })
          } else {
            Toast('用户信息未加载成功，请下拉刷新或重新登录！')
          }
        }
      },
      overdueOrderList () {
        if (this.model === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage(this.host + 'overdue-order-list?')
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage(this.host + 'overdue-order-list?')
          }
        } else {
          if (this.user) {
            this.$router.push({
              name: 'OverdueOrderList',
              query: {
                token: this.$store.state.token,
                firm: this.$store.state.firm,
                storeId: this.user.storeId
              }
            })
          } else {
            Toast('用户信息未加载成功，请下拉刷新或重新登录！')
          }
        }
      },
      repairList () {
        if (this.model === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage(this.host + 'repair-list?')
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage(this.host + 'repair-list?')
          }
        } else {
          if (this.user) {
            this.$router.push({
              name: 'RepairList',
              query: {
                token: this.$store.state.token,
                firm: this.$store.state.firm,
                storeId: this.user.storeId
              }
            })
          } else {
            Toast('用户信息未加载成功，请下拉刷新或重新登录！')
          }
        }
      },
      balance () {
        if (this.model === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage(this.host + 'ops-balance?')
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage(this.host + 'ops-balance?')
          }
        } else {
          if (this.user) {
            this.$router.push({
              name: 'OpsBalance',
              query: {
                token: this.$store.state.token,
                firm: this.$store.state.firm,
                storeId: this.user.storeId
              }
            })
          } else {
            Toast('用户信息未加载成功，请下拉刷新或重新登录！')
          }
        }
      },
      earningsList () {
        if (this.model === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage(this.host + 'earnings-list?')
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage(this.host + 'earnings-list?')
          }
        } else {
          if (this.user) {
            this.$router.push({
              name: 'EarningsList',
              query: {
                token: this.$store.state.token,
                firm: this.$store.state.firm,
                storeId: this.user.storeId
              }
            })
          } else {
            Toast('用户信息未加载成功，请下拉刷新或重新登录！')
          }
        }
      },
      payOrderList () {
        if (this.model === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage(this.host + 'pay-order-list?')
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage(this.host + 'pay-order-list?')
          }
        } else {
          if (this.user) {
            this.$router.push({
              name: 'PayOrderList',
              query: {
                token: this.$store.state.token,
                firm: this.$store.state.firm,
                storeId: this.user.storeId
              }
            })
          } else {
            Toast('用户信息未加载成功，请下拉刷新或重新登录！')
          }
        }
      },
      search () {
        if (this.model === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage(this.host + 'search-main?')
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage(this.host + 'search-main?')
          }
        } else {
          this.$router.push({
            name: 'SearchMain',
            query: {
              token: this.$store.state.token,
              firm: this.$store.state.firm
            }
          })
        }
      },
      orderBattery () {
        if (this.model === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage(this.host + 'order-battery?')
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage(this.host + 'order-battery?')
          }
        } else {
          this.$router.push({
            name: 'OrderBattery',
            query: {
              token: this.$store.state.token,
              firm: this.$store.state.firm
            }
          })
        }
      },
      batteryDistribution () {
        if (this.model === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage(this.host + 'battery-distribution?')
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage(this.host + 'battery-distribution?')
          }
        } else {
          this.$router.push({
            name: 'BatteryDistribution',
            query: {
              token: this.$store.state.token,
              firm: this.$store.state.firm
            }
          })
        }
      },
      incomeStatistics () {
        if (this.model === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage(this.host + 'income-statistics?')
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage(this.host + 'income-statistics?')
          }
        } else {
          this.$router.push({
            name: 'IncomeStatistics',
            query: {
              token: this.$store.state.token,
              firm: this.$store.state.firm
            }
          })
        }
      }
    },
    mounted () {
      window.productDetail = this
      document.title = '首页'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.model = this.$route.query.model
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
        this.loadUserDetail()
      }
    }
  }
</script>

<style scoped>

  .container{
  }

  .table-head-title {
    padding-left: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    font-size: 0.875rem;
    background-color: white;
  }

  .h-buttons-container {
    display: -webkit-flex;
    display: flex;
    background-color: white;
    height: 33.333333vw;
    -webkit-align-items:center;
    align-items:center;
    -webkit-justify-content:center;
    justify-content:center;
  }

  .v-button {
    -webkit-flex: 1;
    flex: 1;
    text-align: center;
  }

  .v-button-icon {
    width: 2.5rem;
    height: 2.5rem;;
  }

  .v-button-title {
    margin-top: 0.5rem;
    color: #212121;
    font-size: 0.875rem;
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
