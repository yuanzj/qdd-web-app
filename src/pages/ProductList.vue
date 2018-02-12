<template>
  <mt-loadmore :top-method="loadProductList" ref="loadmore">
    <div style="min-height: 100vh">
      <div v-for="(item,index)  in productList" >

        <product-item style="margin: 1rem"  :key="item.id" :id="item.id" :image="item.image" :imageLarge="item.imageLarge" :title="item.name"
                      :desc="item.desc" :price="item.price" :model="item.model" :outUrl="item.outUrl"></product-item>

      </div>
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
              order: 'asc'
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
