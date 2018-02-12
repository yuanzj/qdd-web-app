<template>
    <div class="p-container" @click="showDetail">
      <div class="p-head">
        <img class="p-image" :src="image"/>
        <span class="p-title" >{{ title }}</span>
      </div>
      <div class="p-content">

        <div class="p-price" >
          最高续航 <span style="font-size: 1.25rem;color: #E64E42;font-weight: bold">80</span> km
        </div>
        <div style="-webkit-flex:1;flex: 1"></div>
        <div class="p-price" style="text-align: right">
        <span style="font-size: 1.25rem;color: #E64E42;font-weight: bold">{{ price }}</span> 元/日起
      </div>
      </div>
      <div class="p-desc">{{ desc }}</div>
    </div>
</template>

<script>
  export default {
    name: 'product-item',
    props: {
      id: {
        type: Number
      },
      image: {
        type: String,
        default: '../../static/images/p.png'
      },
      imageLarge: {
        type: String
      },
      title: {
        type: String
      },
      desc: {
        type: String
      },
      price: {
        type: Number
      },
      model: {
        type: String
      },
      outUrl: {
        type: String
      }
    },
    data () {
      return {}
    },
    methods: {
      showDetail () {
        if (this.$store.state.enterModel === 'newPage') {
          /* eslint-disable no-undef */
          if (window.hasOwnProperty('nativeObj')) {
            nativeObj.startNewPage(this.id)
          } else {
            window.webkit.messageHandlers.startNewPage.postMessage(this.id)
          }
        } else {
          if (this.$store.state.token && this.$store.state.firm) {
            if (this.$store.state.ccuSn) {
              if (this.$store.state.orderId) {
                this.$router.push({
                  name: 'ProductDetail',
                  params: {id: this.id},
                  query: {
                    token: this.$store.state.token,
                    firm: this.$store.state.firm,
                    ccuSn: this.$store.state.ccuSn,
                    orderId: this.$store.state.orderId
                  }
                })
              } else {
                this.$router.push({
                  name: 'ProductDetail',
                  params: {id: this.id},
                  query: {token: this.$store.state.token, firm: this.$store.state.firm, ccuSn: this.$store.state.ccuSn}
                })
              }
            } else {
              this.$router.push({name: 'ProductDetail', params: { id: this.id }, query: {token: this.$store.state.token, firm: this.$store.state.firm}})
            }
          } else {
            if (this.$store.state.orderId) {
              this.$router.push({name: 'ProductDetail', params: { id: this.id }, query: {orderId: this.$store.state.orderId}})
            } else {
              this.$router.push({name: 'ProductDetail', params: { id: this.id }})
            }
          }
        }
      }
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
    margin-left: 1rem;
    padding-right: 2rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .p-price {
    text-align: left;
    color: #212121;
    font-size: 0.875rem;
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
