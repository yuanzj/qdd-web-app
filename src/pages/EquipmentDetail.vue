<template>
  <div class="lm-font-default lm-text-text">

    <div class="h-container">
      <div class="lm-text-second" >电池编号</div>
      <div>{{ ccuSn }}</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">电池规格</div>
      <div>{{ guige }}</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">电池输出</div>
      <div>{{ gearzt[gear] }}</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">电池状态</div>
      <div>{{ status === 3 ? '移动' : '静止' }}</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">电池电压</div>
      <div>{{ voltageString }} v</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">电池电量</div>
      <div>{{ bmsSoc }} %</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">总里程</div>
      <div>{{ odo }} km</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">今日里程</div>
      <div>{{ dayOdo }} km</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">电池位置</div>
      <div>{{ address }} </div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">更新时间</div>
      <div>{{ reportTime }} </div>
    </div>

    <div style="height: 1rem"></div>

    <div class="h-container">
      <div class="lm-text-second">用户姓名</div>
      <div>{{ xingming }}</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">联系方式</div>
      <div>{{ phoneNumber }}</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">租期</div>
      <div>{{ usedDays }}</div>
    </div>
    <div class="h-container">
      <div class="lm-text-second">有效期</div>
      <div >{{ surplusTime  }}</div>
    </div>
    <div style="height: 1rem"></div>

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
          '17': '关闭',
          '34': '开启'
        },
        guige: this.$route.query.guige,
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
        let x = this.x
        let y = this.y
        /* eslint-disable no-undef */
        let ggPoint = new BMap.Point(x, y)
        let convertor = new BMap.Convertor()
        let geoc = new BMap.Geocoder()
        let translateCallback = (data) => {
          if (data.status === 0) {
            geoc.getLocation(data.points[0], (rs) => {
              let addComp = rs.addressComponents
              this.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
            })
          }
        }
        let pointArr = []
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
  .h-container {
    background-color: #ffffff;
    width: 100%;
    height: 3rem;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

</style>
