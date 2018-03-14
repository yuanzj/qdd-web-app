<template>

  <div class="p-container">

    <div class="p-content" >
      <span class="lm-text-text lm-font-second" >{{ title }}</span>
      <div style="flex: 1"></div>
      <span class="lm-font-second">单次租赁限使用一张</span>
    </div>

    <div style="width:100%;height:1px;margin:1rem 0 0 0 ;autopadding:0px;background-color:#E0E0E0;overflow:hidden"></div>

    <div  class="p-content p-price" >
      <span>抵扣现金</span>
      <div style="flex: 1"></div>
      <span style="color: #E64E42;"><span style="font-size: 1.5rem;font-weight: bold">{{ amount }}</span> 元</span>
    </div>

    <div style="color: #E64E42;margin-top: 1rem;font-size: 0.875rem">有效期至 {{ endTime.substr(0,10) }}</div>
    <div class="lm-text-second lm-font-second" style="margin-top: 0.5rem">{{ desc }}</div>
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

  .p-container {
    display: -webkit-flex;
    display: flex;
    background: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.20), 0 6px 20px 0 rgba(0, 0, 0, 0.10);
    border-radius: 4px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    padding: 1rem;
  }

  .p-head {
    height: 4.5rem;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
    padding: 1rem;
  }

  .p-image {
    width: 2.5rem;
    height: 2.5rem;
  }

  .p-title {
    margin-left: 1rem;
    color: #212121;
    font-size: 1rem;
    flex-grow: 1;
  }

  .p-content {
    width: 100%;
    -webkit-flex: 1;
    flex: 1;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
  }

  .p-price {
    text-align: left;
    color: #212121;
    font-size: 1rem;
    margin-top: 1rem;
  }

  .p-desc {
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    max-height: 3.75rem;
    font-size: 0.875rem;
    color: #757575;
    margin: 1rem;
  }

</style>
