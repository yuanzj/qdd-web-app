<template>
  <div class="container">
    <div class="completed-box">
      <ve-line class="completed" :data="chartData" :settings="chartSettings" :data-zoom="dataZoom" :colors="colors"></ve-line>
    </div>
    <div class="h-btn-container" style="padding: 1rem">
      <input style="width: 100%;height: 3rem" type="date" v-model="selectedDate"/>
    </div>
  </div>
</template>

<script>
  import {Indicator, Toast} from 'mint-ui'
  import 'echarts/lib/component/dataZoom'
  import {formatDate} from '../components/date.js'
  const EMPTY_DATA = {
    columns: [],
    rows: []
  }
  export default {
    name: 'voltage-chart',
    data () {
      return {
        selectedDate: null,
        ccuSn: null,
        startTime: null,
        endTime: null,
        loading: false,
        dataEmpty: false,
        colors: ['#39CB75'],
        dataZoom: [
          {
            type: 'slider',
            start: 0,
            end: 100
          }
        ],
        chartSettings: {
          min: [48],
          area: true,
          labelMap: {
            'fVoltage': '电压'
          }
        },
        chartData: {
          columns: [],
          rows: []
        }
      }
    },
    watch: {
      selectedDate (curVal, oldVal) {
        if (curVal) {
          this.loadData()
        }
      }
    },
    methods: {
      loadData () {
        this.startTime = this.selectedDate + ' 00:00:00'
        this.endTime = this.selectedDate + ' 23:59:59'
        Indicator.open('加载中...')
        this.axios.get('/api-analyze/v3.1/ebikereports',
          {
            params: {
              ccSn: this.ccuSn,
              startTime: this.startTime,
              endTime: this.endTime
            }
          }
        ).then((res) => {
          Indicator.close()
          let data = res.data
          if (data && data.length > 0) {
            let maxValue = 0
            data = data.map(function (item) {
              item.reportTime = item.reportTime.substring(11, 16)
              if (item.fVoltage > maxValue) {
                maxValue = item.fVoltage
              }
              return item
            })
            this.chartData = {
              columns: ['reportTime', 'fVoltage'],
              rows: data
            }
          } else {
            this.chartData = EMPTY_DATA
          }
        })
          .catch(error => {
            this.chartData = EMPTY_DATA
            Indicator.close()
            if (error.data.error) {
              Toast(error.data.error.msg)
            }
          })
      }
    },
    mounted () {
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
        this.ccuSn = this.$route.params.ccuSn
      }
      document.title = '电量统计'
      this.selectedDate = formatDate(new Date(), 'yyyy-MM-dd')
      this.loadData()
    }
  }
</script>

<style scoped>
  .container {
    height: 100%;
    position: relative;
  }

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
  }

  .h-btn-container {
    width: 100%;
    display: flex;
    position: fixed;
    bottom: 0;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    text-align: center;
  }
</style>
