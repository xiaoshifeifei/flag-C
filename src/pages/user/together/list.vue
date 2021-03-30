<template>
	<view class="collection">
		<view class="row" v-for="(item, index) in collectionList" :key="index">
			<!-- 商品 -->
			<view
				class="carrier"
				:class="[
					theIndex === index ? 'open' : oldIndex === index ? 'close' : ''
				]"
				@tap.stop="navTo(item.fightGroupsId)"
			>
				<view class="left">
					<image
						class="image"
						:src="item.mainiPcture"
					></image>
				</view>
				<view class="mid">
					<view class="title in2line">{{
						item.productName
					}}</view>
					<view class="bottom">
						<text class="price" :class="'text-' + themeColor.name">{{ moneySymbol }}{{
							item.payAmount
						}}</text>
					</view>
					<view class="bottom" style="margin-top: 5px;">
						<text :class="'text-' + themeColor.name">{{
							shipStatusInfo[item.shipStatus]
						}}</text>
						<text>{{ item.createTime }}</text>
					</view>
				</view>
			</view>
		</view>
		<rf-load-more :status="loadingType" v-if="collectionList.length > 0" />
		<rf-empty
			:info="'快去拼一些商品吧~'"
			v-if="collectionList.length === 0 && !loading"
		></rf-empty>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
/**
 * @des 我的收藏
 *
 * @author stav stavyan@qq.com
 * @date 2019-11-22 10:47
 * @copyright 2019
 */
import { togtherList } from '@/api/userInfo'
import rfLoadMore from '@/components/rf-load-more/rf-load-more'
import moment from '@/common/moment'
import $mAssetsPath from '@/config/assets.config'
import {
  getDate
} from '@/common/utils'
export default {
  components: {
    rfLoadMore
  },
  data () {
    return {
      collectionList: [],
      page: 1,
      loadingType: 'more',
      loading: true,
      moneySymbol: this.moneySymbol,
      // 控制滑动效果
      theIndex: null,
      oldIndex: null,
      pageSize: 10,
      shipStatusInfo: {
        1: '拼团中',
        2: '拼团成功',
        3: '未拼中',
        4: '结算成功'
      }

    }
  },
  filters: {
    time (val) {
      return moment(val * 1000).format('YYYY-MM-DD HH:mm')
    },
    marketingTypeTag (marketingType) {
      let tag
      switch (marketingType) {
        case 'discount':
          tag = $mAssetsPath.discountTag
          break
        case 'bargain':
          tag = $mAssetsPath.bargainTag
          break
        case 'group_buy':
          tag = $mAssetsPath.groupTag
          break
        case 'wholesale':
          tag = $mAssetsPath.wholesaleTag
          break
      }
      return tag
    }
  },
  onShow () {
    this.initData()
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.page = 1
    this.collectionList = []
    this.loading = true
    this.getCollectionList('refresh')
  },
  // 加载更多
  onReachBottom () {
    if (this.loadingType === 'nomore') return
    this.page++
    this.getCollectionList()
  },
  methods: {
    // 数据初始化
    initData () {
      this.page = 1
      this.collectionList.length = 0
      this.getCollectionList()
    },
    // 控制左滑删除效果
    touchStart (index, event) {
      // 多点触控不触发
      if (event.touches.length > 1) {
        this.isStop = true
        return
      }
      this.oldIndex = this.theIndex
      this.theIndex = null
      // 初始坐标
      this.initXY = [event.touches[0].pageX, event.touches[0].pageY]
    },
    touchMove (index, event) {
      // 多点触控不触发
      if (event.touches.length > 1) {
        this.isStop = true
        return
      }
      const moveX = event.touches[0].pageX - this.initXY[0]
      const moveY = event.touches[0].pageY - this.initXY[1]

      if (this.isStop || Math.abs(moveX) < 5) {
        return
      }
      if (Math.abs(moveY) > Math.abs(moveX)) {
        // 竖向滑动-不触发左滑效果
        this.isStop = true
        return
      }

      if (moveX < 0) {
        this.theIndex = index
        this.isStop = true
      } else if (moveX > 0) {
        if (this.theIndex != null && this.oldIndex === this.theIndex) {
          this.oldIndex = index
          this.theIndex = null
          this.isStop = true
          setTimeout(() => {
            this.oldIndex = null
          }, 150)
        }
      }
    },
    touchEnd (index, $event) {
      // 结束禁止触发效果
      this.isStop = false
    },
    // 获取收藏列表
    async getCollectionList (type) {
      await this.$http
        .get(`${togtherList}`, {
          page: this.page
        })
        .then(r => {
          this.loading = false
          if (r.status) {
            this.$mHelper.toast('获取我的团友失败！')
          }
          for (let i = 0; i < r.data.length; i++) {
            r.data[i].createTime = getDate(r.data[i].createTime, 2)
          }
          this.loadingType = r.data.length === this.pageSize ? 'more' : 'nomore'
          this.collectionList = [...this.collectionList, ...r.data]
          if (type === 'refresh') {
            uni.stopPullDownRefresh()
          }
        })
        .catch(() => {
          this.loading = false
          if (type === 'refresh') {
            uni.stopPullDownRefresh()
          }
        })
    },
    navTo (id) {
      const route = `/pages/product/product?id=${id}`
      this.$mRouter.push({ route })
    }
  }
}
</script>

<style lang="scss">
page {
	background-color: $page-color-base;
}
.collection {
	.row {
		width: calc(94%);
		height: 200upx;
		margin: 20upx auto;
		border-radius: 15upx;
		box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		position: relative;
		overflow: hidden;
		z-index: 4;
		border: 0;
		.menu {
			.icon {
				color: #fff;
				font-size: 60upx;
			}
			position: absolute;
			width: 29%;
			height: 100%;
			right: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 2;
		}
		.carrier {
			@keyframes showMenu {
				0% {
					transform: translateX(0);
				}
				100% {
					transform: translateX(-30%);
				}
			}
			@keyframes closeMenu {
				0% {
					transform: translateX(-30%);
				}
				100% {
					transform: translateX(0);
				}
			}
			&.open {
				animation: showMenu 0.25s linear both;
			}
			&.close {
				animation: closeMenu 0.15s linear both;
			}
			background-color: #fff;
			position: absolute;
			width: 100%;
			padding: 0 0;
			height: 100%;
			z-index: 3;
			display: flex;
			align-items: center;
			.left {
				width: 22vw;
				height: 22vw;
				margin-left: 20upx;
				margin-right: 10upx;
				position: relative;
				.image {
					border-radius: 10upx;
					width: 22vw;
					height: 22vw;
				}
				.tag {
					position: absolute;
					left: 0;
					top: 0;
					width: 60upx;
					height: 60upx;
				}
			}
			.mid {
				width: 100%;
				margin: 10upx 10upx 0;
				.title {
					height: 60upx;
					line-height: 1.2;
					font-size: $font-base;
				}
				.data {
					width: 100%;
					display: flex;
					align-items: center;
					margin: 10upx 0 5upx;
					font-size: $font-base;
					color: $font-color-base;
					.item {
						flex: 1;
					}
					.iconfont {
						color: $font-color-light;
						margin-right: 10upx;
					}
					.status {
						padding: 6upx 20upx;
						opacity: 0.8;
						color: $color-white;
						font-size: $font-sm;
						border-radius: 6upx;
					}
				}
				.bottom {
					line-height: 1.2;
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: $font-sm;
					color: $font-color-light;
					.price {
						font-size: $font-lg;
					}
				}
			}
		}
	}
}
</style>
