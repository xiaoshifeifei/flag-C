<template>
	<view class="account-bill">
		<!--顶部账单类型 全部/充值/消费-->
		<!-- <view class="navbar">
			<view
				v-for="(item, index) in billTypeList"
				:key="index"
				class="nav-item"
				:class="
					tabCurrentIndex === index
						? `text-${themeColor.name} current`
						: ''
				"
				@tap="tabClick(index, item.state)"
			>
				{{ item.text }}
			</view>
		</view> -->
		<!--账单明细列表-->
		<view class="rf-bill-list" v-if="integralList.length > 0">
			<view
				class="rf-list-item"
				v-for="(item, index) in integralList"
				:key="index"
			>
				<view class="mid">
					<view class="title">
						<text :class="'text-' + themeColor.name"
							>{{ moneySymbol }}{{ item.payAmount }}</text
						>
						<text>来源：{{ item.businessTypeDes }}</text>
					</view>
					<view class="time">
						<text>{{ item.createTime | time }}</text>
						<text
							>{{ item.payPlatformDes }} -
							{{ item.platformStatusDes }}</text
						>
					</view>
				</view>
			</view>
			<rf-load-more
				class="load-more"
				:status="loadingType"
				v-if="integralList.length > 0"
			></rf-load-more>
		</view>
		<rf-empty
			:info="'暂无账单记录'"
			v-if="integralList.length === 0 && !loading"
		></rf-empty>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
/**
 * @des 账单明细
 *
 * @author stav stavyan@qq.com
 * @date 2020-01-13 11:18
 * @copyright 2019
 */
import { creditsLogList } from '@/api/userInfo'
import rfLoadMore from '@/components/rf-load-more/rf-load-more.vue'
import moment from '@/common/moment'

export default {
	components: {
		rfLoadMore
	},
	data() {
		return {
			pageType:'',
			loading: true,
			typeClass: 'valid',
			state: 1,
			tabCurrentIndex: 0,
			businessType: this.$mConstDataConfig.businessType,
			platformStatus: this.$mConstDataConfig.platformStatus,
			payPlatform: this.$mConstDataConfig.payPlatform,
			integralList: [],
			loadingType: 'more',
			page: 1,
			pageSize: 10
		}
	},
	filters: {
		time(val) {
			return moment(val).format('YYYY-MM-DD HH:mm:ss')
		}
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.page = 1
		this.integralList = []
		this.getIntegralListList('refresh')
	},
	// 加载更多
	onReachBottom() {
		if (this.loadingType === 'nomore') return
		this.page++
		this.getIntegralListList()
	},
	onLoad(options) {
		// this.initData(options)
	},

	computed:{
		billTypeList(){
			return this.pageType == 'hmb'  ?
			
			[
				{
					state: 1,
					text: '全部',
					typeVal: 77
				},
				{
					state: 2,
					text: '充值',
					typeVal: 88
				},
				{
					state: 5,
					text: '提现',
					typeVal: 99
				}
			]	
			:
			[
				{
					state: 1,
					text: '全部',
					typeVal: 0
				},
				{
					state: 2,
					text: '充值',
					typeVal: 1
				},
				{
					state: 3,
					text: '收入',
					typeVal: 5
				},
				{
					state: 4,
					text: '消费',
					typeVal: 3
				},
				{
					state: 5,
					text: '提现',
					typeVal: 2
				},
				{
					state: 6,
					text: '退款',
					typeVal: 4
				}
			]
		},
	},
	methods: {
		// // 顶部tab点击
		// tabClick(index, state) {
		// 	this.page = 1
		// 	this.integralList = []
		// 	this.integralList.length = 0
		// 	this.loading = true
		// 	this.tabCurrentIndex = index
		// 	this.state = state
		// 	this.getIntegralListList()
		// },
		// // 数据初始化
		// initData(options) {
		// 	if(options.type && options.type == 'hmb'){
		// 		this.pageType = options.type;
		// 		uni.setNavigationBarTitle({title:'hmb流水'})
		// 	}
		// 	else{
		// 		this.state = parseInt(options.state, 10)
		// 		if (this.state !== 1) {
		// 			this.tabClick(this.state - 1, this.state)
		// 			return
		// 		}
		// 	}
			
		// 	this.getIntegralListList()
		// },
		// 获取积分
		async getIntegralListList(type) {
			const params = {}
			params.businessType = this.billTypeList[this.tabCurrentIndex].typeVal
			params.pageSize = this.page
			params.pageNum = this.pageSize
			await this.$http
				.get(`${creditsLogList}`, params)
				.then(r => {
					this.loading = false
					if (type === 'refresh') {
						uni.stopPullDownRefresh()
					}

					if (r.status) {
						this.$mHelper.toast(r.msg || '获取列表失败')
						return
					}
					const list = r.data.list
					for (let i = 0; i < list.length; i++) {
						const item = list[i]
						item.businessTypeDes = this.businessType[item.businessType]
						item.platformStatusDes = this.platformStatus[item.platformStatus]
						item.payPlatformDes = this.payPlatform[item.payPlatform]
					}
					this.loadingType = list.length === 10 ? 'more' : 'nomore'
					this.integralList = [...this.integralList, ...list]
				})
				.catch(() => {
					this.loading = false
					if (type === 'refresh') {
						uni.stopPullDownRefresh()
					}
				})
		}
	}
}
</script>
<style scoped lang="scss">
page {
	background-color: $page-color-base;
}
.navbar{
	.nav-item{
		white-space: nowrap;
	}
}


.account-bill {
	.rf-bill-list {
		.rf-list-item {
			background-color: $color-white;
			padding: $spacing-base $spacing-lg;
			border: 1upx solid rgba(0, 0, 0, 0.02);
			display: flex;
			justify-content: space-between;
			align-items: center;
			.mid {
				text-align: left;
				flex-grow: 1;
				.title {
					margin-top: 10upx;
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					display: flex;
					justify-content: space-between;
				}
				.time {
					margin-top: 10upx;
					font-size: $font-base;
					width: 100%;
					margin-left: $spacing-sm;
					color: $font-color-light;
					display: flex;
					justify-content: space-between;
				}
			}
		}
	}
}
</style>
