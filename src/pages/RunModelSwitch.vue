<template>
  <div class="container">
    <div class="completed-box">
      <!--<div class="completed">-->
        <!--<input v-model='ccusn' type="text" class="form-control searchResult"-->
               <!--placeholder="输入序列号" onblur="if(this.placeholder==''){this.placeholder='输入序列号'}"-->
               <!--onfocus="if(this.placeholder=='输入序列号'){this.placeholder=''}" >-->
        <!--<mt-button class="mintui mintui-search" style="margin-left: 8px;width: 40px;height: 40px" @click="searchequipment"></mt-button>-->
      <!--</div>-->

    <div v-if="showTips" class="lm-font-default" style="padding: 1rem; word-break: break-all;word-wrap: break-word;">
     每台电池<span class="lm-text-text lm-font-head">30天内</span>只能进入充电模式<span class="lm-text-text lm-font-head">一次</span>，充电模式只有<span class="lm-text-text lm-font-head">两个小时</span>的持续时间开启后请及时充电。<br><br>
      如需多次进入充电模式请联系雷小电管理员。
    </div>

    </div>

    <div class="h-container">
      <!--<div style="flex: 1">-->
      <!--<mt-button type="default" @click="back" style="width: 100%">上一步</mt-button>-->
      <!--</div>-->
      <!--<div style="width: 1rem"></div>-->
      <div style="flex: 1">
        <mt-button type="primary" @click="scanCode" style="width: 100%">扫码进入租前充电</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {Indicator, Toast, MessageBox} from 'mint-ui'
  export default {
    name: 'run-model-switch',
    components: {
    },
    data () {
      return {
        storeId: null,
        showTips: false,
        ccuSn: ''
      }
    },
    methods: {
      loadStoreInfo () {
        Indicator.open('加载中...')
        this.axios.get('/api-user/v3.1/ebikestores/' + this.storeId).then((res) => {
          Indicator.close()
          let data = res.data
          if (data) {
            if (data.type === 70) {
              this.showTips = false
            } else {
              this.showTips = true
            }
          }
        })
          .catch(error => {
            Indicator.close()
            if (error.data.error) {
              Toast(error.data.error.msg)
            }
          })
      },
      scanCode () {
        // JS 调用本地方法完成扫码
        /* eslint-disable no-undef */
        if (window.hasOwnProperty('nativeObj')) {
          nativeObj.scan()
        } else {
          window.webkit.messageHandlers.scan.postMessage('')
        }
      },
      fillSnFromScan (sn) {
        this.ccuSn = sn.split(' ')[0]
        this.updateRunModel()
      },
      updateRunModel () {
        Indicator.open('提交中...')
        this.axios.put('/api-ebike/v3.1/ues/update-run-model-flag?ccuSn=' + this.ccuSn + '&runModel=1&duration=2').then((res) => {
          console.log(res)
          Indicator.close()
          MessageBox.alert('操作成功', '提示').then(action => {
          })
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
    mounted () {
      window.productDetail = this
      document.title = '租前充电'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        this.storeId = this.$route.query.storeId
      }

      if (this.storeId) {
        this.loadStoreInfo()
      }
    }
  }
</script>
<style scoped>
  .completed-box{
    width: 100%;
    display: flex;
    display: -webkit-flex;
    height: 100vh;
    justify-content:center;
    align-items: center;
  }
  .completed{
    text-align: center;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%);
    position: absolute;
    width: 100%;
    padding-bottom: 5rem;
  }
  .container{
    height: 100%;
    position: relative;
  }
  .searchResult{
    display: inline-block;
    width: 68%;
    height: 40px;
  }
  input{
    /*background:transparent;*/
    font-size: 16px;
    border: 1px solid #ccc;
    padding: 7px 0;
    border-radius: 3px;
    padding-left:16px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s
  }
  input:focus{
    border-color: #66afe9;
    outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)
  }

  .action-btn{
    height: 3rem;
    width: 100%;

  }

  .h-container {
    width: 100%;
    height: 3rem;
    padding: 1rem;
    position: fixed;
    background: none;
    bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 3rem;
  }
</style>
