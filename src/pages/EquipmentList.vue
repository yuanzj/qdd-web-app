<template>
  <div class="page-navbar">
    <mt-loadmore :top-method="loadProductList" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" bottomPullText=""  ref="loadmore" :style="{ 'min-height': wrapperHeight + 'px' }">

      <mt-tab-container  v-model="selected" >

        <mt-tab-container-item id="1">
          <div data-toggle="distpicker" id="app1"  class="form-inline topinline1">
            <input v-model='ccsn' type="text" class="form-control searchResult"  style="display: inline-block;width: 120px;height: 25px"
                   placeholder="输入序列号" onblur="if(this.placeholder==''){this.placeholder='输入序列号'}"
                   onfocus="if(this.placeholder=='输入序列号'){this.placeholder=''}" >
            <mt-button type="primary" style="width: 35px;height: 24px;padding: 0" @click="searchCcusn"><span class="mintui mintui-search"></span></mt-button>
            <select v-model="selected2" type="text" class="sechgg"  @change="look" >
              <option selected = "selected" value="0"  >---选择规格---</option>
              <option v-for="option in options" v-bind:value="option.id">
                {{ option.name }}
              </option>
            </select>

          </div>
          <div data-toggle="distpicker" class="form-inline topinline2">
            <v-distpicker  :province="user.xtrysf" :city="user.xtrycs" :area="user.xtryq"  @province="onChangeProvince" @city="onChangeCity" @area="onChangeArea" >
            </v-distpicker>


            <mt-button type="primary" @click="searchgg" style="width: 50px;height: 25px;font-size: 12px">查询</mt-button>
          </div>

            <table class="table table-bordered">
              <tbody>
              <tr>
                <th></th>
                <th>序列号</th>
                <th>租赁</th>
                <th>禁用</th>
                <th>电压(/V)</th>
                <th>电量(%)</th>
              </tr>
              <tr v-for="(item,index)  in productList" :id= "item.ccuSn"  @click="showDetails(item)">
                <td>{{ index+1 }}</td>
                <td>{{ item.ccuSn }}</td>
                <td v-if="item.orderId===null">未租</td>
                <td v-else="">已租</td>
                <td>{{gearzt[item.gear]}}</td>
                <td>{{ item.voltageString }}</td>
                <td>{{ item.bmsSoc }}</td>
              </tr>
              </tbody>
            </table>



        </mt-tab-container-item>

      </mt-tab-container>
    </mt-loadmore>

  </div>
</template>

<script>
  import VDistpicker from 'v-distpicker'

  export default {
    name: 'coupon-list',
    components: {
      VDistpicker
    },
    data () {
      return {
        pageNo: 1,
        pageSize: 30,
        totalpage: 0,
        allLoaded: false,
        wrapperHeight: 0,
        id: '',
        selected: '1',
        selected2: '0',
        productList: [],
        options: [],
        option: '',
        ccsn: '',
        gearzt: {
          '17': '禁用',
          '34': '启用'
        },
        user: {
          xtrysf: '',
          xtrycs: '',
          xtryq: ''
        }
      }
    },
    watch: {
      selected (val, oldval) {
        this.productList = []
        this.loadProductList()
        this.loadBottom()
        this.options = []
        this.loadoPtions()
      }
    },
    methods: {
      loadBottom () {
        this.more()// 上拉触发的分页查询
        this.$refs.loadmore.onBottomLoaded()// 固定方法，查询完要调用一次，用于重新定位
      },
      more: function () {
        // 分页查询
        if (this.totalpage === 1) {
          this.pageNo = 1
          this.allLoaded = true
        } else {
          this.pageNo = parseInt(this.pageNo) + 1
          this.allLoaded = false
        }

        console.log(this.pageNo)
        this.axios.get('/api-ebike/v3.1/ebikes/list?sort=ue.status,desc&adminFlag=ss&type=4&storeTypes=0,40&sort=ue.end_time,asc',
          {
            params: {
              page: this.pageNo,
              limit: 30
            }
          }
        ).then((res) => {
          this.$refs.loadmore.onTopLoaded()
          this.productList = this.productList.concat(res.data.list)
          this.totalpage = Math.ceil(res.data.totalCount / this.pageSize)
          if (this.totalpage === 1) {
            this.allLoaded = true
          }
          this.$nextTick(function () {
            // 是否还有下一页，加个方法判断，没有下一页要禁止上拉
            this.scrollMode = 'touch'
            this.isHaveMore()
          })
        })
          .catch(error => {
            this.$refs.loadmore.onTopLoaded()
            console.log(error)
          })
      },
      isHaveMore: function () {
        // 是否还有下一页，如果没有就禁止上拉刷新
        this.allLoaded = false // true是禁止上拉加载
        if (this.pageNo === this.totalpage) {
          this.allLoaded = true
        }
      },
      loadProductList () {
        this.pageNo = 1
        this.axios.get('/api-ebike/v3.1/ebikes/list?sort=ue.status,desc&adminFlag=ss&type=4&storeTypes=0,40&sort=ue.end_time,asc',
          {
            params: {
              page: 1,
              limit: 30
            }
          }
        ).then((res) => {
          this.$refs.loadmore.onTopLoaded()
          this.productList = res.data.list
          this.allLoaded = false // true是禁止上拉加载
          if (this.pageNo === this.totalpage) {
            this.allLoaded = true
          }
        })
          .catch(error => {
            this.$refs.loadmore.onTopLoaded()
            console.log(error)
          })
      },
      loadoPtions () {
        this.axios.get('/api-order/v3.1/specifications?sort=id,asc&categoryIds=1',
          {
            params: {
              page: 1,
              limit: 999
            }
          }
        ).then((res) => {
          this.$refs.loadmore.onTopLoaded()
          this.options = res.data.list
        })
          .catch(error => {
            this.$refs.loadmore.onTopLoaded()
            console.log(error)
          })
      },
      searchCcusn () {
        this.axios.get('/api-ebike/v3.1/ebikes/list?sort=ue.status,desc&adminFlag=ss&type=4&storeTypes=0,40&sort=ue.end_time,asc&ccuSn=' + this.ccsn,
          {
            params: {
              page: 1,
              limit: 999
            }
          }
        ).then((res) => {
          this.$refs.loadmore.onTopLoaded()
          this.productList = res.data.list
          this.allLoaded = true
        })
          .catch(error => {
            this.$refs.loadmore.onTopLoaded()
            console.log(error)
          })
      },
      onChangeProvince (data) {
        this.user.xtrysf = data.value
      },
      onChangeCity (data) {
        this.user.xtrycs = data.value
      },
      onChangeArea (data) {
        this.user.xtryq = data.value
      },
      look (obj) {
        console.log(this.selected2)
      },
      searchgg () {
        console.log(this.selected2)
        if (this.selected2 === '0') {
          this.axios.get('/api-ebike/v3.1/ebikes/list?sort=ue.status,desc&adminFlag=ss&type=4&storeTypes=0,40&sort=ue.end_time,asc&province=' + this.user.xtrysf + '&city=' + this.user.xtrycs + '&county=' + this.user.xtryq,
            {
              params: {
                page: 1,
                limit: 999
              }
            }
          ).then((res) => {
            this.$refs.loadmore.onTopLoaded()
            this.productList = res.data.list
            this.allLoaded = true
          })
            .catch(error => {
              this.$refs.loadmore.onTopLoaded()
              console.log(error)
            })
        } else {
          this.axios.get('/api-ebike/v3.1/ebikes/list?sort=ue.status,desc&adminFlag=ss&type=4&storeTypes=0,40&sort=ue.end_time,asc&province=' + this.user.xtrysf + '&city=' + this.user.xtrycs + '&county=' + this.user.xtryq + '&&productId=' + this.selected2,
            {
              params: {
                page: 1,
                limit: 999
              }
            }
          ).then((res) => {
            this.$refs.loadmore.onTopLoaded()
            this.productList = res.data.list
            this.allLoaded = true
          })
            .catch(error => {
              this.$refs.loadmore.onTopLoaded()
              console.log(error)
            })
        }
      },
      showDetails (obj) {
        this.$router.push({
          name: 'EquipmentDetail',
          params: {ccusn: obj.ccuSn},
          query: {reportTime: obj.reportTime,
            voltageString: obj.voltageString,
            storeName: obj.storeName,
            usedDays: obj.usedDays,
            surplusTime: obj.surplusTime,
            owner: obj.owner,
            bmsSoc: obj.bmsSoc,
            odo: obj.odo,
            dayOdo: obj.dayOdo,
            guige: obj.productEntity.name,
            gear: obj.gear,
            status: obj.status,
            lon: obj.lon,
            lat: obj.lat
          }
        })
      }
    },
    mounted () {
      this.wrapperHeight = document.documentElement.clientHeight - 48
      console.log(this.wrapperHeight)
      document.title = '设备查询'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
      }

      this.loadProductList()
      this.loadoPtions()
    }
  }
</script>

<style scoped>
  .sechgg{
    display: inline-block;
    width: 100px;
    height: 25px;
    border-radius: .25rem;
    border: 1px solid rgba(0, 0, 0, 0.15);
  }
 .table-bordered{
   border-bottom: 1px solid #393939;
   width: 95%;
   margin-left: 2.5%;
   text-align: center;
   margin-top: 1rem;
   background-color: white;
 }
 th
 {
   border-bottom: 1px solid rgba(0, 0, 0, 0.71);
   background-color: #656b79;
   color:white;
   height: 1.5rem;
   vertical-align: middle;
   font-weight: 600;
 }
  td{
    border-bottom: 1px solid #393939;
    height: 1.8rem;
    vertical-align: middle;
  }
  .topinline1{
    margin-top: .5rem;
    margin-bottom: .25rem;
    margin-left:2.5%;
  }
  .topinline2{
    margin-top: .25rem;
    margin-bottom: -.5rem;
    margin-left:2.5%;
  }
 .distpicker-address-wrapper select{
   padding: 0;
   font-size: 12px;
   height: 25px;

 }
 .searchResult{
   padding-left: 4px;
   border-radius: .25rem;
   border: 1px solid rgba(0, 0, 0, 0.15);
 }
  .page-navbar{
    overflow: auto;
  }

</style>
