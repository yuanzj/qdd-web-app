<template>
  <div style="background-color: white;padding: 1em">
    <div style="padding: 1.5em 0">
      <div style="display: flex;align-items:center;justify-content:center;">
        <div style="flex: 1;font-size: 1.2em">我的卡</div>
        <div style="flex: 1;text-align: right;color: rgba(128,128,128,0.8)" @click="gotoPackageList"> 去购买 ></div>
      </div>
    </div>
    <!--<div style="padding: 1.5em 0;font-size: 1.2em">我的卡</div>-->
    <div style="width: 100%;display: flex;align-items:center;justify-content:center;padding: 0.5em 0"
         v-for="item in cardList" >
      <div class="card" :style="{backgroundImage: 'url(' + item.productEntity.image + ')', backgroundSize:'cover'}">
        <div style="flex:0">
          <div>{{item.productEntity.name}} (剩余{{item.amount}}次)</div>
        </div>
        <div style="flex: 1"></div>
        <div style="flex: 0">剩余有效期({{item.days}})</div>
      </div>
    </div>

    <!--<div style="width: 100%;display: flex;align-items:center;justify-content:center;padding: 0.5em 0">
      <div class="card" >
        <div style="flex:0;display: flex">
          <div style="flex: 1">换电卡</div>
          <div style="flex: 4"></div>
          <div style="flex: 1">
            <div style="height: 2em;width: 90%;background-color: white;color: #009eff;display: flex;align-items:center;justify-content:center;border-radius: 1em" @click="gotoPackageList">
              购买
            </div>
          </div>
        </div>
        <div style="flex: 1"></div>
        <div style="flex: 0">买卡换电更划算</div>
      </div>
    </div>-->

    <div style="padding: 1.5em 0">
      <div style="display: flex;align-items:center;justify-content:center;">
        <div style="flex: 1;font-size: 1.2em">优惠券</div>
        <div style="flex: 1;text-align: right;color: rgba(128,128,128,0.8)"> 去查看 ></div>
      </div>
    </div>
    <div style="padding: 1.5em 0">
      <div style="display: flex;align-items:center;justify-content:center;">
        <div style="flex: 1;font-size: 1.2em">余额</div>
        <div style="flex: 1;text-align: right;color: rgba(128,128,128,0.8)">
          <router-link to="/ops-balance">{{unlockBalance}} 元 ></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MyWallet',
    data () {
      return {
        unlockBalance: 0,
        cardList: []
      }
    },
    mounted () {
      document.title = '我的钱包'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
      }
      this.getPayAccount()
      this.getUserCardList()
    },
    methods: {
      getPayAccount () {
        this.axios.get('/api-pay/v3.1/accounts/detail').then((res) => {
          let data = res.data
          if (data) {
            this.unlockBalance = data.unlockBalance
          }
        })
          .catch(error => {
            console.log(error)
          })
      },
      getUserCardList () {
        this.axios.get('/api-order/v3.1/powerexchangecards/list', {
          params: {}
        }).then((res) => {
          console.log(res)
          this.cardList = res.data.list
          this.cardList.forEach((item) => {
            let now = new Date()
            let expiresTime = new Date(item.expiresTime)
            let days = (expiresTime.getTime() - now.getTime()) / 1000 / 60 / 60 / 24
            if (days >= 1) {
              item.days = days.toString().split('.')[0] + '天'
            } else {
              let hour = (expiresTime.getTime() - now.getTime()) / 1000 / 60 / 60
              item.days = hour.toString().split('.')[0] + '小时'
            }
          })
        })
          .catch(error => {
            console.log(error)
          })
      },
      gotoPackageList () {
        if (this.$store.state.token && this.$store.state.firm) {
          this.axios.get('/api-ebike/v3.0/ue/ue_list', {
            params: {}
          }).then((res) => {
            console.log(res)
            let list = res.data.data5
            if (list && list.length > 0) {
              this.$router.push({
                name: 'PackageList',
                params: {},
                query: {
                  token: this.$store.state.token,
                  firm: this.$store.state.firm,
                  storeId: list[0].storeId
                }
              })
            } else {
              if (this.$store.state.token && this.$store.state.firm) {
                this.$router.push({
                  name: 'UeNotFound',
                  params: {},
                  query: {
                    token: this.$store.state.token,
                    firm: this.$store.state.firm
                  }
                })
              }
            }
          })
            .catch(error => {
              console.log(error)
            })
        }
      }
    }
  }
</script>

<style scoped>
  .card {
    display: flex;
    flex-direction: column;
    width: 96%;
    height: 15vh;
    border-radius: 1em;
    padding: 1em;
    color: white;
    background: -webkit-linear-gradient(#00c4ff, #009eff); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#00c4ff, #009eff); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#00c4ff, #009eff); /* Firefox 3.6 - 15 */
    background: linear-gradient(#00c4ff, #009eff); /* 标准的语法（必须放在最后） */
    box-shadow: 2px 2px 5px rgba(136, 136, 136, 0.5);
  }
</style>
