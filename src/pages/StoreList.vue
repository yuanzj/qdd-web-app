<template>
  <mt-loadmore :top-method="loadProductList" ref="loadmore" :style="{ 'min-height': wrapperHeight + 'px' }">
    <div v-for="(item,index)  in productList">

      <store-item style="margin: 1rem"  :key="item.id" :city="item.city" :area="item.county" :distance="item.distance" :id="item.id" :title="item.name"
                    :desc="item.desc" :code="item.code" :tel="item.contact" :address="item.address"></store-item>

    </div>
  </mt-loadmore>
</template>

<script>
  import StoreItem from '@/components/StoreItem'
  import {Toast} from 'mint-ui'
  export default {
    name: 'product-list',
    components: {
      StoreItem
    },
    data () {
      return {
        wrapperHeight: 0,
        productList: [],
        city: null,
        userLon: null,
        userLat: null
      }
    },
    methods: {
      loadProductList () {
        this.axios.get('/api-user/v3.1/ebikestores/list',
          {
            params: {
              page: 1,
              limit: 999,
              sidx: 'id',
              order: 'asc',
              types: '6,40',
              city: this.city,
              userLon: this.userLon,
              userLat: this.userLat
            }
          }
        ).then((res) => {
          this.$refs.loadmore.onTopLoaded()
          this.productList = res.data.list
          if (this.productList.length === 0) {
            Toast('当前城市暂无网点！')
          }
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
        this.axios.defaults.headers.common['firm'] = this.$route.query.firm
        if (this.$route.query.token) {
          this.axios.defaults.headers.common['Authorization'] = this.$route.query.token
        }
        if (this.$route.query.city) {
          this.city = this.$route.query.city
        }
        if (this.$route.query.userLon) {
          this.userLon = this.$route.query.userLon
        }
        if (this.$route.query.userLat) {
          this.userLat = this.$route.query.userLat
        }
      }

      this.loadProductList()
    }
  }
</script>

<style scoped>

</style>
