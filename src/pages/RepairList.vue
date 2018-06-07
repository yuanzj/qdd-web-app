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
    @on-custom-comp="customCompFunc"
  ></v-table>
</template>

<script>
  import Vue from 'vue'
  import {Indicator, Toast, MessageBox} from 'mint-ui'

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
            field: 'bmsSoc',
            title: '电量',
            width: 70,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true,
            formatter: function (rowData, rowIndex, pagingIndex, field) {
              return rowData.bmsSoc + '%'
            }
          },
          {
            field: 'custome-adv',
            title: '操作',
            width: 70,
            titleAlign: 'center',
            columnAlign: 'center',
            componentName: 'table-operation',
            isResize: true
          }
        ]
      }
    },
    methods: {
      loadStatistics () {
        Indicator.open('加载中...')
        this.axios.get('/api-ebike/v3.1/ebikes/list?type=4&afterSaleFlag=1&sort=ue.end_time,desc&limit=999&page=1',
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
          query: {
            reportTime: rowData.reportTime,
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
      },
      customCompFunc (params) {
        console.log(params)
        if (params.type === 'edit') {
          // do edit operation
          MessageBox.confirm('确定取消' + params.rowData.ccuSn + '售后标识?').then(action => {
            this.deleteAfterSaleFlag(params)
          })
        }
      },
      deleteAfterSaleFlag (params) {
        Indicator.open('删除中...')
        this.axios.put('/api-ebike/v3.1/ues/update-after-sale-flag?ccuSn=' + params.rowData.ccuSn + '&afterSaleFlag=0').then((res) => {
          Indicator.close()
          this.loadStatistics()
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
      document.title = '售后查询'
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
  // 自定义列组件
  /* eslint-disable no-new */
  Vue.component('table-operation', {
    template: `<span>
        <a class="lm-text-blue" href="" @click.stop.prevent="update(rowData,index)">编辑</a>&nbsp;
        </span>`,
    props: {
      rowData: {
        type: Object
      },
      field: {
        type: String
      },
      index: {
        type: Number
      }
    },
    methods: {
      update () {
        // 参数根据业务场景随意构造
        let params = {type: 'edit', index: this.index, rowData: this.rowData}
        this.$emit('on-custom-comp', params)
      }
    }
  })
</script>

<style scoped>

</style>
