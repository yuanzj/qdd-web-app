<template>
  <div>
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
    <mt-popup
      v-model="popupVisible"
      popup-transition="popup-fade">
      <div  style="width: 300px;background-color: white">
        <div class="mint-msgbox-header">
          <div class="mint-msgbox-title">编辑</div>
        </div>
        <div class="mint-msgbox-content">
          <div class="mint-msgbox-input">
            <input v-model="inputValue" :placeholder="inputPlaceholder" style="height: 33px">
          </div>
        </div>
        <div class="mint-msgbox-btns" style="padding: 1rem;height: 65px">
          <mt-button type="primary" size="small" style="flex: 1" @click.native="opsAffirm">确认</mt-button>
          <mt-button type="default" size="small" style="flex: 1;margin-left: 1rem" @click.native="opsCancel">取消</mt-button>
          <mt-button type="danger" size="small" style="flex: 1;margin-left: 1rem" @click.native="opsDelete">删除</mt-button>
        </div>
      </div>
    </mt-popup>
  </div>

</template>

<script>
  import Vue from 'vue'
  import {Indicator, Toast} from 'mint-ui'
  export default {
    name: 'overdue-order-list',
    data () {
      return {
        inputValue: null,
        params: null,
        inputPlaceholder: '请填写售后原因',
        popupVisible: false,
        dealerId: null,
        storeId: null,
        tableData: [],
        columns: [
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
      opsAffirm () {
        this.updateAfterSaleFlag(this.params)
      },
      opsCancel () {
        this.popupVisible = false
      },
      opsDelete () {
        this.deleteAfterSaleFlag(this.params)
      },
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
        this.axios.get('/api-ebike/v3.1/ebikes/list?afterSaleFlag=1&sort=ue.end_time,desc&limit=999&page=1',
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
          this.params = params
          this.popupVisible = true
          if (this.params.rowData.afterSaleReason) {
            this.inputValue = this.params.rowData.afterSaleReason
          } else {
            this.inputValue = null
          }
        }
      },
      deleteAfterSaleFlag (params) {
        Indicator.open('删除中...')
        this.axios.put('/api-ebike/v3.1/ues/update-after-sale-flag?ccuSn=' + params.rowData.ccuSn + '&afterSaleFlag=0').then((res) => {
          Indicator.close()
          this.loadStatistics()
          this.popupVisible = false
        })
          .catch(error => {
            Indicator.close()
            if (error.data.error) {
              Toast(error.data.error.msg)
            }
            this.popupVisible = false
          })
      },
      updateAfterSaleFlag (params) {
        if (this.inputValue === null || this.inputValue === '') {
          this.popupVisible = false
          Toast('请输入售后原因')
          return
        }
        Indicator.open('更新中...')
        this.axios.put('/api-ebike/v3.1/ues/update-after-sale-flag?ccuSn=' + params.rowData.ccuSn + '&afterSaleFlag=1&afterSaleReason=' + this.inputValue).then((res) => {
          Indicator.close()
          this.loadStatistics()
          this.popupVisible = false
        })
          .catch(error => {
            Indicator.close()
            if (error.data.error) {
              Toast(error.data.error.msg)
            }
            this.popupVisible = false
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

      this.loadStoreInfo()
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
