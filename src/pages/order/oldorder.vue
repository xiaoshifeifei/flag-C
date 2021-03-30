<template>
	<view class="order">
		<!--搜索导航栏-->
		<!-- <view class="order-search" @tap="navTo(`/pages/index/search/search?keyword=搜索我的订单&type=order`)">
			<view class="order-search-input">请输入订单关键字</view>
			<view class="iconfont iconsousuo2"></view>
		</view> -->
		<!--导航栏-->
		<!-- <view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="tabCurrentIndex === index ? `text-${themeColor.name} current` : ''"
			 @tap="tabClick(index)">
				{{ item.text }}
			</view>
		</view> -->
		<!--订单列表-->
		<swiper class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="getMoreOrderList">
					<view v-for="(item, index) in orderList" :key="index" class="rf-order-item">
						<view class="i-top b-b">
							<text class="time in1line">订单号：{{ item.orderNo }}</text>
							<!--<text class="time">{{item.created_at | time}}</text>-->
							<text class="state" :class="'text-' + themeColor.name" v-if="parseInt(item.order_status, 10) !== 0">{{ item.status | orderStatusFilter }}</text>
							<view class="example-body" v-else>
								<rf-count-down :show-day="false" :second="second(item.close_time)" @timeup="timeUp(item)" color="#FFFFFF"
								 :background-color="themeColor.color" :border-color="themeColor.color" />
							</view>
						</view>
						<view class="goods-box-single" @tap.stop="
								navTo(`/pages/order/detail?id=${item.id}`)
							" v-for="(goodsItem, goodsIndex) in item.orderItemVoList"
						 :key="goodsIndex">
							<image class="goods-img" :src="goodsItem.productImage" mode="aspectFill"></image>
							<view class="right">
								<text class="title in2line">{{ goodsItem.productName }}</text>
								<text class="attr-box">单价：{{ moneySymbol }}{{ goodsItem.currentUnitPrice}} &nbsp;&nbsp;&nbsp; 数量：{{ goodsItem.quantity }}</text>
								<text v-if="goodsItem.point_exchange_type == 2">
									<text class="point" :class="'text-' + themeColor.name">{{ goodsItem.product_money }} + {{ item.point }}积分
									</text>
								</text>
								<text v-else-if="goodsItem.point_exchange_type == 4">
									<text class="point">{{ item.point }}积分 </text>
								</text>
								<text class="price" v-else>
									<text :class="'text-' + themeColor.name">{{ moneySymbol }}{{ goodsItem.totalPrice }}
										<text v-if="false">
											+ {{ item.point + '积分' || '' }}</text></text>
								</text>
							</view>
						</view>
						<view class="price-box">
							共
							<text class="num">{{ item.orderItemVoList.length }}</text>
							种商品 实付款
							<text class="price" :class="'text-'+themeColor.name">{{ moneySymbol }}{{ item.payment }}</text>
						</view>
						<view class="price-box">
							<text>创建时间：{{ item.createTime | time }}</text>
						</view>
						<view v-if="item.logistics" class="price-box">
							<text>快递单号：{{ item.logistics }}</text>
						</view>
						<view class="action-box b-t">
							<button class="action-btn" :class="'text-' + themeColor.name" v-if="false" @tap="handleOrderOperation(item, 'shipping')">
								查看物流
							</button>
							<button class="action-btn" :class="'bg-' + themeColor.name" v-if="false" @tap="navTo(`/pages/user/money/pay?id=${item.id}`)">
								立即支付
							</button>
							<button class="action-btn" :class="'bg-' + themeColor.name" v-if="item.status == 40 && userInfo.role === 1" @tap="handleOrderOperation(item, 'delivery')">
								确认收货
							</button>
							<button class="action-btn" :class="'bg-' + themeColor.name" v-if="item.status == 20 && userInfo.role === 2" @tap="handleOrderOperation(item, 'makeDelivery')">
								确认发货
							</button>
						</view>
					</view>
					<rf-load-more :status="loadingType" v-if="orderList.length > 0"></rf-load-more>
					<rf-empty info="暂无订单" v-if="orderList.length === 0 && !loading"></rf-empty>
				</scroll-view>
			</swiper-item>
		</swiper>
		<view class="makeDeliveryWindow" v-show="showMakeDelivery">
			<view class="deliveryContent">
				<view class="windowTitle">填写快递信息</view>
				<view class="login-type-form">
					<view class="input-item">
						<text :class="'text-' + themeColor.name">快递单号：</text>
						<input class="login-type-input" v-model="makeDeliveryOrder.logistics" placeholder="请输入快递单号" />
					</view>
					<view class="btnLine">
					<button class="confirm-btn" :class="'bg-' + themeColor.name" @tap="toMakeDelivery">
						提交
					</button>
					<button class="confirm-btn cancle-btn"  @tap="showMakeDelivery = false;">
						取消
					</button>
					</view>
				</view>
			</view>
		</view>
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
/**
	 * @des 订单管理
	 *
	 * @author stav stavyan@qq.com
	 * @date 2020-01-15 11:54
	 * @copyright 2019
	 */
import rfLoadMore from '@/components/rf-load-more/rf-load-more'
import moment from '@/common/moment'
import {
  orderDelete,
  orderList,
  orderTakeDelivery,
  orderMakeDelivery
} from '@/api/userInfo'
import rfCountDown from '@/components/rf-count-down'
import {
  orderClose
} from '@/api/product'
import mConstData from '@/config/constData.config'
export default {
  components: {
    rfLoadMore,
    rfCountDown
  },
  data () {
    return {
      tabCurrentIndex: null,
      loadingType: 'more',
      navList: this.$mConstDataConfig.orderNavList,
      moneySymbol: this.moneySymbol,
      orderList: [],
      page: 1,
      pageSize: 10,
      loading: true,
      isRefreshing: true,
      singleSkuText: this.singleSkuText,
      userInfo: uni.getStorageSync('userInfo'),
      makeDeliveryOrder: {},
      showMakeDelivery: false
    }
  },
  computed: {
    // 计算倒计时时间
    second () {
      return function (val) {
        return Math.floor(val - new Date() / 1000)
      }
    }
  },
  filters: {
    // 时间格式化
    time (val) {
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    },
    // 状态显示格式化
    orderStatusFilter (orderStatus) {
      let state
      mConstData.orderStatus.forEach(orderItem => {
        if (orderItem.key === parseInt(orderStatus, 10)) {
          state = orderItem.value
        }
      })
      return state
    }
  },
  onShow () {
    this.initData()
  },
  onLoad (options) {
    /**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
    this.tabCurrentIndex = parseInt(options.index, 10) + 1
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.page = 1
    this.orderList.length = 0
    this.getOrderList('refresh')
  },
  // 加载更多
  onReachBottom () {
    if (this.loadingType === 'nomore' || this.orderList.length === 0) return
    this.page++
    this.getOrderList()
  },
  methods: {
    // 倒计时关闭订单
    timeUp (item) {
      if (this.isRefreshing) {
        this.isRefreshing = false
        this.handleOrderClose(item.id)
      }
    },
    // 订单操作
    handleOrderOperation (item, type) {
      switch (type) {
        case 'detail': // 订单详情
          this.navTo(`/pages/order/detail?id=${item.id}`)
          break
        case 'evaluation': // 我要评价
          this.navTo(`/pages/order/evaluation/evaluation?order_id=${item.id}`)
          break
        case 'close': // 取消订单
          this.handleOrderClose(item.id)
          break
        case 'delete': // 删除订单
          this.handleOrderDelete(item.id)
          break
        case 'shipping': // 查看物流
          this.navTo(`/pages/order/shipping/shipping?id=${item.id}`)
          break
        case 'delivery': // 确认收货
          this.handleOrderTakeDelivery(item)
          break
        case 'makeDelivery': // 确认收货
          this.handleOrderMakeDelivery(item)
          break
      }
    },
    // 跳转页面
    navTo (route) {
      this.$mRouter.push({
        route
      })
    },
    // 关闭订单
    async handleOrderClose (id) {
      await this.$http
        .get(`${orderClose}`, {
          id
        })
        .then(() => {
          this.isRefreshing = true
          this.$mHelper.toast('订单取消成功')
          setTimeout(() => {
            this.loading = true
            this.page = 1
            this.orderList.length = 0
            this.getOrderList()
          }, 500)
        })
    },
    // 删除已关闭订单
    async handleOrderDelete (id) {
      await this.$http.delete(`${orderDelete}?id=${id}`, {}).then(() => {
        this.$mHelper.toast('订单删除成功')
        setTimeout(() => {
          this.page = 1
          this.orderList.length = 0
          this.getOrderList()
        }, 500)
      })
    },
    // 确认收货
    async handleOrderTakeDelivery (item) {
      const r = await this.$mHelper.confirm('确定确认收货？')
      if (r !== true) {
        return
      }
      this.loading = true
      await this.$http
        .post(`${orderTakeDelivery}`, {
          orderNo: item.orderNo
        })
        .then((r) => {
          this.loading = false
          if (r.status) {
            this.$mHelper.toast('确认收货失败！')
            return
          }
          this.page = 1
          this.orderList.length = 0
          this.getOrderList()
        }).catch(() => {
          this.loading = false
        })
    },
    handleOrderMakeDelivery (item) {
      if (this.showMakeDelivery) {
        return
      }
      this.showMakeDelivery = true
      this.makeDeliveryOrder = item
      this.makeDeliveryOrder.logistics = ''
    },
    async toMakeDelivery () {
      if (!this.makeDeliveryOrder.logistics) {
				  this.$mHelper.toast('请填写快递单号！')
				  return
      }
      this.loading = true
      await this.$http
        .post(`${orderMakeDelivery}`, {
          orderItemId: this.makeDeliveryOrder.id,
          logistics: this.makeDeliveryOrder.logistics
        })
        .then((r) => {
          this.loading = false
          if (r.status) {
            this.$mHelper.toast('填写发货信息失败！')
            return
          }
          this.page = 1
          this.orderList.length = 0
          this.getOrderList()
        }).catch(() => {
          this.loading = false
        })
    },

    // 数据初始化
    async initData () {
      this.page = 1
      this.orderList.length = 0
      // await this.getOrderList()
      this.loading=false
    },
    // 获取订单列表
    async getOrderList (type) {
      const navItem = this.navList[this.tabCurrentIndex]
      const params = {}
      if (navItem.state || navItem.state === 0) {
        params.pageState = navItem.state
      }
      params.pageNum = this.page
      params.pageSize = this.pageSize
      await this.$http
        .get(`${orderList}`, params)
        .then(async r => {
          this.loading = false
          if (r.status) {
            this.$mHelper.toast('获取订单列表失败！')
            return
          }
          if (type === 'refresh') {
            uni.stopPullDownRefresh()
          }
          this.loadingType = r.data.list.length === this.pageSize ? 'more' : 'nomore'
          this.orderList = [...this.orderList, ...r.data.list]
					console.log(this.orderList)
        })
        .catch(() => {
          this.loading = false
          if (type === 'refresh') {
            uni.stopPullDownRefresh()
          }
        })
    },
    // 监听swiper切换
    changeTab (e) {
      this.page = 1
      this.orderList.length = 0
      this.tabCurrentIndex = e.target.current
      this.loading = true
      this.getOrderList()
    },
    // 顶部tab点击
    // tabClick (index) {
    //   this.page = 1
    //   this.orderList.length = 0
    //   this.tabCurrentIndex = index
    //   this.loading = true
    //   this.getOrderList()
    // },
    // 顶部tab点击
    getMoreOrderList () {
      if (this.loadingType === 'nomore' || this.orderList.length === 0) return
      this.page++
      this.getOrderList()
    }
  }
}
</script>
<style lang="scss">
	page,
	.makeDeliveryWindow{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(1, 1, 1, 0.318);
		.deliveryContent{
			background-color: white;
			position: absolute;
			top: 50%;
			left: 50%;
			padding: 4vw;
			border-radius: 5px;
			transform: translate(-50%, -50%);

			.windowTitle{
				text-align: center;
				font-size: 16px;
			}
			.input-item {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				justify-content: center;
				padding: 0 30upx;
				background: $page-color-light;
				height: 120upx;
				border-radius: 4px;
				margin-bottom: 50upx;
				margin-top: 30upx;

				&:last-child {
					margin-bottom: 0;
				}

				.tit {
					height: 50upx;
					line-height: 56upx;
					font-size: $font-sm + 2upx;
					color: $font-color-base;
				}

				input {
					height: 60upx;
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					width: 100%;
				}
			}
		}
		.btnLine{
			display: flex;
			justify-content: center;
			align-items: center;
			button{
				width: 25vw;
				margin: 0 6.18vw;
			}
			.cancle-btn{
				background-color: rgb(240, 240, 240);
				color: rgb(180, 180, 180);
			}
		}
	}
	.order {
		background:$color-white;
		height: 100vh;

		.order-search {
			padding: $spacing-sm $spacing-base;
			position: relative;

			.order-search-input {
				width: 100%;
				background-color: $color-white;
				border-radius: 40upx;
				padding: $spacing-sm 0 $spacing-sm $spacing-lg;
				color: $font-color-light;
			}

			.iconfont {
				position: absolute;
				right: 48upx;
				top: 22upx;
			}
		}

		.swiper-box {
			height: calc(100% - 160upx);
		}

		.list-scroll-content {
			height: 100%;
		}

		.uni-swiper-item {
			height: auto;
		}
	}
	.action-box{
		height: auto;
		.action-btn {
			margin-top: 5px;
			margin-bottom: 5px;
		}
	}
</style>
