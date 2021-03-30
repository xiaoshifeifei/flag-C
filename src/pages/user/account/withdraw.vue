<template>
	<view class="recharge">
		<view class="block">
			<view class="title">
				我的账户
			</view>
			<view class="content">
				<view class="my">
					我的账户余额：
					<text class="balance" :class="'text-' + themeColor.name">{{
						(userInfo && userInfo.balance) || '0'
					}}</text>
					元
				</view>
			</view>
		</view>
		<view class="block">
			<view class="title">
				提现
			</view>
			<view class="content">
				<view class="amount">
					<view class="num">
						<view class="text">
							提现方式：
						</view>
						<view class="input radioinput">
							<radio-group @change="handleTypeChange">
								<label
									class="gender-item"
									v-for="(item, index) in withdrawTypes"
									:key="index"
								>
									<radio
										class="gender-item-radio"
										:color="themeColor.color"
										:value="item.value"
										:checked="item.value === withdrawalType"
									/>
									<text class="gender-item-text">{{
										item.name
									}}</text>
								</label>
							</radio-group>
						</view>
					</view>
				</view>
			</view>
			<view class="content">
				<view class="amount">
					<view class="num">
						<view class="text">
							提现账号：
						</view>
						<view class="input">
							<input
								type="text"
								:class="'text-' + themeColor.name"
								v-model="account"
							/>
						</view>
					</view>
				</view>
			</view>
			<view class="content">
				<view class="amount">
					<view class="num">
						<view class="text">
							提现金额：
						</view>
						<view class="input">
							<input
								type="number"
								:class="'text-' + themeColor.name"
								v-model="inputAmount"
							/>
						</view>
					</view>
				</view>
			</view>
			<view class="content" v-show="withdrawalType === '3'">
				<view class="amount">
					<view class="num">
						<view class="text">
							开户行：
						</view>
						<view class="input">
							<input
								type="text"
								:class="'text-' + themeColor.name"
								v-model="bankName"
							/>
						</view>
					</view>
				</view>
			</view>
			<view class="content" v-show="withdrawalType === '3'">
				<view class="amount">
					<view class="num">
						<view class="text">
							姓名：
						</view>
						<view class="input">
							<input
								:class="'text-' + themeColor.name"
								v-model="realName"
							/>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="pay">
			<view class="btn" :class="'bg-' + themeColor.name" @tap="withdraw"
				>立即提现</view
			>
		</view>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
import { memberOtherInfo, toWithdraw, lastPayInfo } from '@/api/userInfo'
//@ts-check
export default {
	data() {
		return {
			withdrawTypes: [
				{
					name: '支付宝',
					value: '1'
				},
				//   {
				//     name: '微信',
				//     value: '2'
				//   },
				{
					name: '银行卡',
					value: '3'
				}
			],
			loading: true,
			userInfo: {},
			inputAmount: 0,
			withdrawalType: '1',
			account: '',
			bankName: '',
			realName: ''
		}
	},
	onLoad(options) {
		this.initData(options)
	},
	methods: {
		// 监听类型更改
		handleTypeChange(e) {
			this.withdrawalType = e.detail.value
		},
		async withdraw() {
			if (!this.account) {
				this.$mHelper.toast('请输入账号')
				return
			}
			if (!this.inputAmount) {
				this.$mHelper.toast('提现金额不能为0')
				return
			}
			if (
				this.withdrawalType === '3' &&
				(!this.bankName || !this.realName || !this.account)
			) {
				this.$mHelper.toast('请将银行卡信息填写完整')
				return
			}
			if (parseFloat(this.inputAmount) > parseFloat(this.userInfo.balance)) {
				this.$mHelper.toast('您的余额不够！')
				return
			}
			this.loading = true

			await this.$http
				.post(toWithdraw, {
					amount: parseFloat(this.inputAmount),
					withdrawalType: this.withdrawalType,
					account: this.account,
					bankName: this.bankName,
					realName: this.realName
				})
				.then(async r => {
					this.loading = false
					if (r.status) {
						this.$mHelper.toast(r.msg || '提现失败')
						return
					}
					this.$mHelper.toast('提现成功, 等待审核')
					this.initData()
				})
				.catch(() => {
					this.loading = false
				})
		},
		// 初始化数据
		async initData(options) {
			await this.$http
				.get(memberOtherInfo)
				.then(async r => {
					this.loading = false
					this.userInfo = r.data
				})
				.catch(() => {
					this.loading = false
				})

			/**
			 * @typedef  { Object }LastPayInfo 最后一次提现记录
			 * @property  { number }withdrawalType 提现类型 1-支付宝 3-银行卡
			 * @property  { string }account 账号（支付宝账号、银行账号）
			 * @property  { string }realName 开户人
			 * @property  { string }bankName 开户行
			 */

			/** @type { { status:number, data: LastPayInfo} } */
			let ds = await  this.$http.get(lastPayInfo)
			if (ds.status == 0 && ds.data) {
				this.withdrawalType = ds.data.withdrawalType.toString()
				this.account = ds.data.account
				this.bankName = ds.data.bankName
				this.realName = ds.data.realName
			}
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
				margin-top: 20upx;
				display: flex;
				align-items: center;

				.text {
					padding-right: 10upx;
					font-size: 30upx;
					flex-shrink: 0;
					width: 80px;
					white-space: nowrap;
				}

				.give {
					font-size: $font-sm;
				}

				.input {
					flex-grow: 1;
					border-bottom: solid 2upx;
					justify-content: center;
					align-items: center;

					input {
						margin: 0 20upx;
						height: 60upx;
						font-size: 30upx;
						justify-content: flex-end;
						align-items: center;
					}
				}
				.radioinput {
					border-bottom: 0;
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
.gender-item {
	margin-right: 3.5vw;
	.gender-item-radio {
		margin-right: 1.5vw;
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
