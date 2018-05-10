<template>

  <div class="container">
    <div class="completed-box">
      <div class="completed">
        <img src="../assets/ic-money.png"  />
        <div class="lm-margin-t lm-font-default lm-text-text">账户余额</div>
        <div class="lm-margin-t lm-font-default lm-text-text"><span class="lm-font-head">{{ unlockBalance }}</span> 元</div>
      </div>
    </div>

    <div class="h-btn-container" >
      <div @click="withdraw"  class="action-btn">提现</div>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'balance',
    data () {
      return {
        unlockBalance: null
      }
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
      withdraw () {
        this.$router.push({
          name: 'UserPayAccount',
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
      }

      this.getPayAccount()
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
    width:3.5rem;
    height: 3.5rem;
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
