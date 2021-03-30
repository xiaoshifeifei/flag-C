<template>
	<view class="shareContainer">
		<div class="share-bg"></div>
		<view class="history-section icon">
			<view class="qrcode-wrapper">
				<view class="qrcode-img-wrapper">
					<!-- <rf-qrcode class="qrcode" ref="recode" cid="qrcode2229" :makeOnLoad="!!hostUrl" :text="hostUrl"></rf-qrcode> -->
					<!-- <div id="qrCode" class="qrcode" ref="qrCodeDiv"></div> -->
					<canvas style="width: 200upx;height: 200upx;" canvas-id="couponQrcode"></canvas>
				</view>
				<text class="info">我的邀请码: {{proCode}}</text>
				<view class="copy-btn" @click="share">复制</view>
			</view>

			<view class="sec-header">
				<text @click="share">上&nbsp;拼&nbsp;购&nbsp;分&nbsp;享</text>
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
import QRCode from '@/utils/weapp-qrcode.js'

import {
  memberOtherInfo
} from '@/api/userInfo'
export default {
  // components: { rfQrcode },
  data () {
    return {
      proCode: '',
      hostUrl: '',
      premoteMe: '',
      myPremoter: []
    }
  },
  onLoad () {
    this.initData()
  },
  methods: {

    // 初始化数据
    async initData () {
      await this.$http
        .get(memberOtherInfo)
        .then(async r => {
			console.log(r)
          if (r.status) {
            this.$mHelper.toast('获取分享码失败！')
            return
		  }
		  this.proCode = r.data.promoCode
		  /**
		   *  这里 让服务器返回域名 
		   *  */	
		  var url = location ? location.origin : "http://pingouchina.com/";

          this.hostUrl = url + 'pages/public/login?type=1&invitecode=' + r.data.promoCode

          new QRCode('couponQrcode',{
            text: this.hostUrl,
            width: 96,
            height: 96,
            colorDark: '#333333', // 二维码颜色
            colorLight: '#ffffff', // 二维码背景色
            correctLevel: QRCode.CorrectLevel.L // 容错率，L/M/H
          })
        })
        .catch(() => {})
    },

    share () {
      this.$mHelper.h5Copy(this.hostUrl)
    }
  }
}
</script>
<style lang="scss" scoped>
	page {
		background-color: #f5f5f5;
	}

	/*关于商城*/
	.shareContainer {
		.share-bg {
			width: 100%;
			height: 100%;
			// background-image: url(/static/share/share.png);
			background-position: 50% 50%;
			background-size: cover;
			background-repeat: no-repeat;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
		}

		.history-section {
			position: absolute;
			width: 61.8vw;
			height: 61.8vh;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -38.2%);
			z-index: 10;

			.sec-header {
				font-size: $font-base + 6;
				color: $uni-color-primary;
				background-image: linear-gradient(to bottom right, #ffffb2, #dcdc0d);
				border-radius: 10vw;
				height: 40px;
				line-height: 40px;
				font-weight: 520;
				text-align: center;
				margin-top: 25px;
				width: 100%;
			}

			.qrcode-wrapper {
				padding: 4vh 0;
				text-align: center;

				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-radius: 20upx;
				background: #fff;
				box-shadow: 0px 2px 4px 4px rgba(255, 187, 4, 0.318);

				.qrcode-img-wrapper {
					display: flex;
					justify-content: center;
					align-items: center;
				}

				.qrcode {
					height: 38.1vw;
					width: 38.1vw;
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
					margin-top: 15px;
					display: block;
					font-size: $font-base + 4;
				}

				.copy-btn {
					color: $uni-color-primary;
					border: 1px solid $uni-color-primary;
					background-color: white;
					border-radius: 15px;
					height: 30px;
					line-height: 28px;
					text-align: center;
					margin-top: 15px;
					letter-spacing: 2px;
					width: 100px;
				}
			}

			.recordLine {
				font-size: $font-base;
				color: $font-color-dark;
				line-height: 40upx;
				margin-left: 30upx;
				margin-top: 30upx;

				.names {
					color: $uni-color-primary;
					display: block;
				}
			}
		}
	}
</style>
