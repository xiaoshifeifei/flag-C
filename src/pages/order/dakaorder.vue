<template>
	<view>
		<view v-if="list.length > 0" class="wrap">
			<view class="page-box">
				<view class="order shadow bg-white" v-for="(res, index) in list" :key="index">
					<view class="top">
						<view class="left">
							<u-icon name="twitter" :size="30" color="rgb(94,94,94)"></u-icon>
							<!-- <view v-if="res.flag_status==null" class="store">直购</view>
              <view v-if="res.flag_status==1" class="store">flag购</view>
              <view v-if="res.flag_status==2" class="store">挑战购</view> -->
							<view class="store">{{ res.title }}</view>

							<!-- <u-icon
								name="arrow-right"
								color="rgb(203,203,203)"
								:size="26"
							></u-icon> -->
						</view>
						<!-- <view class="right">{{ res.is_paid }}</view> -->
					</view>
					<view class="item">
						<view class="left" @click="previewImage(res.images[0])">
							<image :src="res.images[0]" mode="aspectFill"></image>
						</view>
						<view class="content">
							<view class="title u-line-2">{{ res.name }}</view>
							<!-- <view class="type">{{ '应该给' }}</view> -->
							<!-- <view class="delivery-time">打卡时间 {{ res.create_time }}</view> -->
						</view>
						<!-- <view class="right">
							<view class="price">
								￥{{ res.money / 100 }}
								<text class="decimal">.{{ 4444 }}</text>
							</view>
							<view class="number">x{{ 1 }}</view>
						</view> -->
					</view>
                    <view class="delivery-time margin-top margin-bottom">￥{{ res.money / 100 }}</view>
                    <view class="delivery-time margin-bottom">打卡内容: {{ res.content }} </view>
                    <view class="delivery-time">打卡时间: {{ res.create_time }}</view>
					<!-- <view class="total">
						共{{ 1 }}件商品 合计:
						<text class="total-price">
							￥{{ res.money / 100 }}
							<text class="decimal">{{ 1111 }}</text>
						</text>
					</view> -->
					<view v-if="false" class="bottom">
						<view class="more">
							<u-icon name="more-dot-fill" color="rgb(203,203,203)"></u-icon>
						</view>
						<view class="logistics btn">查看物流</view>
						<view class="exchange btn">卖了换钱</view>
						<view class="evaluate btn">评价</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 404页面 -->
		<view v-else>
			<rf-no-data :custom="true">
				<view class="no-data-title">
					{{ '暂无数据' }}
				</view>
				<!-- <view @tap="getProductDetail(productDetail.id)" slot="refresh" class="spec-color">重新加载</view> -->
			</rf-no-data>
		</view>
		<!--回到顶部-->
		<rf-back-top :scrollTop="scrollTop"></rf-back-top>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
import { record } from '@/api/basic';
export default {
	data() {
		return {
			scrollTop: 0,
			loading: true,

			list: [
				// {
				// 	order_no: 'NO5146357876543653',
				// 	name: '测试商品3',
				// 	money: 5,
				// 	type: 0,
				// 	flag_status: null,
				// 	is_paid: '已支付',
				// 	paid_time: '2021-02-03 15:54:50',
				// 	orderType: '正常下单',
				// 	img: ''
				// }
			]
		};
	},
	onLoad() {},
	onShow() {
		this.getList();
	},
	computed: {},
	methods: {
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
	//预览图片
		previewImage(img) {
			uni.previewImage({
				// current: index, //预览图片的下标
				urls: [img] //预览图片的地址，必须要数组形式
			});
		},
		async getList() {
			await this.$http
				.get(`${record}`, {})
				.then(async r => {
					this.loading = false;
					if (r.data) {
						this.list = r.data.rows;
					}
				})
				.catch(() => {
					this.loading = false;
				});
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
				margin-top: 10px;
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
		padding: 0 10upx;
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
		}

		.evaluate {
			color: $u-type-warning-dark;
			border-color: $u-type-warning-dark;
		}
	}
}

.centre {
	text-align: center;
	margin: 200upx auto;
	font-size: 32upx;

	image {
		width: 164upx;
		height: 164upx;
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
