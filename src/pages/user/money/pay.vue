<template>
	<view class="pay" v-if="!loading">
		<!-- <cu-custom bgColor="" :isBack="true" :class="'bg-' + themeColor.name">
      <block slot="content">支付</block>
    </cu-custom> -->
		<view class="pay-section" :class="'bg-' + themeColor.name">
			<image class="bg" :src="moneyBg"></image>
			<view class="tips-wrapper">
				<text class="title">支付金额</text>
				<view class="tip">{{ moneySymbol }}{{ money/100 }}</view>
			</view>
		</view>
		<view class="pay-type-list">
			<view
				class="type-item"
				:class="payType === 1 ? 'type-item-active text-' + themeColor.name : ''"
				@tap="changePayType(1)"
				v-if="parseInt(payTypeList.order_wechat_pay, 10) === 1"
			>
				<i
					class="iconfont iconweixinzhifu"
					:style="{ color: payType === 1 ? '#36cb59' : '' }"
				></i>
				<view class="con">
					<text
						class="tit"
						:class="payType === 1 ? 'text-' + themeColor.name : ''"
						>微信支付</text
					>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio
						size="12"
						value=""
						:color="themeColor.color"
						:checked="payType == 1"
					/>
				</label>
			</view>
			<!-- #ifndef MP-WEIXIN -->
			<!-- <view
				class="type-item"
				:class="
					payType === 'ALIPAY'
						? 'type-item-active text-' + themeColor.name
						: ''
				"
				@tap="changePayType('ALIPAY')"
				v-if="
					parseInt(payTypeList.order_ali_pay, 10) === 1 && !isWechat
				"
			>
				<i
					class="iconfont iconalipay"
					:style="{ color: payType === 'ALIPAY' ? '#01aaef' : '' }"
				></i>
				<view class="con">
					<text
						class="tit"
						:class="
							payType === 'ALIPAY'
								? 'text-' + themeColor.name
								: ''
						"
						>支付宝支付</text
					>
					<text>推荐使用支付宝支付</text>
				</view>
				<label class="radio">
					<radio
						value=""
						:color="themeColor.color"
						:checked="payType == 'ALIPAY'"
					/>
				</label>
			</view> -->
			<!-- #endif-->
			<!-- <view
				class="type-item"
				:class="
					payType === 5
						? 'type-item-active text-' + themeColor.name
						: ''
				"
				@tap="changePayType(5)"
				v-if="payTypeList.order_balance_pay === '1'"
			>
				<i
					class="iconfont iconerjiye-yucunkuan"
					:style="{ color: payType === 5 ? '#fe8e2e' : '' }"
				></i>
				<view class="con">
					<text
						class="tit"
						:class="payType === 5 ? 'text-' + themeColor.name : ''"
						>余额支付</text
					>
					<text
						>可用余额 {{ moneySymbol
						}}{{ userInfo && userInfo.balance }}</text
					>
				</view>
				<label class="radio">
					<radio
						value=""
						:color="themeColor.color"
						:checked="payType === 5"
					/>
				</label>
			</view> -->
		</view>
		<button
			class="confirm-btn"
			:class="'bg-' + themeColor.name"
			:disabled="btnLoading"
			:loading="btnLoading"
			@tap="confirm"
		>
			确认支付
		</button>
		<button
			class="confirm-btn"
			:class="'text-' + themeColor.name"
			style="margin-top: 20px"
			@tap="returnIndex"
		>
			返回首页
		</button>

		<rf-box
			title="余额支付"
			v-if="payPasswordShow"
			okText="确认支付"
			@close="payPasswordShow = false"
			@ok="payPasswordSub()"
		>
			<view class="row b-b">
				<text class="tit">支付密码</text>
				<input
					class="input"
					type="password"
					placeholder="请输入支付密码"
					v-model="payPassword"
					placeholder-class="placeholder"
				/>
			</view>
		</rf-box>
		<rf-box
			title="提示"
			v-if="toSetPasswordShow"
			okText="去设置"
			@close="toSetPasswordShow = false"
			@ok="toSetPassword()"
		>
			<view>您还没有设置支付密码，无法使用余额支付，去设置？</view>
		</rf-box>
	</view>
</template>

<script>
import {
	memberOtherInfo,
	validationPayPassword,
	hasPayPassword
} from '@/api/userInfo';
import { orderPreview, orderBuyByBalance } from '@/api/product';
export default {
	data() {
		return {
			payPassword: '',
			payPasswordShow: false,
			toSetPasswordShow: false,
			isWechat: this.$mPayment.isWechat(),
			payType: 5,
			payTypeList: {
				order_ali_pay: '1',
				order_balance_pay: '1',
				order_wechat_pay: '1'
			},
			money: 0,
			userInfo: {},
			moneySymbol: this.moneySymbol,
			orderDetail: {},
			orderInfo: {},
			btnLoading: false,
			loading: false,
			type: '',
			moneyBg: this.$mAssetsPath.moneyBg,
			marketingId: '',
			id: '',
			taskid: '',
			type: '',
			price: '',
			product_id: '',
			address_id: '',
			remark: '',
      paytype: '',
      task_id:''
		};
	},
	computed: {},
	onLoad(options) {
		this.initData(options);
		this.money = options.price;
		this.paytype = options.paytype;
		this.task_id = options.task_id;
		this.product_id = options.id;
    this.address_id = options.addr_id;
    this.payType=1
		this.remark = uni.getStorageSync('remark');
	},
	methods: {
		// 数据初始化
		async initData(options) {
			this.id = options.id;
			this.type = options.type;
			this.taskid = options.taskid;
			// await this.getOrderDetail()
			// await this.getUserinfo()
			// if (uni.getSystemInfoSync().platform === 'android') {
			// 	let url =
			// 		window && window.location && window.location.href
			// 			? window.location.href
			// 			: 'http://pingouchina.com/'
			// 	await this.$mPayment.wxConfigH5(url)
			// }
		},

		// 选择支付方式
		changePayType(type) {
			this.payType = type;
		},
		// 获取订单费用
		// async getOrderDetail(id) {
		// 	this.loading = true
		// 	await this.$http
		// 		.get(`${orderPreview}/${id}`, {
		// 			id, // 订单id
		// 			simplify: 1 // 获取简化订单详情
		// 		})
		// 		.then(r => {
		// 			this.loading = false
		// 			if (r.status) {
		// 				this.$mHelper.toast('获取订单详情失败')
		// 			}
		// 			this.orderDetail = r.data
		// 			this.money = r.data.payment
		// 		})
		// 		.catch(err => {
		// 			this.loading = false
		// 			this.errorInfo = err
		// 		})
		// },
		// async getUserinfo() {
		// 	await this.$http
		// 		.get(memberOtherInfo)
		// 		.then(async r => {
		// 			if (r.status) {
		// 				return
		// 			}
		// 			this.userInfo = r.data
		// 		})
		// 		.catch(() => {})
		// },

		// 确认支付
		async confirm() {
			if (this.payType == 1) {
				if (this.paytype == 'liji') {
					console.log(this.paytype);
					let params = {
						product_id: this.product_id,
						address_id: this.address_id,
						remark: this.remark
					};
					await this.$mPayment.weixinPay(params, this.paytype);
				} else {
					console.log(this.paytype);
					console.log(this.task_id);
					let params = {
						product_id: this.product_id,
						address_id: this.address_id,
						task_id: this.task_id
					};
					await this.$mPayment.weixinPay(params, this.paytype);
				}
			} else {
				this.$mHelper.toast('请选择支付方式');
			}

			// this.btnLoading = true
			// const route = `/pages/user/money/success?type=${this.type}&order_id=${this.orderInfo.order_id}`
			// setTimeout(() => {
			// 	this.btnLoading = false
			// }, 0.5 * 1000)
			// switch (this.payType) {

			// 	case 1:
			//         console.log('发起支付')
			// 		await this.$mPayment.weixinPay(
			// 			'order',
			// 			this.orderInfo.order_id,
			// 			route
			// 		)
			// 		break
			// 	case 'ALIPAY':
			// 		await this.$mPayment.aliPay('order', this.orderInfo.order_id, route)
			// 		break
			// 	case 5:
			// 		let ds  = await this.$http.get(hasPayPassword)
			// 		if(!ds.status)
			// 			this.payPasswordShow = true
			// 		else
			// 			this.toSetPasswordShow  = true
			// 		break
			// }
		},

		toSetPassword() {
			this.toSetPasswordShow = false;
			this.$mRouter.push({ route: '/pages/public/password?type=4' });
		},

		async payPasswordSub() {
			let ds = await this.$http.post(validationPayPassword, {
				payPassword: this.payPassword
			});
			if (!ds.status) {
				await this.$mPayment.balancePay(
					this.orderInfo.order_id,
					`/pages/user/money/success?type=${this.type}&order_id=${this.orderInfo.order_id}`
				);
			} else {
				this.$mHelper.toast(ds.msg);
			}
		},

		async balancePay() {
			const params = {};
			params.orderNo = this.orderDetail.orderNo;
			this.loading = true;
			await this.$http
				.post(`${orderBuyByBalance}`, params)
				.then(r => {
					this.loading = false;
					if (r.status) {
						this.$mHelper.toast('订单创建失败： ' + r.msg);
						return;
					}
					this.$mHelper.toast('支付成功');
					this.navTo('/pages/order/order?index=-1');
				})
				.catch(() => {
					this.loading = false;
				});
		},
		returnIndex() {
			this.$mRouter.reLaunch({
				route: '/pages/index/index'
			});
		},

		// 通用跳转
		navTo(route) {
			this.$mRouter.push({
				route
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: $color-white;
}
.row {
	display: flex;
	.tit {
		padding-right: 1em;
	}
}
.pay {
	width: 100%;

	.pay-section {
		height: 400upx;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100vw;
			height: 60vw;
		}

		.tips-wrapper {
			text-align: center;

			.title {
				font-size: $font-lg;
				margin-bottom: $spacing-base;
			}

			.tip {
				font-size: $font-lg + 42upx;
			}
		}
	}
}

.price-box {
	background-color: #fff;
	height: 265upx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-size: 28upx;
	color: #909399;

	.price {
		font-size: 50upx;
		color: #303133;
		margin-top: 12upx;
	}
}

.pay-type-list {
	margin: 60upx 0;
	background-color: #fff;
	padding: 0 40upx;

	.type-item {
		padding: 0 $spacing-lg;
		height: 100upx;
		border-radius: 100upx;
		margin-bottom: $spacing-lg;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 30upx;
		position: relative;
		border: 2upx solid rgba(0, 0, 0, 0.12);
	}

	.type-item-active {
		border: 2upx solid;
	}

	.iconfont {
		font-size: 45upx;
		margin: 0 $spacing-base;
		color: $font-color-light;
	}

	.tit {
		font-size: $font-base;
		margin-bottom: 4upx;
	}

	.tit-active {
		color: $font-color-dark;
	}

	.con {
		flex: 1;
		font-size: $font-sm;
		color: $font-color-light;

		.tit {
			margin-right: $spacing-base;
		}
	}

	.radio {
		radio {
			transform: scale(0.7);
		}
	}
}

.confirm-btn {
	height: 86upx;
	line-height: 86upx;
	width: 70%;
	margin-top: 144upx;
}
</style>
