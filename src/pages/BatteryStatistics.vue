<template>
  <v-table
    is-vertical-resize
    style="width:100%"
    is-horizontal-resize
    :vertical-resize-offset='5'
    :min-height='200'
    :columns="columns"
    :table-data="tableData"
    :show-vertical-border="false"
  ></v-table>
</template>

<script>
  export default {
    name: 'battery-statistics',
    data () {
      return {
        tableData: [],
        columns: [
          {
            field: 'specification',
            title: '电池规格',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            isFrozen: true,
            isResize: true
          },
          {
            field: 'batteryTotalCount',
            title: '总电池数',
            width: 80,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'batteryRentedCount',
            title: '已租赁数',
            width: 80,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'batteryUnusedCount',
            title: '待租赁数',
            width: 80,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'rentPercent',
            title: '租赁率',
            width: 80,
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
      loadStatistics () {
        // http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/rent-statistics?storeId=19966&_=1524905367769
        this.axios.get('/api-ebike/v3.1/ebikes/rent-statistics',
          {
            params: {
              storeId: 19966
            }
          }
        ).then((res) => {
          console.log(res)
          this.tableData = res.data
        })
          .catch(error => {
            console.log(error)
          })
      }
    },
    mounted () {
      document.title = '统计'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
      }

      this.loadStatistics()
    }
  }
</script>

<style scoped>

</style>
