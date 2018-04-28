<template>
  <div class="container">

    <div class="table-head-title">租赁管理</div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    <div class="h-buttons-container">

      <div class="v-button"  @click="finish">
        <img src="../assets/icons8-refund.png" class="v-button-icon"/>
        <p class="v-button-title">退租</p>
      </div>
      <div class="v-button"  @click="replace">
        <img src="../assets/icons8-replace.png" class="v-button-icon"/>
        <p class="v-button-title">售后</p>
      </div>
      <div class="v-button"></div>
      <div class="v-button"></div>
    </div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>


    <div class="table-head-title">资产管理</div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    <div class="h-buttons-container">

      <div class="v-button"  @click="batteryStatistics">
        <img src="../assets/icons8-positive_dynamic.png" class="v-button-icon"/>
        <p class="v-button-title">统计</p>
      </div>
      <div class="v-button"  @click="search">
        <img src="../assets/icons8-search.png" class="v-button-icon"/>
        <p class="v-button-title">查询</p>
      </div>
      <div class="v-button"  @click="orderBattery">
        <img src="../assets/icons8-shopping_cart_loaded.png" class="v-button-icon"/>
        <p class="v-button-title">订货</p>
      </div>
      <div class="v-button"  @click="batteryDistribution">
        <img src="../assets/icons8-scan_stock.png" class="v-button-icon"/>
        <p class="v-button-title">分配</p>
      </div>
    </div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>

    <div class="table-head-title">财务管理</div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    <div class="h-buttons-container">

      <div class="v-button"  @click="incomeStatistics">
        <img src="../assets/icons8-money.png" class="v-button-icon"/>
        <p class="v-button-title">收益</p>
      </div>
      <div class="v-button"  >
      </div>
      <div class="v-button"  >
      </div>
      <div class="v-button"></div>
    </div>
    <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
  </div>
</template>

<script>
  export default {
    name: 'ops-main',
    data () {
      return {
        ccuSn: null
      }
    },
    methods: {
      finish () {
        this.$router.push({
          name: 'OpsOrderOpsStep',
          query: {
            token: this.$store.state.token,
            firm: this.$store.state.firm,
            model: 0
          }
        })
      },
      replace () {
        this.$router.push({
          name: 'OpsOrderOpsStep',
          query: {
            token: this.$store.state.token,
            firm: this.$store.state.firm,
            model: 1
          }
        })
      },
      batteryStatistics () {
        this.$router.push({
          name: 'BatteryStatistics',
          query: {
            token: this.$store.state.token,
            firm: this.$store.state.firm
          }
        })
      },
      search () {
        this.$router.push({
          name: 'Equipmentlist',
          query: {
            token: this.$store.state.token,
            firm: this.$store.state.firm
          }
        })
      },
      orderBattery () {
        this.$router.push({
          name: 'OrderBattery',
          query: {
            token: this.$store.state.token,
            firm: this.$store.state.firm
          }
        })
      },
      batteryDistribution () {
        this.$router.push({
          name: 'BatteryDistribution',
          query: {
            token: this.$store.state.token,
            firm: this.$store.state.firm
          }
        })
      },
      incomeStatistics () {
        this.$router.push({
          name: 'IncomeStatistics',
          query: {
            token: this.$store.state.token,
            firm: this.$store.state.firm
          }
        })
      }
    },
    mounted () {
      window.productDetail = this
      document.title = '首页'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
      }
    }
  }
</script>

<style scoped>

  .container{
  }

  .table-head-title {
    margin-left: 1rem;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  .h-buttons-container {
    display: -webkit-flex;
    display: flex;
    padding: 1rem 0 1rem 0;
    background-color: white;
  }

  .v-button {
    -webkit-flex: 1;
    flex: 1;
    text-align: center;
  }

  .v-button-icon {
    width: 2.5rem;
    height: 2.5rem;;
  }

  .v-button-title {
    margin-top: 0.5rem;
    color: #212121;
    font-size: 1rem;
  }

  .p-head {
    height: 4.5rem;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
    padding: 1rem;
  }

  .p-image {
    width: 2.5rem;
    height: 2.5rem;
  }

  .p-title {
    margin-left: 1rem;
    color: #212121;
    font-size: 1rem;
    flex-grow: 1;
  }

  .p-desc {
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    max-height: 3.75rem;
    font-size: 0.875rem;
    color: #757575;
    margin: 1rem 1rem 0 1rem;
  }

  .p-container {
    flex: 1;
    -webkit-flex: 1;
    display: -webkit-flex;
    display: flex;
    background: white;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .p-head {
    height: 4.5rem;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
    padding: 1rem;
  }

  .p-image {
    width: 2.5rem;
    height: 2.5rem;
  }

  .p-title {
    margin-left: 1rem;
    color: #212121;
    font-size: 1rem;
    flex-grow: 1;
  }

  .p-content {
    width: 100%;
    -webkit-flex: 1;
    flex: 1;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
    margin-left: 1rem;
    padding-right: 2rem;
    margin-bottom: 1rem;
  }

  .p-price {
    text-align: left;
    color: #757575;
    font-size: 0.875rem;
  }

  .p-desc {
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    max-height: 3.75rem;
    font-size: 0.875rem;
    color: #757575;
    margin: 1rem;
  }

  .options-container {
    width: 100%;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    background-color: white;
    padding-right: 1rem;
  }

</style>
