<template>


  <div >
    <v-table
      is-vertical-resize
      style="width:100%"
      is-horizontal-resize
      :min-height='200'
      :columns="columns"
      :table-data="tableData"
      :show-vertical-border="false"
      :row-click='showStatistics'
    >
    </v-table>

    <div class="h-btn-container" >
      <!--<div @click="withdraw"  class="action-btn">提现</div>-->
      <span class="bottom-text">总计</span><span class="bottom-text">{{summary.batteryTotalCount}}</span><span class="bottom-text">{{summary.batteryRentedCount}}</span><span class="bottom-text">{{summary.batteryUnusedCount}}</span><span class="bottom-text">{{summary.rentPercent}}%</span>
    </div>
  </div>
</template>

<script>
  import {Indicator, Toast} from 'mint-ui'
  export default {
    name: 'battery-statistics',
    data () {
      return {
        summary: '',
        storeId: null,
        tableData: [],
        columns: [
          {
            field: 'name',
            title: '驿站',
            width: 60,
            titleAlign: 'center',
            columnAlign: 'center',
            isFrozen: true,
            isResize: true
          },
          {
            field: 'batteryTotalCount',
            title: '总电池数',
            width: 60,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true,
//            componentName: 'table-operation',
            formatter: function (rowData, rowIndex, pagingIndex, field) {
              var inner
              inner = '<span><a>' + rowData.batteryTotalCount + '</a></span>'
              return inner
            }
          },
          {
            field: 'batteryRentedCount',
            title: '已租赁数',
            width: 60,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'batteryUnusedCount',
            title: '待租赁数',
            width: 60,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'rentPercent',
            title: '租赁率',
            width: 60,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true,
            formatter: function (rowData, rowIndex, pagingIndex, field) {
              return rowData.rentPercent + '%'
            }
          }
        ]
      }
    },
    methods: {
      loadTotalStatistics () {
        Indicator.open('加载中...')
        this.axios.get('/api-user/v3.1/ebikestores/list-4-manager?category=1&showFlag=0&sort=code,asc&model=list&limit=100&page=1&showTotalStatistics=true&id=' + this.storeId,
          {
            params: {
            }
          }
        ).then((res) => {
          Indicator.close()
          console.log(res.data)
          if (res.data.list && res.data.list.length > 0) {
            this.summary = res.data.list[0]
          }
        })
          .catch(error => {
            Indicator.close()
            console.log(error)
            if (error.data.error) {
              Toast(error.data.error.msg)
            }
          })
      },
      loadStatistics () {
        Indicator.open('加载中...')
        this.axios.get('/api-user/v3.1/ebikestores/list-4-manager?category=2&showFlag=0&sort=code,asc&model=list&limit=100&page=1&showTotalStatistics=true&parentId=' + this.storeId,
          {
            params: {
            }
          }
        ).then((res) => {
          Indicator.close()
          console.log(res.data)
          if (res.data.list && res.data.list.length > 0) {
            this.tableData = res.data.list.sort(function (x, y) {
              if (x.batteryRentedCount < y.batteryRentedCount) {
                return 1
              }
              if (x.batteryRentedCount > y.batteryRentedCount) {
                return -1
              }
              return 0
            })
          }
        })
          .catch(error => {
            Indicator.close()
            console.log(error)
            if (error.data.error) {
              Toast(error.data.error.msg)
            }
          })
      },
      loadoPtions () {
        this.axios.get('/api-user/v3.1/ebikestores/list-4-manager?category=1&showFlag=0&sort=code,asc&limit=100&page=1',
          {
            params: {
              page: 1,
              limit: 999
            }
          }
        ).then((res) => {
          this.options = res.data.list
          if (this.options && this.options.length > 0) {
            this.storeId = this.options[0].id
            this.loadStatistics()
          }
        })
          .catch(error => {
            console.log(error)
          })
      },
      showStatistics (rowIndex, rowData, column) {
        console.log(rowData)
        this.$router.push({
          name: 'BatteryStatistics',
          query: {
            token: this.$store.state.token,
            firm: this.$store.state.firm,
            selectedStoreId: rowData.id
          }
        })
//        alert(`行号：${params.index} 姓名：${params.rowData['id']}`)
      }
    },
    mounted () {
      document.title = '电池统计'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
        this.storeId = this.$route.query.storeId
      }
      if (this.storeId) {
        this.loadStatistics()
        this.loadTotalStatistics()
      } else {
        this.loadoPtions()
      }
    }
  }
//  Vue.component('table-operation', {
//    template: `<span>
//        <a href="" @click.stop.prevent="update(rowData,index)">` + this.rowData + `</a>
//        </span>`,
//    props: {
//      rowData: {
//        type: Object
//      },
//      field: {
//        type: String
//      },
//      index: {
//        type: Number
//      }
//    },
//    methods: {
//      update () {
//        let params = {type: 'edit', index: this.index, rowData: this.rowData}
//        this.$emit('on-custom-comp', params)
//      }
//    }
//  })
</script>

<style scoped>

  .bottom-text{
    flex: 1;
    -webkit-flex: 1;
    text-align: center
  }

  .h-btn-container {
    width: 100%;
    height: 3rem;
    display: flex;
    position: fixed;
    box-shadow: 0 -1px 15px #888888;
    background-color: #fff;
    bottom: 0;
    align-items: center;
    justify-content: space-between;
    line-height: 3rem;


    display: -webkit-flex;
    display: flex;
    -webkit-align-items:center;
    -webkit-justify-content:center;

  }



</style>

