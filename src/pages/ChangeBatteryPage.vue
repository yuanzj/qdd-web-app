<template>
  <div class="container lm-font-default lm-text-text">
    <div class="top-container">
      <img src="../assets/icons8-timer.png" style="width: 32px;height: 32px"/>
      <label class="lm-font-sm lm-text-second" style="margin-left: 1rem">{{ countDownLabel }}</label>
    </div>
    <div class="content-container">
      <mt-spinner type="fading-circle" color="#3B9AD9"></mt-spinner>
      <div style="margin-top: 2rem;font-size: 24px;font-weight: bold;color: black;text-align: center">{{ progressMsg }}</div>
    </div>
  </div>
</template>

<script>
  import {Toast, MessageBox} from 'mint-ui'

  export default {
    name: 'change-battery',
    data () {
      return {
        countDownLabel: '00 : 00',
        progressMsg: '正在处理，请稍候！',
        timer: null,
        cabNum: null,
        batteryUeSn: null
      }
    },
    methods: {
      refreshMainPage () {
        // JS 调用本地方法
        /* eslint-disable no-undef */
        if (window.hasOwnProperty('nativeObj')) {
          nativeObj.reLoadPage('1')
        } else {
          window.webkit.messageHandlers.reLoadPage.postMessage('1')
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
      loadDeviceList () {
        this.axios.get('/api-ebike/v3.0/ue/ue_list',
          {
            params: {
              page: 1,
              limit: 20,
              sidx: 'id',
              order: 'asc'
            }
          }
        ).then((res) => {
          console.log(res)
          this.deviceList = res.data.data5
          if (this.deviceList && this.deviceList.length === 0) {
            MessageBox('提示', '租赁电池后才能进行换电操作！').then(action => {
              // 关闭页面
              console.log('关闭页面')
              this.finish()
            })
          } else {
            for (let item of this.deviceList) {
              if (item.ueSn.) 
            }
            this.batteryUeSn = this.deviceList[0].ueSn
            this.sendCommand()
          }
        })
          .catch(error => {
            console.log(error)
          })
      },
      queryStatus (taskID) {
        let time = 60 * 10
        this.timer = window.setInterval(() => {
          if (time > 1) {
            time -= 1
            let minute = parseInt(time / 60)
            let second = parseInt(time % 60)
            this.countDownLabel = minute + ' : ' + second
            // 查询状态请求
            this.axios.get('api-ebike/v3.1/cabinet-tasks/' + taskID)
              .then((res) => {
                let responseJson = res.data
                if (responseJson.hasOwnProperty('progress')) {
                  // 任务状态（1.待开始 2.处理中 3.成功 4.失败）
                  switch (responseJson.status) {
                    case 1:
                    case 2:
                      break
                    case 3:
                      window.clearInterval(this.timer)
                      Toast('操作成功')
                      this.refreshMainPage()
                      this.finish()
                      break
                    case 4:
                      window.clearInterval(this.timer)
                      Toast('操作失败，请重试')
                      break
                    default:
                      break
                  }
                  if (responseJson.progress !== null) {
                    this.progressMsg = responseJson.progress
                  }
                } else if (responseJson.hasOwnProperty('error')) {
                  Toast(responseJson.error.msg)
                } else {
                  Toast('未知异常')
                }
              })
              .catch(() => {
                console.log('查询异常')
              })
          } else {
            // 清除定时器
            window.clearInterval(this.timer)
          }
        }, 1000)
      },
      sendCommand () {
        this.axios.put('api-ebike/v3.1/cabinets/' + this.cabNum + '/exchange?batteryUeSn=' + this.batteryUeSn).then((res) => {
          let responseJson = res.data
          if (responseJson.hasOwnProperty('id')) {
            this.progressMsg = '正在处理，请稍候！'
            this.queryStatus(responseJson.id)
          } else if (responseJson.hasOwnProperty('error')) {
            MessageBox('提示', responseJson.error.msg)
          } else {
            MessageBox('提示', '未知异常')
          }
        })
          .catch(error => {
            if (error.response.data && error.response.data.error) {
              MessageBox('提示', error.response.data.error.msg).then(action => {
                // 关闭页面
                console.log('关闭页面')
                this.finish()
              })
            }
          })
      }
    },
    mounted () {
      window.productDetail = this
      document.title = '扫码换电'
      if (this.$route.query) {
        this.cabNum = this.$route.query.ccuSn
        this.axios.defaults.headers.common['firm'] = 'ZGJncg=='
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
      }
      this.loadDeviceList()
    },
    destroyed () {
      window.clearInterval(this.timer)
      console.log('destroyed')
    }
  }
</script>

<style scoped>
  .container {
    width: 100vw;
    height: 100vh;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    align-items:center;
    justify-content:center;
  }

  .top-container {
    width: 100%;
    height: 3.5rem;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .content-container {
    padding: 0 1rem 0 1rem;
    flex: 1;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }


</style>
