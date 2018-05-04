<template>
  <div class="container">
    <div class="completed-box">
      <div class="completed">
        <img src="../assets/ic-ops-logo.png"  />
        <div class="lm-margin-t lm-font-default lm-text-text">V1.0.0(build 20180503)</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ops-about',
    mounted () {
      document.title = '关于'
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
</style>
