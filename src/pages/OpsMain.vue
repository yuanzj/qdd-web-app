<template>
  <div class="container lm-font-default lm-text-text">

    <div class="h-btn-container"><mt-button type="default" class="action-btn" @click="finish">设备退租</mt-button></div>

    <div class="h-btn-container"><mt-button type="default" class="action-btn" @click="replace">设备更换</mt-button></div>

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
    height: 100vh;
    width: 100vw;
  }

  .h-btn-container {
    height: 3rem;
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
  }

  .action-btn{
    height: 3rem;
    width: 100%;

  }
</style>
