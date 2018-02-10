<template>
  <div class="container">
    <div class="completed-box">
      <div class="completed">
        <img src="../assets/icon-pay-complete.png"  />
        <div class="lm-margin-t lm-font-default lm-text-text">支付完成</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'pay-complete',
    mounted () {
      document.title = '支付结果'
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
