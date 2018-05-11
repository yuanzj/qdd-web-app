<template>
  <div class="page-navbar-table">
    <mt-loadmore :top-method="loadProductList"  :bottom-all-loaded="allLoaded"  :auto-fill="false" bottomPullText=""  ref="loadmore" :style="{ 'min-height': wrapperHeight + 'px' }">

      <!--<mt-tab-container  v-model="selected" >-->

        <!--<mt-tab-container-item id="1">-->
          <v-table
            is-vertical-resize
            style="width:100%"
            is-horizontal-resize
            columns-width-drag
            :vertical-resize-offset='40'
            :min-height= wrapperHeight-40
            :columns="columns"
            :table-data="tableData"
            :show-vertical-border="false"
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

          <!--<table class="table table-bordered">-->
            <!--<tbody>-->
            <!--<tr>-->
              <!--<th></th>-->
              <!--<th>时间</th>-->
              <!--<th>规格</th>-->
              <!--<th>设备号</th>-->
              <!--<th style="width:2.8rem;">用户姓名</th>-->
              <!--<th style="width:2.8rem;">金额</th>-->
            <!--</tr>-->
            <!--<tr v-for="(item,index)  in productList" :id="item.ccuSn">-->
              <!--<td>{{ index+1 }}</td>-->
              <!--<td>{{ item.createTime }}</td>-->
              <!--<td>{{ item.productName }}</td>-->
              <!--<td>{{ item.ccuSn }}</td>-->
              <!--<td>{{ item.realName }}</td>-->
              <!--<td>{{ item.totalPrice }}</td>-->
            <!--</tr>-->
            <!--</tbody>-->
          <!--</table>-->



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
        pageIndex: 1,
        pageNo: 1,
        pageSize: 20,
        totalpage: 0,
        allLoaded: false,
        wrapperHeight: 0,
        selected: '1',
        selected2: '',
        productList: [],
        ccsn: '',
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
            field: 'createTime',
            title: '时间',
            width: 150,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'productName',
            title: '规格',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'ccuSn',
            title: '设备号',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'realName',
            title: '用户姓名',
            width: 60,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'totalPrice',
            title: '金额',
            width: 60,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          }
        ]
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
      pageChange (pageIndex) {
        this.pageIndex = pageIndex
        console.log(pageIndex)
        this.loadmore()
      },
      pageSizeChange (pageSize) {
        this.pageIndex = 1
        this.pageSize = pageSize
      },
      loadmore () {
        this.axios.get('/api-order/v3.1/product-orders/list?sort=p_o.create_time,desc&status=1&storeTypes=0,40',
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
        this.axios.get('/api-order/v3.1/product-orders/list?sort=p_o.create_time,desc&status=1&storeTypes=0,40',
          {
            params: {
              page: this.pageNo,
              limit: 20
            }
          }
        ).then((res) => {
          this.$refs.loadmore.onTopLoaded()
          this.tableData = this.tableData.concat(res.data.list)
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
          console.log('meile')
        }
      },
      loadProductList () {
        this.pageNo = 1
        this.axios.get('/api-order/v3.1/product-orders/list?sort=p_o.create_time,desc&status=1&storeTypes=0,40',
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
        })
          .catch(error => {
            this.$refs.loadmore.onTopLoaded()
            console.log(error)
          })
      }
    },
    mounted () {
      this.wrapperHeight = document.documentElement.clientHeight
      console.log(this.wrapperHeight)
      document.title = '昨日收益'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
      }

      this.loadProductList()
    }
  }
</script>

<style scoped>
  .table-bordered{
    border-bottom: 1px solid #393939;
    width: 95%;
    margin-left: 2.5%;
    text-align: center;
    margin-top: .5rem;
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
    height: 1.5rem;
    vertical-align: middle;
  }
  .distpicker-address-wrapper select{
    padding: 0;
    font-size: 12px;
    height: 25px;

  }
  .page-navbar-table{
    overflow: scroll;
    height: auto;
  }

</style>
