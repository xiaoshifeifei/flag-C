<template>
	<view class="my-account">
		<!--账户信息面板-->
		<view class="header" :class="'bg-' + themeColor.name">
			<view class="account">
				<view class="assets">
					<view>总资产(元)</view>
					<view class="money">
						{{
							(userInfo && userInfo.balance) ||
								'0.00'
						}}
					</view>
				</view>
				<text v-if="isOpenRecharge" style="margin-left: 60px;" @tap="navTo('/pages/user/account/recharge', true)" class="recharge" :class="'text-' + themeColor.name"
					>充值</text
				>
				<text v-if="isOpenWithdraw" @tap="navTo('/pages/user/account/withdraw', true)" class="recharge" :class="'text-' + themeColor.name"
					>提现</text
				>
			</view>
			<view class="cumulative">
				<view class="item">
					<view>累计充值(元)</view>
					<view class="money">
						{{
							(userInfo && userInfo.recharge) ||
								'0.00'
						}}
					</view>
				</view>
				<view class="item">
					<view>累计消费(元)</view>
					<view class="money">
						{{
							(userInfo && userInfo.used) ||
								'0.00'
						}}
					</view>
				</view>
			</view>
		</view>
		<!--余额/积分导航-->
		<view class="nav">
			<view
				class="item"
				v-for="item in navList"
				:key="item.title"
				@tap="navTo(item.url, item.link)"
			>
				<text class="iconfont" :class="[item.icon, 'text-' + themeColor.name]"></text>
				<text>{{ item.title }}</text>
			</view>
		</view>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
/**
 * @des 用户账户中心
 *
 * @author stav stavyan@qq.com
 * @date 2020-01-10 15:17
 * @copyright 2019
 */
import { memberOtherInfo } from '@/api/userInfo'

export default {
  data () {
    return {
      userInfo: {},
      loading: true,
      isOpenRecharge: this.$mSettingConfig.isOpenRecharge,
      isOpenWithdraw: this.$mSettingConfig.isOpenWithdraw,
      navList: [
        {
          title: '账单',
          icon: 'icondaifukuan',
          url: '/pages/user/account/bill?state=1',
          link: true
		},
			


        {
          title: '充值',
          icon: 'iconchongzhijilu',
          url: '/pages/user/account/bill?state=2',
          link: true
        },
        {
          title: '收入',
          icon: 'iconchongzhijilu',
          url: '/pages/user/account/bill?state=3',
          link: true
        },
        {
          title: '消费',
          icon: 'iconzuheduozhongxiaofeifangshizuhexiaofei',
          url: '/pages/user/account/bill?state=4',
          link: true
        },
        {
          title: '提现',
          icon: 'icontixianjilu',
          url: '/pages/user/account/bill?state=5',
          link: true
        },
        {
          title: '退款',
          icon: 'icontixianjilu',
          url: '/pages/user/account/bill?state=6',
          link: true
        }

      ]
    }
  },
  onShow () {
    this.initData()
  },
  methods: {
    // 初始化数据
    initData () {
      this.getMemberInfo()
    },
    // 获取用户信息
    async getMemberInfo () {
      await this.$http
        .get(memberOtherInfo)
        .then(async r => {
          this.loading = false
          this.userInfo = r.data
        })
        .catch(() => {
          this.loading = false
        })
    },
    navTo (route, link) {
      if (!link) {
        this.$mHelper.toast('页面暂未开发！')
        return
      }
      this.$mRouter.push({ route })
    }
  }
}
</script>
<style scoped lang="scss">
page {
	background-color: $color-white;
}
.my-account {
	background-color: $color-white;
	/*  #ifndef H5  */
	height: 100vh;
	/*  #endif  */
	padding: 4vw 4vw;
	width: 100%;
	.header {
		padding: 30upx;
		height: 320upx;
		opacity: 0.9;
		border-radius: 20upx;
		color: rgba(255, 255, 255, 0.6);
		font-size: $font-sm;
		position: relative;
		.account {
			width: calc(100% - 60upx);
			display: flex;
			position: absolute;
			z-index: 2;
			justify-content: space-between;
			.assets {
				.money {
					color: #fff;
					font-size: $font-lg + 10upx;
					margin: 0;
				}
			}
			.recharge {
				font-size: $font-base;
				width: 150upx;
				height: 54upx;
				line-height: 54upx;
				border-radius: $font-base;
				background-color: #fff9f8;
				text-align: center;
				margin-top: 10upx;
			}
		}
		.cumulative {
			width: calc(100% - 240upx);
			position: absolute;
			bottom: 20upx;
			display: flex;
			justify-content: space-between;
			.money {
				color: #fff;
				font-size: $font-lg + 4upx;
				margin: 0;
			}
		}
		.header-bg {
			position: absolute;
			width: 100%;
			height: 320upx;
			z-index: 1;
			top: 0;
			image {
				width: 100%;
				height: 320upx;
			}
		}
	}
	.nav {
		border-bottom: 1px solid #f5f5f5;
		display: flex;
		flex-wrap: wrap;
		.item {
			margin: 1.4vw;
			font-size: $font-base + 2upx;
			width: 27.5vw;
			text-align: center;
			color: #999;
			.iconfont {
				display: block;
				margin: 0 auto;
				font-size: $font-lg + 30upx;
			}
		}
	}
	.advert {
		display: flex;
		.item {
			flex: 1;
			border-radius: 24upx;
			padding: 10upx 0;
			margin: 20upx 10upx;
			display: flex;
			justify-content: space-between;
			.iconfont {
				font-size: $font-lg + 20upx;
				margin-right: 20upx;
			}
			.text {
				margin-left: 20upx;
				.name {
					font-size: $font-base;
					font-weight: bold;
					height: 40upx;
				}
				.desc {
					font-size: $font-sm - 2upx;
				}
			}
		}
		.on {
			background-color: #fff3f3;
		}
	}
}
</style>
