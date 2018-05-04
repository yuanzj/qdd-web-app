<template>

  <div class="page-field">
    <div style="margin-top: 2rem"></div>
    <div class="page-cell">
      <mt-cell title="用户名" :value="userName"></mt-cell>
    </div>

    <div style="margin-top: 2rem"></div>
    <div class="page-part">
      <mt-field label="新密码" placeholder="请输入新密码" v-model="password"></mt-field>
      <mt-field label="确认新密码" placeholder="请输入确认新密码" v-model="ensurePsw"></mt-field>
    </div>

    <div class="h-container">
      <!--<div style="flex: 1">-->
      <!--<mt-button type="default" @click="back" style="width: 100%">上一步</mt-button>-->
      <!--</div>-->
      <!--<div style="width: 1rem"></div>-->
      <div style="flex: 1">
        <mt-button type="primary" @click="btnAction" style="width: 100%">提交</mt-button>
      </div>
    </div>
  </div>

</template>

<script>
  import {Indicator, Toast} from 'mint-ui'
  export default {
    name: 'ops-user-psw',
    data () {
      return {
        userName: '',
        password: null,
        ensurePsw: null
      }
    },
    methods: {
      btnAction () {
        if (!this.password) {
          Toast('请输入新密码')
          return false
        }
        if (!this.ensurePsw) {
          Toast('请输入确认新密码')
          return false
        }
        if (this.password !== this.ensurePsw) {
          Toast('两次输入的密码不一致')
          return false
        }
        Indicator.open('提交中...')
        this.axios.put('/api-user/v3.1/users/update?password=' + this.password).then((res) => {
          Indicator.close()
          Toast('修改成功')
          this.back()
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
      document.title = '密码设置'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
        this.userName = this.$route.query.userName
      }
    }
  }
</script>

<style scoped>
  .h-container {
    width: 100%;
    height: 3rem;
    padding: 1rem;
    position: fixed;
    bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 3rem;
  }
  .content-container {
    background-color: #ffffff;

    padding-bottom: 1rem;
    display: flex;
    align-items: start;
    justify-content: space-between;
  }
</style>
