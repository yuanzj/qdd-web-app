<template>
  <div class="p-container" @click="showOrderDetail">
    <div class="p-head">
      <div class="p-head-1">{{ itemName }}</div>
      <div class="p-head-2" v-if="days >= 0"> {{ days }}天<span class="lm-text-red">{{ protectModel }}</span></div>
      <div class="p-head-2 lm-text-red" v-if="days < 0">逾期 {{ Math.abs(days) }}天</div>
    </div>

    <div class="p-content" >
      <div style="text-align: center;flex: 1;-webkit-flex: 1">
        <span class="p-desc">电池电量</span>
        <div class="p-title" :class="{ 'lm-text-green': isNormal, 'lm-text-orange': isWarning, 'lm-text-red': isError, 'lm-text-hint': isDisable }">{{ soh }} <span class="p-desc">%</span></div>

      </div>
      <div style="text-align: center;flex: 1;-webkit-flex: 1">
        <span class="p-desc">电池电压</span>
        <div class="p-title" :class="{ 'lm-text-green': isNormal, 'lm-text-orange': isWarning, 'lm-text-red': isError, 'lm-text-hint': isDisable }">{{ voltage }} <span class="p-desc">v</span></div>
      </div>
    </div>

    <div class="p-content" style="margin-top: 1rem">
      <div style="text-align: center;flex: 1;-webkit-flex: 1">
        <span class="p-desc">今日里程</span>
        <div class="p-title" :class="{ 'lm-text-green': isNormal, 'lm-text-orange': isWarning, 'lm-text-red': isError, 'lm-text-hint': isDisable }">{{ dayOdo }} <span class="p-desc">km</span></div>
      </div>
      <div style="text-align: center;flex: 1;-webkit-flex: 1">
        <span class="p-desc">续航里程</span>
        <div class="p-title" :class="{ 'lm-text-green': isNormal, 'lm-text-orange': isWarning, 'lm-text-red': isError, 'lm-text-hint': isDisable }">{{ mileage }} <span v-if="showKMFlag" class="p-desc">km</span></div>
      </div>

    </div>

    <div class="p-desc1" v-if="type === 4">
      {{ address }}
    </div>
    <div class="p-desc2" v-if="noDataUpload">
      未开启服务
    </div>
    <div class="p-desc2">
      更新于 <span class="lm-text-text">{{ reportTime }}</span>
    </div>
    <div style="width:100%; padding: 1rem 1rem 0 1rem">
      <div style="width:100%;height:1px;margin:0 ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    </div>

    <div class="h-container" style="height: 3.5rem" @click.stop="stopEvent">

      <div style="flex: 1;-webkit-flex: 1;text-align: center" @click="voltageChart">
        <div class="lm-font-second lm-text-second" >电量统计</div>
      </div>

      <div style="width: 1px; height: 2rem;background-color: #e2e2e2"></div>

      <div style="flex: 1;-webkit-flex: 1;text-align: center" @click="mileageChart">
        <div class="lm-font-second lm-text-second">里程统计</div>
      </div>

      <div style="width: 1px; height: 2rem;background-color: #e2e2e2"></div>

      <div style="flex: 1;-webkit-flex: 1;text-align: center" @click="locationMap">
        <div class="lm-font-second lm-text-second">位置详情</div>
      </div>

    </div>

    <div style="width:100%; padding:0 1rem 1rem 1rem">
      <div style="width:100%;height:1px;margin:0 ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    </div>

    <div class="h-container" @click.stop="stopEvent">

      <div style="flex: 1;-webkit-flex: 1;text-align: center" @click="findBattery">
        <img  style="width: 1.5rem;height: 1.5rem" src="../assets/icons8-volume_up.png"/>
        <div class="lm-font-second lm-text-second" style="margin-top: 0.5rem">寻找电池</div>
      </div>

      <div style="width: 1px; height: 2rem;background-color: #e2e2e2"></div>

      <div style="flex: 1;-webkit-flex: 1;text-align: center" @click="onClickSwitchPower">
        <img  style="width: 1.5rem;height: 1.5rem" src="../assets/icons8-power-on.png" v-if="modelSwitch"/>
        <img  style="width: 1.5rem;height: 1.5rem" src="../assets/icons8-shutdown.png" v-else/>

        <div class="lm-font-second lm-text-second"  style="margin-top: 0.5rem" v-if="modelSwitch">禁用电池</div>
        <div class="lm-font-second lm-text-red"  style="margin-top: 0.5rem" v-else>激活电池</div>
      </div>

    </div>
    <div style="height: 1rem" v-if="type === 4"></div>
  </div>
</template>

<script>
  import {Indicator, Toast, MessageBox} from 'mint-ui'
  export default {
    name: 'device-item',
    props: {
      type: {
        type: Number
      },
      orderId: {
        type: Number
      },
      ebikeReportData: {
        type: Object
      },
      ueSn: {
        type: String
      },
      address: {
        type: String
      },
      productName: {
        type: String
      },
      days: {
        type: Number
      },
      defaultMileage: {
        type: String,
        default: '-1'
      },
      dayOdo: {
        type: Number
      }

    },
    data () {
      return {
        isNormal: false,
        isWarning: false,
        isError: false,
        isDisable: false,
        modelSwitch: false,
        showKMFlag: true,
        expectStatus: null,
        timeOutTask: null
      }
    },
    computed: {
      protectModel: function () {
        if (this.ebikeReportData) {
          if (this.ebikeReportData.hasOwnProperty('gear')) {
            let gear = this.ebikeReportData.gear
            if (gear === '17') {
              this.modelSwitch = false
            } else {
              this.modelSwitch = true
            }
            if (this.expectStatus === null) {
              this.expectStatus = this.modelSwitch
            } else {
              if (this.expectStatus === this.modelSwitch) {
                if (this.timeOutTask !== null) {
                  clearTimeout(this.timeOutTask)
                  Indicator.close()
                  this.timeOutTask = null
                  MessageBox('提示', this.expectStatus ? '开启成功' : '关闭成功')
                }
              }
            }
            return ((gear === '17') ? '/禁用' : '')
          }
        } else {
          return ''
        }
      },
      itemName: function () {
        return this.productName + ' (' + this.ueSn.slice(6) + ')'
      },
      mileage: function () {
        let percentage = -1
        let perCharge = this.ebikeReportData.remainCapacity
        let soh = this.ebikeReportData.soh
        if (perCharge && soh) {
          let perChargeVal = parseInt(perCharge, 16)
          let sohVal = parseInt(soh, 16)
          if (sohVal > 100 && (perChargeVal > 100 || perChargeVal === 0)) {
            // 显示铅酸电池当前电量格数
            let batteryCount = 0
            if (perChargeVal > 100) {
              batteryCount = perChargeVal - 100
            }
            let batteryTotal = sohVal - 100

            let batteryProgress = (batteryCount * 100) / batteryTotal
            if (batteryProgress > 100) {
              batteryProgress = 100
            }

            percentage = batteryProgress
          } else {
            percentage = perChargeVal
          }
        }
        if (percentage !== -1 && Number(this.defaultMileage) !== -1) {
          if (percentage === 0) {
            this.showKMFlag = false
            return '请尽快充电'
          } else if (percentage <= 5) {
            let lowBatteryTimeStamp = this.ebikeReportData.lowBatteryTimeStamp
            let nowDateTimeStamp = new Date().getTime()
            if ((nowDateTimeStamp - lowBatteryTimeStamp) / 1000 > 60) {
              this.showKMFlag = false
              return '请充电'
            }
          }
          this.showKMFlag = true
          return percentage * Number(this.defaultMileage) / 100.0
        } else {
          this.showKMFlag = false
          return '--'
        }
      },
      soh: function () {
        let percentage = -1
        let perCharge = this.ebikeReportData.remainCapacity
        let soh = this.ebikeReportData.soh
        if (perCharge && soh) {
          let perChargeVal = parseInt(perCharge, 16)
          let sohVal = parseInt(soh, 16)
          if (sohVal > 100 && (perChargeVal > 100 || perChargeVal === 0)) {
            // 显示铅酸电池当前电量格数
            let batteryCount = 0
            if (perChargeVal > 100) {
              batteryCount = perChargeVal - 100
            }
            let batteryTotal = sohVal - 100

            let batteryProgress = (batteryCount * 100) / batteryTotal
            if (batteryProgress > 100) {
              batteryProgress = 100
            }

            percentage = batteryProgress
          } else {
            percentage = perChargeVal
          }
        }
        if (percentage !== -1) {
          return percentage
        } else {
          return '--'
        }
      },
      voltage: function () {
        if (this.ebikeReportData && this.ebikeReportData.voltage) {
          let percentage = -1
          let perCharge = this.ebikeReportData.remainCapacity
          let soh = this.ebikeReportData.soh
          if (perCharge && soh) {
            let perChargeVal = parseInt(perCharge, 16)
            let sohVal = parseInt(soh, 16)
            if (sohVal > 100 && (perChargeVal > 100 || perChargeVal === 0)) {
              // 显示铅酸电池当前电量格数
              let batteryCount = 0
              if (perChargeVal > 100) {
                batteryCount = perChargeVal - 100
              }
              let batteryTotal = sohVal - 100

              let batteryProgress = (batteryCount * 100) / batteryTotal
              if (batteryProgress > 100) {
                batteryProgress = 100
              }

              percentage = batteryProgress
            } else {
              percentage = perChargeVal
            }
          }

          if (percentage > 60) {
            this.isNormal = true
            this.isWarning = false
            this.isError = false
            this.isDisable = false
          } else if (percentage > 30) {
            this.isNormal = false
            this.isWarning = true
            this.isError = false
            this.isDisable = false
          } else if (percentage >= 0) {
            this.isNormal = false
            this.isWarning = false
            this.isError = true
            this.isDisable = false
          } else {
            this.isNormal = false
            this.isWarning = false
            this.isError = false
            this.isDisable = true
          }
          if (this.ebikeReportData.voltage > 30) {
            return this.ebikeReportData.voltage
          } else {
            this.isNormal = false
            this.isWarning = false
            this.isError = false
            this.isDisable = true
            return '--'
          }
        } else {
          this.isNormal = false
          this.isWarning = false
          this.isError = false
          this.isDisable = true
          return '--'
        }
      },
      noDataUpload: function () {
        if (this.ebikeReportData && this.ebikeReportData.lastReportTime) {
          return false
        } else {
          return true
        }
      },
      reportTime: function () {
        if (this.ebikeReportData && this.ebikeReportData.lastReportTime) {
          // let reportDate = Date.parse(this.ebikeReportData.lastReportTime.replace('-', '/'))
          return this.getDateDiff(this.ebikeReportData.lastReportTime)
        } else {
          return null
        }
      }
    },
    methods: {
      stopEvent () {
      },
      voltageChart () {
        if (this.$store.state.enterModel === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage('voltage-chart/' + this.ueSn)
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage('voltage-chart/' + this.ueSn)
          }
        } else {
          if (this.$store.state.token && this.$store.state.firm) {
            this.$router.push({
              name: 'VoltageChart',
              params: {ccuSn: this.ueSn},
              query: {
                token: this.$store.state.token,
                firm: this.$store.state.firm
              }
            })
          } else {
            // 提示需要登录
          }
        }
      },
      mileageChart () {
        if (this.$store.state.enterModel === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage('mileage-chart/' + this.ueSn)
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage('mileage-chart/' + this.ueSn)
          }
        } else {
          if (this.$store.state.token && this.$store.state.firm) {
            this.$router.push({
              name: 'MileageChart',
              params: {ccuSn: this.ueSn},
              query: {
                token: this.$store.state.token,
                firm: this.$store.state.firm
              }
            })
          } else {
            // 提示需要登录
          }
        }
      },
      locationMap () {
        if (this.$store.state.enterModel === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage('location-map/' + this.ueSn)
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage('location-map/' + this.ueSn)
          }
        } else {
          if (this.$store.state.token && this.$store.state.firm) {
            this.$router.push({
              name: 'LocationMap',
              params: {ccuSn: this.ueSn},
              query: {
                token: this.$store.state.token,
                firm: this.$store.state.firm
              }
            })
          } else {
            // 提示需要登录
          }
        }
      },
      findBattery () {
        Indicator.open('寻找电池...')
        this.axios.get('/api-ebike/v3.1/ebikes/' + this.ueSn + '/search').then((res) => {
          console.log(res)
          Indicator.close()
        })
          .catch(error => {
            console.log(error)
            Indicator.close()
          })
      },
      onClickSwitchPower () {
        if (this.days < 0) {
          MessageBox('提示', '您租赁的电池已逾期，请续租后重试！')
        } else {
          if (this.ebikeReportData && this.ebikeReportData.lastReportTime) {
            if (this.getMinuteDifference(this.ebikeReportData.lastReportTime) > 5) {
              MessageBox('提示', '电池不在线，请将电池放在室外有移动信号的地方重试！')
            } else {
              this.handleChange()
            }
          } else {
            MessageBox('提示', '电池不在线，请将电池放在室外有移动信号的地方重试！')
          }
        }
      },
      handleChange () {
        if (this.days >= 0) {
          if (this.modelSwitch) {
            if (this.ueSn.substring(0, 4) === 'P004') {
              Toast('P004开头电池暂不支持电池输出关闭，待系统升级后支持。')
              return
            }
            Indicator.open('电池输出关闭...')
            this.axios.put('/api-ebike/v3.1/ues/update-use-status?ccuSn=' + this.ueSn + '&useStatus=1').then((res) => {
              console.log(res)
              this.expectStatus = false
              this.timeOutTask = setTimeout(() => {
                Indicator.close()
                if (this.expectStatus !== this.modelSwitch) {
                  MessageBox('提示', '关闭失败，请将电池放在室外有移动信号的地方重试！')
                } else {
                  MessageBox('提示', '关闭成功')
                }
              }, 35000)
            })
              .catch(error => {
                console.log(error)
                Indicator.close()
              })
          } else {
            Indicator.open('电池输出开启...')
            this.axios.put('/api-ebike/v3.1/ues/update-use-status?ccuSn=' + this.ueSn + '&useStatus=0').then((res) => {
              console.log(res)
              this.expectStatus = true
              this.timeOutTask = setTimeout(() => {
                Indicator.close()
                if (this.expectStatus !== this.modelSwitch) {
                  MessageBox('提示', '开启失败，请将电池放在室外有移动信号的地方重试！')
                } else {
                  MessageBox('提示', '开启成功')
                }
              }, 35000)
            })
              .catch(error => {
                console.log(error)
                Indicator.close()
              })
          }
        } else {
          Toast('欠费状态不能修改电池输出状态')
        }
      },
      showOrderDetail () {
        if (this.$store.state.enterModel === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage(this.orderId)
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage(this.orderId)
          }
        } else {
          if (this.$store.state.token && this.$store.state.firm) {
            this.$router.push({
              name: 'OrderDetail',
              params: {orderId: this.orderId},
              query: {
                token: this.$store.state.token,
                firm: this.$store.state.firm
              }
            })
          } else {
            // 提示需要登录
          }
        }
      },
      getMinuteDifference: function (dateStr) {
        let dateTimeStamp = Date.parse(dateStr.replace(/-/g, '/'))

        let minute = 1000 * 60
        let now = new Date().getTime()
        let diffValue = now - dateTimeStamp
        if (diffValue < 0) {
          return ''
        }
        return diffValue / minute
      },
      getDateDiff: function (dateStr) {
        let dateTimeStamp = Date.parse(dateStr.replace(/-/g, '/'))

        let minute = 1000 * 60
        let hour = minute * 60
        let day = hour * 24
        // var halfamonth = day * 15
        let month = day * 30
        let now = new Date().getTime()
        let diffValue = now - dateTimeStamp
        if (diffValue < 0) {
          return ''
        }
        let monthC = diffValue / month
        let weekC = diffValue / (7 * day)
        let dayC = diffValue / day
        let hourC = diffValue / hour
        let minC = diffValue / minute
        let result = ''
        if (monthC >= 1) {
          result = '' + parseInt(monthC) + '月前'
        } else if (weekC >= 1) {
          result = '' + parseInt(weekC) + '周前'
        } else if (dayC >= 1) {
          result = '' + parseInt(dayC) + '天前'
        } else if (hourC >= 1) {
          result = '' + parseInt(hourC) + '小时前'
        } else if (minC >= 1) {
          result = '' + parseInt(minC) + '分钟前'
        } else {
          result = '刚刚'
        }
        return result
      }
    }
  }
</script>

<style scoped>
  .p-container {
    background: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.20), 0 6px 20px 0 rgba(0, 0, 0, 0.10);
    border-radius: 4px;
    display:flex;
    display:-webkit-flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 1rem;
  }

  .p-head {
    width: 100%;
    font-size: 1rem;
    color: #212121;
    padding: 1rem;
    display:flex;
    display:-webkit-flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }


  .p-head-1  {
    color: #212121;
    font-size: 1rem;
    flex-grow: 0;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .p-head-2  {
    color: #212121;
    font-size: 0.875rem;
    flex-grow: 1;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    text-align: right;
  }

  .p-content {
    width: 100%;
    flex-grow: 1;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
  }

  .p-title {
    margin-top: 0.5rem;
    color: #212121;
    font-size: 1.5rem;
    flex-grow: 1;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }

  .p-desc {
    margin-top: 0.5rem;
    color: #BDBDBD;
    font-size: 0.75rem;
    flex-grow: 1;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }

  .p-desc1 {
    width: 100%;
    margin: 1rem 1rem 0 1rem;
    padding-right: 2rem;
    color: #757575;
    font-size: 0.875rem;
    flex-grow: 0;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }

  .p-desc2 {
    width: 100%;
    margin: 0.5rem 1rem 0 1rem;
    padding-right: 2rem;
    color: #757575;
    font-size: 0.875rem;
    flex-grow: 0;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
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

</style>
