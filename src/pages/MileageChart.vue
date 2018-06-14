<template>
  <div class="container">
    <ve-histogram class="completed" :data="chartData" :settings="chartSettings" :colors="colors"></ve-histogram>
  </div>
</template>

<script>
  import {Indicator, Toast} from 'mint-ui'
  const EMPTY_DATA = {
    columns: [],
    rows: []
  }
  export default {
    name: 'mileage-chart',
    data () {
      return {
        ccuSn: null,
        loading: false,
        dataEmpty: false,
        colors: ['#3B9AD9'],
        chartSettings: {
          labelMap: {
            'miles': '里程 (km)'
          }
        },
        chartData: {
          columns: [],
          rows: []
        }
      }
    },
    methods: {
      loadData () {
        Indicator.open('加载中...')
        this.axios.get('/api-analyze/v3.1/statistics/day/mileage/' + this.ccuSn).then((res) => {
          Indicator.close()
          console.log(res)
          let data = res.data
          if (data && data.length > 0) {
            data = data.map(function (item) {
              item.miles = Number(item.miles)
              return item
            })
            this.chartData = {
              columns: ['time', 'miles'],
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
      document.title = '里程统计'
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
    margin: 1rem 0 0 0;
  }
</style>
