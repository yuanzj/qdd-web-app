<template>
    <div class="p-container" @click="showDetail">
      <div class="p-content">
        <div class="p-title" style="flex: 1;-webkit-flex: 1" >{{ title }}</div>
        <div class="p-desc-right" style="text-align: right">
          {{ formatDistance }}
        </div>
      </div>

      <div class="p-desc" >网点编号：{{ code }}</div>
      <div class="p-desc" >联系方式：{{ tel }}</div>
      <div class="p-desc" >{{ city }}{{ area }}{{address}}</div>

    </div>
</template>

<script>
  export default {
    name: 'store-item',
    props: {
      distance: {
        type: Number
      },
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
      city: {
        type: String
      },
      area: {
        type: String
      },
      title: {
        type: String
      },
      desc: {
        type: String
      },
      code: {
        type: String
      },
      tel: {
        type: String
      },
      outUrl: {
        type: String
      },
      address: {
        type: String
      }
    },
    data () {
      return {}
    },
    computed: {
      formatDistance: function () {
        if (this.distance === 0) {
          return ''
        } else if (this.distance <= 1000) {
          return this.distance.toFixed(0) + 'm'
        } else {
          return (this.distance / 1000).toFixed(2) + 'km'
        }
      }
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
                  name: 'StoreDetail',
                  params: {id: this.id},
                  query: {
                    token: this.$store.state.token,
                    firm: this.$store.state.firm,
                    ccuSn: this.$store.state.ccuSn,
                    orderId: this.$store.state.orderId,
                    pay2: true
                  }
                })
              } else {
                this.$router.push({
                  name: 'StoreDetail',
                  params: {id: this.id},
                  query: {token: this.$store.state.token, firm: this.$store.state.firm, ccuSn: this.$store.state.ccuSn, pay2: true}
                })
              }
            } else {
              this.$router.push({name: 'StoreDetail', params: { id: this.id }, query: {token: this.$store.state.token, firm: this.$store.state.firm, pay2: true}})
            }
          } else {
            if (this.$store.state.orderId) {
              this.$router.push({name: 'StoreDetail', params: { id: this.id }, query: {orderId: this.$store.state.orderId, pay2: true}})
            } else {
              this.$router.push({name: 'StoreDetail', params: { id: this.id }, query: {pay2: true}})
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
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
    padding: 1rem 1rem 0 1rem;
  }

  .p-image {
    width: 2.5rem;
    height: 2.5rem;
  }

  .p-title {
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
    padding: 1rem;
  }

  .p-desc {
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    font-size: 0.875rem;
    color: #757575;
    margin: 0 1rem 1rem 1rem;
  }

  .p-desc-right {
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    font-size: 0.875rem;
    color: #757575;
  }
</style>
