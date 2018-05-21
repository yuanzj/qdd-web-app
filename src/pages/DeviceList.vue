<template>
  <div>

    <div  v-if="isShowHint" class="container">
      <div style="text-align: center">
        <img src="../assets/icons8_car_battery.png" style="width: 3.5rem;height: 3.5rem;"/>
        <div class="lm-text-text lm-font-default" style="margin-top: 1rem">您尚未添加电池</div>
        <div class="lm-text-second lm-font-second" style="margin-top: 0.5rem">请点击"扫码租赁"按钮添加电池</div>
      </div>
    </div>
    <mt-loadmore :top-method="loadDeviceList" ref="loadmore" :style="{ 'min-height': wrapperHeight + 'px' }">
      <div v-for="(item,index)  in deviceList" >

        <device-item  :key="item.orderId" :type="item.type" :orderId="item.orderId" :ueSn="item.ueSn" :ebikeReportData="item.ebikeReportData" :address="item.address" :productName="item.productName" :days="item.days" :defaultMileage="item.rentOrderEntity.productEntity
  .remark"></device-item>

      </div>
      <div style="height: 3.5rem"></div>
    </mt-loadmore>

  </div>
</template>

<script>
  import DeviceItem from '@/components/DeviceItem'

  export default {
    name: 'device-list',
    components: {
      DeviceItem
    },
    data () {
      return {
        IntervalId: null,
        wrapperHeight: 0,
        deviceList: [],
        isShowHint: false
      }
    },
    methods: {
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
          this.$refs.loadmore.onTopLoaded()
          console.log(res)
          this.deviceList = res.data.data5
          if (this.deviceList && this.deviceList.length === 0) {
            this.isShowHint = true
          } else {
            this.isShowHint = false
          }
          // auto refresh
          if (this.IntervalId) {
            window.clearInterval(this.IntervalId)
          }
          this.IntervalId = window.setInterval(this.loadDeviceList, 15 * 1000)
        })
          .catch(error => {
            this.$refs.loadmore.onTopLoaded()
            this.deviceList = []
            this.isShowHint = true
            console.log(error)
          })
      }
    },
    mounted () {
      this.wrapperHeight = document.documentElement.clientHeight
      document.title = '设备列表'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.$store.commit('setEnterModel', this.$route.query.model)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
          this.loadDeviceList()
        } else {
          this.deviceList = []
          this.isShowHint = true
        }
      }
    },
    destroyed () {
      window.clearInterval(this.IntervalId)
      console.log('destroyed')
    }
  }
</script>

<style scoped>
  .container{
    height: 100vh;
    width: 100%;
    top: 0;
    position: fixed;
    display: -webkit-flex;
    display:         flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
  }

</style>
