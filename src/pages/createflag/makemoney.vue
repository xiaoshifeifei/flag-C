<template>
	<view class="product">
		<view class="createflag-box">
			<view class="cu-bar bg-white margin-right">
				<view class="action sub-title">
					<text class="text-xl text-bold text-orange"
						>挑战金(挑战成功金额返回)</text
					>
					<text class="bg-orange" style="width: 2rem"></text>
					<!-- last-child选择器-->
				</view>
				<!-- <view class="text-cut margin-left"
          >规则
          <u-icon color="#969799" name="arrow-right"></u-icon>
        </view> -->
			</view>
			<!-- <u-cell-group> -->
			<!-- <u-cell-item icon="integral-fill" title="挑战金(挑战成功金额返回)" value="规则"></u-cell-item> -->
			<!-- </u-cell-group> -->
			<view
				class="grid margin-bottom margin-right text-center col-3 margin-top"
			>
				<view
					class="grid margin-bottom text-center flex align-center justify-center"
					v-for="(item, index) in dayList"
					:key="index"
				>
					<view
						v-if="item.type == 'input'"
						@click="clickCur(index)"
						class="day-create"
						:class="[item.cur ? 'bg-orange' : 'bg-gray-zj']"
					>
						<input
							v-model="item.day"
							@input="onInput"
							@focus="InputFocus"
							@blur="InputBlur"
							cursorSpacing="10"
							cursor-spacing="10"
							:placeholder="item.text"
							type="number"
						/>
					</view>
					<view
						v-else
						@click="clickCur(index)"
						class="day-create"
						:class="[item.cur ? 'bg-orange' : 'bg-gray-zj']"
						>{{ item.day }}元</view
					>
				</view>
			</view>
			<view class="padding">
				<u-circle-progress active-color="#ff9900" :percent="percent">
					<view class="u-progress-content">
						<view class="u-progress-dot"></view>
						<text class="u-progress-info">挑战中</text>
					</view>
				</u-circle-progress>
				<text class="tiaozhang">您的挑战决心超越了{{ percent }}%</text>
			</view>
			<view class="cu-bar bg-white">
				<view class="action sub-title">
					<text class="text-xl text-bold text-orange"
						>挑战失败，回馈围观者</text
					>
					<text class="bg-orange" style="width: 2rem"></text>
					<!-- last-child选择器-->
				</view>
			</view>
			<view class="padding">
				<view class="">
					<u-radio-group
						:wrap="true"
						v-model="valueone"
						@change="radioGroupChange"
					>
						<u-radio
							active-color="#ff9900"
							:name="listone[0].name"
							:disabled="listone[0].disabled"
						>
							{{ listone[0].title }}
						</u-radio>
						<!-- <u-radio
              class="margin-top"
              active-color="#ff9900"
              :name="listone[1].name"
              :disabled="listone[1].disabled"
            >
              {{ listone[1].title }}
            </u-radio> -->
					</u-radio-group>
				</view>
				<view v-if="radiotwo" class="margin-top flex middle justify-end">
					<view class="text-cut margin-left" @tap="toggleMask('show')"
						>{{ couponItem.title || '选择商品' }}
						<u-icon color="#969799" name="arrow-right"></u-icon>
					</view>
				</view>
			</view>
		</view>

		<!-- 商品面板 -->
		<view
			class="mask"
			:class="maskState === 1 ? 'show' : 'none'"
			@tap="toggleMask()"
		>
			<view class="mask-content" @tap.stop.prevent="stopPrevent">
				<!-- 优惠券列表 -->
				<view class="sub-list valid">
					<view
						class="row"
						v-for="(item, index) in orderDetail.coupons"
						:key="index"
						@tap.stop="selectCoupon(item)"
					>
						<view
							class="carrier"
							:class="
								parseFloat(amountGoods) > parseFloat(item.at_least)
									? ''
									: 'rf-opacity'
							"
						>
							<view class="title">
								<view class="flex align-center justify-center">
									<text
										style="margin-top: 0px"
										class="cell-icon"
										:class="'bg-' + themeColor.name"
										>{{
											parseInt(item.range_type, 10) === 2 ? '限' : '商'
										}}</text
									>
									<text class="cell-title">{{ item.title }}</text>
								</view>
								<!-- 			<view>
									<text class="price" :class="'text-' + themeColor.name" v-if="item.type === '1'">{{ moneySymbol }}{{ item.money }}</text>
									<text class="price-discount" :class="'text-' + themeColor.name" v-else>{{ `${item.discount / 10}折` }}</text>
								</view> -->
							</view>
							<view class="term">
								<!-- <text>{{ item.start_time || time }}
									{{ item.end_time || time }}</text> -->
								<text class="at_least">{{ item.at_least }}元</text>
							</view>
							<view class="usage">
								<text>
									{{
										parseInt(item.range_type, 10) === 2
											? '部分产品使用'
											: '挑战金产品使用'
									}}
								</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 优惠券页面，仿mt -->
				<text
					class="no-coupon"
					v-if="orderDetail.coupons && orderDetail.coupons.length === 0"
					>暂无优惠券</text
				>
			</view>
		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom" style="padding: 10px 0">
			<u-button
				@click="createFlag"
				shape="circle"
				style="width: 80%; padding: 20px 0"
				size="medium"
				type="warning"
				>创建flag</u-button
			>
		</view>

		<!--回到顶部-->
		<rf-back-top :scrollTop="scrollTop"></rf-back-top>
		<!-- 404页面 -->
		<view v-if="!productDetail.name && !loading">
			<rf-no-data :custom="true">
				<view class="no-data-title">
					{{ errorInfo || '暂无数据' }}
				</view>
				<view
					@tap="getProductDetail(productDetail.id)"
					slot="refresh"
					class="spec-color"
					>重新加载</view
				>
			</rf-no-data>
		</view>
		<!--顶部下拉菜单-->
		<rf-nav-detail @hide="hideNavDetail" :popupShow="navDetailShow">
		</rf-nav-detail>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
import rfProductDetail from '@/components/rf-product-detail';
import rfBackTop from '@/components/rf-back-top';
import rfNoData from '@/components/rf-no-data';
import { orderFlagset } from '@/api/userInfo';
export default {
	components: {
		rfProductDetail,
		rfBackTop,
		rfNoData
	},
	data() {
		return {
			productDetail: {
				name: '111'
			},
			toGetherData: {
				realityNumber: 0,
				shouldNumber: 0
			},
			loading: true,
			errorInfo: '',
			userInfo: {},
			scrollTop: 0,
			currentUrl: '',
			navDetailShow: false,
			appName: this.$mSettingConfig.appName,
			dayList: [
				{
					day: '10',
					cur: true,
					id: 1
				},
				{
					day: '30',
					cur: false,
					id: 2
				},
				{
					day: '60',
					cur: false,
					id: 3
				},
				{
					day: '80',
					cur: false,
					id: 4
				},
				// {
				//   day: '不设置挑战金',
				//   cur: false,
				// },
				{
					day: '',
					cur: false,
					type: 'input',
					id: 5,
					text: '自定义金额'
				}
			],

			percent: 10,
			checked: true,
			listone: [
				{
					title: '挑战金瓜分',
					name: 'one',
					disabled: false
				}
				// {
				//   title: '围观者抽商品',
				//   name: 'two',
				//   disabled: false,
				// },
			],
			radiotwo: false,
			listtwo: [
				{
					title: '围观者抽商品',
					name: 'two',
					disabled: false
				}
			],
			// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
			valueone: 'one',
			valuetwo: '',

			// 商品面板
			maskState: 0, // 优惠券面板显示状态
			couponItem: {},
			orderDetail: {
				coupons: [
					{
						at_least: '100',
						range_type: '1',
						title: '平板电脑平板电脑平板电脑',
						discount: '10',
						start_time: '2020-10-10',
						end_time: '2020-10-10'
					},
					{
						at_least: '90',
						range_type: '1',
						title: '平板电脑平板电脑平板电脑平板电脑平板电脑',
						discount: '10',
						start_time: '2020-10-10',
						end_time: '2020-10-10'
					}
				]
			}
		};
	},
	// #ifndef MP
	onNavigationBarButtonTap(e) {
		const index = e.index;
		if (index === 0) {
			this.navDetailShow = true;
		}
	},
	// #endif
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	async onLoad(options) {
		this.loading = false;
	},
	computed: {
		// 计算商品金额
		amountGoods() {
			// return this.orderDetail.preview && this.orderDetail.preview.product_money
			return 91;
		}
	},
	methods: {
		radioGroupChange(e) {
			this.radioone;
			console.log(e);
			if (e == 'two') {
				this.radiotwo = true;
			} else {
				this.radiotwo = false;
			}
		},

		// 隐藏顶部导航
		hideNavDetail() {
			this.navDetailShow = false;
		},
		clickCur(idx) {
			this.dayList.forEach((item, index) => {
				if (idx == index) {
					item.cur = true;
					//   var percent = isNaN(parseInt(item.day))?0:parseInt(item.day);
					let percent = parseInt(item.day);
					if (isNaN(percent)) {
						this.percent = 0;
					}
					if (percent != '') {
						if (percent < 100) {
							this.percent = percent;
						} else {
							if (!isNaN(percent)) {
								this.percent = 100;
							}
						}
					}
				} else {
					item.cur = false;
					if (item.id == 5) {
						item.day = '';
					}
				}
			});
		},
		InputFocus(e) {
			console.log(e);
		},
		InputBlur(e) {},
		onInput(e) {
			let percent = parseInt(e.detail.value);
			if (isNaN(percent)) {
				this.percent = 0;
			}
			if (percent != '') {
				if (percent < 100) {
					this.percent = percent;
				} else {
					if (!isNaN(percent)) {
						this.percent = 100;
					}
				}
			}

			this.dayList.forEach(item => {
				if (item.id == 5) {
					//正则表达试
					e.detail.value = e.detail.value.match(/^\d*(\.?\d{0,2})/g)[0] || null;
					//重新赋值给input
					this.$nextTick(() => {
						item.day = e.detail.value;
					});

					// item.day = parseInt(e.detail.value);
				}
			});
		},
		createFlag() {
			var creatData = uni.getStorageSync('creatFlag');

			this.dayList.forEach(item => {
				if (item.cur) {
					creatData.money = item.day;
					console.log(item);
					if (item.day == '' || isNaN(item.day)) {
						this.$mHelper.toast('请输入金额');
						return false;
					}
					if (item.day == 0) {
						this.$mHelper.toast('请输入大于0金额');
						return false;
					}
					this.goOnPay(creatData);
					return false;
				}
			});
			console.log(creatData);
			// var reg = /[\u4e00-\u9fa5]/g;
			// var regs = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
			// if (regs.test()) {
			// 	console.log('有中文');
			// }

			//   this.$mHelper.toast('暂未开发,敬请期待');
		},

		//购买会员

		async goOnPay(data) {
			// #ifdef APP-PLUS
			const prames = {
				content: data.content,
				money: data.money,
				days: data.day
			};
			if (this.$mStore.getters.hasLogin) {
				uni.showLoading({ title: '支付中' });
			} else {
			}

			await this.$http.post(`${orderFlagset}`, prames).then(r => {
				console.log(r);
				uni.requestPayment({
					provider: 'wxpay', // 微信支付
					orderInfo: JSON.stringify(r.data), //微信订单数据 r.data.config
					success: () => {
						console.log('支付成功了');
						uni.hideLoading();
						this.$mHelper.toast('支付成功');

						this.$mRouter.redirectTo({
							// route: '/pages/wgsite/wgsite?homeguol=true'
							route: `/pages/createflag/ordersuccess?id=${r.data.flag_id}`
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

		// 商品面板
		toggleMask(type) {
			// if ('combination,wholesale,group_buy'.indexOf(this.data.type) !== -1) {
			// 	this.$mHelper.toast('套餐购买/拼团/团购下单不支持选择购物券')
			// 	return
			// }
			const timer = type === 'show' ? 10 : 300;
			const state = type === 'show' ? 1 : 0;
			this.maskState = 2;
			setTimeout(() => {
				this.maskState = state;
			}, timer);
		},
		selectCoupon(item) {
			if (parseFloat(item.at_least) > parseFloat(this.amountGoods)) {
				this.$mHelper.toast('您的挑战金不满足使用条件~');
				return;
			}
			this.maskState = 0;
			this.couponItem = item;
		}
	}
};
</script>
<style scoped lang="scss">
.day-create {
	padding: 15upx;
	border-radius: 10px;
}

.tiaozhang {
	color: red;
	font-weight: bold;
	font-size: $font-lg;
	margin-left: 20upx;
}

.bg-gray-zj {
	background-color: #f8f8f9;
}

page {
	background: $color-white !important;
}

body {
	background: $color-white !important;
}

.createflag-box {
	// padding-top: 80upx;
	background-color: $color-white !important;
	height: 100vh;
}

.cu-textarea {
	border-radius: 10px;
	border: 1px solid #bbb;
	padding: 30upx !important;
	height: 200px !important;
}

/* 优惠券面板 */
.mask {
	display: flex;
	align-items: flex-end;
	position: fixed;
	left: 0;
	top: var(--window-top);
	bottom: 0;
	width: 100%;
	background: rgba(0, 0, 0, 0);
	z-index: 99;
	transition: 0.3s;

	.mask-content {
		width: 100%;
		max-height: 70vh;
		min-height: 16vh;
		background: #f3f3f3;
		transform: translateY(100%);
		transition: 0.3s;
		overflow-y: scroll;

		.sub-list {
			padding: $spacing-lg;

			.radio-wrapper {
				display: flex;
				justify-content: space-between;
			}

			.title {
				// width: 300upx;
			}

			.invoice-content {
				.invoice-content-item-radio {
					margin: 0 $spacing-sm $spacing-sm $spacing-base;
				}
			}
		}

		.confirm-btn {
			margin: $spacing-base auto $spacing-lg;
		}
	}

	&.none {
		display: none;
	}

	&.show {
		background: rgba(0, 0, 0, 0.4);

		.mask-content {
			transform: translateY(0);
		}
	}
}
</style>
