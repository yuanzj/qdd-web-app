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
    name: 'pay-order-list',
    data () {
      return {
        dealerId: null,
        storeId: null,
        tableData: [],
        columns: [
          {
            field: 'createTime',
            title: '时间',
            width: 160,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'ccuSn',
            title: '序列号',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'storeName',
            title: '驿站',
            width: 80,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'realName',
            title: '用户姓名',
            width: 70,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'rentAmount',
            title: '金额',
            width: 60,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          }
        ]
      }
    },
    methods: {
      loadStoreInfo () {
        Indicator.open('加载中...')
        this.axios.get('/api-user/v3.1/ebikestores/' + this.storeId).then((res) => {
          Indicator.close()
          let data = res.data
          if (data) {
            if (data.category === 0 || data.category === 1) {
              this.dealerId = data.id
              this.storeId = null
            }
            this.loadStatistics()
          }
        })
          .catch(error => {
            Indicator.close()
            if (error.data.error) {
              Toast(error.data.error.msg)
            }
          })
      },
      loadStatistics () {
        Indicator.open('加载中...')
        this.axios.get('/api-order/v3.1/product-orders/list?sort=p_o.create_time,desc&status=1&limit=500&page=1',
          {
            params: {
              dealerId: this.dealerId,
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
      }
    },
    mounted () {
      document.title = '订单查询'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
        this.storeId = this.$route.query.storeId
      }

      this.loadStoreInfo()
    }
  }
</script>

<style scoped>

</style>
