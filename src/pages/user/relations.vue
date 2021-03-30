<template>
	<view class="about">
		<view class="history-section icon">
			<view class="sec-header">
				<i class="iconfont icontuijian"></i>
				<text>伞下总人数：</text>
				<text v-if="number">{{number}}人</text>
			</view>
			<view class="recordLine">
				<text v-show="myPremoter.length > 0" v-for="(item, index) in myPremoter" :key="index"  class="names">{{item.realName}}-{{item.username}}</text>
				<text v-if="myPremoter.length === 0">暂无我的团友</text>
			</view>
		</view>
	</view>
</template>
<script>
/**
	 * @des 关于商城
	 *
	 * @author stav stavyan@qq.com
	 * @date 2019-12-09 10:13
	 * @copyright 2019
	 */
// import rfQrcode from '@/components/rf-qrcode'


// import QRCode from 'qrcodejs2'


import {
  memberOtherInfo,
  userTeam,
  userLevelTeam
} from '@/api/userInfo'
export default {
  // components: { rfQrcode },
  data () {
    return {
	  myPremoter: [],
	  number:0
    }
  },
  onLoad () {
    this.initData()
  },
  methods: {

    // 初始化数据
    async initData () {
		let [a,b] = await Promise.all([
			this.$http.get(userTeam),
			this.$http.get(userLevelTeam)
		]);
		if(!a.status){
			this.myPremoter = a.data
		}
		if(!b.status){
			this.number = b.data
		}
    }
  }
}
</script>
<style lang="scss" scoped>
	page {
		position: relative;
		background-color: #f5f5f5;
	}

	/*关于商城*/
	.about {
		padding: 20upx 0;

		.history-section {
			padding: 30upx 0;
			margin-top: 20upx;
			background: #fff;
			border-radius: 10upx;

			.sec-header {
				display: flex;
				align-items: center;
				font-size: $font-base + 6;
				color: $font-color-dark;
				line-height: 40upx;
				margin-left: 30upx;

				.iconfont {
					font-size: 44upx;
					color: #5eba8f;
					margin-right: 16upx;
					line-height: 40upx;
				}
			}

			.qrcode-wrapper {
				padding: $spacing-lg 0;
				text-align: center;

				.qrcode-img-wrapper {
					display: flex;
					justify-content: center;
					align-items: center;
				}

				.qrcode {
					height: 150px;
					width: 150px;
				}

				.qrcode-img {
					width: 300upx;
					height: 300upx;

					image {
						width: 300upx;
						height: 300upx;
					}
				}

				.info {
					margin-top: 10px;
					display: block;
				}
			}

			.recordLine{
				font-size: $font-base;
				color: $font-color-dark;
				line-height: 40upx;
				margin-left: 30upx;
				margin-top: 30upx;

				.names{
					color: $uni-color-primary;
					display: block;
					margin-top: 10px;
				}
			}
		}
	}
</style>
