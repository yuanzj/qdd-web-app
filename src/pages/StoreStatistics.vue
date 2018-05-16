<template>
  <div class="page-navbar">
 <div class="searchDiv">
  <select v-model="selected2" type="text" class="sechgg">
    <option selected = "selected" value="0"  >请选择</option>
    <option v-for="option in options" v-bind:value="option.id">
      {{ option.name }}
    </option>
  </select>
   <mt-button class="mintui mintui-search" style="height: 39px;display: inline-block;margin-left: 16px;top:-1px" @click="loadStatistics"></mt-button>
 </div>


<div>
  <v-table
    is-vertical-resize
    style="width:100%"
    is-horizontal-resize
    :vertical-resize-offset='5'
    :min-height='200'
    :columns="columns"
    :table-data="tableData"
    :show-vertical-border="false"
    :row-click='showStatistics'
  ></v-table>
</div>
  </div>
</template>

<script>
  export default {
    name: 'battery-statistics',
    data () {
      return {
        selected2: 0,
        options: [],
        option: '',
        storeId: null,
        tableData: [],
        columns: [
          {
            field: 'name',
            title: '驿站',
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
          }
        ]
      }
    },
    watch: {
      selected (val, oldval) {
        this.options = []
        this.loadoPtions()
      }
    },
    methods: {
      loadStatistics () {
        // http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/rent-statistics?storeId=19966&_=1524905367769
        this.axios.get('/api-user/v3.1/ebikestores?category=2&showFlag=0&sort=code,asc&model=list&limit=100&page=1&showTotalStatistics=true&parentId=' + this.selected2,
          {
            params: {
            }
          }
        ).then((res) => {
          console.log(res.data)
          this.tableData = res.data.list
        })
          .catch(error => {
            console.log(error)
          })
      },
      loadoPtions () {
        this.axios.get('/api-user/v3.1/ebikestores?category=1&showFlag=0&sort=code,asc&limit=100&page=1',
          {
            params: {
              page: 1,
              limit: 999
            }
          }
        ).then((res) => {
          this.options = res.data.list
        })
          .catch(error => {
            console.log(error)
          })
      },
      showStatistics (rowIndex, rowData, column) {
        console.log(rowData)
        this.$router.push({
          name: 'BatteryStatistics',
          params: {ccusn: rowData.id}
        })
//        alert(`行号：${params.index} 姓名：${params.rowData['id']}`)
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
        this.storeId = this.$route.query.storeId
      }
      this.loadoPtions()
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
  .searchDiv{
    height: 4.5rem;
    text-align: center;
    vertical-align: middle;
  }
  .sechgg{
    margin-top: 16px;
    padding-left: 8px;
    height: 41px;
    width: 75%;
    font-size: 16px;
    color: black;
    background-color: #fff;
    background-image: none;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: .25rem;
    -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;

  }
</style>

