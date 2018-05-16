<template>
  <div class="container">
    <div class="completed-box">
      <div class="completed">
    <input v-model='ccusn' type="text" class="form-control searchResult"
           placeholder="输入序列号" onblur="if(this.placeholder==''){this.placeholder='输入序列号'}"
           onfocus="if(this.placeholder=='输入序列号'){this.placeholder=''}" >
    <mt-button class="mintui mintui-search" style="margin-left: 8px" @click="searchequipment"></mt-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'search-main',
    components: {
    },
    data () {
      return {
        ccusn: ''
      }
    },
    watch: {
      selected (val, oldval) {
        this.loadProductList()
        this.loadBottom()
        this.options = []
        this.loadoPtions()
      }
    },
    methods: {
      searchequipment (rowIndex, rowData, column) {
        this.axios.get('/api-ebike/v3.1/ebikes/list?sort=ue.status,desc&adminFlag=ss&type=4&storeTypes=0,40&sort=ue.end_time,asc&ccuSn=' + this.ccusn,
          {
            params: {
              page: 1,
              limit: 999
            }
          }
        ).then((res) => {
          console.log(res)
          console.log(res.data.list)
          this.$router.push({
            name: 'EquipmentDetail',
            params: {ccusn: res.data.list[0].ccuSn},
            query: {reportTime: res.data.list[0].reportTime,
              voltageString: res.data.list[0].voltageString,
              storeName: res.data.list[0].storeName,
              usedDays: res.data.list[0].usedDays,
              surplusTime: res.data.list[0].surplusTime,
              owner: res.data.list[0].owner,
              bmsSoc: res.data.list[0].bmsSoc,
              odo: res.data.list[0].odo,
              dayOdo: res.data.list[0].dayOdo,
              guige: res.data.list[0].productEntity.name,
              gear: res.data.list[0].gear,
              status: res.data.list[0].status,
              lon: res.data.list[0].lon,
              lat: res.data.list[0].lat
            }
          })
        })
          .catch(error => {
            console.log(error)
          })
      }
    },
    mounted () {
      this.wrapperHeight = document.documentElement.clientHeight - 100
      console.log(this.wrapperHeight)
      document.title = '设备查询'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
      }
    }
  }
</script>
<style scoped>
  .completed-box{
    width: 100%;
    position: relative;
    height: 80vh;
  }
  .completed{
    text-align: center;
    top:50%;
    left: 50%;
    transform: translate(-50%,-30%);
    position: absolute;
    width: 100%;
  }
  .container{
    height: 100%;
    position: relative;
  }
  .searchResult{
    display: inline-block;
    width: 68%;
    height: 42px;

  }
  input{
    /*background:transparent;*/
    font-size: 16px;
    border: 1px solid #ccc;
    padding: 7px 0;
    border-radius: 3px;
    padding-left:16px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s
  }
  input:focus{
    border-color: #66afe9;
    outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)
  }
</style>
