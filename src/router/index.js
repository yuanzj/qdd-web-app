import Vue from 'vue'
import Router from 'vue-router'

// 产品列表
import ProductList from '@/pages/ProductList'
// 设备列表
import DeviceList from '@/pages/DeviceList'
// 产品详情
import ProductDetail from '@/pages/ProductDetail'
// 支付完成
import PayComplete from '@/pages/PayComplete'
// 订单详情
import OrderDetail from '@/pages/OrderDetail'
// 补缴欠款
import PayArrearage from '@/pages/PayArrearage'
// 优惠券列表
import CouponList from '@/pages/CouponList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/devices',
      name: 'DeviceList',
      component: DeviceList
    },
    {
      path: '/products',
      name: 'ProductList',
      component: ProductList
    },
    {
      path: '/products/:id',
      name: 'ProductDetail',
      component: ProductDetail
    },
    {
      path: '/pay-complete',
      name: 'PayComplete',
      component: PayComplete
    },
    {
      path: '/orders/:orderId',
      name: 'OrderDetail',
      component: OrderDetail
    },
    {
      path: '/pay-arrearage/:orderId',
      name: 'PayArrearage',
      component: PayArrearage
    },
    {
      path: '/coupons',
      name: 'CouponList',
      component: CouponList
    }
  ]
})
