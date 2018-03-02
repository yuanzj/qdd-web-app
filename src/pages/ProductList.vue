<template>
  <mt-loadmore :top-method="loadProductList" ref="loadmore" :style="{ 'min-height': wrapperHeight + 'px' }">
    <div v-for="(item,index)  in productList">

      <product-item style="margin: 1rem"  :key="item.id" :categoryId="item.categoryId" :id="item.id" :image="item.image" :imageLarge="item.imageLarge" :title="item.name"
                    :desc="item.desc" :price="item.price" :model="item.model" :remark="item.remark"></product-item>

    </div>
  </mt-loadmore>
</template>

<script>
  import ProductItem from '@/components/ProductItem'

  export default {
    name: 'product-list',
    components: {
      ProductItem
    },
    data () {
      return {
        wrapperHeight: 0,
        productList: []
      }
    },
    methods: {
      loadProductList () {
        this.axios.get('/api-order/v3.1/products',
          {
            params: {
              page: 1,
              limit: 20,
              sidx: 'id',
              order: 'asc',
              categoryIds: '1,3'
            }
          }
        ).then((res) => {
          this.$refs.loadmore.onTopLoaded()
          this.productList = res.data.list
        })
          .catch(error => {
            this.$refs.loadmore.onTopLoaded()
            console.log(error)
          })
      }
    },
    mounted () {
      this.wrapperHeight = document.documentElement.clientHeight
      document.title = '产品列表'
      if (this.$route.query) {
        this.$store.commit('setToken', this.$route.query.token)
        this.$store.commit('setFirm', this.$route.query.firm)
        this.$store.commit('setEnterModel', this.$route.query.model)
        this.$store.commit('setCcuSn', this.$route.query.ccuSn)
        this.$store.commit('setOrderId', this.$route.query.orderId)
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
