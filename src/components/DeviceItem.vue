<template>
  <div class="p-container" @click="showOrderDetail">
    <div class="p-head">
      <div class="p-head-1">{{ itemName }}</div>
      <div class="p-head-2" v-if="days >= 0"> {{ days }}天<span class="lm-text-red">{{ protectModel }}</span></div>
      <div class="p-head-2 lm-text-red" v-if="days < 0">逾期 {{ Math.abs(days) }}天</div>
    </div>

    <div class="p-content" v-if="type === 4">
      <div style="text-align: center;flex-grow: 1">
        <span class="p-desc">电池电量</span>
        <div class="p-title" :class="{ 'lm-text-green': isNormal, 'lm-text-orange': isWarning, 'lm-text-red': isError, 'lm-text-hint': isDisable }">{{ soh }}</div>
        <span class="p-desc">%</span>
      </div>
      <div style="text-align: center;flex-grow: 1">
        <span class="p-desc">续航里程</span>
        <div class="p-title" :class="{ 'lm-text-green': isNormal, 'lm-text-orange': isWarning, 'lm-text-red': isError, 'lm-text-hint': isDisable }">{{ mileage }}</div>
        <span class="p-desc">km</span>
      </div>
      <div style="text-align: center;flex-grow: 1">
        <span class="p-desc">电池电压</span>
        <div class="p-title" :class="{ 'lm-text-green': isNormal, 'lm-text-orange': isWarning, 'lm-text-red': isError, 'lm-text-hint': isDisable }">{{ voltage }}</div>
        <span class="p-desc">v</span>
      </div>
    </div>
    <div class="p-desc1" v-if="type === 4">
      {{ address }}
    </div>
    <div class="p-desc2" v-if="type === 4">
      {{ reportTime }}
    </div>
    <div style="height: 1rem" v-if="type === 4"></div>
  </div>
</template>

<script>
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
      }
    },
    data () {
      return {
        isNormal: false,
        isWarning: false,
        isError: false,
        isDisable: false
      }
    },
    computed: {
      protectModel: function () {
        if (this.ebikeReportData) {
          if (this.ebikeReportData.hasOwnProperty('gear')) {
            let gear = this.ebikeReportData.gear
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
            return '请尽快充电'
          } else if (percentage <= 10) {
            return '请充电'
          } else {
            return percentage * Number(this.defaultMileage) / 100.0
          }
        } else {
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
      reportTime: function () {
        if (this.ebikeReportData && this.ebikeReportData.lastReportTime) {
          // let reportDate = Date.parse(this.ebikeReportData.lastReportTime.replace('-', '/'))
          return '更新时间: ' + this.ebikeReportData.lastReportTime
        } else {
          return '未开启服务'
        }
      }
    },
    methods: {
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
      getDateDiff: function (dateTimeStamp) {
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


</style>
