<template>
  <v-table
    is-vertical-resize
    style="width:100%"
    is-horizontal-resize
    :min-height='200'
    :columns="columns"
    :table-data="tableData"
    :show-vertical-border="false"
  ></v-table>
</template>

<script>
  import {Indicator, Toast} from 'mint-ui'
  export default {
    name: 'battery-statistics',
    data () {
      return {
        storeId: null,
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
            width: 70,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'batteryRentedCount',
            title: '已租赁数',
            width: 70,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'batteryUnusedCount',
            title: '待租赁数',
            width: 70,
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
        this.axios.get('/api-ebike/v3.1/ebikes/rent-statistics',
          {
            params: {
              storeId: this.storeId
            }
          }
        ).then((res) => {
          Indicator.close()
          this.tableData = res.data
        })
          .catch(error => {
            Indicator.close()
            if (error.data.error) {
              Toast(error.data.error.msg)
            }
          })
      }
    },
    mounted () {
      document.title = '统计详情'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
        this.storeId = this.$route.query.selectedStoreId
      }

      this.loadStatistics()
    }
  }
</script>

<style scoped>

</style>
