<template>
	<view class="coupon-center">
		<view class="list-title">中奖记录：<text @click="toRouter('/pages/getPrize/getPrize')">去抽奖</text></view>
		<view class="coupon-list">
			<!-- 优惠券列表 -->
			<view class="sub-list valid">
				<view class="row" v-for="(item, index) in couponList" :key="index">
					<view class="carrier" :class="item.is_get === 0 ? 'rf-opacity' : ''">
						<view class="title">
							<view>
								<text class="cell-icon" :class="'bg-' + themeColor.name">奖</text>
								<text class="cell-title">{{ item.content }}</text>
							</view>
						</view>
						<view class="usage">
							<text>
								{{
									item.status
								}}
							</text>
							<view>
								{{
									item.time
								}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<rf-load-more :status="loadingType" v-if="couponList.length > 0"></rf-load-more>
		</view>
		<rf-empty :info="errorInfo || '暂无优惠券'" v-if="couponList.length === 0 && !loading"></rf-empty>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
/**
	 * @des 领取中心
	 *
	 * @author stav stavyan@qq.com
	 * @date 2020-01-13 11:28
	 * @copyright 2019
	 */
import {
  couponList
} from '@/api/userInfo'
import rfLoadMore from '@/components/rf-load-more/rf-load-more'
import moment from '@/common/moment'
export default {
  components: {
    rfLoadMore
  },
  data () {
    return {
      couponList: [],
      type: null,
      loadingType: 'more',
      page: 1,
      loading: true,
      moneySymbol: this.moneySymbol,
      errorInfo: ''
    }
  },
  filters: {
    time (val) {
      return moment(val * 1000).format('YYYY-MM-DD HH:mm')
    }
  },
  onLoad (options) {
    this.type = options.type
    this.initData()
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.page = 1
    this.couponList.length = 0
    this.getCouponList('refresh')
  },
  // 加载更多
  onReachBottom () {
    if (this.loadingType === 'nomore') return
    this.page++
    this.getCouponList()
  },
  methods: {
    // 数据初始化
    initData () {
      this.getCouponList()
    },
    toRouter (route) {
      this.$mRouter.push({
			  route
      })
    },
    // 获取收货地址列表
    async getCouponList (type) {
      await this.$http
        .post(`${couponList}`, {
          page: this.page
        })
        .then(r => {
          this.loading = false
          if (type === 'refresh') {
            uni.stopPullDownRefresh()
          }
          this.loadingType = r.data.length === 10 ? 'more' : 'nomore'
          this.couponList = [...this.couponList, ...r.data]
        })
        .catch(err => {
          this.couponList.length = 0
          this.errorInfo = err
          this.loading = false
          if (type === 'refresh') {
            uni.stopPullDownRefresh()
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
	.list-title {
		width: 92%;
		margin: 10px auto 5px;
			text{
				float: right;
				color: $base-color;
			}
	}
</style>
