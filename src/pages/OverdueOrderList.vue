<template>
  <v-table
    is-vertical-resize
    style="width:100%"
    is-horizontal-resize
    :min-height='200'
    :columns="columns"
    :table-data="tableData"
    :show-vertical-border="false"
    :row-click='showDetails'
  ></v-table>
</template>

<script>
  import {Indicator, Toast} from 'mint-ui'
  export default {
    name: 'overdue-order-list',
    data () {
      return {
        storeId: null,
        tableData: [],
        columns: [
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
            field: 'storeName',
            title: '驿站',
            width: 70,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'realname',
            title: '用户姓名',
            width: 70,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true,
            formatter: function (rowData, rowIndex, pagingIndex, field) {
              return rowData.owner.realname
            }
          },
          {
            field: 'phoneNumber',
            title: '联系方式',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true,
            formatter: function (rowData, rowIndex, pagingIndex, field) {
              return rowData.owner.phoneNumber
            }
          },
          {
            field: 'surplusTime',
            title: '有效期',
            width: 150,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          }
        ]
      }
    },
    methods: {
      loadStatistics () {
        Indicator.open('加载中...')
        this.axios.get('/api-ebike/v3.1/ebikes/list?type=4&filterType=2&sort=ue.end_time,desc&limit=999&page=1',
          {
            params: {
              storeId: this.storeId
            }
          }
        ).then((res) => {
          Indicator.close()
          this.tableData = res.data.list
        })
          .catch(error => {
            Indicator.close()
            if (error.data.error) {
              Toast(error.data.error.msg)
            }
          })
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
      document.title = '逾期查询'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
        this.storeId = this.$route.query.storeId
      }

      this.loadStatistics()
    }
  }
</script>

<style scoped>

</style>
