<template>
	<view style="overflow-x: hidden;">
		<view class="bg">
			<image class="bg-img" src="@/static/vip/bg.png" mode=""></image>
		</view>

		<!-- 		<view class="nav" :style="{ paddingTop: statusBarHeight + 'px' }">
			<image class="nav-back" src="@/static/vip/back.png" mode="" @click="back"></image>
			<text class="nav-title">会员中心</text>
			<view class="nav-space"></view>
		</view> -->
		<!-- :style="{marginTop: statusBarHeight + 44 + 'px'}" -->
		<view class="info">
			<image class="info-bg" src="@/static/vip/info-bg.png" mode=""></image>

			<view class="info-content" style="padding-top:80upx;">
				<view class="info-avatar-c margin-right">
					<image
						class="info-avatar-pic-c"
						:src="userInfo.avatar"
						mode=""
					></image>
				</view>
				<view class="info-name">
					<text class="info-name">{{ userInfo.nickname }}</text>
					<text class="info-level">
						{{ userInfo.is_vip == 0 ? ' 普通用户' : '尊贵会员' }}</text
					>
				</view>
			</view>
			<view class="info-asset">
				<text class="iai-title" v-if="userInfo.end_vip_time"
					>会员到期时间: {{ userInfo.end_vip_time }}</text
				>
			</view>
			<!-- <view class="info-asset">
				<view class="info-asset-item">
					<text class="iai-title">积分</text>
					<text class="iai-value">0</text>
				</view>
				<view class="info-asset-item">
					<text class="iai-title">金币</text>
					<text class="iai-value">2563</text>
				</view>
				<view class="info-asset-item">
					<text class="iai-title">优惠券</text>
					<text class="iai-value">3</text>
				</view>
			</view> -->
		</view>

		<view class="main-title">
			<text>会员充值</text>
		</view>

		<scroll-view scroll-x>
			<view class="recharge">
				<view
					class="recharge-item"
					:class="current == index ? 'recharge-item-active' : ''"
					v-for="(item, index) in rechargeOptions"
					:key="index"
					:style="{ marginLeft: !index ? '30upx' : '' }"
					@click="rechargeChange(index)"
				>
					<!-- <view class="recharge-tag" v-if="item.showTag">
						<text class="recharge-tag-text">限时特价 送豪礼</text>
					</view> -->
					<text class="recharge-item-duration">{{ item.month + ' 个月' }}</text>
					<view class="recharge-item-price">
						<text class="rmb">￥</text>
						<text class="recharge-item-price-text">{{ item.money/100 }}</text>
					</view>
					<!-- <text class="recharge-item-des" v-for="(desItem, desIndex) in item.des" :key="desIndex">{{ desItem }}</text> -->
				</view>
			</view>
		</scroll-view>

		<view class="button update" hover-class="hover" @click="updateNow">
			<text class="button-text">立即升级</text>
		</view>

		<!-- <text class="tip">升级得800金币</text> -->

		<view class="main-title">
			<text>会员特权</text>
		</view>

		<view class="privilege">
			<view
				class="privilege-item"
				v-for="(item, index) in privilegeList"
				:key="index"
				hover-class="hover"
				@click="privilegeClick(index)"
			>
				<image class="privilege-item-pic" :src="item.pic" mode=""></image>
				<text class="privilege-item-text">{{ item.text }}</text>
			</view>
		</view>

		<!-- <view class="level">
			<view class="level-rate">
				<text class="level-rate-text1">当前返利比例</text>
				<text class="level-rate-text2">25%</text>
			</view>

			<view class="level-info">
				<image class="level-info-icon" src="@@/static/vip/vip.png" mode=""></image>
				<text class="level-info-text">V1至尊会员</text>
				<text class="level-info-integral">0</text>
			</view>

			<view class="level-distance">
				<text class="level-distance-text">距V1会员还有1250点</text>
				<view class="button level-distance-button" hover-class="hover">
					<text class="button-text">查看详情</text>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
import { profileme, vipConfig, setVip } from '@/api/userInfo';
export default {
	data() {
		return {
			statusBarHeight,
			current: 0,
			rechargeOptions: [
				// {
				// 	duration: '1个月',
				// 	price: 15,
				// 	des: ['联合月卡'],
				// 	showTag: true
				// },
				// {
				// 	duration: '3个月',
				// 	price: 35,
				// 	des: ['联合月卡'],
				// 	showTag: false
				// },
				// {
				// 	duration: '12个月',
				// 	price: 88,
				// 	des: ['到期自动续费', '可随时关闭'],
				// 	showTag: true
				// }
				// {
				// 	duration: '12个月',
				// 	price: 88,
				// 	des: [
				// 		'到期自动续费',
				// 		'可随时关闭'
				// 	],
				// 	showTag: true
				// },
				// {
				// 	duration: '1个月',
				// 	price: 15,
				// 	des: [
				// 		'联合月卡'
				// 	],
				// 	showTag: false
				// },
				// {
				// 	duration: '连续包月',
				// 	price: 10,
				// 	des: [
				// 		'到期自动续费',
				// 		'可随时关闭'
				// 	],
				// 	showTag: false
				// },
				// {
				// 	duration: '连续包年',
				// 	price: 70,
				// 	des: [
				// 		'到期自动续费',
				// 		'可随时关闭'
				// 	],
				// 	showTag: true
				// }
			],
			privilegeList: [
				{
					pic: '../../../static/vip/coin.png',
					text: '每日金币'
				},
				{
					pic: '../../../static/vip/quan.png',
					text: '大额神券'
				},
				{
					pic: '../../../static/vip/red-bag.png',
					text: '更多返利'
				},
				{
					pic: '../../../static/vip/goods.png',
					text: '精选商品'
				},
				{
					pic: '../../../static/vip/speed.png',
					text: '极速到账'
				},
				{
					pic: '../../../static/vip/share.png',
					text: '分享领券'
				},
				{
					pic: '../../../static/vip/active.png',
					text: '专享活动'
				},
				{
					pic: '../../../static/vip/birthday.png',
					text: '生日折扣'
				}
				// {
				// 	pic: '@/static/vip/notic.png',
				// 	text: '上架提醒'
				// },
				// {
				// 	pic: '@/static/vip/kefu.png',
				// 	text: '专属客服'
				// }
			],
			userInfo: {}
		};
	},
	created() {
		this.getinfo();
		this.getVipMoney();
	},
	methods: {
		async getinfo() {
			await this.$http
				.get(profileme)
				.then(async r => {
					this.loading = false;
					console.log(r);
					uni.setStorageSync('userInfo', r.data);
					this.userInfo = r.data;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		async getVipMoney() {
			await this.$http
				.get(vipConfig)
				.then(async r => {
					this.loading = false;
					this.rechargeOptions = r.data.vip_config;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		rechargeChange(index) {
			this.current = index;
		},
		updateNow() {
			this.goOnPay(this.rechargeOptions[this.current]);
		},
		//购买会员

		async goOnPay(data) {
			// #ifdef APP-PLUS
			const prames = {
				month: data.month,
				money: data.money,
				remark: ''
			};
			uni.showLoading({ title: '支付中' });
			await this.$http.post(`${setVip}`, prames).then(r => {
				console.log(r);
				uni.requestPayment({
					provider: 'wxpay', // 微信支付
					orderInfo: JSON.stringify(r.data), //微信订单数据 r.data.config
					success: () => {
						console.log('支付成功了');
						uni.hideLoading();
						this.$mHelper.toast('支付成功');
						this.getinfo();
						// this.$mRouter.redirectTo({
						// 	route: '/pages/order/orderjilu/orderjilu'
						// });
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
		privilegeClick(index) {
			uni.showToast({
				icon: 'none',
				title: `点击了「${this.privilegeList[index].text}」`
			});
		},
		back() {
			uni.showToast({
				icon: 'none',
				title: '返回'
			});
		}
	}
};
</script>

<style lang="scss">
.info-avatar-c {
	width: 130upx;
	height: 130upx;
	border: 5upx solid #fff;
	border-radius: 50%;
	overflow: hidden;
	.info-avatar-pic-c {
		width: 100%;
		height: 100%;
	}
}
.main-title {
	padding: 30upx 30upx;
	font-size: 34upx;
	color: #1c1c1c;
}

.tip {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	font-size: 24upx;
	color: #a5a3a2;
}

.rmb {
	font-size: 26upx;
	color: #e3be83;
}

.bg {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 320upx;
	z-index: -2;

	&-img {
		width: 100%;
		height: 100%;
	}
}

.hover {
	opacity: 0.7;
}

.nav {
	position: fixed;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 750upx;
	height: 44px;
	padding: 0 30upx;
	background-image: url('@/static/vip/nav-bg.png');
	background-size: 100%;
	z-index: 99;

	&-back {
		width: 20upx;
		height: 40upx;
	}

	&-title {
		color: #ffffff;
		font-size: 42upx;
	}

	&-space {
		width: 70upx;
		height: 40upx;
	}
}

.info {
	position: relative;
	padding: 0 15upx;
	width: 730upx;
	height: 360upx;
	margin-top: 40upx;
	&-bg {
		position: absolute;
		width: 730upx;
		height: 360upx;
		z-index: -1;
	}

	&-content {
		padding: 70upx 50upx 0 50upx;
		margin-bottom: 50upx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	&-avatar {
		margin-right: 30upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 85upx;
		height: 85upx;
		background-color: #fff;
		padding: 1upx;
		border-radius: 50%;

		&-pic {
			width: 83upx;
			height: 83upx;
		}
	}

	&-name {
		display: flex;
		flex-direction: column;
		color: #ffffff;
		font-size: 35upx;
	}

	&-level {
		margin-top: 15upx;
		font-size: 24upx;
	}

	&-asset {
		padding: 0 50upx;
		display: flex;
		flex-direction: row;
		align-items: center;

		&-item {
			display: flex;
			flex-direction: column;
		}
	}
}

.iai {
	&-title {
		margin-bottom: 20upx;
		margin-right: 100upx;
		font-size: 24upx;
		color: #cfb386;
	}

	&-value {
		font-size: 35upx;
		color: #ffffff;
	}
}

.recharge {
	position: relative;
	margin-bottom: 35upx;
	display: flex;
	flex-direction: row;
	align-items: center;

	&-tag {
		position: absolute;
		top: -2upx;
		left: -2upx;
		width: 170upx;
		height: 36upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-image: url('@/static/vip/tag.png');
		background-size: 100%;

		&-text {
			font-size: 20upx;
			color: #ffffff;
			text-align: center;
		}
	}

	&-item {
		position: relative;
		padding: 40upx 0;
		margin-left: 15upx;
		width: 200upx;
		height: 230upx;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		border: solid 2upx #f2f2f3;
		border-radius: 12upx;

		&-active {
			border-color: #edd2a9;
			background-color: #fbf1e5;
		}

		&-duration {
			margin-bottom: 30upx;
			font-size: 26upx;
			color: #1c1c1c;
		}

		&-price {
			margin-bottom: 20upx;
			display: flex;
			flex-direction: row;
			align-items: baseline;

			&-text {
				font-size: 48upx;
				color: #e3be83;
			}
		}

		&-des {
			font-size: 22upx;
			color: #a5a3a2;
		}
	}
}

.button {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	height: 85upx;
	border-radius: 50upx;
	background-image: linear-gradient(#efcf9e, #e4bf85);

	&-text {
		font-size: 30upx;
		color: #1c1c1c;
	}
}

.update {
	margin: 35upx 30upx 20upx 30upx;
}

.privilege {
	padding: 0 30upx;
	margin-bottom: 40upx;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
	flex-wrap: wrap;

	&-item {
		margin: 0 23upx;
		margin-bottom: 25upx;
		display: flex;
		flex-direction: column;
		align-items: center;

		&-pic {
			width: 80upx;
			height: 80upx;
			margin-bottom: 20upx;
		}

		&-text {
			font-size: 24upx;
			color: #383738;
		}
	}
}

.level {
	position: relative;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 750upx;
	height: 466upx;
	background-image: url('@/static/vip/vip-bg.png');
	background-size: 100%;

	&-rate {
		position: absolute;
		top: 43upx;
		left: 33upx;
		display: flex;
		flex-direction: row;
		align-items: center;

		&-text1 {
			margin-right: 20upx;
			color: #1c1c1c;
			font-size: 34upx;
		}

		&-text2 {
			font-size: 34upx;
			color: #c07c07;
		}
	}

	&-info {
		// position: absolute;
		// top: 188upx;
		// left: 350upx;
		margin-top: 20upx;
		display: flex;
		flex-direction: column;
		align-items: center;

		&-icon {
			margin-bottom: 20upx;
			width: 48upx;
			height: 38upx;
		}

		&-text {
			margin-bottom: 20upx;
			font-size: 26upx;
			color: #292929;
		}

		&-integral {
			font-size: 40upx;
			color: #c07c07;
		}
	}

	&-distance {
		position: absolute;
		left: 30upx;
		right: 30upx;
		bottom: 35upx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;

		&-text {
			font-size: 26upx;
			color: #292929;
		}

		&-button {
			padding: 0 30upx;
			height: 60upx;
		}
	}
}
</style>
