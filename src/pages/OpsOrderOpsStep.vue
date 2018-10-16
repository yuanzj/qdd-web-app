<template>
  <div>
    <VueSteps :items="items" :activeIndex='index' style="margin-top: 1rem" />

    <div v-if="showFeePanel" style="background: white">
      <div style="font-size: 1rem;padding: 1rem;color: #E64E42">请检查充电器和转接线后再扫描用户出示退租二维码,如发生丢失和损坏请勾选下面对应列表项进行扣费处理。</div>
      <mt-checklist
        v-model="optionsValue"
        :options="options">
      </mt-checklist>
    </div>

    <div v-if="showCodePanel"  class="lm-font-default" style="padding: 1rem;background: white;margin-top: 1rem">
      <div  v-if="showSn" class="content-container">
        <div class="lm-text-second">{{title1}}</div>
        <div >{{ ccuSn }}</div>
      </div>
      <div v-if="showNewSn" class="content-container">
        <div class="lm-text-second">{{title2}}</div>
        <div >{{ newSn }}</div>
      </div>
      <div  v-if="showCode" class="content-container">
        <div class="lm-text-second" >{{title3}}</div>
        <div style="width: 220px;word-wrap:break-word">{{ code }}</div>
      </div>
    </div>

    <div v-if="showCheckListPanel">
      <mt-checklist
        v-model="checkOptionsValue"
        :options="checkOptions">
      </mt-checklist>
    </div>

    <div v-if="showBatteryPanel" class="lm-font-default lm-text-text" style="margin-top: 1rem">

      <div class="h-container">
        <div class="lm-text-second" >电池编号</div>
        <div>{{ ccuSn }}</div>
      </div>
      <div class="h-container">
        <div class="lm-text-second">电池规格</div>
        <div>{{ battery.guige }}</div>
      </div>
      <div class="h-container">
        <div class="lm-text-second">电池输出</div>
        <div>{{ battery.gearzt[battery.gear] }}</div>
      </div>
      <div class="h-container">
        <div class="lm-text-second">电池状态</div>
        <div>{{ battery.status === 3 ? '移动' : '静止' }}</div>
      </div>
      <div class="h-container">
        <div class="lm-text-second">电池电压</div>
        <div>{{ battery.voltageString }} v</div>
      </div>
      <div class="h-container">
        <div class="lm-text-second">电池电量</div>
        <div>{{ battery.bmsSoc }} %</div>
      </div>
      <div class="h-container">
        <div class="lm-text-second">总里程</div>
        <div>{{ battery.odo }} km</div>
      </div>
      <div class="h-container">
        <div class="lm-text-second">今日里程</div>
        <div>{{ battery.dayOdo }} km</div>
      </div>
      <div class="h-container">
        <div class="lm-text-second">更新时间</div>
        <div>{{ battery.reportTime }} </div>
      </div>

      <div class="h-container">
        <div class="lm-text-second">用户姓名</div>
        <div>{{ battery.xingming }}</div>
      </div>
      <div class="h-container">
        <div class="lm-text-second">联系方式</div>
        <div>{{ battery.phoneNumber }}</div>
      </div>

      <div class="h-container">
        <div class="lm-text-second">租期</div>
        <div>{{ battery.usedDays }}</div>
      </div>
      <div class="h-container">
        <div class="lm-text-second">有效期</div>
        <div >{{ battery.surplusTime  }}</div>
      </div>

      <div style="height: 6rem"></div>

    </div>

    <div class="h-container-bottom">
      <div style="flex: 1">
        <mt-button type="primary" @click="scanBtnAction" style="width: 100%">{{ nextBtnTitle }}</mt-button>
      </div>
    </div>

  </div>
</template>

<script>
  import VueSteps from '@/components/Steps'
  import {MessageBox, Indicator, Toast} from 'mint-ui'

  export default {
    name: 'ops-order-ops-step',
    components: {
      VueSteps
    },
    data () {
      return {
        showFeePanel: false,
        showCodePanel: false,
        showBatteryPanel: false,
        showCheckListPanel: false,
        showSn: false,
        showNewSn: false,
        showCode: false,
        title1: '电池SN号',
        title2: '新电池SN号',
        title3: '授权码',
        nextBtnTitle: '扫描电池二维码',
        enterModel: -1,
        scanModel: -1,
        ccuSn: null,
        newSn: null,
        code: '',
        myQrcode: null,
        items: [
          {
            num: '1',
            text: '电池二维码'
          },
          {
            num: '2',
            text: '售后电池二维码'
          },
          {
            num: '3',
            text: '用户出示二维码'
          }
        ],
        index: 0,
        battery: {
          ccuSn: null,
          voltageString: null,
          gear: null,
          gearzt: {
            '17': '关闭',
            '34': '开启'
          },
          guige: null,
          storeName: null,
          usedDays: '',
          surplusTime: null,
          xingming: '',
          phoneNumber: '',
          owner: null,
          status: null,
          bmsSoc: null,
          odo: null,
          dayOdo: null,
          reportTime: null,
          address: ''
        },
        optionsValue: [],
        options: [
          {
            label: '充电器(扣除200元)',
            value: '200'
          },
          {
            label: '转接线(扣除20元)',
            value: '20'
          }
        ],
        checkOptionsValue: [],
        checkOptions: [
          {
            label: '离线',
            value: '离线'
          },
          {
            label: '无法充电/骑行',
            value: '无法充电/骑行'
          },
          {
            label: '骑行时常断电',
            value: '骑行时常断电'
          },
          {
            label: '里程严重不足',
            value: '里程严重不足'
          },
          {
            label: '外观损坏',
            value: '外观损坏'
          },
          {
            label: '其他（包含未知故障、充电服务等）',
            value: '其他（包含未知故障、充电服务等）'
          }
        ]
      }
    },
    watch: {
      index (curVal, oldVal) {
        if (this.enterModel === 0) {
          // 退租
          switch (curVal) {
            case 0:
              this.showCode = false
              this.nextBtnTitle = '扫描电池二维码'
              break
            case 1:
              this.showCode = true
              this.nextBtnTitle = '扫描用户出示二维码'
              break
            case 2:
              break
            default:
              break
          }
        } else if (this.enterModel === 1) {
          this.showCheckListPanel = true
          // 换电池
          switch (curVal) {
            case 0:
              this.showNewSn = false
              this.showCode = false
              this.nextBtnTitle = '扫描旧电池二维码'
              break
            case 1:
              this.showNewSn = true
              this.showCode = false
              this.nextBtnTitle = '扫描新电池二维码'
              break
            case 2:
              this.showNewSn = true
              this.showCode = true
              this.nextBtnTitle = '扫描用户出示二维码'
              break
            default:
              break
          }
        }
        console.log(curVal, oldVal)
      }
    },
    methods: {
      searchEquipment () {
        Indicator.open('查询中...')
        this.axios.get('/api-ebike/v3.1/ebikes/list?filterType=1&sort=ue.end_time,asc&ccuSn=' + this.ccuSn,
          {
            params: {
              page: 1,
              limit: 999
            }
          }
        ).then((res) => {
          Indicator.close()
          console.log(res)
          if (res.data && res.data.list.length > 0) {
            this.battery.reportTime = res.data.list[0].reportTime
            this.battery.voltageString = res.data.list[0].voltageString
            this.battery.storeName = res.data.list[0].storeName
            this.battery.usedDays = res.data.list[0].usedDays
            this.battery.surplusTime = res.data.list[0].surplusTime
            this.battery.owner = res.data.list[0].owner
            this.battery.bmsSoc = res.data.list[0].bmsSoc
            this.battery.odo = res.data.list[0].odo
            this.battery.dayOdo = res.data.list[0].dayOdo
            this.battery.guige = res.data.list[0].productEntity.name
            this.battery.gear = res.data.list[0].gear
            this.battery.status = res.data.list[0].status
            if (this.battery.usedDays === null) {
              this.battery.usedDays = ''
            } else {
              this.battery.usedDays = this.battery.usedDays + '天'
            }
            if (this.battery.owner === null) {
              this.battery.xingming = ''
              this.battery.phoneNumber = ''
            } else {
              this.battery.xingming = this.battery.owner.realname
              this.battery.phoneNumber = this.battery.owner.phoneNumber
            }
            this.showFeePanel = true
            this.showCodePanel = true
            this.showBatteryPanel = true
            this.btnAction()
          } else {
            Toast('已租赁电池中不存在该序列号！')
          }
        })
          .catch(error => {
            Indicator.close()
            console.log(error)
            if (error.response.data && error.response.data.error) {
              Toast(error.response.data.error.msg)
            }
          })
      },
      scanBtnAction () {
        if (this.enterModel === 0) {
          // 退租
          switch (this.index) {
            case 0:
              this.scanOldSn()
              break
            case 1:
              this.scanCode()
              break
            case 2:
              break
            default:
              break
          }
        } else if (this.enterModel === 1) {
          if (this.checkOptionsValue.length < 1) {
            Toast('请至少选择一项换电原因')
            return
          }
          // 换电池
          switch (this.index) {
            case 0:
              this.scanOldSn()
              break
            case 1:
              this.scanNewSn()
              break
            case 2:
              this.scanCode()
              break
            default:
              break
          }
        }
      },
      btnAction () {
        if (this.enterModel === 0) {
          // 退租
          switch (this.index) {
            case 0:
              if (!this.ccuSn) {
                Toast('请扫描电池二维码')
                return
              }
              this.index = 1
              break
            case 1:
              if (!this.code) {
                Toast('请扫描用户出示的二维码')
                return
              }
              this.submit()
              break
            case 2:
              break
            default:
              break
          }
        } else if (this.enterModel === 1) {
          // 换电池
          switch (this.index) {
            case 0:
              if (!this.ccuSn) {
                Toast('请扫描电池二维码')
                return
              }
              this.index = 1
              break
            case 1:
              if (!this.newSn) {
                Toast('请扫描新电池二维码')
                return
              }
              this.index = 2
              break
            case 2:
              if (!this.code) {
                Toast('请扫描用户出示的二维码')
                return
              }
              this.submit()
              break
            default:
              break
          }
        }
      },
      scanOldSn () {
        this.scanModel = 0
        // JS 调用本地方法完成扫码
        /* eslint-disable no-undef */
        if (window.hasOwnProperty('nativeObj')) {
          nativeObj.scan()
        } else {
          window.webkit.messageHandlers.scan.postMessage('')
        }
      },
      scanCode () {
        this.scanModel = 1
        // JS 调用本地方法完成扫码
        /* eslint-disable no-undef */
        if (window.originalPostMessage) {
          window.postMessage('scan')
        } else if (window.hasOwnProperty('nativeObj')) {
          nativeObj.scanForVoucher()
        } else {
          window.webkit.messageHandlers.scanForVoucher.postMessage('')
        }
      },
      scanNewSn () {
        this.scanModel = 2
        // JS 调用本地方法完成扫码
        /* eslint-disable no-undef */
        if (window.originalPostMessage) {
          window.postMessage('scan')
        } else if (window.hasOwnProperty('nativeObj')) {
          nativeObj.scan()
        } else {
          window.webkit.messageHandlers.scan.postMessage('')
        }
      },
      fillSnFromScan (sn) {
        switch (this.scanModel) {
          case 0:
            this.ccuSn = sn.split(' ')[0]
            if (this.enterModel === 0) {
              this.searchEquipment()
            } else {
              this.btnAction()
            }
            break
          case 1:
            this.code = sn
            this.btnAction()
            break
          case 2:
            this.newSn = sn.split(' ')[0]
            this.btnAction()
            break
          default:
            break
        }
      },
      finish () {
        // JS 调用本地方法
        /* eslint-disable no-undef */
        if (window.hasOwnProperty('nativeObj')) {
          nativeObj.closeCurrentPage()
        } else {
          window.webkit.messageHandlers.closeCurrentPage.postMessage('')
        }
      },
      submit () {
        if (this.enterModel === 0) {
          if (!this.ccuSn) {
            Toast('请扫描电池二维码')
            return
          }
          if (!this.code) {
            Toast('请扫描用户出示的二维码')
            return
          }
          let feeSum = 0
          let feeDescription = ''
          if (this.optionsValue.length > 0) {
            feeSum = Number(this.optionsValue.reduce(function (x, y) {
              return Number(x) + Number(y)
            }))
            if (feeSum === 20) {
              feeDescription = '扣除转接线20元'
            } else if (feeSum === 200) {
              feeDescription = '扣除充电器200元'
            } else if (feeSum === 220) {
              feeDescription = '扣除充电器加转接线合计220元'
            }
            console.log('feeSum:' + feeSum + (feeSum === 200))
            console.log('feeDescription:' + feeDescription)
          }
          // 退租
          Indicator.open('提交中...')
          this.axios({
            method: 'put',
            url: '/api-order/v3.1/rent-orders/finish-use-voucher?ccuSn=' + this.ccuSn + (feeSum > 0 ? ('&deductFee=' + feeSum + '&deductFeeReason=' + feeDescription) : ''),
            data: this.code,
            headers: {'Content-Type': 'text/plain'}
          }).then((res) => {
            Indicator.close()
            MessageBox.alert('退租成功').then(action => {
              this.finish()
            })
          })
            .catch(error => {
              Indicator.close()
              console.log(error)
              if (error.response.data && error.response.data.error) {
                Toast(error.response.data.error.msg)
              }
            })
        } else if (this.enterModel === 1) {
          // 换电池
          if (!this.ccuSn) {
            Toast('请扫描旧电池二维码')
            return
          }
          if (!this.code) {
            Toast('请扫描用户出示的二维码')
            return
          }
          if (!this.newSn) {
            Toast('请扫描新电池二维码')
            return
          }
          Indicator.open('提交中...')
          this.axios({
            method: 'put',
            url: '/api-order/v3.1/rent-orders/replace-use-voucher?oldSn=' + this.ccuSn + '&newSn=' + this.newSn,
            data: this.code,
            headers: {'Content-Type': 'text/plain'}
          }).then((res) => {
            Indicator.close()
            MessageBox.alert('售后成功').then(action => {
              this.finish()
            })
          })
            .catch(error => {
              Indicator.close()
              console.log(error)
              if (error.response.data && error.response.data.error) {
                Toast(error.response.data.error.msg)
              }
            })
          this.axios({
            method: 'put',
            url: '/api-ebike/v3.1/ues/update-after-sale-flag?ccuSn=P0031R45W8&afterSaleFlag=1&afterSaleReason=cccc',
            headers: {'Content-Type': 'text/plain'}
          })
            .catch(error => {
              Indicator.close()
              console.log(error)
              if (error.response.data && error.response.data.error) {
                Toast(error.response.data.error.msg)
              }
            })
        }
      },
      back () {
        this.$router.back(-1)
      },
      handleMessage (event) {
        this.fillSnFromScan(event.data)
      }
    },
    mounted () {
      window.productDetail = this
      document.addEventListener('message', this.handleMessage)
      if (this.$route.query) {
        this.enterModel = Number(this.$route.query.model)
        this.ccuSn = this.$route.query.ccuSn
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
        if (this.enterModel === 0) {
          // 退租
          document.title = '电池退租'
          this.title1 = '电池SN号'
          this.items = [
            {
              num: '1',
              text: '电池二维码'
            },
            {
              num: '2',
              text: '用户出示二维码'
            }
          ]
          this.nextBtnTitle = '扫描电池二维码'
        } else if (this.enterModel === 1) {
          this.showCheckListPanel = true
          // 换电池
          document.title = '电池售后'
          this.title1 = '旧电池SN号'
          this.items = [
            {
              num: '1',
              text: '旧电池二维码'
            },
            {
              num: '2',
              text: '新电池二维码'
            },
            {
              num: '3',
              text: '用户出示二维码'
            }
          ]
          this.nextBtnTitle = '扫描旧电池二维码'
          this.showSn = true
          this.showCodePanel = true
        }
      }
    }
  }
</script>

<style scoped>

  .h-container-bottom {
    width: 100%;
    height: 3rem;
    padding: 1rem;
    position: fixed;
    bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 3rem;
  }
  .content-container {
    background-color: #ffffff;

    padding-bottom: 1rem;
    display: flex;
    align-items: start;
    justify-content: space-between;
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
