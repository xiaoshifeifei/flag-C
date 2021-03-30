<template>
	<view class="user">
		<!--头部-->
		<view class="user-section" :class="'bg-' + themeColor.name">
			<image class="bg" :src="userBg"></image>
			<!--用户信息-->
			<view class="user-info-box">
				<!-- <view class="portrait-box" @tap="navTo(hasLogin ? '/pages/user/userinfo/userinfo' : 'login', true)"> -->
				<view class="portrait-box" @tap="navTo(hasLogin ? '1' : 'login', true)">
					<image class="portrait" :src="userInfo.avatar || headImg"></image>
					<view class="username">
						<view v-if="hasLogin">
							<view style="font-size: 16px">{{ userInfo.nickname }}</view>
							<view style="font-size: 16px"> {{ userInfo.mobile }}</view>
							<!-- {{ userInfo.nickname || userInfo.realname || userInfo.username }} -->
						</view>
						<view style="font-size: 24px" v-else> 登录/注册 </view>
						<view v-if="userInfo.promoCode && hasLogin" style="font-size: 12px"
							>邀请码：{{ userInfo.promoCode }}</view
						>
					</view>
				</view>
			</view>
			<!--vip信息-->
			<view
				class="vip-card-box"
				@tap="navTo('/pages/user/account/level', true)"
			>
				<!-- <view class="b-btn">
					{{ vipStatus }}
				</view> -->
				<view class="tit">
					<i class="iconfont iconzuanshi" />
					{{
						userInfo.is_vip == 0 ? appName + ' 普通用户' : appName + '尊贵会员'
					}}
					{{
						userInfo.generalAgencyStatus
							? '-区域：' + userInfo.generalAgencyInfo
							: ''
					}}
				</view>
				<view class="info-asset">
					<text class="iai-title" v-if="userInfo.end_vip_time"
						>会员到期时间: {{ userInfo.end_vip_time }}</text
					>
				</view>
			</view>
		</view>
		<!-- 个人中心 内容区-->
		<view
			class="cover-container"
			:style="[
				{
					transform: coverTransform,
					transition: coverTransition
				}
			]"
			@touchstart="coverTouchstart"
			@touchmove="coverTouchmove"
			@touchend="coverTouchend"
		>
			<image class="arc" :src="arc"></image>
			<!--余额 优惠券 积分信息-->
			<view class="promotion-center">
				<!-- /pages/user/account/account -->
				<list-cell
					icon="iconqianbao"
					:iconColor="themeColor.color"
					@eventClick="navTo('/pages/user/home/home', true)"
					title="我的账户"
				></list-cell>
				<view class="tj-sction">
					<view class="tj-item" v-for="item in amountList" :key="item.title" 		@tap="navTo(item.url, item.link)">
				
						<text
							class="num"
							:class="item.value > 0 ? 'text-' + themeColor.name : ''"
						>
							{{ item.value }}
						</text>
						<text>{{ item.title }}</text>
					</view>
				</view>
			</view>
			<!-- 我的商品 -->
			<view class="promotion-center" v-if="userInfo.role === 2">
				<list-cell
					icon="iconicon1"
					:iconColor="themeColor.color"
					navigateType="add"
					@eventClick="navTo('/pages/product/upload/upload', true)"
					title="我的商品"
				></list-cell>
				<view class="order-section">
					<view
						class="order-item"
						v-for="item in productionSectionList"
						:key="item.title"
						@tap="navTo(item.url)"
						hover-class="common-hover"
						:hover-stay-time="50"
					>
						<text class="num" style="font-size: 18px">{{ item.num }}</text>
						<text>{{ item.title }}</text>
					</view>
				</view>
			</view>
			<!-- 我的订单 -->
			<view class="promotion-center">
				<list-cell
					icon="iconicon1"
					:iconColor="themeColor.color"
					@eventClick="navTo(`/pages/order/order?status=0`, true)"
					title="全部订单"
				></list-cell>
				<view class="order-section">
					<view
						class="order-item"
						v-for="item in orderSectionList"
						:key="item.name"
						@tap="navTo(item.url, true)"
						hover-class="common-hover"
						:hover-stay-time="50"
					>
						<i
							class="iconfont"
							:class="[item.icon, 'text-' + themeColor.name]"
						/>
						<text>{{ item.name }}</text>
						<rf-badge
							v-if="item.num > 0"
							type="error"
							size="small"
							class="badge"
							:text="item.num"
						></rf-badge>
					</view>
				</view>
			</view>
			<!--我的服务-->
			<view class="promotion-center">
				<list-cell
					icon="iconfuwu"
					:iconColor="themeColor.color"
					title="我的服务"
				></list-cell>
				<!-- @eventClick="navTo('/pages/set/set',false)" -->
				<view class="tj-sction">
					<!-- 分类列表 -->
					<view class="category-list">
						<view
							class="category"
							v-for="(item, index) in settingList"
							:key="index"
							:style="{ display: settingItemShowFilter(item.title) }"
							@tap.stop="serviceNav(item)"
							v-show="
								normalUserOnly.indexOf(item.title) === -1 || userInfo.role === 1
							"
						>
							<view v-if="item.title !== '分享'">
								<view class="img">
									<text
										class="iconfont"
										:class="[item.icon, 'text-' + themeColor.name]"
									></text>
								</view>
								<view class="text">{{ item.title }}</view>
							</view>
							<button class="share-btn" open-type="share" @tap="share" v-else>
								<view class="img">
									<text
										class="iconfont"
										:class="[item.icon, 'text-' + themeColor.name]"
									></text>
								</view>
								<view class="text">{{ item.title }}</view>
							</button>
						</view>
					</view>
				</view>
			</view>

			<view
				class="promotion-center"
				style="background-color: transparent"
				v-if="hasLogin"
			>
				<button
					class="confirm-btn"
					v-if="userInfo.role === 1"
					:class="'bg-' + themeColor.name"
					@tap="navTo('/pages/user/userinfo/storeinfo', true)"
				>
					成为商家
				</button>
				<button
					class="confirm-btn confirm-btn-bg text-grey"
					style="background-color: white; margin-top: 20px"
					@tap="logout"
				>
					退出账号
				</button>
			</view>
		</view>

		<!-- 底部弹出 -->

		<u-action-sheet
			:list="actionSheetList"
			v-model="actionSheetShow"
			@click="actionSheetCallback"
		></u-action-sheet>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
/**
 * @des 个人中心
 *
 * @author stav stavyan@qq.com
 * @date 2020-01-10 11:41
 * @copyright 2019
 */
import {
	footPrintList,
	memberInfo,
	memberOtherInfo,
	notifyUnRreadCount,
	storeProNumInfo,
	profileme,
	serviceTel,
	appShare
} from '@/api/userInfo';
import listCell from '@/components/rf-list-cell';
import { mapMutations } from 'vuex';
import rfBadge from '@/components/rf-badge/rf-badge';
import $mAssetsPath from '@/config/assets.config';
import userinfoVue from '../user/userinfo/userinfo.vue';
let startY = 0;
let moveY = 0;
const pageAtTop = true;

//@ts-check

export default {
	components: {
		listCell,
		rfBadge
	},
	data() {
		return {
			settingList: this.$mConstDataConfig.settingList,
			productionSectionList: this.$mConstDataConfig.productionSectionList,
			orderSectionList: this.$mConstDataConfig.orderSectionList,
			amountList: this.$mConstDataConfig.amountList,
			isOpenLiveStreaming: this.$mSettingConfig.isOpenLiveStreaming,
			headImg: this.$mAssetsPath.headImg,
			vipCardBg: this.$mAssetsPath.vipCardBg,
			arc: this.$mAssetsPath.arc,
			userBg: this.$mAssetsPath.userBg,
			coverTransform: 'translateY(0px)',
			coverTransition: '0s',
			moving: false,
			userInfo: {
				// 用户信息
				promoter: null // 分销商信息
			},
			footPrintList: [], // 足迹列表
			loading: true,
			appName: this.$mSettingConfig.appName,
			hasLogin: false,
			normalUserOnly: ['抽奖', '拼团', '地址管理'],
			tel: '',

			// 分享
			//   底部弹出
			actionSheetList: [
				{
					text: '分享到微信朋友'
				},
				{
					text: '分享到微信朋友圈'
				}
			],
			actionSheetShow: false,
			appShareDatas:{}
		};
	},
	filters: {
		filterMemberLevel(val) {
			if (!val) return '普通用户';
			return val.name;
		},
		marketingTypeTag(marketingType) {
			let tag;
			switch (marketingType) {
				case 'discount':
					tag = $mAssetsPath.discountTag;
					break;
				case 'bargain':
					tag = $mAssetsPath.bargainTag;
					break;
				case 'group_buy':
					tag = $mAssetsPath.groupTag;
					break;
				case 'wholesale':
					tag = $mAssetsPath.wholesaleTag;
					break;
			}
			return tag;
		}
	},
	computed: {
		// 判断推广中心是否显示 当有分销商信息的时候显示
		settingItemShowFilter() {
			return function(val) {
				let type = 'block';
				if (val === '推广中心' && this.userInfo.promoter) {
					type = 'none';
				} else if (val === '直播' && !this.isOpenLiveStreaming) {
					type = 'none';
				}
				return type;
			};
		},

		vipStatus() {
			if (this.userInfo.provinceAgencyStatus) return '省级代理';
			if (this.userInfo.generalAgencyStatus) return '市级代理';
			if (this.userInfo.seniorAgencyStatus) return '高级代理';
			if (this.userInfo.agencyStatus) return '代理';
			if (this.userInfo.vipStatus) return 'VIP';
			return '会员中心';
		},
		username() {
			return this.$mStore.state.username;
		}
	},
	// 小程序分享
	onShareAppMessage() {
		return {
			title: `欢迎来到${this.appName}`,
			path: '/pages/index/index'
		};
	},
	onShow() {
		// 初始化数据
		this.initData();
	},
	methods: {
		...mapMutations(['setNotifyNum', 'setCartNum']),
		// 分享
		share() {
			this.actionSheetShow = true;
		},
		// 点击actionSheet回调
		actionSheetCallback(index) {
			uni.hideKeyboard();
			//   console.log(index);
			// let data = {
			// 	href: 'https://www.baidu.com/', //这地址太长了，就省略了
			// 	title:
			// 		'肥狗，没有水的地方叫沙漠，没有你的地方，你知道叫什么吗？不知道。叫寂寞。',
			// 	summary: '肥狗，你有火吗？没有,为何你点燃了我的心？',
			// 	imageUrl:
			// 		'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic4.zhimg.com%2F50%2Fv2-cde006d8fb2711dcf86a373018c42c5d_hd.jpg&refer=http%3A%2F%2Fpic4.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1615890795&t=ce025b78294664c95eb91e0453a04c52'
			// };
			console.log(this.appShareDatas)
			if (index == 0) {
				this.$mflagShare.shareFriend(this.appShareDatas);
			} else if (index == 1) {
				this.$mflagShare.shareFriendcricle(this.appShareDatas);
			}
		},
		...mapMutations(['login']),
		async getinfo() {
			await this.$http
				.get(profileme)
				.then(async r => {
					this.loading = false;
					console.log(r);
					uni.setStorageSync('userInfo', r.data);
					this.userInfo = uni.getStorageSync('userInfo');
					this.amountList.forEach(item => {
						if (item.id == 'wg') {
							item.value = this.userInfo.onlook;
						}
						if (item.id == 'flagnum') {
							item.value = this.userInfo.flag;
						}
						if (item.id == 'money') {
							item.value = this.userInfo.balance / 100;
						}
					});
				})
				.catch(() => {
					this.loading = false;
				});
		},
		async appShareData() {
			await this.$http
				.get(appShare)
				.then(async r => {
					this.loading = false;
					console.log(r);
					if(r.code==0){
						this.appShareDatas=r.data.app_share
					}
				})
				.catch(() => {
					this.loading = false;
				});
		},
		async getTel() {
			await this.$http
				.get(serviceTel)
				.then(async r => {
					this.loading = false;
					console.log(r);
					if (r.code == 0) {
						this.tel = r.data.service_tel;
					}
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 数据初始化
		async initData() {
			this.hasLogin = this.$mStore.getters.hasLogin;
			console.log(this.hasLogin);
			this.getinfo();
			this.getTel();
			this.appShareData();
			// this.userInfo = uni.getStorageSync('loginusername');

			this.loading = false; // new adds
			await this.getMemberInfo();
			console.log(this.amountList);

			// uni.setTabBarStyle({
			//   selectedColor: this.themeColor.color,
			//   borderStyle: 'white'
			// })
			// this.themeColor.tabList && this.themeColor.tabList.forEach((selectedIconPath, index) => {
			//   uni.setTabBarItem({
			//     index,
			//     selectedIconPath
			//   })
			// })

			// HIDE
			//   if (this.hasLogin) {

			//     await this.setProNum();
			//   } else {
			//     this.loading = false;
			//     this.resetSectionData();
			//   }
		},
		async setProNum() {
			await this.$http.get(storeProNumInfo).then(r => {
				if (r.status) {
					return;
				}
				this.productionSectionList[0].num = r.data.hot ? r.data.hot : 0;
				this.productionSectionList[1].num = r.data.pre ? r.data.pre : 0;
				this.productionSectionList[2].num = r.data.all ? r.data.all : 0;
			});
		},
		// 获取用户信息
		async getMemberInfo() {
			const vm = this;
			// const token = uni.getStorageSync('accessToken');
			// await this.$http
			//   .get(profileme)
			//   .then(async (r) => {
			//     this.loading = false;
			//     console.log(r)
			//     // if (r.status) {
			//     //   this.hasLogin = false;
			//     //   return;
			//     // }
			//     // await this.setCartNum(r.data.cart_num)
			//     // await this.initNotifyNum()
			//     // // 获取足迹列表
			//     // await this.getFootPrintList()
			//   })
			//   .catch(() => {
			//     // this.hasLogin = false;
			//     // this.userInfo = {};
			//     // this.resetSectionData();
			//     this.loading = false;
			//   });
			// await this.$http
			// 	.get(memberOtherInfo, token)
			// 	.then(async r => {
			// 		let userInfo = JSON.parse(JSON.stringify(vm.userInfo));
			// 		if (r.status) {
			// 			return;
			// 		}
			// 		// userInfo.promoCode = r.data.promoCode;
			// 		// userInfo.hmb = r.data.hmb;
			// 		// userInfo.balance = r.data.balance;
			// 		// userInfo.vipStatus = r.data.vipStatus;
			// 		// userInfo.agencyStatus = r.data.agencyStatus;
			// 		// userInfo.generalAgencyInfo = r.data.generalAgencyInfo;
			// 		// userInfo.generalAgencyStatus = r.data.generalAgencyStatus;
			// 		// userInfo.integral = r.data.integral;
			// 		// vm.userInfo = userInfo;
			// 		// await this.setSectionData(vm.userInfo);
			// 	})
			// 	.catch(() => {});
		},
		// 设置未读消息个数
		async initNotifyNum() {
			await this.$http.get(notifyUnRreadCount).then(r => {
				this.setNotifyNum(r.data.count);
			});
		},
		// 清空个人中心的各模块状态
		resetSectionData() {
			this.userInfo = {};
			uni.removeTabBarBadge({
				index: this.$mConstDataConfig.cartIndex
			});
			uni.removeTabBarBadge({
				index: this.$mConstDataConfig.notifyIndex
			});
			this.amountList.forEach(item => (item.value = 0));

			// this.orderSectionList[0].num = 0
			// this.orderSectionList[1].num = 0
			// this.orderSectionList[2].num = 0
			// this.orderSectionList[3].num = 0
			// this.orderSectionList[4].num = 0
		},
		// 给个人中心的各模块赋值
		setSectionData(data) {
			// const orderSynthesizeNumArr = []
			// for (const item in data.order_synthesize_num) {
			//   orderSynthesizeNumArr.push(data.order_synthesize_num[item])
			// }
			// for (let i = 0; i < this.orderSectionList.length; i++) {
			//   this.orderSectionList[i].num = orderSynthesizeNumArr[i].toString()
			// }
			// ['balance', 'hmb', 'integral'].forEach((key, i) => {
			//   this.amountList[i] && (this.amountList[i].value = data[key] || 0);
			// });
			// // 更新userInfo缓存
			// uni.setStorageSync('userInfo', data);
		},
		// 获取足迹列表
		async getFootPrintList() {
			await this.$http.get(`${footPrintList}`).then(r => {
				this.footPrintList = r.data;
			});
		},
		serviceNav(item) {
			console.log(item);
			if (item.type == 'share') {
				return false;
			}
			if (item.callService) {
				// window.location.href = 'tel:' + this.$mConstDataConfig.servicePhone
				// #ifdef H5
				window.location.href = 'tel:' + this.tel;
				// #endif
				//#ifdef APP-PLUS
				plus.runtime.openURL('tel:' + this.tel);
				//#endif
			} else {
				// if (!item.route || !item.isLogin) {
				//   this.$mHelper.toast('该功能暂未开放，敬请期待')
				// }
				if (!item.url || !item.link) {
					this.$mHelper.toast('该功能暂未开放，敬请期待');
				}
				this.navTo(item.url, item.link);
			}
		},

		// 统一跳转接口,拦截未登录路由
		navTo(route, isLogin) {
			console.log(route)
			if(route=='/pages/user/account/level') return
			if (route === '1') return;
			if (!route || !isLogin) {
				this.$mHelper.toast('该功能暂未开放，敬请期待');
				return;
			} else if (!this.hasLogin) {
				uni.removeStorageSync('backToPage');
				this.$mRouter.push({
					route: '/pages/public/login'
				});
			} else {
				console.log('-->', route);
				this.$mRouter.push({
					route
				});
			}
		},

		/**
		 *  会员卡下拉和回弹
		 *  1.关闭bounce避免ios端下拉冲突
		 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
		 *    transition设置0.1秒延迟，让css来过渡这段空窗期
		 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
		 */
		coverTouchstart(e) {
			if (pageAtTop === false) {
				return;
			}
			this.coverTransition = 'transform .1s linear';
			startY = e.touches[0].clientY;
		},
		coverTouchmove(e) {
			moveY = e.touches[0].clientY;
			let moveDistance = moveY - startY;
			if (moveDistance < 0) {
				this.moving = false;
				return;
			}
			this.moving = true;
			if (moveDistance >= 80 && moveDistance < 100) {
				moveDistance = 80;
			}
			if (moveDistance > 0 && moveDistance <= 80) {
				this.coverTransform = `translateY(${moveDistance}px)`;
			}
		},
		coverTouchend() {
			if (this.moving === false) {
				return;
			}
			this.moving = false;
			this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
			this.coverTransform = 'translateY(0px)';
		},
		// 跳转至商品详情
		navToProduct(type, id) {
			let route = `/pages/product/product?id=${id}`;
			switch (type) {
				case 'discount':
					route = `/pages/marketing/discount/product?id=${id}`;
					break;
				case 'bargain':
					route = `/pages/marketing/bargain/product?id=${id}`;
					break;
				case 'group_buy':
					route = `/pages/marketing/group/product?id=${id}`;
					break;
				case 'wholesale':
					route = `/pages/marketing/wholesale/product?id=${id}`;
					break;
			}
			this.$mRouter.push({
				route
			});
		},

		logout() {
			// this.$mRouter.push({
			//   route: '/pages/public/login',
			// });
			// this.$mStore.commit('logout');
			uni.showModal({
				content: '确定要退出登录么',
				success: e => {
					if (e.confirm) {
						// this.$http.post(`${logout}`).then(() => {
						this.$mStore.commit('logout');
						uni.reLaunch({
							url: '/pages/profile/profile'
						});
						// });
					}
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
page {
	background-color: $page-color-base;
}

.user {
	.user-section {
		height: 520upx;
		padding: 100upx 30upx 0;
		position: relative;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100vw;
			height: 60vw;
			opacity: 0.84;
		}

		.user-info-box {
			height: 180upx;
			display: flex;
			align-items: center;
			position: relative;
			z-index: 1;
			justify-content: space-between;

			.portrait-box {
				display: flex;
				align-items: center;

				.portrait {
					width: 130upx;
					height: 130upx;
					border: 5upx solid #fff;
					border-radius: 50%;
				}

				.username {
					font-size: $font-lg + 6upx;
					color: $color-white;
					margin-left: 20upx;
				}

				button {
					background-color: transparent;
					font-size: $font-lg + 6upx;
					color: $font-color-dark;
					border: none;
				}

				button::after {
					border: none;
				}
			}
		}

		.vip-card-box {
			display: flex;
			flex-direction: column;
			color: #f7d680;
			height: 240upx;
			background: url('/static/vip-card.png');
			background-size: 100% 100%;
			border-radius: 16upx 16upx 0 0;
			overflow: hidden;
			position: relative;
			padding: 20upx 24upx;

			.b-btn,
			.b-btn-2 {
				position: absolute;
				right: 24upx;
				top: 18upx;
				width: 150upx;
				height: 55upx;
				text-align: center;
				line-height: 55upx;
				font-size: 30upx;
				color: #36343c;
				border-radius: 20px;
				background: linear-gradient(to left, #f9e6af, #ffd465);
				z-index: 1;
			}
			.b-btn-2 {
				right: 200upx;
				width: auto;
				padding: 0 15upx;
			}

			.tit {
				font-size: 30upx;
				color: #f7d680;
				margin-bottom: 28upx;

				.iconfont {
					color: #f6e5a3;
					display: inline-block;
					margin-right: 16upx;
				}
			}
		}
	}

	.cover-container {
		margin-top: -120upx;
		padding: 0 30upx 20upx;
		position: relative;
		background-color: $page-color-base;

		.arc {
			position: absolute;
			left: 0;
			top: -34upx;
			width: 100%;
			height: 36upx;
		}

		.promotion-center {
			background: #fff;
			margin-bottom: 20upx;

			/*分类列表*/
			.category-list {
				width: 100%;
				padding: 0 0 30upx 0;
				border-bottom: solid 2upx #f6f6f6;
				display: flex;
				flex-wrap: wrap;

				.category {
					width: 33.3%;
					margin-top: 50upx;
					display: flex;
					justify-content: center;
					flex-wrap: wrap;

					.img {
						width: 100%;
						display: flex;
						justify-content: center;

						.iconfont {
							font-size: $font-lg + 24upx;
						}
					}

					.text {
						width: 100%;
						display: flex;
						justify-content: center;
						font-size: 24upx;
						color: #3c3c3c;
					}

					.share-btn {
						height: 142upx;
						text-align: left;
						background: none;
						padding: 0;
						margin: 0;
					}

					.share-btn:after {
						border: none;
						border-radius: none;
					}
				}
			}
		}

		.tj-sction {
			@extend %section;
			display: flex;

			.tj-item {
				@extend %flex-center;
				flex: 1;
				flex-direction: column;
				margin: 30upx 0;
				font-size: $font-sm;
				color: #75787d;
				/*border-right: 2upx solid rgba(0, 0, 0, 0.2);*/
			}

			/*.tj-item:last-child {*/
			/*border-right: none;*/
			/*}*/
			.num {
				font-size: $font-base;
			}

			.red {
				color: $base-color;
			}
		}

		.order-section {
			@extend %section;
			padding: 28upx 0;

			.order-item {
				@extend %flex-center;
				width: 120upx;
				height: 120upx;
				border-radius: 10upx;
				font-size: $font-sm;
				color: $font-color-dark;
				position: relative;
			}

			.badge {
				position: absolute;
				top: 0;
				right: 4upx;
			}

			.iconfont {
				font-size: 48upx;
			}

			.icon-shouhoutuikuan {
				font-size: 44upx;
			}
		}

		.history-section {
			background: #fff;
			margin-bottom: $spacing-sm;

			.h-list-history {
				margin: 0;
				border-radius: 10upx;
				white-space: nowrap;
				background-color: $page-color-base;

				.h-item-history {
					background-color: $color-white;
					display: inline-block;
					font-size: $font-sm;
					color: $font-color-base;
					width: 180upx;
					margin: $spacing-sm $spacing-sm 0 0;
					border-radius: 10upx;
					position: relative;
					top: 0;
					overflow: hidden;

					.h-item-img {
						width: 180%;
						height: 200upx;
						border-top-left-radius: 12upx;
						border-top-right-radius: 12upx;
						border-bottom: 1upx solid rgba(0, 0, 0, 0.01);
					}

					.tag {
						position: absolute;
						border-top-left-radius: 12upx;
						left: 0;
						right: 0;
						width: 60upx;
						height: 60upx;
					}

					.h-item-text {
						font-size: $font-sm;
						margin: $spacing-sm 4upx;
					}
				}
			}

			.no-foot-print {
				text-align: center;
				padding: 48upx 0;

				.no-foot-print-icon {
					font-size: $font-lg + 2upx;
					margin-right: 10upx;
				}
			}

			.share-btn {
				height: 102upx;
				text-align: left;
				background: none;
				padding: 0;
				margin: 0;
			}

			.share-btn:after {
				border: none;
				border-radius: none;
			}
		}
	}
}

%flex-center {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

%section {
	justify-content: space-around;
	display: flex;
	align-content: center;
	background: #fff;
	border-radius: 10upx;
}
</style>
