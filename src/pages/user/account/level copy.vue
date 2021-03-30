<template>
	<view class="rf-account-level" v-if="!loading">
		<!-- <view class="title">会员级别列表</view> -->
		<view class="service">
			<view class="sub-list valid">
				<view class="row" v-for="(item, index) in memberLevelList" :key="index" >
					<view class="carrier">
						<view class="title">
							<rf-image class="pack-img" :src="item.itemImg"></rf-image>
							<view class="title-right">
								<view class="title-type">
									<text class="cell-icon" :class="'bg-' + themeColor.name">{{
												parseInt(item.type, 10) === 0 ? 'V' : '代'
											}}</text>
									<text class="cell-title">{{item.mealName}}</text>
								</view>
								<view :class="'text-' + themeColor.name">
									<text class="price">{{item.itemName}}</text>
								</view>
							</view>
						</view>
						<view class="term">
							<text>￥{{item.price}}</text>
							<text class="buy" @click="buy(item)">购买</text>
						</view>
						<view class="usage" v-if="parseInt(item.type, 10) === 0">
							<text>收益占比：{{item.interestsProportion}}个分红点</text>
						</view>
						<view class="usage">
							<text>{{item.remark}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>

import helper from "./../../../utils/helper"



/**
	 * @des 用户账户中心
	 *
	 * @author stav stavyan@qq.com
	 * @date 2020-01-10 15:17
	 * @copyright 2019
	 */
import {
  openVip,
  openAgent,
  memberLevelIndex
} from '@/api/userInfo'

//@ts-check

export default {
  data () {
    return {
      memberLevelList: [],
      loading: true
    }
  },
  onLoad () {
    this.initData()
  },
  methods: {
    // 初始化数据
    initData () {
      this.getMemberLevelList()
    },
    // 获取用户信息
    async getMemberLevelList () {
		//this.loading = false
      await this.$http
        .post(memberLevelIndex)
        .then(async r => {
          this.loading = false
          if (r.status) {
            return
          }
          this.memberLevelList = r.data
        })
        .catch(() => {
          this.loading = false
		})
		
    },
    navTo (route) {
      this.$mRouter.push({
        route
      })
	},
	/** 
	 * @this {Vue}
	 */
    async buy (item) {
      if (this.loading) {
        return
      }

      const r = await  helper.confirm('确定购买？')
      if (r !== true) {
        return
      }
      const url = item.type === 0 ? openVip : openAgent
      this.loading = true
      await this.$http
        .post(url, {
          mealId: item.id
        })
        .then(async r => {
          this.loading = false
          if (r.status) {
            this.$mHelper.toast(r.msg ? r.msg : '购买失败！')
            return
          }
          this.$mHelper.toast('购买成功！')
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped lang="scss">
	page {
		background-color: $color-white;
	}

	$color: #e0e0e0;

	.rf-account-level {
		padding: 30upx;
		display: flex;
		flex: 1;
		flex-direction: column;

		.title {
			margin: 30upx 0;
			font-size: $font-lg;
			font-weight: 600;
			color: #333;
		}

		// 多行合并表格
		/* .advance-area {} */

		.service {
			padding: $spacing-base $spacing-lg 0;

			.row {
				font-size: $font-lg;
				margin-bottom: $spacing-sm;

				.title {
					display: flex;
					align-items: top;

					.price {
						font-size: 16px;
					}

					.pack-img {
						flex-shrink: 0;
						width: 15vw;
						height: 15vw;
					}

					.title-right {
						margin-left: 20px;
						flex-grow: 1;

						.title-type {
							display: flex;
							align-items: center;

							.cell-icon {
								margin-top: 0;
							}
						}
					}
				}

				.term text {
					color: $uni-color-primary;
				}
			}
		}
	}
</style>
