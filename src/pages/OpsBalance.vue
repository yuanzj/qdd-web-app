<template>

  <div class="container">
    <div class="completed-box">
      <div class="completed">
        <img src="../assets/ic-money.png"  />
        <div class="lm-margin-t lm-font-default lm-text-text"><span style="font-size: 2rem">{{ unlockBalance }}</span> 元</div>
      </div>
    </div>

    <div v-if="showWithdraw" class="h-btn-container" >
      <div @click="withdraw"  class="action-btn">提现</div>
    </div>
  </div>

</template>

<script>
  import {Indicator, Toast} from 'mint-ui'
  export default {
    name: 'ops-balance',
    data () {
      return {
        role: null,
        showWithdraw: false,
        loginUserId: null,
        loginUserStoreId: null,
        storeId: null,
        unlockBalance: null
      }
    },
    methods: {
      loadStoreInfo () {
        this.axios.get('/api-user/v3.1/ebikestores/' + this.loginUserStoreId).then((res) => {
          let data = res.data
          if (data) {
            if (data.category === 2 && data.parentId === Number(this.storeId)) {
              this.showWithdraw = true
              this.getPayAccount(this.loginUserId)
            } else {
              this.showWithdraw = false
              this.getUserInfo()
            }
          } else {
            Indicator.close()
          }
        })
          .catch(error => {
            Indicator.close()
            if (error.data.error) {
              Toast(error.data.error.msg)
            }
          })
      },
      getCurrentUserInfo () {
        Indicator.open('加载中...')
        this.axios.get('/api-user/v3.1/users/info').then((res) => {
          console.log(res)
          let data = res.data
          if (data) {
            this.loginUserId = data.id
            this.loginUserStoreId = data.storeId
            for (let i = 0; i < data.roles.length; i++) {
              let item = data.roles[i]
              if (item.name === 'ADMIN') {
                this.role = 'ADMIN'
              } else if (item.name === 'AGENT') {
                if (this.role !== 'ADMIN') {
                  this.role = 'AGENT'
                }
              } else if (item.name === 'DEALER') {
                if (this.role !== 'ADMIN' && this.role !== 'AGENT') {
                  this.role = 'DEALER'
                }
              } else if (item.name === 'STATION') {
                if (this.role !== 'ADMIN' && this.role !== 'AGENT' && this.role !== 'DEALER') {
                  this.role = 'STATION'
                }
              } else {
                if (this.role !== 'ADMIN' && this.role !== 'AGENT' && this.role !== 'DEALER' && this.role !== 'STATION') {
                  this.role = 'USER'
                }
              }
            }
            if ((data.storeId != null && Number(data.storeId) === Number(this.storeId)) || this.role === 'AGENT') {
              this.showWithdraw = true
              this.getPayAccount(this.loginUserId)
            } else {
              if (this.loginUserStoreId === null) {
                this.showWithdraw = false
                this.getUserInfo()
              } else {
                this.loadStoreInfo()
              }
            }
          } else {
            Indicator.close()
          }
        })
          .catch(error => {
            Indicator.close()
            if (error.data.error) {
              Toast(error.data.error.msg)
            }
          })
      },
      getUserInfo () {
        this.axios.get('/api-user/v3.1/users/manager-user-info', {
          params: {
            storeId: this.storeId
          }
        }).then((res) => {
          console.log(res)
          let data = res.data
          if (data) {
            this.getPayAccount(data.id)
          } else {
            Indicator.close()
          }
        })
          .catch(error => {
            if (error.data.error) {
              Toast(error.data.error.msg)
            }
          })
      },
      getPayAccount (userId) {
        this.axios.get('/api-pay/v3.1/accounts/info', {
          params: {
            userId: userId
          }
        }).then((res) => {
          Indicator.close()
          let data = res.data
          if (data) {
            this.unlockBalance = data.unlockBalance
          }
        })
          .catch(error => {
            Indicator.close()
            if (error.data.error) {
              Toast(error.data.error.msg)
            }
          })
      },
      withdraw () {
        this.$router.push({
          name: 'EnterprisePayAccount',
          query: {
            token: this.$store.state.token,
            firm: this.$store.state.firm,
            balance: this.unlockBalance
          }
        })
      }
    },
    mounted () {
      document.title = '余额'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
        this.storeId = this.$route.query.storeId
      }
      this.getCurrentUserInfo()
    }
  }
</script>

<style scoped>
  .container {
    height: 100%;
    position: relative;
  }

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
    width: 80%;
  }
  .completed > img{
    width: 5rem;
    height: 5rem;
    vertical-align: bottom;
  }

  .h-btn-container {
    width: 100%;
    height: 3rem;
    display: flex;
    position: fixed;
    box-shadow: 0 -1px 15px #888888;
    background-color: #fff;
    bottom: 0;
    align-items: center;
    justify-content: space-between;
    line-height: 3rem;
  }

  .action-btn{
    height: 3rem;
    flex: 1;
    font-size: 0.875rem;
    text-align: center;
    color: #3B9AD9;
    font-weight: bold;
  }
</style>
