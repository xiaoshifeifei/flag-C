<template>
	<view class="rf-index">
		<!-- #ifndef H5 -->
		<!-- <image class="adimage" src="../../static/app/hb.png" mode="" @click="toAd()"></image> -->
		<!-- #endif -->

		<!--搜索导航栏-->
		<!-- 	<rf-search-bar @search="navToSearch" title="扫一扫" icon="iconsaomiao" @tab="tabClick" :merchantData="merchantData"
		 :placeholder="hotSearchDefault" /> -->
		<!-- <view class="headerBg"></view> -->
		<!-- <view class="headerWords">Flag，拼出价值，购出品质 </view> -->
		<!-- <view class="headerWords"> </view> -->
		<view
			:style="{
				paddingTop: merchantShow
					? isOpenIndexCate
						? 94 + statusBar + 'px'
						: 45 + statusBar + 'px'
					: isOpenIndexCate
					? 20 + statusBar + 'px'
					: 25 + statusBar + 'px'
			}"
		>
			<block v-if="currentCate === 0">
				<!-- 头部 -->
				<view class="cu-custom">
					<view
						class="nav fixed bg-white home-nav text-center"
						style="margin:0;"
					>
						<view
							class="cu-item"
							:class="index == TabCur ? 'text-orange cur' : ''"
							v-for="(item, index) in nav"
							:key="index"
							@tap="tabSelect(index)"
						>
							{{ item.name }}
						</view>
					</view>
				</view>

				<!--精选Flag团购-->
				<block v-if="TabCur == 0">
					<!-- <view
						class="flex middle start padding"
						style="border-bottom: 1px solid #f5f5f5"
					>
						<text
							@click="clickCur(index)"
							class="title-cur"
							v-for="(item, index) in listmywg"
							:key="index"
							:class="[item.cur ? 'text-orange' : '']"
						>
							{{ item.name }}
						</text>
					</view> -->
					<flag-list-wg
						ref="mainindex"
						:weiguangc="true"
						@send="send"
					></flag-list-wg>
					<!-- <rf-floor-index
						icon="icontuijian21"
						:list="recommendProductList"
						:header="{ title: '商品', desc: 'Recommend Product' }"
						@toList="
							navTo(
								`/pages/product/list?cate_id=${specialType.teamId}&isSpecial=2`
							)
						"
						@detail="navToDetailPage"
					/> -->
				</block>
				<block v-else-if="TabCur == 1">
					<flag-list-me-wg ref="mainindexme" @send="send"></flag-list-me-wg>
					<!-- 		<rf-floor-index icon="icontuijian21" :flagtype="flagtypes" :list="recommendProductList" :header="{ title: '商品', desc: 'Recommend Product' }"
					 @toList="
							navTo(
								`/pages/product/list?cate_id=${specialType.teamId}&isSpecial=2`
							)
						"
					 @detail="navToDetailPage" /> -->
				</block>
				<block v-else-if="TabCur == 2">
					<flag-list-wg-copy @send="send"></flag-list-wg-copy>
				</block>

				<!--网站备案号-->
				<view class="copyright" v-if="config.web_site_icp">
					{{ config.copyright_desc }}
					<a href="http://www.baidu.com">{{ config.web_site_icp }}</a>
				</view>
			</block>
			<!-- <view v-else class="index-cate-product-list">
				<rf-product-list :bottom="bottom" :list="categoryProductList"></rf-product-list>
				<rf-load-more :status="loadingType" v-if="categoryProductList.length > 0"></rf-load-more>
				<rf-empty :bottom="bottom" :info="'暂无该分类产品~'" v-if="categoryProductList.length === 0 && !productLoading"></rf-empty>
			</view> -->
		</view>

		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<rf-back-top :scrollTop="scrollTop"></rf-back-top>
		<!-- <rf-back-home></rf-back-home> -->
	</view>
</template>
<script>
/**
 * @des 微商城首页
 *
 * @author stav stavyan@qq.com
 * @date 2020-01-08 14:14
 * @copyright 2019
 */
import { productList } from '@/api/product';
import { flaglist } from '@/api/basic';
import rfSwipeDot from '@/components/rf-swipe-dot';
import flagListWg from '@/components/flag-list-wg';
import flagListMeWg from '@/components/flag-list-me-wg';
import flagListWgCopy from '@/components/flag-list-wg-copy';
import rfFloorIndex from '@/components/rf-floor-index';
import rfSearchBar from '@/components/rf-search-bar';
import rfSwiperSlide from '@/components/rf-swiper-slide';
import rfProductList from '@/components/rf-product-list';
import listCell from '@/components/rf-list-cell';
import { mapMutations } from 'vuex';
export default {
	components: {
		rfFloorIndex,
		rfSwipeDot,
		rfProductList,
		rfSearchBar,
		flagListWg,
		flagListWgCopy,
		flagListMeWg
	},
	data() {
		return {
			current: 0, // 轮播图index
			carouselList: [], // 广告图
			hotProductList: [], // 热门商品列表
			recommendProductList: [], // 推荐商品列表
			guessYouLikeProductList: [], // 猜您喜欢商品列表
			newProductList: [], // 新品上市商品列表
			productCateList: [], // 商品栏目
			config: {
				// web_site_icp:'@zhiliao.com'
			}, // 商户配置
			announceList: [], // 公告列表
			share: {},
			loading: true,
			scrollTop: 0,
			kefuShow: true,
			loadingType: 'more',
			hotSearchDefault: '请输入商品关键字',
			newsBg: this.$mAssetsPath.newsBg,
			errorImage: this.$mAssetsPath.errorImage,
			appName: this.$mSettingConfig.appName,
			categoryList: [], // 分类列表
			categoryProductList: [], // 分类列表
			page: 1,
			currentCate: 0,
			hotRecommendList: this.$mConstDataConfig.hotRecommendList,
			productLoading: true,
			isOpenIndexCate: this.$mSettingConfig.isOpenIndexCate,
			moneySymbol: this.moneySymbol,
			merchantShow: false,
			merchantData: {},
			specialType: {
				hotId: '',
				perId: '',
				teamId: ''
			},
			iconList: [
				{
					icon: 'goodsnewfill',
					color: 'orange',
					badge: 0,
					name: 'Flag购',
					url: '/pages/newGoods/newGoods'
				},
				{
					icon: 'noticefill',
					color: 'pink',
					badge: 0,
					name: '挑战购',
					url: '/pages/index/index?cur=earn'
				},
				{
					icon: 'crownfill',
					color: 'blue',
					badge: 0,
					name: '围观广场',
					url: '/pages/vipGoods/vipGoods'
				},
				{
					icon: 'countdownfill',
					color: 'mauve',
					badge: 0,
					name: '立flag',
					url: '/pages/createflag/createflag'
				}
			],
			nav: [
				{
					name: '围观广场'
				},
				{
					name: '我的围观'
				},
				{
					name: '我的flag'
				}
			],
			TabCur: 0,
			scrollLeft: 0,
			flagtypes: true,
			value: '',
			type: 'text',
			border: true,

			listmywg: [
				{
					name: '默认',
					cur: true,
					orderwg: 'onlook'
				},
				{
					name: 'flag金额高',
					cur: false,
					orderwg: 'money'
				}
			],
			listmywgcopy: [
				{
					name: '进行中',
					cur: true
				},
				{
					name: '已结束',
					cur: false
				}
			],
			current: 0,
			wgidx: 0,
			wgidxcopy: 0,
			homeguol: '',

			// 围观
			orderwg: 'onlook', //排序：onlook：热门  money：金额
			categoryProductListwg: [] // 围观列表
		};
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	onShow() {
		// 初始化购物车数量
		// this.setCartNum(uni.getStorageSync('cartNum'));
		// this.initData();
		// this.getWgList();

		if (this.TabCur == 1) {
			this.$nextTick(() => {
				this.$refs.mainindexme.getWgList();
			});
		} else if (this.TabCur == 0) {
			this.$nextTick(() => {
				this.$refs.mainindex.getWgList();
			});
		}

		this.loading = false;
	},

	onLoad(options) {
		if (options.homeguol == 'true') {
			this.tabSelect(2);
		}
		if (options.homeguolwg == 'true') {
			this.tabSelect(1);
		}
	},
	computed: {
		statusBar() {
			const e = uni.getSystemInfoSync();
			return e.statusBarHeight;
		},
		// 计算倒计时时间
		second() {
			return function(val) {
				return Math.floor(15 * 60 - (new Date() / 1000 - val));
			};
		},
		bottom() {
			let bottom = 0;
			bottom = 90;
			return bottom;
		},
		swipeCateList() {
			const list = this.productCateList;
			const result = [];
			for (let i = 0, len = list.length; i < len; i += 10) {
				result.push(list.slice(i, i + 10));
			}
			return result;
		}
	},
	onShareAppMessage() {
		const shareParams = {
			title: this.share.share_title || `欢迎来到${this.appName}`,
			path: '/pages/index/index'
		};
		return shareParams;
	},
	filters: {
		filterDiscountPrice(val) {
			const price = val.product && (val.product.price * val.discount) / 100;
			switch (val.decimal_reservation_number) {
				case 0:
					return (Math.floor(price * 100) / 100).toFixed(2);
				case 1:
					return (Math.floor(price * 100) / 100).toFixed(0);
				case 2:
					return (Math.floor(price * 100) / 100).toFixed(1);
				default:
					return (Math.floor(price * 100) / 100).toFixed(2);
			}
		},
		filterTotalSales(val) {
			if (val > 10000) {
				val = `${(val / 10000).toFixed(2)}w`;
			}
			return val;
		}
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.getIndexList('refresh');
	},
	// 加载更多
	onReachBottom() {
		// if (this.currentCate === 0) return;
		// if (this.loadingType === 'nomore') return;
		// this.page++;
		// this.getProductList(this.currentCate);
	},
	methods: {
		// 获取围观列表
		async getWgList() {
			let params = {
				order: this.orderwg
			};
			await this.$http
				.get(`${flaglist}`, params)
				.then(async r => {
					this.loading = false;
					//   console.log(r.data.total);
					this.loadingType =
						this.categoryProductListwg.length >= r.data.total
							? 'nomore'
							: 'more';
					this.categoryProductListwg = [
						...this.categoryProductListwg,
						...r.data.rows
					];
				})
				.catch(() => {
					this.loading = false;
				});
		},

		clickCur(idx) {
			this.wgidx = idx;
			this.listmywg.forEach((item, index) => {
				if (idx == index) {
					item.cur = true;
					this.orderwg = item.orderwg;
				} else {
					item.cur = false;
				}
			});
			// this.getWgList();
		},
		clickCurcopy(idx) {
			this.wgidxcopy = idx;
			console.log(idx);
			this.listmywgcopy.forEach((item, index) => {
				if (idx == index) {
					item.cur = true;
				} else {
					item.cur = false;
				}
			});
		},

		// tab切换
		tabSelect(e) {
			console.log(e);
			this.TabCur = e;
			this.scrollLeft = (e - 1) * 60;
			this.modalName = null;
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 0
			});
		},
		toAd() {
			uni.navigateTo({
				url: '../ads/rewardvideo'
			});
		},
		send(value) {
			console.log('首页数据', value);
		},
		// 顶部tab点击
		// tabClick({
		// 	id
		// }) {
		// 	this.currentCate = id;
		// 	if (id === 0) return;
		// 	this.loading = true;
		// 	this.page = 1;
		// 	this.productLoading = true;
		// 	this.categoryProductList = [];
		// 	this.getProductList(id);
		// },
		// 获取产品列表
		async getProductList(id) {
			await this.$http
				.get(`${productList}`, {
					cate_id: id,
					page: this.page
				})
				.then(async r => {
					this.loading = false;
					this.productLoading = false;
					this.loadingType = r.data.length < 10 ? 'nomore' : 'more';
					this.categoryProductList = [...this.categoryProductList, ...r.data];
				})
				.catch(() => {
					this.loading = false;
					this.productLoading = false;
				});
		},
		...mapMutations(['setCartNum']),
		// 监听轮播图切换
		handleDotChange(e) {
			this.current = e.detail.current;
		},
		// 数据初始化
		initData() {
			// 设置购物车数量角标
			// this.getIndexList();
			// this.initCartItemCount();
		},
		// 设置购物车数量角标
		async initCartItemCount() {
			if (
				this.$mStore.getters.hasLogin &&
				parseInt(uni.getStorageSync('cartNum'), 10) > 0
			) {
				uni.setTabBarBadge({
					index: this.$mConstDataConfig.cartIndex,
					text: uni.getStorageSync('cartNum').toString()
				});
			} else {
				uni.removeStorageSync('cartNum');
				uni.removeTabBarBadge({
					index: this.$mConstDataConfig.cartIndex
				});
			}
		},
		// 通用跳转
		navTo(route) {
			this.$mRouter.push({
				route
			});
		},
		// 跳转至分类模块
		navToCategory(id) {
			if (this.$mSettingConfig.appCateType === '2') {
				uni.setStorageSync('indexToCateId', id);
				this.$mRouter.reLaunch({
					route: '/pages/category/category'
				});
			} else {
				this.navTo(`/pages/product/list?cate_id=${id}`);
			}
		},
		// 通用跳转
		navToSearch() {
			this.$mRouter.push({
				//route: `/pages/index/search/search?data=${JSON.stringify(this.search)}`
				route: '/pages/index/search/search'
			});
		},
		// 跳至广告图指定页面
		indexTopToDetailPage(item) {
			if (item.bannerType === 1) {
				this.navTo(`/pages/index/notice/detail?id=${item.objId}`);
			} else if (item.bannerType === 2) {
				this.navTo(`/pages/product/product?id=${item.objId}`);
			}
		},

		// 获取主页数据
		async getIndexList(type) {
			await this.$http
				.get(`${bannerList}`, {})
				.then(async r => {
					// uni.setNavigationBarTitle({
					// 	title: this.appName
					// });
					// if (type === 'refresh') {
					// 	uni.stopPullDownRefresh();
					// }
					// if (r.status) {
					// 	this.$mHelper.toast(r.msg);
					// 	return;
					// }
					// 首页参数赋值
					this.carouselList = r.data;
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
					// if (type === 'refresh') {
					// 	uni.stopPullDownRefresh();
					// }
				});
			await this.$http
				.get(`${indexConfig}`, {})
				.then(async r => {
					// uni.setNavigationBarTitle({
					// 	title: this.appName
					// });
					// if (type === 'refresh') {
					// 	uni.stopPullDownRefresh();
					// }
					// if (r.status) {
					// 	this.$mHelper.toast(r.msg);
					// 	return;
					// }
					// 首页参数赋值
					this.loading = false;
					this.initIndexData(r.data);
				})
				.catch(() => {
					this.loading = false;
					// if (type === 'refresh') {
					// 	uni.stopPullDownRefresh();
					// }
				});
		},
		// 首页参数赋值
		initIndexData(data) {
			for (const i in this.specialType) {
				if (data[i]) {
					this.specialType[i] = data[i];
				}
			}
			this.hotProductList = data.hot;
			this.recommendProductList = data.team;
			this.newProductList = data.per;
			this.$mHelper.handleWxH5Share(
				this.share.share_title || this.appName,
				this.share.share_desc || `欢迎来到${this.appName}商城`,
				this.share.share_link || this.$mConfig.hostUrl,
				this.share.share_cover || this.$mSettingConfig.appLogo
			);
		},
		// 跳转至商品详情页
		navToDetailPage(data) {
			const { id } = data;
			if (!id) return;
			this.$mRouter.push({
				route: `/pages/product/product?id=${id}`
			});
		},
		// 跳转至分类页
		toCategory() {
			this.$mRouter.switchTab({
				route: '/pages/category/category'
			});
		}
	}
};
</script>
<style lang="scss">
.title-cur {
	margin-right: 30upx;
}

page {
	background-color: $page-color-base;
}

@keyframes fade {
	from {
		transform: scale(0.9);
	}

	to {
		transform: scale(1.1);
	}
}

.adimage {
	width: 36px;
	height: 55px;
	position: fixed;
	bottom: 2px;
	right: 18px;
	z-index: 1000;
	animation: fade 0.75s infinite alternate;
}

.bg-search {
	background-color: $uni-color-primary;
}

.headerBg {
	background-color: $uni-color-primary;
	position: absolute;
	top: -80px;
	left: -50%;
	z-index: 0;
	width: 200%;
	height: 500upx;
	border-bottom-right-radius: 50%;
	border-bottom-left-radius: 50%;
}

.headerWords {
	position: fixed;
	width: 100%;
	top: 0;
	left: 0;
	z-index: 10;
	background-color: #fa436a;
	color: #ffffff;
	text-align: center;
	height: 45px;
	line-height: 45px;
	font-size: 16px;
}

.rf-index {
	background-color: $color-white;

	/*爆款拼团*/
	.wrapper {
		border-radius: 10upx;

		.h-list {
			background-color: $page-color-base;
			white-space: nowrap;
			padding: 0 $spacing-sm;

			.h-item {
				margin: $spacing-sm $spacing-sm $spacing-sm 0;
				display: inline-block;
				background-color: $color-white;
				font-size: $font-sm;
				width: 280upx;
				border-radius: 6upx;

				.title {
					width: 280upx;
					white-space: normal;
					height: 60upx;
					line-height: 30upx;
					font-size: $font-sm;
					padding: 0 $spacing-sm;
					margin: $spacing-sm 0;
				}

				.last-line {
					padding: 0 $spacing-sm $spacing-base;
					margin-bottom: 5upx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					/* 垂直居中 */
					.red {
						font-size: $font-sm;
						margin-right: 4upx;
					}
				}

				.price {
					font-size: $font-base - 2upx;
					line-height: 1;

					.m-price {
						margin-left: 8upx;
						color: $font-color-light;
						font-size: $font-sm;
						text-decoration: line-through;
					}
				}
			}
		}
	}

	/*轮播图*/
	.swiper {
		width: 100%;
		margin-bottom: 20upx;
		display: flex;
		justify-content: center;

		.swiper-box {
			width: 92%;
			height: 40vw;
			overflow: hidden;
			border-radius: 15upx;
			box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
			//兼容ios，微信小程序
			position: relative;
			z-index: 1;

			swiper {
				width: 100%;
				height: 40vw;

				swiper-item {
					image {
						width: 100%;
						height: 40vw;
					}
				}
			}
		}
	}

	/* 爆款推荐 */
	.hot-recommend {
		background-color: $color-white;
		display: flex;
		padding: $spacing-base $spacing-lg 0;

		.hot-recommend-image {
			width: 100%;
			height: 100%;
		}

		.left {
			flex: 3;
			height: 350upx;
			margin-right: 15upx;
		}

		.right {
			flex: 4;

			.hot-recommend-image {
				height: 170upx;
			}
		}
	}

	/*轮播图2*/
	.swiper-item-text {
		position: absolute;
		bottom: 16upx;
		left: 30upx;
		height: 48upx;
		line-height: 48upx;
		background: rgba(0, 0, 0, 0.2);
		width: 90%;
		color: $color-white;
		border-bottom-left-radius: 12upx;
		padding-left: 20upx;
	}

	/*新闻通知*/
	.swiper-slide-header {
		.iconfont {
			font-size: $font-lg + 8upx;
			font-weight: 600;
		}
	}

	/*分类列表*/
	.category-list-wrapper {
		.category-list {
			width: 100%;
			padding: $spacing-base;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.category {
				margin-top: 10upx;
				width: calc(20% - 20upx);
				height: 132upx;
				display: flex;
				text-align: center;
				flex-wrap: wrap;

				.img {
					width: 100%;
					display: flex;
					justify-content: center;

					image {
						width: 12vw;
						height: 12vw;
						border-radius: 50%;
					}
				}

				.text {
					margin-top: 16upx;
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 24upx;
					color: #3c3c3c;
				}
			}
		}
	}

	/*版权显示*/
	.copyright {
		margin: 10upx 0;
		width: 100%;
		text-align: center;
		color: #666;

		a {
			display: block;
			color: #666;
			text-decoration: none;
		}
	}

	/*限时抢购*/
	.order-item {
		display: flex;
		flex-direction: column;
		background: #fff;
		padding: 0 30upx;
		margin-bottom: 20upx;

		.goods-box-single {
			display: flex;
			padding: 40upx 10upx 10upx;
			height: 330upx;
			border-radius: 12upx;
			margin-top: 20upx;
			box-shadow: 2px 2px 10px rgba(66, 135, 193, 0.2); // 阴影
			border-bottom: 1px solid rgba(0, 0, 0, 0.05); // 边框
			position: relative;

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;

				.title {
					font-weight: bold;
					line-height: 1.2;
					margin: 10upx 0;
				}

				.attr-box {
					line-height: 1.2;
					margin-bottom: 8upx;
					margin-left: 10upx;
				}

				.last-line {
					margin-top: 3upx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					/* 垂直居中 */
					.red {
						margin-right: 4upx;
					}
				}

				.price {
					font-size: $font-lg;
					line-height: 1;

					.m-price {
						margin-left: 8upx;
						color: $font-color-light;
						font-size: $font-sm;
						text-decoration: line-through;
					}
				}

				.triangle-wrapper {
					position: absolute;
					overflow: hidden;
					top: 0;
					right: 0;
					border-radius: 12upx;

					.triangle {
						color: #5eba8f;
						width: 0;
						height: 0;
						border-top: 120upx solid;
						opacity: 0.8;
						border-left: 120upx solid transparent;
					}

					.triangle-content {
						position: absolute;
						top: 28upx;
						right: 0;
						transform: rotate(45deg);
						font-size: $font-sm - 2upx;
						color: #fff;
					}
				}
			}
		}

		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 90upx;
			position: relative;

			.discount-time {
				font-size: $font-sm;
				color: $uni-color-success;
				margin-right: 20upx;
			}
		}
	}

	.index-cate-product-list {
		padding-top: $spacing-sm;
		background-color: $page-color-base;

		.no-data {
			margin: 48upx 0;
			color: $font-color-light;
			display: flex;
			justify-content: center;
			align-items: center;

			.iconfont {
				margin-right: 20upx;
				font-size: $font-lg + 16upx;
			}
		}
	}
}
</style>
