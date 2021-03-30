<template>
	<view class="recharge">
		<view class="block">
			<view class="title">
				充值金额
			</view>
			<view class="content">
				<view class="amount">
					<view class="list">
						<view class="box" v-for="(amount, index) in amountList" :key="index" @tap="select(amount)" :class="amount.price == inputAmount ? 'bg-' + themeColor.name : 'on'">
							<view class="real">{{ amount.price }}元</view>
						</view>
					</view>
					<view class="num">
						<view class="text">
							自定义充值金额
						</view>
						<view class="input">
							<input type="number" :class="'text-' + themeColor.name" @input="handleInputAmountChange" v-model="inputAmount" />
						</view>
						<text class="give" :class="'text-' + themeColor.name" v-if="inputAmountGive > 0">赠送 {{ inputAmountGive }}元</text>
					</view>
				</view>
			</view>
		</view>
		<view class="block">
			<view class="title">
				选择支付方式
			</view>
			<view class="content">
				<view class="pay-list">
					<view class="row" @tap="payType = 'ALIPAY'">
						<text class="icon iconfont iconalipay"></text>
						<view class="center">
							支付宝支付
						</view>
						<view class="right">
							<radio :checked="payType == 'ALIPAY'" :color="themeColor.color" />
						</view>
					</view>
					<view class="row" @tap="payType = 'WXPAY'">
						<i class="icon iconfont iconweixinzhifu"></i>
						<view class="center">
							微信支付
						</view>
						<view class="right">
							<radio :checked="payType == 'WXPAY'" :color="themeColor.color" />
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="pay">
			<view class="btn" :class="'bg-' + themeColor.name" @tap="pay">立即充值</view>

		</view>
		<!--加载动画-->
		<rfLoading isFullScreen :active="pageLoading"></rfLoading>
	</view>
</template>

<script>
import {
  payCreate
} from '@/api/basic'
import {
  recharge
} from '@/api/userInfo'
export default {
  data () {
    return {
      inputAmount: 0, // 金额
      inputAmountGive: 0, // 金额
      amountList: [{
        price: 100
      }, {
        price: 200
      }, {
        price: 500
      }, {
        price: 700
      }, {
        price: 900
      }, {
        price: 1200
      }], // 预设3个可选快捷金额
      payType: 'ALIPAY', // 支付类型
      userInfo: {},
      loading: false,
      providerList: [],
      payTypeList: {},
      isWechat: this.$mPayment.isWechat(),
      pageLoading: false,
      code: ''
    }
  },
  onLoad (options) {

  },
  methods: {
    select (item) {
      this.inputAmount = item.price
      this.inputAmountGive = item.give_price
    },
    async pay () {
      if (this.pageLoading) {
        return
      }
      const inputAmount = this.inputAmount
      if (parseInt(inputAmount, 10) === 0) {
        this.$mHelper.toast('请输入或选择充值金额')
        return
      }
      this.pageLoading = true
      await this.$http
        .post(`${recharge}`, {
          payment: inputAmount,
          payType: this.payType
        })
        .then(r => {
          this.pageLoading = false
          if (r.status) {
            this.$mHelper.toast(r.msg)
            return
          }
          this.toGetPayInfo(r.data, this.payType)
        })
        .catch(e => {
          this.pageLoading = true
        })
    },
    async toGetPayInfo (orderNo, payType) {
      await this.$http
        .post(`${payCreate}`, {
          orderNo: orderNo,
          payType: payType
        })
        .then(r => {
          if (r.status) {
            this.$mHelper.toast(r.msg)
            return
          }
          //#ifdef H5
          window.location.href = r.data.payUrl
          //#endif
          //#ifdef APP-PLUS
          plus.runtime.openURL(r.data.payUrl)
          //#endif
        })
    }
  }
}
</script>

<style lang="scss">
	page {
		background-color: $color-white;
	}

	.block {
		width: 100%;
		padding: 20upx;

		.title {
			width: 100%;
			font-size: 34upx;
		}

		.content {
			.my {
				width: 100%;
				height: 120upx;
				display: flex;
				align-items: center;
				font-size: $font-lg;
				border-bottom: solid 1upx #eee;

				.balance {
					margin-right: 6upx;
					font-size: $font-lg + 4upx;
				}
			}

			.amount {
				width: 100%;

				.list {
					display: flex;
					justify-content: space-between;
					padding-top: 20upx;
					flex-wrap: wrap;

					.box {
						width: 31%;
						margin-bottom: 20upx;
						height: 120upx;
						text-align: center;
						border-radius: 10upx;
						box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.05);

						&.on {
							background-color: #f1f1f1;
							color: #333;
						}

						.real {
							font-size: $font-lg;
							margin-top: 10upx;
						}

						.give {
							display: block;
							font-size: $font-sm;
						}
					}
				}

				.num {
					margin-top: 10upx;
					display: flex;
					justify-content: flex-end;
					align-items: center;

					.text {
						padding-right: 10upx;
						font-size: 30upx;
					}

					.give {
						font-size: $font-sm;
					}

					.input {
						width: 28.2vw;
						border-bottom: solid 2upx;
						justify-content: flex-end;
						align-items: center;

						input {
							margin: 0 20upx;
							height: 60upx;
							font-size: 30upx;
							justify-content: flex-end;
							align-items: center;
						}
					}
				}
			}

			.pay-list {
				width: 100%;
				border-bottom: solid 1upx #eee;

				.row {
					width: 100%;
					height: 120upx;
					display: flex;
					align-items: center;

					.icon {
						width: 100upx;
						font-size: 52upx;
						margin-left: 15upx;
					}

					.iconerjiye-yucunkuan {
						color: #fe8e2e;
					}

					.iconweixinzhifu {
						color: #36cb59;
					}

					.iconalipay {
						color: #01aaef;
					}

					.center {
						width: 100%;
						font-size: 30upx;
					}

					.right {
						width: 100upx;
						flex-shrink: 0;
						display: flex;
						justify-content: flex-end;
					}
				}
			}
		}
	}

	.pay {
		margin-top: 20upx;
		width: 100%;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;

		.btn {
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			box-shadow: 0upx 5upx 10upx rgba(0, 0, 0, 0.2);
		}

		.tis {
			margin-top: 10upx;
			width: 100%;
			font-size: 24upx;
			display: flex;
			justify-content: center;
			align-items: baseline;
			color: #999;

			.terms {
				color: #5a9ef7;
			}
		}
	}

	.rmbLogo {
		font-size: 40upx;
	}

	button {
		background-color: #007aff;
		color: #ffffff;
	}

	.uni-h1.uni-center {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-end;
	}

	.price {
		border-bottom: 1px solid #eee;
		width: 200upx;
		height: 80upx;
		padding-bottom: 4upx;
	}

	.ipaPayBtn {
		margin-top: 30upx;
	}
</style>
