<template>
  <div class="page-field">
    <div class="table-head-title"></div>
    <div class="page-part">
      <mt-field label="提现金额" type="number" v-model="amount">元(可提现：{{balance}})</mt-field>
    </div>
    <div class="table-head-title">提现账户</div>
    <div class="page-part">
      <mt-field label="支付宝账号" placeholder="如：138********" v-model="account"></mt-field>
      <mt-field label="真实姓名" placeholder="如：张三" v-model="realName"></mt-field>
    </div>
    <div class="table-head-title">验证码校验</div>
    <div class="page-part">
      <mt-field label="绑定手机号" readonly  v-model="bindPhone">
        <mt-button size="small" type="primary" @click="getVerifyCode">获取验证码</mt-button>
      </mt-field>
      <mt-field label="验证码"  placeholder="请输入验证码"  v-model="verifyCode"></mt-field>
    </div>
    <div class="lm-font-default lm-text-red" style="margin: 1rem">
      提现的金额将转账到此支付宝账户，为了您的财产安全请认真填写确认无误后提交。
    </div>

    <div class="h-btn-container" >
      <div @click="submit"  class="action-btn">提交</div>
    </div>
  </div>
</template>

<script>
  import {Toast, Indicator, MessageBox} from 'mint-ui'
  export default {
    name: 'user-pay-account',
    data () {
      return {
        balance: 0,
        account: null,
        realName: null,
        bindPhone: null,
        verifyCode: null,
        amount: 0
      }
    },
    methods: {
      withdraw () {
        if (!this.verifyCode) {
          Toast('请输入验证码！')
          return false
        }
        if (this.amount < 0.1) {
          Toast('最低提现金额为0.1元！')
          return false
        }
        if (this.amount > this.balance) {
          Toast('余额不足！')
          return false
        }
        Indicator.open('提交中...')
        this.axios.get('/api-user/v3.1/users/withdrawal?amount=' + this.amount + '&verifyCode=' + this.verifyCode + '&bindPhone=' + this.bindPhone).then((res) => {
          Indicator.close()
          if (res.status === 200) {
            this.$router.go(-1)
          }
        })
          .catch(error => {
            console.log(error)
            Indicator.close()
            if (error.response.data && error.response.data.error) {
              Toast(error.response.data.error.msg)
            }
          })
      },
      getUserPayAccount () {
        this.axios.get('/api-user/v3.1/userpayaccounts/user-pay-account-info').then((res) => {
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
      getUserInfo () {
        this.axios.get('/api-user/v3.1/users/info').then((res) => {
          if (res.data.roles) {
            let isUser = false
            res.data.roles.forEach((e) => {
              if (e.name === 'USER') {
                isUser = true
              }
            })
            if (isUser) {
              this.bindPhone = res.data.phoneNumber
            } else {
              this.axios.get('/api-user/v3.1/ebikestores/' + res.data.storeId).then((res) => {
                console.log(res)
                if (res.data) {
                  this.bindPhone = res.data.contact
                }
              }).catch(error => {
                console.log(error)
              })
            }
          }
          console.log(res)
        }).catch(error => {
          console.log(error)
        })
      },
      submit () {
        MessageBox.confirm('确定提交提现?').then(action => {
          this.postUserPayAccount()
        })
      },
      getVerifyCode () {
        this.axios.get('/api-user/v3.1/codes/sms/verify-code?mobile=' + this.bindPhone).then((res) => {
          Toast('获取成功！')
        }).catch(error => {
          console.log(error)
          if (error.response.data && error.response.data.error) {
            Toast(error.response.data.error.msg)
          }
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
        this.axios.post('/api-user/v3.1/userpayaccounts/add',
          {
            'account': this.account,
            'realName': this.realName
          }
        ).then((res) => {
          console.log(res)
          Indicator.close()
          if (res.status === 201) {
            this.withdraw()
          }
        })
          .catch(error => {
            Indicator.close()
            console.log(error)
            if (error.response.data && error.response.data.error) {
              Toast(error.response.data.error.msg)
            }
          })
      }
    },
    mounted () {
      document.title = '提现'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
        this.balance = Number(this.$route.query.balance)
      }

      this.getUserPayAccount()
      this.getUserInfo()
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
