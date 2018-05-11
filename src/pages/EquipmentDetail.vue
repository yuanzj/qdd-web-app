<template>
  <div class="container details">

    <div>

      <div>
        序列号：{{ ccuSn }}
      </div>
      <div>
        规格：{{ guige }}
      </div>
      <div>
        网点：{{ storeName }}
      </div>
      <div>
        租期：{{ usedDays }}
      </div>
      <div>
        有效期：{{ surplusTime }}
      </div>
      <div>
        用户姓名：{{ xingming }}
      </div>
      <div>
        联系方式：{{ phoneNumber }}
      </div>
      <div>
        禁用状态：{{gearzt[gear]}}
      </div>
      <div v-if="status===3">
        状态：移动
      </div>
      <div v-else>
        状态：静止
      </div>
      <div>
        电压：{{ voltageString }}V
      </div>
      <div>
        电量：{{ bmsSoc }}%
      </div>
      <div>
        里程：{{ odo }}km
      </div>
      <div>
        今日里程：{{ dayOdo }}km
      </div>
      <div>
        更新时间：{{ reportTime }}
      </div>
      <div id="dizhi">
      </div>






    </div>


  </div>
</template>

<script>
  export default {
    name: 'equipments',
    data () {
      return {
        ccuSn: this.$route.params.ccusn,
        voltageString: this.$route.query.voltageString,
        gear: this.$route.query.gear,
        gearzt: {
          '17': '禁用',
          '34': '启用'
        },
        guige: this.$route.query.reportTime,
        storeName: this.$route.query.storeName,
        usedDays: '',
        surplusTime: this.$route.query.surplusTime,
        xingming: '',
        phoneNumber: '',
        owner: this.$route.query.owner,
        status: this.$route.query.status,
        bmsSoc: this.$route.query.bmsSoc,
        odo: this.$route.query.odo,
        dayOdo: this.$route.query.dayOdo,
        reportTime: this.$route.query.reportTime,
        address: '',
        x: this.$route.query.lon,
        y: this.$route.query.lat
      }
    },
    computed: {
    },
    methods: {
      loadEquipmentDetail () {
        if (this.$route.query.usedDays === null) {
          this.usedDays = ''
        } else {
          this.usedDays = this.$route.query.usedDays + '天'
        }
        if (this.owner === null) {
          this.xingming = ''
          this.phoneNumber = ''
        } else {
          this.xingming = this.owner.realname
          this.phoneNumber = this.owner.phoneNumber
        }
        var x = this.x
        var y = this.y
        /* eslint-disable no-undef */
        var ggPoint = new BMap.Point(x, y)
        var convertor = new BMap.Convertor()
        var geoc = new BMap.Geocoder()
        var translateCallback = function (data) {
          if (data.status === 0) {
            geoc.getLocation(data.points[0], function (rs) {
              var addComp = rs.addressComponents
              var addre = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
              document.getElementById('dizhi').innerHTML = '地址：' + addre
            })
          }
        }
        var pointArr = []
        pointArr.push(ggPoint)
        convertor.translate(pointArr, 1, 5, translateCallback)
      },
      loadBMapScript () {
        let script = document.createElement('script')
        script.src = 'http://api.map.baidu.com/api?v=2.0&ak=upXkuuhfOOuQkOlW7yxP0cVHRKIseXmc&callback=bMapInit'
        document.body.appendChild(script)
      }

    },
    mounted () {
      window.productDetail = this
      this.loadBMapScript()
      this.wrapperHeight = document.documentElement.clientHeight
      document.title = '设备详情'
      window['bMapInit'] = () => {
        this.loadEquipmentDetail()
      }
    }
  }
</script>
<style>
  .details{
    font-size: 1rem;
    line-height: 2.2rem;
    padding: 1rem;

  }
</style>
