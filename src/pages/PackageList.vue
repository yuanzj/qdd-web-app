<template>
<div>
      <div style="background-color: white;margin-top: 2px;padding: 1em;height: 100vh">
        <div v-for="item in cardList" style="padding: 0.5em;">
          <div class="card" @click="currentCard = item" :style="{backgroundImage: 'url(' + item.image + ')', backgroundSize:'cover'}">
            <div style="display: flex;flex-direction: column;height: 100%">
              <div style="flex: 0;font-size: 1.4em">{{item.name}} (剩余{{item.count}}次)</div>
              <div style="flex: 1"></div>
              <div style="flex: 0;">有效期{{item.days}}天</div>
            </div>
          </div>
        </div>
      </div>
  <div style="height: 4em;display: flex;position: fixed;bottom: 0;width: 100vw;border-top: solid lightgray 1px">
    <div style="flex: 2;padding: 0.5em 1.5em;background-color: white"><span style="font-size: 2em">{{currentCard.price}}</span>元</div>
    <div style="flex: 1;display: flex;align-items:center;justify-content:center">
      <!--<button @click="reChargeOrder" style="width: 100%;height: 100%;background-color: #009eff;color: white;font-size: 1.5em">购买</button>-->
      <mt-button type="primary" style="width: 100%;height: 100%" @click="reChargeOrder">购买</mt-button>
    </div>
  </div>
  <div class="hide" v-html="alipay"></div>
</div>
</template>

<script>
import {Indicator, Toast} from 'mint-ui'
export default {
  name: 'PackageList',
  data () {
    return {
      alipay: '',
      isActive: 0,
      selected: '0',
      cardList: [],
      currentCard: {
        price: 0
      }
    }
  },
  mounted () {
    document.title = '套餐充值'
    if (this.$route.query) {
      this.$store.commit('setToken', this.$route.query.token)
      this.$store.commit('setFirm', this.$route.query.firm)
      this.axios.defaults.headers.common['firm'] = this.$route.query.firm
      if (this.$route.query.token) {
        this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
      }
    }

    this.axios.get('/api-order/v3.1/products/list', {
      params: {
        categoryId: 2,
        storeId: this.$route.query.storeId
      }
    }).then((res) => {
      console.log(res)
      if (res.data) {
        this.cardList = res.data.list
      }
    })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    reChargeOrder () {
      Indicator.open('提交中...')
      this.axios.post('/api-order/v3.1/orders/card', {
        productId: this.currentCard.id,
        price: this.currentCard.price
      })
        .then((res) => {
          console.log(res)
          Indicator.close()
          if (res.data) {
            if (res.data.error) {
              Toast(res.data.error.msg)
            } else {
              if (res.data === 'success') {
                this.$router.push({
                  name: 'PayComplete'
                })
              } else if (res.data.indexOf('_alipaysubmit_') !== -1) {
                this.alipay = res.data
                setTimeout(function () {
                  document.forms['_alipaysubmit_'].submit()
                }, 0)
              } else {
                location.href = res.data
              }
            }
          } else {
            Toast(res.data.msg)
          }
        }).catch(error => {
          Indicator.close()
          if (error.response.data && error.response.data.error) {
            Toast(error.response.data.error.msg)
          }
        })
    }
  }
}
</script>

<style scoped>
  .card{
    width: 100%;
    height: 15vh;
    border-radius: 1em;
    padding: 1em 1.5em;
    color: white;
    background: -webkit-linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)); /* Firefox 3.6 - 15 */
    background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)); /* 标准的语法（必须放在最后） */
    box-shadow: 2px 2px 5px rgba(136, 136, 136, 0.2);
  }
</style>
