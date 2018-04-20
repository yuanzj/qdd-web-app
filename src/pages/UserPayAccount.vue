<template>
  <div class="page-field">

    <div class="table-head-title">退还账户</div>
    <div class="page-part">
      <mt-field label="支付宝账号" placeholder="如：138********" v-model="account"></mt-field>
      <mt-field label="真实姓名" placeholder="如：张三" v-model="realName"></mt-field>
    </div>
    <div class="lm-font-default lm-text-red" style="margin: 1rem">
      此账户将用于收取电池退租后退还的押金，为了您的财产安全请认真填写确认无误后提交。
    </div>

    <div class="h-btn-container" >
      <div @click="postUserPayAccount"  class="action-btn">提交</div>
    </div>
  </div>
</template>

<script>
  import {Toast, Indicator} from 'mint-ui'
  export default {
    name: 'user-pay-account',
    data () {
      return {
        userId: null,
        account: null,
        realName: null,
        ccuSn: null,
        orderId: null,
        storeName: null
      }
    },
    methods: {
      getUserPayAccount () {
        this.axios.get('/api-user/v3.1/userpayaccounts/detail',
          {
            params: {
              userId: this.userId
            }
          }
        ).then((res) => {
          let data = res.data
          if (data) {
            this.account = data.account
            this.realName = data.realName
          }
        })
          .catch(error => {
            console.log(error)
          })
      },
      postUserPayAccount () {
        if (!this.account) {
          Toast('请输入支付宝账号！')
          return false
        }
        if (!this.realName) {
          Toast('请输入真实姓名！')
          return false
        }
        Indicator.open('提交中...')
        this.axios.post('/api-user/v3.1/userpayaccounts/',
          {
            'account': this.account,
            'realName': this.realName,
            'userId': this.userId
          }
        ).then((res) => {
          console.log(res)
          Indicator.close()
          if (res.status === 201) {
            this.$router.push({
              name: 'OrderOpsQRCode',
              query: {
                token: this.$store.state.token,
                firm: this.$store.state.firm,
                ccuSn: this.ccuSn,
                orderId: this.orderId,
                title: '退租二维码',
                storeName: this.storeName,
                type: 0
              }
            })
          }
        })
          .catch(error => {
            Indicator.close()
            console.log(error)
          })
      }
    },
    mounted () {
      document.title = '押金退还账户设置'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
        this.userId = this.$route.query.userId
        this.ccuSn = this.$route.query.ccuSn
        this.orderId = this.$route.query.orderId
        this.storeName = this.$route.query.storeName
      }

      this.getUserPayAccount()
    }
  }
</script>

<style scoped>

  .table-head-title {
    margin-left: 1rem;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
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
