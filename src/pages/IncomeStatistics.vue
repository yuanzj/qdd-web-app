<template>
  <div>

    <div style="height: 1rem"></div>
    <div v-if="productList.length > 0" style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
    <div class="lm-text-text lm-font-second" style="background-color: white" v-for="(option,index) in productList">

      <div class="options-container" @click="showDetail(index)">
        <div class="p-title" >
          {{ option.name }}
        </div>
        <div class="p-title lm-text-red" style="flex: 1;-webkit-flex: 1;text-align: right;" >
          {{ option.value }}
        </div>
        <img v-if="option.showDetail" style="width: 25px;height: 25px" src="../assets/icons8-right_4.png"/>
      </div>
      <div style="margin-left: 1rem" v-if="index < (productList.length - 1)">
        <div style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>
      </div>
    </div>
    <div v-if="productList.length > 0" style="width:100%;height:1px;margin:0px ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>


  </div>
</template>

<script>
  export default {
    name: 'income-statistics',
    methods: {
      showDetail (index) {
        switch (index) {
          case 1:
            break
          case 2:
            this.$router.push({
              name: 'Incomelist',
              query: {
                token: this.$store.state.token,
                firm: this.$store.state.firm
              }
            })
            break
        }
      }
    },
    data () {
      return {
        productList: [{'name': '余额', 'value': '0', 'showDetail': false}, {'name': '总收益', 'value': '0', 'showDetail': true}, {'name': '昨日收益', 'value': '0', 'showDetail': true}]
      }
    },
    mounted () {
      document.title = '收益'
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


  .p-title {
    margin-left: 1rem;
    color: #212121;
    font-size: 1rem;
  }

  .options-container {
    width: 100%;
    height: 3rem;
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
