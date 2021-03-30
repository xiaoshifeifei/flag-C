<template>
	<view class="product">
		<rf-product-detailmywg
			ref="proDetail"
			@product="getProductDetail"
			:userInfo="userInfo"
			:toGetherData="toGetherData"
			:url="currentUrl"
			:product="productDetail"
			:flag_id="flag_id"
		></rf-product-detailmywg>

		<!-- 404页面 -->
		<!-- <view v-if="!productDetail.name && !loading">
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
    </view> -->
		<!--顶部下拉菜单-->
		<rf-nav-detail @hide="hideNavDetail" :popupShow="navDetailShow">
		</rf-nav-detail>

		<!--回到顶部-->
		<rf-back-top :scrollTop="scrollTop"></rf-back-top>
		<!--页面加载动画-->
		<!-- <rfLoading isFullScreen :active="loading"></rfLoading> -->
	</view>
</template>
<script>
/**
 * @des 商品详情
 *
 * @author stav stavyan@qq.com
 * @date 2020-03-23 15:04
 * @copyright 2019
 */
import { productDetail, produTogtherlist } from '@/api/product';
import rfProductDetailmywg from '@/components/rf-product-detailmywg';
import rfBackTop from '@/components/rf-back-top';
import rfNoData from '@/components/rf-no-data';
export default {
	components: {
		rfProductDetailmywg,
		rfBackTop,
		rfNoData
	},
	data() {
		return {
			productDetail: {},
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
			flag_id: ''
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
		this.productId = options.id;
		this.flag_id = options.id;
		// await this.initData();
	},
	methods: {
		// 隐藏顶部导航
		hideNavDetail() {
			this.navDetailShow = false;
		},
		// 数据初始化
		async initData() {
			this.currentUrl = `${this.$mConfig.hostUrl}/pages/product/product?id=${this.productId}`;
			this.hasLogin = this.$mStore.getters.hasLogin;
			await this.getProductDetail();
		},
		// 获取产品详情
		// 获取产品详情
		async getProductDetail() {
			await this.$http
				.get(`${productDetail}?product_id=${this.productId}`, {})
				.then(async r => {
					this.loading = false;

					const data = r.data;
					console.log(data);
					this.productDetail = data;
					uni.setNavigationBarTitle({
						title: data.name
					});
				})
				.catch(err => {
					this.loading = false;
					this.errorInfo = err;
				});
		}
	}
};
</script>
<style scoped lang="scss">
page {
	background: $page-color-base;
}
</style>
