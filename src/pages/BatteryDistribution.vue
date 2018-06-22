<template>
  <div class="container">
    <div v-if="showDealerFlag" class="h-btn-container"><mt-button type="default" class="action-btn" @click="dealerSelect">{{dealerTitle}}</mt-button></div>

    <div class="h-btn-container"><mt-button type="default" class="action-btn" @click="storeSelect">{{storeTitle}}</mt-button></div>

    <div class="lm-text-text lm-font-second" style="margin-top: 2rem;text-align: center">{{ ccuSn }}</div>

    <div class="lm-text-text lm-font-second" style="margin-top: 2rem;text-align: center">{{ result }}</div>

    <div class="h-container">
      <!--<div style="flex: 1">-->
      <!--<mt-button type="default" @click="back" style="width: 100%">上一步</mt-button>-->
      <!--</div>-->
      <!--<div style="width: 1rem"></div>-->
      <div style="flex: 1">
        <mt-button type="primary" @click="scanCode" style="width: 100%">扫码分配</mt-button>
      </div>
    </div>


    <mt-popup
      v-model="popupVisible"
      position="bottom" style="width: 100%">
      <mt-picker style="width: 100%;" value-key="name" :slots="slots" @change="onValuesChange"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
  import {Indicator, Toast, MessageBox} from 'mint-ui'
  export default {
    name: 'battery-distribution',
    data () {
      return {
        slots: [
          {
            flex: 1,
            values: [],
            textAlign: 'center'
          }
        ],
        selectModel: 0,
        popupVisible: false,
        dealerTitle: '请选择经销商',
        storeTitle: '请选择门店',
        ccuSn: '',
        dealerId: null,
        storeId: -1,
        ueID: null,
        result: null,
        showDealerFlag: true
      }
    },
    methods: {
      onValuesChange (picker, values) {
        console.log(values)
        if (values[0] !== undefined) {
          if (this.selectModel === 0) {
            this.dealerId = values[0].id
            this.dealerTitle = values[0].name
            this.storeId = null
            this.storeTitle = '请选择门店'
          } else {
            this.storeId = values[0].id
            this.storeTitle = values[0].name
          }
        }
      },
      dealerSelect () {
        this.popupVisible = true
        this.selectModel = 0
        this.loadStores(1, null)
      },
      storeSelect () {
        this.popupVisible = true
        this.selectModel = 1
        if (this.dealerId) {
          this.loadStores(2, this.dealerId)
        }
      },
      scanCode () {
        if (this.storeId === -1) {
          MessageBox.alert('请选择门店后重试！', '提示').then(action => {
          })
          return
        }
        // JS 调用本地方法完成扫码
        /* eslint-disable no-undef */
        if (window.hasOwnProperty('nativeObj')) {
          nativeObj.scanForVoucher()
        } else {
          window.webkit.messageHandlers.scanForVoucher.postMessage('')
        }
      },
      fillSnFromScan (sn) {
        this.ccuSn = sn.split(' ')[0]
        this.result = ''
        Indicator.open('检查设备信息...')
        this.axios.get('/api-ebike/v3.1/ues/' + this.ccuSn).then((res) => {
          Indicator.close()
          let ue = res.data
          if (ue) {
            let _storeId = (this.storeId ? this.storeId : this.dealerId)
            this.ueID = ue.id
            if (_storeId && this.ueID) {
              if (_storeId === ue.storeId) {
                this.result = '该设备号已归属当前选择的站点'
                MessageBox.alert('该设备号已归属当前选择的站点', '提示').then(action => {
                })
                return
              }
              this.submit()
            } else {
              this.result = '非法的设备序列号'
              MessageBox.alert(this.result, '失败').then(action => {
              })
            }
          } else {
            this.result = '非法的设备序列号'
            MessageBox.alert(this.result, '失败').then(action => {
            })
          }
        })
          .catch(error => {
            Indicator.close()
            console.log(error)
            if (error.response.data && error.response.data.error) {
              this.result = error.response.data.error.msg
              MessageBox.alert(error.response.data.error.msg, '失败').then(action => {
              })
            }
          })
      },
      submit () {
        if (this.storeId === -1) {
          MessageBox.alert('请选择门店后重试！', '提示').then(action => {
          })
          return
        }
        Indicator.open('提交中...')
        this.axios.put('/api-ebike/v3.1/ues/update_storeId?storeId=' + (this.storeId === 0 ? this.dealerId : this.storeId) + '&ueId=' + this.ueID + '&checkPermission=true').then((res) => {
          Indicator.close()
          Toast('分配成功')
          this.result = '分配成功'
        })
          .catch(error => {
            Indicator.close()
            console.log(error)
            if (error.response.data && error.response.data.error) {
              this.result = error.response.data.error.msg
              MessageBox.alert(error.response.data.error.msg, '分配失败').then(action => {
              })
            }
          })
      },
      loadStores (category, parentId) {
        // http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?category=1&sort=code,asc&limit=100&page=1&_=1524916233075
        this.axios.get('/api-user/v3.1/ebikestores/list-4-manager',
          {
            params: {
              category: category,
              sort: 'code,asc',
              parentId: parentId,
              page: 1,
              limit: 1000
            }
          }
        ).then((res) => {
          console.log(res)
          if (res.data) {
            this.slots[0].values = res.data.list
            if (this.slots[0].values.length > 0) {
              this.slots[0].values.push({id: 0, name: '无'})
            } else {
              this.slots[0].values = []
              this.slots[0].values.push({id: 0, name: '无'})
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
      document.title = '分配'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
        this.dealerId = this.$route.query.storeId
        if (this.dealerId) {
          this.showDealerFlag = false
        }
      }
    }
  }
</script>

<style scoped>
  .container{
    height: 100vh;
    width: 100vw;
  }

  .h-btn-container {
    height: 3rem;
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
  }

  .action-btn{
    height: 3rem;
    width: 100%;

  }

  .h-container {
    width: 100%;
    background: none;
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
