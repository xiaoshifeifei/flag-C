<template>
	<view>
		<view class="wrap">
			<view class="u-tabs-box">
				<u-tabs-swiper
					activeColor="#f29100"
					ref="tabs"
					:list="list"
					:current="current"
					@change="change"
					:is-scroll="false"
					swiperWidth="750"
				></u-tabs-swiper>
			</view>
			<swiper
				class="swiper-box"
				:current="swiperCurrent"
				@animationfinish="animationfinish"
			>
				<swiper-item class="swiper-item" @touchmove.stop>
					<scroll-view
						scroll-y
						style="height: 100%; width: 100%"
						@scrolltolower="reachBottom"
						v-if="dataList.length > 0"
					>
						<view class="page-box">
							<view
								class="order"
								v-for="(item, index) in dataList"
								:key="index"
							>
								<view class="top">
									<view class="left">
										<u-icon
											name="home"
											:size="30"
											color="rgb(94,94,94)"
										></u-icon>
										<view v-if="item.status == 0" class="store">待付款</view>
										<view v-if="item.status == 1" class="store">待发货</view>
										<view v-if="item.status == 2" class="store">待收货</view>
										<view v-if="item.status == 3" class="store">已完成</view>

										<view>{{ item.create_time }}</view>
										<u-icon
											name="arrow-right"
											color="rgb(203,203,203)"
											:size="26"
										></u-icon>
									</view>
									<!-- <view class="right">1111</view> -->
								</view>
								<view class="item">
									<view class="left"
										><image
											:src="
												item.img
													? item.img
													: '//img13.360buyimg.com/n7/jfs/t1/103005/7/17719/314825/5e8c19faEb7eed50d/5b81ae4b2f7f3bb7.jpg'
											"
											mode="aspectFill"
										></image
									></view>
									<view class="content">
										<view class="title u-line-2">{{ item.name }}</view>
										<!-- <view class="type">{{ item.type }}</view> -->
										<!-- <view class="delivery-time"
											>发货时间 {{ item.deliveryTime }}</view
										> -->
									</view>
									<view class="right">
										<!-- <view class="price">
											￥{{ item.price}}
											<text class="decimal"
												>.{{item.price }}</text
											>
										</view> -->
										<view class="number">x{{ item.num }}</view>
									</view>
								</view>
								<view class="total">
									共{{ item.num }}件商品 合计:
									<text class="total-price">
										￥{{ item.money / 100 }}
										<!-- <text class="decimal">111</text> -->
									</text>
								</view>
								<view class="bottom">
									<!-- <view class="more"
										><u-icon
											name="more-dot-fill"
											color="rgb(203,203,203)"
										></u-icon
									></view> -->
									<view></view>
									<view class="flex middle center" v-if="status == 0">
										<view class="logistics btn" @click="delOrder(item.id)"
											>取消订单</view
										>
										<view class="evaluate btn" @click="goOnPay(item.id)"
											>去支付</view
										>
									</view>
									<view class="flex middle center" v-if="status == 2">
										<view class="evaluate btn" @click="goOnPayqr(item.id)"
											>确认收货</view
										>
									</view>
									<!-- <view class="evaluate btn">再来一单</view> -->
									<!-- <view class="evaluate btn">查看物流</view>
									<view class="evaluate btn">确认收货</view> -->
								</view>
							</view>
							<!-- <u-loadmore
								:status="loadStatus[0]"
								bgColor="#f2f2f2"
							></u-loadmore> -->
						</view>
					</scroll-view>
					<!-- 暂无数据 -->

					<scroll-view v-else scroll-y style="height: 100%; width: 100%">
						<view class="page-box">
							<view>
								<view class="centre flex flex-direction middle center">
									<image
										src="@/static/app/nodata.png"
										mode=""
									></image>
									<view class="explain">
										您还没有相关的订单
										<view class="tips">可以去看看有那些想买的</view>
									</view>
									<view @click="goToIndex" class="btn">随便逛逛</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>

				<swiper-item class="swiper-item" @touchmove.stop>
					<scroll-view
						scroll-y
						style="height: 100%; width: 100%"
						@scrolltolower="reachBottom"
						v-if="dataList.length > 0"
					>
						<view class="page-box">
							<view
								class="order"
								v-for="(item, index) in dataList"
								:key="index"
							>
								<view class="top">
									<view class="left">
										<u-icon
											name="home"
											:size="30"
											color="rgb(94,94,94)"
										></u-icon>
										<view v-if="item.status == 0" class="store">待付款</view>
										<view v-if="item.status == 1" class="store">待发货</view>
										<view v-if="item.status == 2" class="store">待收货</view>
										<view v-if="item.status == 3" class="store">已完成</view>

										<view>{{ item.create_time }}</view>
										<u-icon
											name="arrow-right"
											color="rgb(203,203,203)"
											:size="26"
										></u-icon>
									</view>
									<!-- <view class="right">1111</view> -->
								</view>
								<view class="item">
									<view class="left"
										><image
											:src="
												item.img
													? item.img
													: '//img13.360buyimg.com/n7/jfs/t1/103005/7/17719/314825/5e8c19faEb7eed50d/5b81ae4b2f7f3bb7.jpg'
											"
											mode="aspectFill"
										></image
									></view>
									<view class="content">
										<view class="title u-line-2">{{ item.name }}</view>
										<!-- <view class="type">{{ item.type }}</view> -->
										<!-- <view class="delivery-time"
											>发货时间 {{ item.deliveryTime }}</view
										> -->
									</view>
									<view class="right">
										<!-- <view class="price">
											￥{{ item.price}}
											<text class="decimal"
												>.{{item.price }}</text
											>
										</view> -->
										<view class="number">x{{ item.num }}</view>
									</view>
								</view>
								<view class="total">
									共{{ item.num }}件商品 合计:
									<text class="total-price">
										￥{{ item.money / 100 }}
										<!-- <text class="decimal">111</text> -->
									</text>
								</view>
								<view class="bottom">
									<!-- <view class="more"
										><u-icon
											name="more-dot-fill"
											color="rgb(203,203,203)"
										></u-icon
									></view> -->
									<view></view>
									<view class="flex middle center" v-if="status == 0">
										<view class="logistics btn" @click="delOrder(item.id)"
											>取消订单</view
										>
										<view class="evaluate btn" @click="goOnPay(item.id)"
											>去支付</view
										>
									</view>
									<view class="flex middle center" v-if="status == 2">
										<view class="evaluate btn" @click="goOnPayqr(item.id)"
											>确认收货</view
										>
									</view>
									<!-- <view class="evaluate btn">再来一单</view> -->
									<!-- <view class="evaluate btn">查看物流</view>
									<view class="evaluate btn">确认收货</view> -->
								</view>
							</view>
							<!-- <u-loadmore
								:status="loadStatus[0]"
								bgColor="#f2f2f2"
							></u-loadmore> -->
						</view>
					</scroll-view>
					<!-- 暂无数据 -->

					<scroll-view v-else scroll-y style="height: 100%; width: 100%">
						<view class="page-box">
							<view>
								<view class="centre flex flex-direction middle center">
									<image
										src="@/static/app/nodata.png"
										mode=""
									></image>
									<view class="explain">
										您还没有相关的订单
										<view class="tips">可以去看看有那些想买的</view>
									</view>
									<view @click="goToIndex" class="btn">随便逛逛</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>

				<swiper-item class="swiper-item" @touchmove.stop>
					<scroll-view
						scroll-y
						style="height: 100%; width: 100%"
						@scrolltolower="reachBottom"
						v-if="dataList.length > 0"
					>
						<view class="page-box">
							<view
								class="order"
								v-for="(item, index) in dataList"
								:key="index"
							>
								<view class="top">
									<view class="left">
										<u-icon
											name="home"
											:size="30"
											color="rgb(94,94,94)"
										></u-icon>
										<view v-if="item.status == 0" class="store">待付款</view>
										<view v-if="item.status == 1" class="store">待发货</view>
										<view v-if="item.status == 2" class="store">待收货</view>
										<view v-if="item.status == 3" class="store">已完成</view>

										<view>{{ item.create_time }}</view>
										<u-icon
											name="arrow-right"
											color="rgb(203,203,203)"
											:size="26"
										></u-icon>
									</view>
									<!-- <view class="right">1111</view> -->
								</view>
								<view class="item">
									<view class="left"
										><image
											:src="item.img? item.img: '//img13.360buyimg.com/n7/jfs/t1/103005/7/17719/314825/5e8c19faEb7eed50d/5b81ae4b2f7f3bb7.jpg'"
											mode="aspectFill"
										></image
									></view>
									<view class="content">
										<view class="title u-line-2">{{ item.name }}</view>
										<!-- <view class="type">{{ item.type }}</view> -->
										<!-- <view class="delivery-time"
											>发货时间 {{ item.deliveryTime }}</view
										> -->
									</view>
									<view class="right">
										<!-- <view class="price">
											￥{{ item.price}}
											<text class="decimal"
												>.{{item.price }}</text
											>
										</view> -->
										<view class="number">x{{ item.num }}</view>
									</view>
								</view>
								<view class="total">
									共{{ item.num }}件商品 合计:
									<text class="total-price">
										￥{{ item.money / 100 }}
										<!-- <text class="decimal">111</text> -->
									</text>
								</view>
								<view class="bottom">
									<!-- <view class="more"
										><u-icon
											name="more-dot-fill"
											color="rgb(203,203,203)"
										></u-icon
									></view> -->
									<view></view>
									<view class="flex middle center" v-if="status == 0">
										<view class="logistics btn" @click="delOrder(item.id)"
											>取消订单</view
										>
										<view class="evaluate btn" @click="goOnPay(item.id)"
											>去支付</view
										>
									</view>
									<view class="flex middle center" v-if="status == 2">
										<view class="evaluate btn" @click="goOnPayqr(item.id)"
											>确认收货</view
										>
									</view>
									<!-- <view class="evaluate btn">再来一单</view> -->
									<!-- <view class="evaluate btn">查看物流</view>
									<view class="evaluate btn">确认收货</view> -->
								</view>
							</view>
							<!-- <u-loadmore
								:status="loadStatus[0]"
								bgColor="#f2f2f2"
							></u-loadmore> -->
						</view>
					</scroll-view>
					<!-- 暂无数据 -->

					<scroll-view v-else scroll-y style="height: 100%; width: 100%">
						<view class="page-box">
							<view>
								<view class="centre flex flex-direction middle center">
									<image
										src="@/static/app/nodata.png"
										mode=""
									></image>
									<view class="explain">
										您还没有相关的订单
										<view class="tips">可以去看看有那些想买的</view>
									</view>
									<view @click="goToIndex" class="btn">随便逛逛</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>

				<swiper-item class="swiper-item" @touchmove.stop>
					<scroll-view
						scroll-y
						style="height: 100%; width: 100%"
						@scrolltolower="reachBottom"
						v-if="dataList.length > 0"
					>
						<view class="page-box">
							<view
								class="order"
								v-for="(item, index) in dataList"
								:key="index"
							>
								<view class="top">
									<view class="left">
										<u-icon
											name="home"
											:size="30"
											color="rgb(94,94,94)"
										></u-icon>
										<view v-if="item.status == 0" class="store">待付款</view>
										<view v-if="item.status == 1" class="store">待发货</view>
										<view v-if="item.status == 2" class="store">待收货</view>
										<view v-if="item.status == 3" class="store">已完成</view>

										<view>{{ item.create_time }}</view>
										<u-icon
											name="arrow-right"
											color="rgb(203,203,203)"
											:size="26"
										></u-icon>
									</view>
									<!-- <view class="right">1111</view> -->
								</view>
								<view class="item">
									<view class="left"
										><image
											:src="item.img? item.img: '//img13.360buyimg.com/n7/jfs/t1/103005/7/17719/314825/5e8c19faEb7eed50d/5b81ae4b2f7f3bb7.jpg'"
											mode="aspectFill"
										></image
									></view>
									<view class="content">
										<view class="title u-line-2">{{ item.name }}</view>
										<!-- <view class="type">{{ item.type }}</view> -->
										<!-- <view class="delivery-time"
											>发货时间 {{ item.deliveryTime }}</view
										> -->
									</view>
									<view class="right">
										<!-- <view class="price">
											￥{{ item.price}}
											<text class="decimal"
												>.{{item.price }}</text
											>
										</view> -->
										<view class="number">x{{ item.num }}</view>
									</view>
								</view>
								<view class="total">
									共{{ item.num }}件商品 合计:
									<text class="total-price">
										￥{{ item.money / 100 }}
										<!-- <text class="decimal">111</text> -->
									</text>
								</view>
								<view class="bottom">
									<!-- <view class="more"
										><u-icon
											name="more-dot-fill"
											color="rgb(203,203,203)"
										></u-icon
									></view> -->
									<view></view>
									<view class="flex middle center" v-if="status == 0">
										<view class="logistics btn" @click="delOrder(item.id)"
											>取消订单</view
										>
										<view class="evaluate btn" @click="goOnPay(item.id)"
											>去支付</view
										>
									</view>
									<view class="flex middle center" v-if="status == 2">
										<view class="evaluate btn" @click="goOnPayqr(item.id)"
											>确认收货</view
										>
									</view>
									<!-- <view class="evaluate btn">再来一单</view> -->
									<!-- <view class="evaluate btn">查看物流</view>
									<view class="evaluate btn">确认收货</view> -->
								</view>
							</view>
							<!-- <u-loadmore
								:status="loadStatus[0]"
								bgColor="#f2f2f2"
							></u-loadmore> -->
						</view>
					</scroll-view>
					<!-- 暂无数据 -->

					<scroll-view v-else scroll-y style="height: 100%; width: 100%">
						<view class="page-box">
							<view>
								<view class="centre flex flex-direction middle center">
									<image
										src="@/static/app/nodata.png"
										mode=""
									></image>
									<view class="explain">
										您还没有相关的订单
										<view class="tips">可以去看看有那些想买的</view>
									</view>
									<view @click="goToIndex" class="btn">随便逛逛</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>

				<!-- <swiper-item class="swiper-item">
          <scroll-view scroll-y style="height: 100%; width: 100%">
            <view class="page-box">
              <view>
                <view class="centre flex flex-direction middle center">
                  <image
                    src="https://cdn.uviewui.com/uview/template/taobao-order.png"
                    mode=""
                  ></image>
                  <view class="explain">
                    您还没有相关的订单
                    <view class="tips">可以去看看有那些想买的</view>
                  </view>
                  <view @click="goToIndex" class="btn">随便逛逛</view>
                </view>
              </view>
            </view>
          </scroll-view>
        </swiper-item>
        <swiper-item class="swiper-item">
          <scroll-view scroll-y style="height: 100%; width: 100%">
            <view class="page-box">
              <view>
                <view class="centre flex flex-direction middle center">
                  <image
                    src="https://cdn.uviewui.com/uview/template/taobao-order.png"
                    mode=""
                  ></image>
                  <view class="explain">
                    您还没有相关的订单
                    <view class="tips">可以去看看有那些想买的</view>
                  </view>
                  <view @click="goToIndex" class="btn">随便逛逛</view>
                </view>
              </view>
            </view>
          </scroll-view>
        </swiper-item>
        <swiper-item class="swiper-item">
          <scroll-view scroll-y style="height: 100%; width: 100%">
            <view class="page-box">
              <view>
                <view class="centre flex flex-direction middle center">
                  <image
                    src="https://cdn.uviewui.com/uview/template/taobao-order.png"
                    mode=""
                  ></image>
                  <view class="explain">
                    您还没有相关的订单
                    <view class="tips">可以去看看有那些想买的</view>
                  </view>
                  <view @click="goToIndex" class="btn">随便逛逛</view>
                </view>
              </view>
            </view>
          </scroll-view>
        </swiper-item> -->
			</swiper>
		</view>

		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
import { orderList, cancelPay, contPay, changestatus } from '@/api/userInfo';
export default {
	data() {
		return {
			orderList: [[], [], [], []],
			dataList: [],
			list: this.$mConstDataConfig.orderSectionList,
			current: 0,
			swiperCurrent: 0,
			tabsHeight: 0,
			dx: 0,
			loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore'],

			page: 1,
			limit: 1000,
			status: 0, //(0:待处理 1:待发货 2:已发货 3:已收货 4:退款/售后)
			loading: true
		};
	},
	onLoad(options) {
		// this.getOrderList(0);
		// this.getOrderList(1);
		// this.getOrderList(3);
		console.log(options);
		this.swiperCurrent = options.status ? options.status : 0;
		this.current = options.status ? options.status : 0;
		this.status = options.status ? options.status : 0;
		// 接口没写
		// if (this.status == 0) {
		this.getOrderList();
		// }
		this.loading = false;
	},
	computed: {},
	methods: {
		reachBottom() {
			// 此tab为空数据
			// if (this.current != 2) {
			// 	this.loadStatus.splice(this.current, 1, 'loading');
			// 	setTimeout(() => {
			// 		this.getOrderList(this.current);
			// 	}, 1200);
			// }
		},
		goToIndex() {
			this.$mRouter.reLaunch({
				route: '/pages/index/index'
			});
		},

		// 获取订单列表
		async getOrderList() {
			const params = {
				page: this.page,
				limit: this.limit,
				status: this.status
			};
			await this.$http
				.get(`${orderList}`, params)
				.then(async r => {
					console.log(r);
					this.loading = false;
					this.dataList = r.data.rows;

					// this.loadingType = r.data.list.length === this.pageSize ? 'more' : 'nomore'
					// this.orderList = [...this.orderList, ...r.data.list]
					// console.log(this.orderList)
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 取消订单
		delOrder(id) {
			const params = {
				id: id
			};
			uni.showModal({
				title: '提示',
				content: '确定要取消订单吗？',
				success: res => {
					if (res.confirm) {
						this.$http
							.get(`${cancelPay}`, params)
							.then(async r => {
								console.log(r);
								if (r.code == 0) {
									this.$mHelper.toast(r.msg);
									this.getOrderList();
								}
							})
							.catch(() => {
								this.loading = false;
							});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		// 确认收货
		goOnPayqr(id) {
			const params = {
				id: id,
				status: 3
			};
			uni.showModal({
				title: '提示',
				content: '确认收货？',
				success: res => {
					if (res.confirm) {
						this.$http
							.post(`${changestatus}`, params)
							.then(async r => {
								console.log(r);
								if (r.code == 0) {
									this.$mHelper.toast(r.msg);
									this.getOrderList();
								}
							})
							.catch(() => {
								this.loading = false;
							});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},

		//继续支付

		async goOnPay(id) {
			// this.$mHelper.toast('支付成功');
			// this.$mRouter.redirectTo({
			//   route: '/pages/order/orderjilu/orderjilu',
			// });
			// #ifdef APP-PLUS
			const prames = {
				id
			};
			uni.showLoading({ title: '支付中' });
			await this.$http.get(`${contPay}`, prames).then(r => {
				console.log(r);
				uni.requestPayment({
					provider: 'wxpay', // 微信支付
					orderInfo: JSON.stringify(r.data), //微信订单数据 r.data.config
					success: () => {
						console.log('支付成功了');
						uni.hideLoading();
						this.$mHelper.toast('支付成功');
						this.$mRouter.redirectTo({
							route: '/pages/order/orderjilu/orderjilu'
						});
					},
					fail: err => {
						uni.hideLoading();
						console.log('err', err);
						this.$mHelper.toast('支付已取消,请重新支付');
					}
				});
			});
			// #endif
		},

		// tab栏切换
		change(index) {
			this.swiperCurrent = index;
			this.current = index;
			this.status = index;
			// 接口没写
			// if (this.status == 0) {
			this.loading = true;
			this.getOrderList();
			// }
		},

		animationfinish({ detail: { current } }) {
			// this.$refs.tabs.setFinishCurrent(current);
			// this.swiperCurrent = current;
			// this.current = current;
			// this.status = current;
			// // 接口没写
			// // if (this.status == 0) {
			//   this.loading = false;
			//   this.getOrderList();
			// // }
		}
	}
};
</script>

<style>
/* #ifndef H5 */
page {
	height: 100%;
	background-color: #f2f2f2;
}
/* #endif */
</style>

<style lang="scss" scoped>
.order {
	width: 710upx;
	background-color: #ffffff;
	margin: 20upx auto;
	border-radius: 20upx;
	box-sizing: border-box;
	padding: 20upx;
	font-size: 28upx;
	border: 1px solid #f5f5f5;
	.top {
		display: flex;
		justify-content: space-between;
		.left {
			display: flex;
			align-items: center;
			.store {
				margin: 0 10upx;
				font-size: 32upx;
				font-weight: bold;
			}
		}
		.right {
			color: $u-type-warning-dark;
		}
	}
	.item {
		display: flex;
		margin: 20upx 0 0;
		.left {
			margin-right: 20upx;
			image {
				width: 200upx;
				height: 200upx;
				border-radius: 10upx;
			}
		}
		.content {
			.title {
				font-size: 28upx;
				line-height: 50upx;
			}
			.type {
				margin: 10upx 0;
				font-size: 24upx;
				color: $u-tips-color;
			}
			.delivery-time {
				color: #e5d001;
				font-size: 24upx;
			}
		}
		.right {
			margin-left: 10upx;
			padding-top: 20upx;
			text-align: right;
			.decimal {
				font-size: 24upx;
				margin-top: 4upx;
			}
			.number {
				color: $u-tips-color;
				font-size: 24upx;
			}
		}
	}
	.total {
		margin-top: 20upx;
		text-align: right;
		font-size: 24upx;
		.total-price {
			font-size: 32upx;
		}
	}
	.bottom {
		display: flex;
		margin-top: 40upx;
		// padding: 0 10upx;
		justify-content: space-between;
		align-items: center;
		.btn {
			line-height: 52upx;
			width: 160upx;
			border-radius: 26upx;
			border: 2upx solid $u-border-color;
			font-size: 26upx;
			text-align: center;
			color: $u-type-info-dark;
			margin-right: 10upx;
		}
		.evaluate {
			color: $u-type-warning-dark;
			border-color: $u-type-warning-dark;
		}
	}
}
.centre {
	text-align: center;
	padding-top: 200upx;
	font-size: 32upx;
	image {
		width: 200upx;
		height: 200upx;
		border-radius: 50%;
		margin-bottom: 20upx;
	}
	.tips {
		font-size: 24upx;
		color: #999999;
		margin-top: 20upx;
	}
	.btn {
		margin: 80upx auto;
		width: 200upx;
		border-radius: 32upx;
		line-height: 64upx;
		color: #ffffff;
		font-size: 26upx;
		background: linear-gradient(
			270deg,
			rgba(249, 116, 90, 1) 0%,
			rgba(255, 158, 1, 1) 100%
		);
	}
}
.wrap {
	display: flex;
	flex-direction: column;
	height: calc(100vh - var(--window-top));
	width: 100%;
}
.swiper-box {
	flex: 1;
}
.swiper-item {
	height: 100%;
}
</style>
