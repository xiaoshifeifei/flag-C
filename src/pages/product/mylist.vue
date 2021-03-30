<template>
	<view class="container product-list">

		<view class="rf-header-box">
			<view class="rf-header" :style="{width:width+'px',height:height+'px'}">
				<view class="rf-back" :style="{marginTop:arrowTop+'px'}" @tap="back">
					<text class="iconfont iconzuo"></text>
				</view>
				<view class="input-box" :style="{marginTop:inputTop+'px'}">
					我的商品
				</view>
			</view>
		</view>
		<view class="product-list-wrapper">
			<view class="product-item" v-for="item in productList" :key="item.id">
				<view :style="{'background-image': 'url(' + item.mainImage + ')'}" class="mainImg"></view>
				<view class="product-title">{{item.name}}</view>
				<view class="product-subtitle">{{item.subtitle}}</view>
				<view class="product-other">
					<view class="product-other__ptice">价格：￥{{item.price}}</view>
					<view class="product-other__stock">库存：{{item.stock}}</view>
				</view>
			</view>
		</view>
		<rf-load-more :status="loadingType" v-if="productList.length > 0"></rf-load-more>
		<rf-empty :info="errorInfo || '该分类暂无商品'" v-if="productList.length === 0 && !loading"></rf-empty>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
import uniDrawer from '@/components/uni-drawer/drawer'
import rfTopDrawer from '@/components/rf-top-drawer'
import rfAttrContent from '@/components/rf-attr-content'
import rfProductList from '@/components/rf-product-list'
import rfLoadMore from '@/components/rf-load-more/rf-load-more'
import {
  shopProList
} from '@/api/product'
import {
  mapMutations
} from 'vuex'
/* eslint-disable */
	export default {
		components: {
			uniDrawer,
			rfProductList,
			rfAttrContent,
			rfLoadMore,
			rfTopDrawer
		},
		data() {
			return {
				keyword: '',
				errorInfo: '',
				loadingType: 'more',
				page: 1,
				loading: true,
				specClass: 'none',
				productDetail: {},
				searchKey: "", //搜索关键词
				width: 200, //header宽度
				height: 64, //header高度
				inputTop: 0, //搜索框距离顶部距离
				arrowTop: 0, //箭头距离顶部距离
				dropScreenH: 0, //下拉筛选框距顶部距离
				attrData: [],
				attrIndex: -1,
				dropScreenShow: false,
				scrollTop: 0,
				tabIndex: 0, //顶部筛选索引
				isList: false, //是否以列表展示  | 列表或大图
				drawer: false,
				drawerH: 0, //抽屉内部scrollview高度
				selectedName: "综合",
				selectH: 0,
				productParams: {
					proType: '0'
				},
				productList: [],
				pageIndex: 1,
				pageSize: 10,
				pullUpOn: true
			}
		},
		onLoad(options) {
			let obj = {},
				proTypeWord = '所有';
			uni.getSystemInfo({
				success: (res) => {
					this.width = obj.left || res.windowWidth;
					this.height = obj.top ? (obj.top + obj.height + 8) : (res.statusBarHeight + 44);
					this.inputTop = obj.top ? (obj.top + (obj.height - 30) / 2) : (res.statusBarHeight + 7);
					this.arrowTop = obj.top ? (obj.top + (obj.height - 32) / 2) : (res.statusBarHeight + 6);
					this.searchKey = options.searchKey || "";
					//略小，避免误差带来的影响
					this.dropScreenH = this.height * 750 / res.windowWidth + 186;
					this.drawerH = res.windowHeight - uni.upx2px(100) - this.height
				}
			});
			if (options.type === '1') {
				proTypeWord = '爆款'
			} else if (options.type === '2') {
				proTypeWord = '预售'
			}
			this.productParams.proType = options.type ? options.type : 0;
			uni.setNavigationBarTitle({
				title: '我的商品-' + proTypeWord
			});
			this.initData(options);
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.page = 1;
			this.productList.length = 0;
			this.getProductList('refresh', {});
		},
		// 加载更多
		onReachBottom() {
			if (this.loadingType === 'nomore') return;
			this.page++;
			this.getProductList();
		},
		methods: {
			...mapMutations(['setCartNum']),
			// 初始化数据
			initData(options) {
				this.getProductList();
			},
			stopPrevent() {},
			px(num) {
				return uni.upx2px(num) + "px"
			},
			async reset() {
				this.currentBrandStr = '';
				this.currentCateStr = '';
				this.minPrice = '';
				this.maxPrice = '';
				await this.getBrandList();
			},
			screen(e) {
				let index = parseInt(e.currentTarget.dataset.index, 10);
				if (index === 0) {
					this.showDropdownList();
				} else if (index === 1) {
					let params = {}
					if (this.tabIndex === 1) {
						this.tabIndex = null;
						params.total_sales = 'asc';
					} else {
						this.tabIndex = 1;
						params.total_sales = 'desc';
					}
					this.page = 1;
					this.productList = [];
					this.loading = true;
					this.productParams = params;
					this.getProductList();
				} else if (index === 2) {
					this.isList = !this.isList
				} else if (index === 3) {
					if (this.productCateList.length === 0) {
						this.getProductCate();
					}
					if (this.brandList.length === 0) {
						this.getBrandList();
					}
					this.drawer = true;
				}
			},
			// 获取商品列表
			async getProductList(type) {
				await this.$http
					.get(`${shopProList}`, {
						proType: this.productParams ? this.productParams.proType : '0',
						pageNum: this.page,
						pageSize: this.pageSize
					})
					.then(async r => {
						this.loading = false;
						if (type === 'refresh') {
							uni.stopPullDownRefresh();
						}
						if (r.status) {
							this.$mHelper.toast('文件上传失败')
						}
						this.loadingType = r.data.length === this.pageSize ? 'more' : 'nomore';
						this.productList = [...this.productList, ...r.data.list];
					})
					.catch(err => {
						this.errorInfo = err;
						this.loading = false;
						if (type === 'refresh') {
							uni.stopPullDownRefresh();
						}
					});
			},

			back() {
				this.$mRouter.back();
			},
			// 跳转详情
			navTo(route) {
				this.$mRouter.push({
					route
				});
			}
		},
	}
</script>
<style lang="scss">
	page {
		background: $page-color-base;
	}

	/*顶部下拉选择 属性*/
	.rf-scroll-box {
		width: 100%;
		height: 480upx;
		box-sizing: border-box;
		position: relative;
		z-index: 99;
		color: $color-white;
		font-size: 30upx;
		word-break: break-all;
	}

	.rf-drop-item {
		color: #333;
		height: 80upx;
		font-size: 28upx;
		padding: 20upx 40upx 20upx 40upx;
		box-sizing: border-box;
		display: inline-block;
		width: 50%;
	}

	.rf-drop-btnbox {
		width: 100%;
		height: 100upx;
		position: absolute;
		left: 0;
		bottom: 0;
		box-sizing: border-box;
		display: flex;
	}

	.rf-drop-btn {
		width: 50%;
		font-size: 32upx;
		text-align: center;
		height: 100upx;
		line-height: 100upx;
		border: 0;
	}

	.rf-dropdownlist {
		width: 100%;
		position: absolute;
		background: $color-white;
		border-bottom-left-radius: 24upx;
		border-bottom-right-radius: 24upx;
		overflow: hidden;
		box-sizing: border-box;
		padding-top: 10upx;
		padding-bottom: 26upx;
		left: 0;
		top: 88upx;
		visibility: hidden;
		transition: all 0.2s ease-in-out;
		z-index: 99;

		.icongouxuan {
			font-size: $font-lg;
			line-height: 88upx;
		}
	}

	.rf-dropdownlist-show {
		visibility: visible;
	}

	.rf-dropdownlist-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: -1;
		transition: all 0.2s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}

	.rf-mask-show {
		opacity: 1;
		visibility: visible;
	}

	.rf-dropdownlist-item {
		color: #333;
		height: 70upx;
		font-size: 28upx;
		padding: 0 40upx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	/*顶部下拉选择 综合*/
	.rf-drawer-box {
		width: 686upx;
		font-size: 24upx;
		overflow: hidden;
		position: relative;
		padding-bottom: 100upx;
	}

	.rf-drawer-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30upx;
		box-sizing: border-box;
		height: 80upx;
	}

	.rf-title-bold {
		font-size: 26upx;
		font-weight: bold;
		flex-shrink: 0;
	}

	.rf-location {
		margin-right: 6upx;
	}

	.rf-attr-right {
		width: 70%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: right;
	}

	.rf-all-box {
		width: 90%;
		white-space: nowrap;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.rf-drawer-content {
		padding: 16upx 30upx 30upx 30upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.rf-input {
		border: 0;
		height: 64upx;
		border-radius: 32upx;
		width: 45%;
		background: #f7f7f7;
		text-align: center;
		font-size: $font-base;
		color: #333;
	}

	.rf-phcolor {
		text-align: center;
		color: #b2b2b2;
		font-size: 24upx;
	}

	.rf-flex-attr {
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.rf-attr-item {
		width: 30%;
		height: 64upx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 4upx;
		box-sizing: border-box;
		border-radius: 32upx;
		margin-right: 5%;
		margin-bottom: 5%;
	}

	.rf-attr-ellipsis {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		width: 96%;
		text-align: center;
	}

	.rf-attr-item:nth-of-type(3n) {
		margin-right: 0%;
	}

	.rf-attr-btnbox {
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
		box-sizing: border-box;
		padding: 0 30upx;
		background: $color-white;
	}

	.rf-attr-safearea {
		height: 100upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		/*padding-bottom: env(safe-area-inset-bottom);*/
	}

	.rf-safearea-bottom {
		width: 100%;
		height: env(safe-area-inset-bottom);
	}

	.rf-attr-btnbox::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		border-top: 1upx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.rf-drawer-btn {
		width: 47%;
		text-align: center;
		height: 60upx;
		border-radius: 30upx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.rf-drawerbtn-black {
		border: 1upx solid;
	}

	.product-list {
		padding-bottom: env(safe-area-inset-bottom);

		/* 隐藏scroll-view滚动条*/
		::-webkit-scrollbar {
			width: 0;
			height: 0;
			color: transparent;
		}

		.rf-header-box {
			width: 100%;
			background: $color-white;
			position: fixed;
			z-index: 100;
			left: 0;
			top: 0;

			.rf-header {
				display: flex;
				align-items: flex-start;

				.rf-back {
					margin-left: 8upx;
					height: 32px !important;
					width: 32px !important;
					display: flex;
					justify-content: center;
					align-items: center;

					.iconzuo {
						font-size: $font-lg + 4upx;
						font-weight: 500;
						color: $font-color-dark;
					}
				}
			}

			.input-box {
				width: 100%;
				font-size: $font-sm;
				box-sizing: border-box;
				color: #999;
				display: flex;
				align-items: center;
				overflow: hidden;
				height: 60upx;
				background-color: $page-color-base;
				border-radius: 30upx;
				position: relative;
				margin: 0 20upx 0 10upx;

				.iconsousuo2 {
					z-index: 100;
					display: flex;
					align-items: center;
					position: absolute;
					top: 0;
					right: 0;
					width: 60upx;
					height: 60upx;
					font-size: $font-lg + 4upx;
					color: $font-color-dark;
				}

				input {
					width: 100%;
					padding-left: 28upx;
					height: 28upx;
					color: $font-color-base;
					font-size: 28upx;
				}
			}
		}

		/*screen*/
		.rf-header-screen {
			width: 100%;
			background: $color-white;
			position: fixed;
			z-index: 99;

			.rf-screen-top,
			.rf-screen-bottom {
				border: none;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28upx;
				color: #333;
			}

			.rf-screen-top {
				height: 88upx;
				line-height: 88upx;
				position: relative;
				background: $color-white;
			}

			.rf-top-item {
				height: 28upx;
				line-height: 28upx;
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;

				.iconfont {
					font-size: $font-lg + 4upx;
					font-weight: 500;
				}
			}

			.rf-screen-bottom {
				height: 100upx;
				padding: 0 30upx;
				box-sizing: border-box;
				font-size: 24upx;
				align-items: center;
				overflow: hidden;
			}

			.rf-bottom-text {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.rf-bottom-item {
				flex: 1;
				width: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 12upx;
				box-sizing: border-box;
				margin-right: 20upx;
				white-space: nowrap;
				height: 60upx;
				border-radius: 40upx;
			}

			.rf-bottom-item:last-child {
				margin-right: 0;
			}

			.rf-bold {
				font-weight: bold;
			}

			.rf-active {
				color: $base-color;
			}

			.rf-icon-ml .rf-icon-class {
				margin-left: 6upx;
			}

			.rf-ml {
				margin-left: 6upx;
			}

			.rf-seizeaseat-20 {
				height: 20upx;
			}

			.rf-seizeaseat-30 {
				height: 30upx;
			}

			.rf-icon-middle .rf-icon-class {
				vertical-align: middle;
			}

			.rf-middle {
				vertical-align: middle;
			}
		}

		/*screen*/
		.rf-btmItem-active {
			border-radius: 32upx;
			font-weight: bold;
			position: relative;
		}

		.rf-btmItem-normal {
			border: 1upx solid rgba(0, 0, 0, 0.12);
			position: relative;
		}

		.rf-btmItem-active::after {
			content: "";
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: 40upx;
			left: 0;
			top: 0;
		}

		.rf-btmItem-tap {
			position: relative;
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		}

		.rf-btmItem-tap::after {
			content: "";
			position: absolute;
			width: 100%;
			height: 22upx;
			background: #f7f7f7;
			left: 0;
			top: 58upx;
		}

		.product-list-wrapper {
			padding-top: 2vw;
			display: flex;
			flex-wrap: wrap;
			align-items: top;
			.product-item{
				background-color: white;
				padding: 10px;
				width: 46%;
				height: auto;
				margin: 0 2%;
				.mainImg{
					width: 40vw;
					height: 40vw;
					margin: 0;
					margin-bottom: 5px;
					background-repeat: no-repeat;
					background-size: cover;
				}
				.product-title{
					font-size: 20px;
					margin-bottom: 5px;
					color: $base-color;
				}
				.product-subtitle{
					font-size: 14px;
					margin-bottom: 5px;
				}
				.product-other{
					display: flex;
					font-size: 14px;
					justify-content: space-between;
				}
				.product-other__ptice{
					flex-shrink: 0;
					color: $base-color;
				}
				.product-other__stock{
					flex-shrink: 0;
				}
			}
		}
	}
</style>
