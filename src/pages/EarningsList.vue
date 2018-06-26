<template>
  <div>
    <div style="padding: 1rem;text-align: center;font-size: 1rem;color: #212121">总收益： <span style="font-size: 1.5rem;color: #E64E42">{{totalIncome}}</span> 元</div>
    <v-table
      is-vertical-resize
      style="width:100%"
      is-horizontal-resize
      :min-height='200'
      :columns="columns"
      :table-data="tableData"
      :show-vertical-border="false"
    ></v-table>
  </div>
</template>

<script>
  import {Indicator, Toast} from 'mint-ui'
  export default {
    name: 'pay-order-list',
    data () {
      return {
        accountNo: null,
        totalIncome: 0,
        dealerId: null,
        storeId: null,
        tableData: [],
        columns: [
          {
            field: 'createTime',
            title: '时间',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'remark',
            title: '备注',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'amount',
            title: '金额（元）',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true,
            formatter: function (rowData, rowIndex, pagingIndex, field) {
              return '+' + rowData.amount
            }
          }
        ]
      }
    },
    methods: {
      getUserInfo () {
        this.axios.get('/api-user/v3.1/users/manager-user-info',
          {
            params: {
              storeId: this.storeId
            }
          }).then((res) => {
            console.log(res)
            let data = res.data
            if (data) {
              this.getPayAccount(data.id)
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      getPayAccount (userId) {
        this.axios.get('/api-pay/v3.1/accounts/info', {
          params: {
            userId: userId
          }
        }).then((res) => {
          console.log(res)
          let data = res.data
          if (data) {
            this.unlockBalance = data.unlockBalance
            this.totalIncome = data.totalIncome
            this.accountNo = data.accountNo
            this.accounthistorys()
          }
        })
          .catch(error => {
            console.log(error)
          })
      },
      accounthistorys () {
        Indicator.open('加载中...')
        this.axios.get('/api-pay/v3.1/accounthistorys',
          {
            params: {
              accountNo: this.accountNo,
              trxType: 'INCREASE_BALANCE'
            }
          }
        ).then((res) => {
          console.log(res)
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
      document.title = '收益查询'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
        this.storeId = this.$route.query.storeId
      }
      this.getUserInfo()
    }
  }
</script>

<style scoped>

</style>
