import Vue from 'vue'
import Router from 'vue-router'

// 网点列表
// import StoreList from '@/pages/StoreList'
const StoreList = () => import('@/pages/StoreList')
// 网点详情
// import StoreDetail from '@/pages/StoreDetail'
const StoreDetail = () => import('@/pages/StoreDetail')
// 网点详情
// import StoreDetailPro from '@/pages/StoreDetailPro'
const StoreDetailPro = () => import('@/pages/StoreDetailPro')
// 电柜详情
// import CabinetDetail from '@/pages/CabinetDetail'
const CabinetDetail = () => import('@/pages/CabinetDetail')
// 产品列表
// import ProductList from '@/pages/ProductList'
const ProductList = () => import('@/pages/ProductList')
// 设备列表
// import DeviceList from '@/pages/DeviceList'
const DeviceList = () => import('@/pages/DeviceList')
// 产品详情
// import ProductDetail from '@/pages/ProductDetail'
const ProductDetail = () => import('@/pages/ProductDetail')
// 支付完成
// import PayComplete from '@/pages/PayComplete'
const PayComplete = () => import('@/pages/PayComplete')
// 订单详情
// import OrderDetail from '@/pages/OrderDetail'
const OrderDetail = () => import('@/pages/OrderDetail')
// 补缴欠款
// import PayArrearage from '@/pages/PayArrearage'
const PayArrearage = () => import('@/pages/PayArrearage')
// 优惠券列表
// import CouponList from '@/pages/CouponList'
const CouponList = () => import('@/pages/CouponList')
// 租赁电池入口
// import RentBattery from '@/pages/RentBattery'
const RentBattery = () => import('@/pages/RentBattery')
// 订单操作
// import OrderOpsQRCode from '@/pages/OrderOpsQRCode'
const OrderOpsQRCode = () => import('@/pages/OrderOpsQRCode')
// 退款账户设置
// import UserPayAccount from '@/pages/UserPayAccount'
const UserPayAccount = () => import('@/pages/UserPayAccount')
// 余额
// import Balance from '@/pages/Balance'
const Balance = () => import('@/pages/Balance')
// 二维码名片
// import MyQRCode from '@/pages/MyQRCode'
const MyQRCode = () => import('@/pages/MyQRCode')
// 升级押金
// import UpgradeDeposit from '@/pages/UpgradeDeposit'
const UpgradeDeposit = () => import('@/pages/UpgradeDeposit')
// 运维首页
// import OpsMain from '@/pages/OpsMain'
const OpsMain = () => import('@/pages/OpsMain')
// 运维订单处理页面
// import OpsOrderOps from '@/pages/OpsOrderOps'
const OpsOrderOps = () => import('@/pages/OpsOrderOps')
// 运维订单处理步骤页面
// import OpsOrderOpsStep from '@/pages/OpsOrderOpsStep'
const OpsOrderOpsStep = () => import('@/pages/OpsOrderOpsStep')
// 电池管理-统计
// import BatteryStatistics from '@/pages/BatteryStatistics'
const BatteryStatistics = () => import('@/pages/BatteryStatistics')
// 电池管理-设备列表查询
// import Equipmentlist from '@/pages/Equipmentlist'
const Equipmentlist = () => import('@/pages/Equipmentlist')
// 电池管理-订货
// import OrderBattery from '@/pages/OrderBattery'
const OrderBattery = () => import('@/pages/OrderBattery')
// 电池管理-设备详情页面
// import EquipmentDetail from '@/pages/EquipmentDetail'
const EquipmentDetail = () => import('@/pages/EquipmentDetail')
// 电池管理-分配
// import BatteryDistribution from '@/pages/BatteryDistribution'
const BatteryDistribution = () => import('@/pages/BatteryDistribution')
// 电池管理-在租查询
// import RentedList from '@/pages/RentedList'
const RentedList = () => import('@/pages/RentedList')
// 电池管理-待租查询
// import UnrentedList from '@/pages/UnrentedList'
const UnrentedList = () => import('@/pages/UnrentedList')
// 电池管理-逾期列表
// import OverdueOrderList from '@/pages/OverdueOrderList'
const OverdueOrderList = () => import('@/pages/OverdueOrderList')
// 电池管理-欠压列表
// import UndervoltageList from '@/pages/UndervoltageList'
const UndervoltageList = () => import('@/pages/UndervoltageList')
// 电池管理-离线列表
// import OfflineList from '@/pages/OfflineList'
const OfflineList = () => import('@/pages/OfflineList')
// 电池管理-售后列表
// import RepairList from '@/pages/RepairList'
const RepairList = () => import('@/pages/RepairList')
// 电池管理-租前充电
// import RunModelSwitch from '@/pages/RunModelSwitch'
const RunModelSwitch = () => import('@/pages/RunModelSwitch')
// 财务管理-统计
// import IncomeStatistics from '@/pages/IncomeStatistics'
const IncomeStatistics = () => import('@/pages/IncomeStatistics')
// 财务管理-七天收益列表
// import Incomelist from '@/pages/IncomeList'
const Incomelist = () => import('@/pages/IncomeList')
// 财务管理-订单查询
// import PayOrderList from '@/pages/PayOrderList'
const PayOrderList = () => import('@/pages/PayOrderList')
// 财务管理-账户余额
// import OpsBalance from '@/pages/OpsBalance'
const OpsBalance = () => import('@/pages/OpsBalance')
// 财务管理-企业账户
// import EnterprisePayAccount from '@/pages/EnterprisePayAccount'
const EnterprisePayAccount = () => import('@/pages/EnterprisePayAccount')
// 财务管理-收益列表
// import EarningsList from '@/pages/EarningsList'
const EarningsList = () => import('@/pages/EarningsList')
// 用户中心-密码设置
// import OpsUserPsw from '@/pages/OpsUserPsw'
const OpsUserPsw = () => import('@/pages/OpsUserPsw')
// 用户中心-关于
// import OpsAbout from '@/pages/OpsAbout'
const OpsAbout = () => import('@/pages/OpsAbout')
// 电池查询-输入
// import SearchMain from '@/pages/SearchMain'
const SearchMain = () => import('@/pages/SearchMain')
// 分站电池统计
// import StoreStatistics from '@/pages/StoreStatistics'
const StoreStatistics = () => import('@/pages/StoreStatistics')
// 帮助
// import OpsHelp from '@/pages/OpsHelp'
const OpsHelp = () => import('@/pages/OpsHelp')
// 电量统计
// import VoltageChart from '@/pages/VoltageChart'
const VoltageChart = () => import('@/pages/VoltageChart')
// 里程统计
// import MileageChart from '@/pages/MileageChart'
const MileageChart = () => import('@/pages/MileageChart')
// 位置详情
// import LocationMap from '@/pages/LocationMap'
const LocationMap = () => import('@/pages/LocationMap')
// 铁塔统计
// import TowerBatteryStatistics from '@/pages/TowerBatteryStatistics'
const TowerBatteryStatistics = () => import('@/pages/TowerBatteryStatistics')
// 铁塔电池规格统计
// import TowerSpecificationStatistics from '@/pages/TowerSpecificationStatistics'
const TowerSpecificationStatistics = () => import('@/pages/TowerSpecificationStatistics')
// 发电订单详情
// import DischargeOrderDetail from '@/pages/DischargeOrderDetail'
const DischargeOrderDetail = () => import('@/pages/DischargeOrderDetail')
// 扫码换电
const ChangeBatteryPage = () => import('@/pages/ChangeBatteryPage')
// 我的钱包
const MyWallet = () => import('@/pages/MyWallet')
// 套餐列表
const PackageList = () => import('@/pages/PackageList')
// 未租赁设备提示页面
const UeNotFound = () => import('@/pages/UeNotFound')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/devices',
      name: 'DeviceList',
      component: DeviceList
    },
    // 为了兼容已经发布的App使用products路径
    {
      path: '/products',
      name: 'StoreList',
      component: StoreList
    },
    {
      path: '/products-v0',
      name: 'ProductList',
      component: ProductList
    },
    {
      path: '/products-v0/:id',
      name: 'ProductDetail',
      component: ProductDetail
    },
    {
      path: '/products/:id',
      name: 'StoreDetail',
      component: StoreDetail
    },
    {
      path: '/StoreDetailPro/:id',
      name: 'StoreDetailPro',
      component: StoreDetailPro
    },
    {
      path: '/CabinetDetail/:ueSn',
      name: 'CabinetDetail',
      component: CabinetDetail
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
    },
    {
      path: '/ops-main',
      name: 'OpsMain',
      component: OpsMain
    },
    {
      path: '/search-main',
      name: 'SearchMain',
      component: SearchMain
    },
    {
      path: '/ops-order-ops',
      name: 'OpsOrderOps',
      component: OpsOrderOps
    },
    {
      path: '/ops-order-ops-step',
      name: 'OpsOrderOpsStep',
      component: OpsOrderOpsStep
    },
    {
      path: '/store-statistics',
      name: 'StoreStatistics',
      component: StoreStatistics,
      beforeEnter: (to, from, next) => {
        if (typeof (to.query.from) !== 'undefined' && to.query.from === 'tower') {
          next({
            name: 'TowerBatteryStatistics',
            query: {
              token: to.query.token,
              firm: to.query.firm,
              storeId: to.query.storeId
            }
          })
        } else {
          next()
        }
      }
    },
    {
      path: '/tower-battery-statistics',
      name: 'TowerBatteryStatistics',
      component: TowerBatteryStatistics
    },
    {
      path: '/tower-battery-specification-statistics',
      name: 'TowerSpecificationStatistics',
      component: TowerSpecificationStatistics
    },
    {
      path: '/battery-statistics',
      name: 'BatteryStatistics',
      component: BatteryStatistics
    },
    {
      path: '/battery-distribution',
      name: 'BatteryDistribution',
      component: BatteryDistribution
    },
    {
      path: '/income-statistics',
      name: 'IncomeStatistics',
      component: IncomeStatistics
    },
    {
      path: '/equipment-list',
      name: 'Equipmentlist',
      component: Equipmentlist
    },
    {
      path: '/equipments/:ccusn',
      name: 'EquipmentDetail',
      component: EquipmentDetail
    },
    {
      path: '/order-battery',
      name: 'OrderBattery',
      component: OrderBattery
    },
    {
      path: '/income-list',
      name: 'Incomelist',
      component: Incomelist
    },
    {
      path: '/ops-user-psw',
      name: 'OpsUserPsw',
      component: OpsUserPsw
    },
    {
      path: '/ops-about',
      name: 'OpsAbout',
      component: OpsAbout
    },
    {
      path: '/ops-help',
      name: 'OpsHelp',
      component: OpsHelp
    },
    {
      path: '/rented-list',
      name: 'RentedList',
      component: RentedList
    },
    {
      path: '/unrented-list',
      name: 'UnrentedList',
      component: UnrentedList
    },
    {
      path: '/overdue-order-list',
      name: 'OverdueOrderList',
      component: OverdueOrderList
    },
    {
      path: '/undervoltage-list',
      name: 'UndervoltageList',
      component: UndervoltageList
    },
    {
      path: '/offline-list',
      name: 'OfflineList',
      component: OfflineList
    },
    {
      path: '/repair-list',
      name: 'RepairList',
      component: RepairList
    },
    {
      path: '/run-model-switch',
      name: 'RunModelSwitch',
      component: RunModelSwitch
    },
    {
      path: '/pay-order-list',
      name: 'PayOrderList',
      component: PayOrderList
    },
    {
      path: '/rent-battery',
      name: 'RentBattery',
      component: RentBattery
    },
    {
      path: '/order-ops',
      name: 'OrderOpsQRCode',
      component: OrderOpsQRCode
    },
    {
      path: '/earnings-list',
      name: 'EarningsList',
      component: EarningsList
    },
    {
      path: '/enterprise-pay-account',
      name: 'EnterprisePayAccount',
      component: EnterprisePayAccount
    },
    {
      path: '/user-pay-account',
      name: 'UserPayAccount',
      component: UserPayAccount
    },
    {
      path: '/ops-balance',
      name: 'OpsBalance',
      component: OpsBalance
    },
    {
      path: '/balance',
      name: 'Balance',
      component: Balance
    },
    {
      path: '/my-qrcode',
      name: 'MyQRCode',
      component: MyQRCode
    },
    {
      path: '/upgrade-deposit',
      name: 'UpgradeDeposit',
      component: UpgradeDeposit
    },
    {
      path: '/orders/voltage-chart/:ccuSn',
      name: 'VoltageChart',
      component: VoltageChart
    },
    {
      path: '/orders/mileage-chart/:ccuSn',
      name: 'MileageChart',
      component: MileageChart
    },
    {
      path: '/orders/location-map/:ccuSn',
      name: 'LocationMap',
      component: LocationMap
    },
    {
      path: '/discharge-orders/:id',
      name: 'dischargeOrderDetail',
      component: DischargeOrderDetail
    },
    {
      path: '/change-battery',
      name: 'ChangeBatteryPage',
      component: ChangeBatteryPage
    },
    {
      path: '/my-wallet',
      name: 'MyWallet',
      component: MyWallet
    },
    {
      path: '/package-list',
      name: 'PackageList',
      component: PackageList
    },
    {
      path: '/ue-not-found',
      name: 'UeNotFound',
      component: UeNotFound
    }
  ]
})
