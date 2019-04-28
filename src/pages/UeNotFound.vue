<template>
<div style="display: flex;
            justify-content: center;
            align-items: center;height: 80vh;
padding: 20%;text-align: center">
  <div>
    <div style="padding: 1em">
      <img src="/static/images/noUe.svg"/>
    </div>
    <div style="height: 2em">尚未租赁任何设备</div>
    <div style="height: 2em">无法购买套餐</div>
    <div style="height: 2em">赶快去附近的站点租赁一块设备吧~</div>
  </div>
</div>
</template>

<script>
    export default {
      name: 'UeNotFound',
      mounted () {
        document.title = '暂无设备'
      }
    }
</script>

<style scoped>

</style>
