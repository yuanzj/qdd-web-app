<template>
  <div class="container" >
    <div style="width: 100%;flex: 1" id="allmap" ref="allmap"></div>
    <div class="h-btn-container">
      <div class="p-head">
        <div class="p-head-1 lm-text-second">上报时间</div>
        <div class="p-head-2 lm-text-text">{{ reportTime }}</div>
      </div>
      <div style="padding:0 1rem 1rem 1rem" class="lm-font-second lm-text">
        {{ address }}
      </div>
    </div>
  </div>
</template>

<script>
  import {Indicator} from 'mint-ui'
  export default {
    name: 'location-map',
    data () {
      return {
        IntervalId: null,
        ccuSn: null,
        curMap: null,
        reportTime: null,
        address: null
      }
    },
    methods: {
      translateCallback (data) {
        console.log('=============>' + data)
        if (data.status === 0) {
          /* eslint-disable no-undef */
          this.curMap.clearOverlays()
          let myIcon = new BMap.Icon('../static/images/map_pins.png', new BMap.Size(50, 50))
          let marker = new BMap.Marker(data.points[0], {icon: myIcon})
          this.curMap.addOverlay(marker)
          this.curMap.setCenter(data.points[0])
          let geoc = new BMap.Geocoder()
          geoc.getLocation(data.points[0], (rs) => {
            let addComp = rs.addressComponents
            this.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
          })
        }
      },
      loadEbikeDetail () {
        Indicator.open('加载中...')
        this.axios.get('/api-ebike/v3.0/app/get_car_info?ueSn=' + this.ccuSn).then((res) => {
          Indicator.close()
          console.log(res)
          let data = res.data.data
          if (data) {
            console.log(data)
            this.reportTime = this.getDateDiff(data.lastReportTime)
            /* eslint-disable no-undef */
            let ggPoint = new BMap.Point(Number(data.lon), Number(data.lat))
            let map = new BMap.Map(this.$refs.allmap)
            map.centerAndZoom(ggPoint, 16)
            map.enableScrollWheelZoom(true)
            this.curMap = map
            let convertor = new BMap.Convertor()
            let pointArr = []
            pointArr.push(ggPoint)
            convertor.translate(pointArr, 1, 5, this.translateCallback)

            // auto refresh
            if (this.IntervalId) {
              window.clearInterval(this.IntervalId)
            }
            this.IntervalId = window.setInterval(this.loadEbikeDetail, 15 * 1000)
          }
        })
          .catch(error => {
            Indicator.close()
            console.log(error)
          })
      },
      loadBMapScript () {
        let script = document.createElement('script')
        script.src = 'http://api.map.baidu.com/api?v=2.0&ak=upXkuuhfOOuQkOlW7yxP0cVHRKIseXmc&callback=bMapInit'
        document.body.appendChild(script)
      },
      getDateDiff: function (dateStr) {
        let dateTimeStamp = Date.parse(dateStr.replace(/-/g, '/'))

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
    },
    mounted () {
      this.loadBMapScript()
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
        this.ccuSn = this.$route.params.ccuSn
      }
      document.title = '位置详情'
      window['bMapInit'] = () => {
        this.loadEbikeDetail()
      }
    },
    destroyed () {
      window.clearInterval(this.IntervalId)
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
    font-size: 0.875rem;
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

  .container-1{
    width: 100%;
    height: 90px;
    background-color: #fff;
  }

  .h-btn-container {
    width: 100%;
    height: 90px;
    position: fixed;
    box-shadow: 0 -1px 15px #888888;
    background-color: #fff;
    bottom: 0;
  }

</style>
