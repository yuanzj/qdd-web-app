<template>
  <div class="page-navbar">
    <mt-loadmore :top-method="loadProductList"  :bottom-all-loaded="allLoaded" :auto-fill="false" bottomPullText=""  ref="loadmore" :style="{ 'min-height': wrapperHeight + 'px' }">

      <!--<mt-tab-container  v-model="selected" >-->

        <!--<mt-tab-container-item id="1">-->
          <div data-toggle="distpicker" id="app1"  class="form-inline topinline1">

            <select v-model="selected2" type="text" class="sechgg"  @change="look" >
              <option selected = "selected" value="0"  >选择规格</option>
              <option v-for="option in options" v-bind:value="option.id">
                {{ option.name }}
              </option>
            </select>
            <v-distpicker  :province="user.xtrysf" :city="user.xtrycs" :area="user.xtryq"  @province="onChangeProvince" @city="onChangeCity" @area="onChangeArea" >
            </v-distpicker>


            <mt-button type="primary" @click="searchgg" style="width: 50px;height: 24px;font-size: 12px">查询</mt-button>

          </div>
          <div data-toggle="distpicker" class="form-inline topinline2">
            <input v-model='ccsn' type="text" class="form-control searchResult"  style="display: inline-block;width: 120px;height: 25px"
                   placeholder="输入序列号" onblur="if(this.placeholder==''){this.placeholder='输入序列号'}"
                   onfocus="if(this.placeholder=='输入序列号'){this.placeholder=''}" >
            <mt-button type="primary" style="width: 35px;height: 24px;padding:0" @click="searchCcusn"><span class="mintui mintui-search"></span></mt-button>

          </div>

          <v-table
            is-vertical-resize
            style="width:100%;margin-top: 1rem"
            is-horizontal-resize
            columns-width-drag
            :vertical-resize-offset='40'
            :min-height= wrapperHeight-10
            :columns="columns"
            :table-data="tableData"
            :show-vertical-border="false"
            :row-click='showDetails'
            :paging-index="(pageIndex-1)*pageSize"
          ></v-table>
           <div>
          <div class="mb20 bold"></div>
          <v-pagination
            @page-change="pageChange" @page-size-change="pageSizeChange"
            style="margin-top: 8px"
            size="small"
            :total="totaltablenum"
            :showPagingCount="3"
            :page-size="20"
            :layout="[ 'prev','pager', 'next']">
          </v-pagination>
        </div>

        <!--</mt-tab-container-item>-->

      <!--</mt-tab-container>-->
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
        totaltablenum: '',
        pageNo: 1,
        pageIndex: 1,
        pageSize: 20,
        totalpage: 0,
        allLoaded: false,
        wrapperHeight: 0,
        id: '',
        url: '',
        selected: '1',
        selected2: '0',
        productList: [],
        options: [],
        tableData: [],
        columns: [
          {
            field: 'custome',
            title: '序号',
            width: 40,
            titleAlign: 'center',
            columnAlign: 'center',
            formatter: function (rowData, index, pagingIndex) {
              var currentIndex = index + pagingIndex
              return currentIndex + 1
            },
            isFrozen: true,
            isResize: true
          },
          {
            field: 'ccuSn',
            title: '序列号',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            isFrozen: true,
            isResize: true
          },
          {
            field: 'realName',
            title: '租赁',
            width: 60,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true,
            formatter: function (rowData, rowIndex, pagingIndex, field) {
              var inner
              if (rowData.orderId === null) {
                inner = '未租'
              } else {
                inner = '已租'
              }
              return inner
            }
          },
          {
            field: 'gear',
            title: '禁用',
            width: 60,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true,
            formatter: function (rowData, rowIndex, pagingIndex, field) {
              var inner
              if (rowData.gear === '17') {
                inner = '禁用'
              } else if (rowData.gear === '34') {
                inner = '启用'
              }
              return inner
            }
          },
          {
            field: 'voltageString',
            title: '电压（/V）',
            width: 80,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'bmsSoc',
            title: '电量（%）',
            width: 80,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          }
        ],
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
        this.loadProductList()
        this.loadBottom()
        this.options = []
        this.loadoPtions()
      }
    },
    methods: {
      pageChange (pageIndex) {
        this.pageIndex = pageIndex
        console.log(pageIndex)
        this.loadmore()
      },
      pageChange2 (pageIndex) {
        this.pageIndex = pageIndex
        console.log(pageIndex)
      },
      pageSizeChange (pageSize) {
        this.pageIndex = 1
        this.pageSize = pageSize
      },
      loadmore () {
        this.axios.get(this.url,
          {
            params: {
              page: this.pageIndex,
              limit: 20
            }
          }
        ).then((res) => {
          this.$refs.loadmore.onTopLoaded()
          this.tableData = res.data.list
        })
          .catch(error => {
            this.$refs.loadmore.onTopLoaded()
            console.log(error)
          })
      },
      loadBottom () {
        this.more()// 上拉触发的分页查询
        this.$refs.loadmore.onBottomLoaded()// 固定方法，查询完要调用一次，用于重新定位
      },
      loadProductList () {
        this.axios.get('/api-ebike/v3.1/ebikes/list?sort=ue.status,desc&adminFlag=ss&type=4&storeTypes=0,40&sort=ue.end_time,asc',
          {
            params: {
              page: 1,
              limit: 20
            }
          }
        ).then((res) => {
          this.$refs.loadmore.onTopLoaded()
          this.tableData = res.data.list
          this.totaltablenum = res.data.totalCount
          this.url = '/api-ebike/v3.1/ebikes/list?sort=ue.status,desc&adminFlag=ss&type=4&storeTypes=0,40&sort=ue.end_time,asc'
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
          this.tableData = res.data.list
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
        if (this.selected2 === '0') {
          this.axios.get('/api-ebike/v3.1/ebikes/list?sort=ue.status,desc&adminFlag=ss&type=4&storeTypes=0,40&sort=ue.end_time,asc&province=' + this.user.xtrysf + '&city=' + this.user.xtrycs + '&county=' + this.user.xtryq,
            {
              params: {
                page: 1,
                limit: 20
              }
            }
          ).then((res) => {
            this.$refs.loadmore.onTopLoaded()
            this.tableData = res.data.list
            this.pageIndex = 1
            this.totaltablenum = res.data.totalCount
            this.url = '/api-ebike/v3.1/ebikes/list?sort=ue.status,desc&adminFlag=ss&type=4&storeTypes=0,40&sort=ue.end_time,asc&province=' + this.user.xtrysf + '&city=' + this.user.xtrycs + '&county=' + this.user.xtryq
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
                limit: 20
              }
            }
          ).then((res) => {
            this.$refs.loadmore.onTopLoaded()
            this.tableData = res.data.list
            this.pageIndex = 1
            this.totaltablenum = res.data.totalCount
            this.url = '/api-ebike/v3.1/ebikes/list?sort=ue.status,desc&adminFlag=ss&type=4&storeTypes=0,40&sort=ue.end_time,asc&province=' + this.user.xtrysf + '&city=' + this.user.xtrycs + '&county=' + this.user.xtryq + '&&productId=' + this.selected2
          })
            .catch(error => {
              this.$refs.loadmore.onTopLoaded()
              console.log(error)
            })
        }
      },
      showDetails (rowIndex, rowData, column) {
        this.$router.push({
          name: 'EquipmentDetail',
          params: {ccusn: rowData.ccuSn},
          query: {reportTime: rowData.reportTime,
            voltageString: rowData.voltageString,
            storeName: rowData.storeName,
            usedDays: rowData.usedDays,
            surplusTime: rowData.surplusTime,
            owner: rowData.owner,
            bmsSoc: rowData.bmsSoc,
            odo: rowData.odo,
            dayOdo: rowData.dayOdo,
            guige: rowData.productEntity.name,
            gear: rowData.gear,
            status: rowData.status,
            lon: rowData.lon,
            lat: rowData.lat
          }
        })
      }
    },
    mounted () {
      this.wrapperHeight = document.documentElement.clientHeight - 100
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
    width: 20%;
    height: 25px;
    border-radius: .25rem;
    border: 1px solid rgba(0, 0, 0, 0.15);
    font-size: 12px;
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
    width: 100%;
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
