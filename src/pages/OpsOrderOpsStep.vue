<template>
  <div>
    <VueSteps :items="items" :activeIndex='index' style="margin-top: 1rem" />
    <div  class="lm-font-default">
      <div style="padding: 1rem;background: white;margin-top: 1rem">
        <div class="content-container">
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
        <!--<div style="text-align: right"><mt-button style="width: 100%;margin-top: 1rem" type="default" @click="scanBtnAction">{{ btnTitle }}</mt-button></div>-->
      </div>
    </div>


    <div class="h-container">
      <!--<div style="flex: 1">-->
        <!--<mt-button type="default" @click="back" style="width: 100%">上一步</mt-button>-->
      <!--</div>-->
      <!--<div style="width: 1rem"></div>-->
      <div style="flex: 1">
        <mt-button type="primary" @click="scanBtnAction" style="width: 100%">{{ nextBtnTitle }}</mt-button>
      </div>
    </div>

  </div>
</template>

<script>
  import VueSteps from '@/components/Steps'
  import {Indicator, Toast} from 'mint-ui'

  export default {
    name: 'ops-order-ops-step',
    components: {
      VueSteps
    },
    data () {
      return {
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
        index: 0
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
        if (window.hasOwnProperty('nativeObj')) {
          nativeObj.scanForVoucher()
        } else {
          window.webkit.messageHandlers.scanForVoucher.postMessage('')
        }
      },
      scanNewSn () {
        this.scanModel = 2
        // JS 调用本地方法完成扫码
        /* eslint-disable no-undef */
        if (window.hasOwnProperty('nativeObj')) {
          nativeObj.scan()
        } else {
          window.webkit.messageHandlers.scan.postMessage('')
        }
      },
      fillSnFromScan (sn) {
        switch (this.scanModel) {
          case 0:
            this.ccuSn = sn.split(' ')[0]
            break
          case 1:
            this.code = sn
            break
          case 2:
            this.newSn = sn.split(' ')[0]
            break
          default:
            break
        }
        this.btnAction()
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
          // 退租
          Indicator.open('提交中...')
          this.axios({
            method: 'put',
            url: '/api-order/v3.1/rent-orders/finish-use-voucher?ccuSn=' + this.ccuSn,
            data: this.code,
            headers: {'Content-Type': 'text/plain'}
          }).then((res) => {
            Indicator.close()
            Toast('退租成功')
            this.back()
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
            Toast('售后成功')
            this.back()
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
      }
    },
    mounted () {
      window.productDetail = this
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
        }
      }
    }
  }
</script>

<style scoped>

  .h-container {
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
</style>
