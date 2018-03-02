<template>
  <div class="p-content">

    <div class="lm-font-second lm-text-red">
      <div>抵扣现金</div>
      <div style="height: 0.5rem"></div>
      <span style="font-size: 1.25rem;color: #E64E42;font-weight: bold">{{ amount }}</span> 元
    </div>

    <div style="-webkit-flex:1;flex: 1"></div>

    <div style="text-align: right">
      <div class="lm-font-default lm-text-text">{{ title }}</div>
      <div style="height: 1rem"></div>
      <div class="lm-font-second lm-text-second">有效期至 {{ endTime }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'coupon-item',
    props: {
      status: {
        type: Number
      },
      id: {
        type: Number
      },
      title: {
        type: String
      },
      desc: {
        type: String
      },
      amount: {
        type: Number
      },
      endTime: {
        type: String
      }
    },
    data () {
      return {}
    },
    methods: {
    }
  }
</script>

<style scoped>

  .p-content {
    background: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.20), 0 6px 20px 0 rgba(0, 0, 0, 0.10);
    border-radius: 4px;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
    padding: 1rem;
  }

</style>
