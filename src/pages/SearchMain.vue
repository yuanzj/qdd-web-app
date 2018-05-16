<template>
  <div class="container">
    <div class="completed-box">
      <div class="completed">
        <input v-model='ccusn' type="text" class="form-control searchResult"
               placeholder="输入序列号" onblur="if(this.placeholder==''){this.placeholder='输入序列号'}"
               onfocus="if(this.placeholder=='输入序列号'){this.placeholder=''}" >
        <mt-button class="mintui mintui-search" style="margin-left: 8px;width: 40px;height: 40px" @click="searchequipment"></mt-button>
      </div>

    </div>

    <div class="h-container">
      <!--<div style="flex: 1">-->
      <!--<mt-button type="default" @click="back" style="width: 100%">上一步</mt-button>-->
      <!--</div>-->
      <!--<div style="width: 1rem"></div>-->
      <div style="flex: 1">
        <mt-button type="primary" @click="scanCode" style="width: 100%">扫码查询</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {Toast} from 'mint-ui'
  export default {
    name: 'search-main',
    components: {
    },
    data () {
      return {
        ccusn: ''
      }
    },
    watch: {
      selected (val, oldval) {
        this.loadProductList()
        this.loadBottom()
        this.options = []
        this.loadoPtions()
      }
    },
    methods: {
      scanCode () {
        // JS 调用本地方法完成扫码
        /* eslint-disable no-undef */
        if (window.hasOwnProperty('nativeObj')) {
          nativeObj.scanForVoucher()
        } else {
          window.webkit.messageHandlers.scanForVoucher.postMessage('')
        }
      },
      fillSnFromScan (sn) {
        this.ccusn = sn.split(' ')[0]
        this.searchequipment()
      },
      searchequipment () {
        this.axios.get('/api-ebike/v3.1/ebikes/list?sort=ue.status,desc&adminFlag=ss&type=4&storeTypes=0,40&sort=ue.end_time,asc&ccuSn=' + this.ccusn,
          {
            params: {
              page: 1,
              limit: 999
            }
          }
        ).then((res) => {
          console.log(res)
          console.log(res.data.list)
          if (res.data && res.data.list.length > 0) {
            this.$router.push({
              name: 'EquipmentDetail',
              params: {ccusn: res.data.list[0].ccuSn},
              query: {reportTime: res.data.list[0].reportTime,
                voltageString: res.data.list[0].voltageString,
                storeName: res.data.list[0].storeName,
                usedDays: res.data.list[0].usedDays,
                surplusTime: res.data.list[0].surplusTime,
                owner: res.data.list[0].owner,
                bmsSoc: res.data.list[0].bmsSoc,
                odo: res.data.list[0].odo,
                dayOdo: res.data.list[0].dayOdo,
                guige: res.data.list[0].productEntity.name,
                gear: res.data.list[0].gear,
                status: res.data.list[0].status,
                lon: res.data.list[0].lon,
                lat: res.data.list[0].lat
              }
            })
          } else {
            Toast('设备号不存在！')
          }
        })
          .catch(error => {
            console.log(error)
            if (error.response.data && error.response.data.error) {
              Toast(error.response.data.error.msg)
            }
          })
      }
    },
    mounted () {
      window.productDetail = this
      document.title = '查询'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
      }
    }
  }
</script>
<style scoped>
  .completed-box{
    width: 100%;
    position: relative;
    height: 100vh;
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
    bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 3rem;
  }
</style>
