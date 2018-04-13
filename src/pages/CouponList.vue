<template>
  <div class="page-navbar">
    <mt-navbar class="page-part" style="height: 48px" v-model="selected">
      <mt-tab-item id="1">未使用</mt-tab-item>
      <mt-tab-item id="2">已使用</mt-tab-item>
      <mt-tab-item id="3">已过期</mt-tab-item>
    </mt-navbar>
    <mt-loadmore :top-method="loadProductList" ref="loadmore" :style="{ 'min-height': wrapperHeight + 'px' }">

      <mt-tab-container  v-model="selected" >

        <mt-tab-container-item id="1">

            <div v-for="(item,index)  in productList">

              <coupon-item style="margin: 1rem"  :key="item.id" :id="item.id" :title="item.name" :desc="item.desc" :amount="item.amount" :endTime="item.endTime"></coupon-item>

            </div>

        </mt-tab-container-item>

        <mt-tab-container-item id="2">

            <div v-for="(item,index)  in productList">

              <coupon-item style="margin: 1rem"  :key="item.id" :id="item.id" :title="item.name" :desc="item.desc" :amount="item.amount" :endTime="item.endTime"></coupon-item>

            </div>

        </mt-tab-container-item>

        <mt-tab-container-item id="3">

            <div v-for="(item,index)  in productList">

              <coupon-item style="margin: 1rem"  :key="item.id" :id="item.id" :title="item.name" :desc="item.desc" :amount="item.amount" :endTime="item.endTime"></coupon-item>

            </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </mt-loadmore>

  </div>
</template>

<script>
  import CouponItem from '@/components/CouponItem'

  export default {
    name: 'coupon-list',
    components: {
      CouponItem
    },
    data () {
      return {
        wrapperHeight: 0,
        selected: '1',
        productList: []
      }
    },
    watch: {
      selected (val, oldval) {
        this.productList = []
        this.loadProductList()
      }
    },
    methods: {
      loadProductList () {
        this.axios.get('/api-order/v3.1/coupons',
          {
            params: {
              page: 1,
              limit: 999,
              sidx: 'id',
              order: 'asc',
              status: this.selected
            }
          }
        ).then((res) => {
          this.$refs.loadmore.onTopLoaded()
          if (res.data && res.data.list.length > 0) {
            this.productList = res.data.list.map(function (item) {
              if (item.couponRuleEntity) {
                item.desc = item.couponRuleEntity.desc
              }
              return item
            })
          } else {
            this.productList = []
          }
        })
          .catch(error => {
            this.$refs.loadmore.onTopLoaded()
            console.log(error)
          })
      }
    },
    mounted () {
      this.wrapperHeight = document.documentElement.clientHeight - 48
      console.log(this.wrapperHeight)
      document.title = '优惠券'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
      }

      this.loadProductList()
    }
  }
</script>

<style scoped>

</style>
