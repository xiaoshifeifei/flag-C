<template>
	<view class="withdraw">
		<view class="withdraw-head">
			<view class="withdraw-head-to">提现至</view>
			<view class="withdraw-head-way">
				<view class="withdraw-head-way-1 flex">
					<image class="way-icon" src="/static/images/money.png"></image>
					<view
						v-if="siteList.length > 0"
						@click="upList()"
						class="way-text"
						style="margin-left: 5px"
					>
						<view>
							{{ bank_num }}
						</view>
						<!-- <view>
							{{ phone }}
						</view> -->
					</view>
					<text v-else @click="upCart()" class="way-text">添加银行卡</text>
				</view>
				<view class="withdraw-head-way-2">{{cash_rule}}</view>
			</view>
		</view>
		<view class="withdraw-body">
			<text>提现金额</text>
			<view class="input-money">
				<text class="rmb">￥</text>
				<input
					type="number"
					v-model="extract"
					class="t-input"
					@input="onInput"
				/>
			</view>
			<view class="info-money">
				<view v-if="is_out">
					<text class="info-money-num" style="color: #ff1e0f"
						>输入金额超过可提现余额，账户余额{{ userInfo.balance }}元</text
					>
				</view>
				<view v-else-if="is_lowest">
					<text class="info-money-num" style="color: #ff1e0f"
						>最低{{ lowest }}元起提现，账户余额{{ userInfo.balance }}元</text
					>
				</view>
				<view>
					<text class="info-money-num"
						>当前可提现余额{{ userInfo.balance }}元，</text
					>
					<text class="info-money-all" @click="getAll">全部提现</text>
				</view>
			</view>
			<!-- :class="'tx' + (is_post ? '-active' : '')" -->
			<view class="tx-active"
				><button @click="handleShowModel">提现</button></view
			>
		</view>

		<view
			:class="[
				'keyboard',
				keyboradShow ? '' : 'active',
				isIphoneX ? 'isIphone' : ''
			]"
		>
			<block v-for="(item, index) in 9" :key="index">
				<view class="keyboard-item" @tap="keyboradKey(index + 1)">{{
					index + 1
				}}</view>
			</block>
			<view class="keyboard-item hide"></view>
			<view class="keyboard-item" @tap="keyboradKey(0)"><text>0</text></view>
			<view class="keyboard-item delte" @tap="keyboradDel()"
				><image
					class="img"
					src="/static/images/del.png"
					mode="aspectFill"
					:lazy-load="true"
				></image
			></view>
		</view>

		<view class="cu-modal" :class="showModal ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end"
					><view class="content">提现确认</view></view
				>
				<view class="padding-xl" style="text-align: left">
					<view>
						<text>提现金额：</text>
						<text class="text-red fee">
							{{ money }}
							<em>元</em>
						</text>
					</view>
					<view class="margin-top-sm">
						<text>实际到账：</text>
						<text class="text-red fee">
							{{ real_money }}
							<em>元</em>
						</text>
					</view>
					<view class="margin-top-sm">
						<text>服务费：</text>
						<text class="text-red fee">
							{{ service_fee }}
							<em>元</em>
						</text>
					</view>
					<view class="margin-top-sm">
						<text>服务费率：</text>
						<text class="text-red">{{ fee }}%</text>
					</view>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn margin-left" @tap="showModal = false">
							我再想想
						</button>
						<button class="cu-btn bg-green margin-left" @tap="getMoney">
							确认提现
						</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 提现弹窗 -->

		<u-popup v-model="cart" mode="bottom">
			<view class="padding">
				<u-form :model="form" ref="uForm">
					<u-form-item label="姓名:" label-width="150"
						><u-input v-model="form.bank_user" placeholder="请输入姓名"
					/></u-form-item>
					<u-form-item label="电话:" label-width="150"
						><u-input
							v-model="form.mobile"
							type="number"
							placeholder="请输入电话"
					/></u-form-item>
					<u-form-item label="所属银行:" label-width="150"
						><u-input v-model="form.bank_name" placeholder="请输入所属银行"
					/></u-form-item>
					<u-form-item label="开户银行:" label-width="150"
						><u-input v-model="form.bank_addr" placeholder="请输入开户银行"
					/></u-form-item>
					<u-form-item label="银行卡号:" label-width="150"
						><u-input
							v-model="form.bank_num"
							type="number"
							placeholder="请输入银行卡号"
					/></u-form-item>
					<u-button type="success" @click="submit()">{{
						this.type == 'edit' ? '修改银行卡' : '提交'
					}}</u-button>
				</u-form>
			</view>
		</u-popup>
		<u-popup v-model="cartlist" mode="bottom" style="z-index: 999">
			<view class="padding">
				<scroll-view
					scroll-y
					style="height: 300px; position: relative; padding-bottom: 100upx"
				>
					<view
						class="item"
						v-for="(res, index) in siteList"
						:key="index"
						@click.stop="clickCart(res)"
					>
						<view class="item-sub" :class="[res.id==actives?'active':'']" @longtap="deleteAddress(res.id)">
							<view class="top">
								<view class="name">{{ res.bank_name }}</view>
								<view class="phone">{{ res.mobile }}</view>
								<view class="tag">
									<text
										v-for="(item, index) in res.tag"
										:key="index"
										:class="{ red: item.tagText == '默认' }"
										>{{ item.tagText }}</text
									>
								</view>
							</view>
							<view class="bottom">
								{{ res.bank_num }}
								<u-icon
									name="edit-pen"
									@click="edit(res.id, 'edit')"
									:size="40"
									color="#999999"
								></u-icon>
							</view>
						</view>
					</view>
					<view
						v-if="siteList.length > 0"
						class="tips"
						:class="'text-' + themeColor.name"
					>
						提示：长按可删除当前银行卡信息。
					</view>
					<view
						style="margin-top: 100upx; text-align: center"
						v-if="siteList.length == 0"
						>暂无银行卡信息</view
					>
					<view class="page-bottom">
						<u-button style="width: 100%" type="success" @click="upCart()"
							>添加银行卡</u-button
						>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import {
	bankAdd,
	bankList,
	bankInfo,
	bankEdit,
	bankDel
} from '@/api/product.js';
import { profileme, profileCash ,cashRule} from '@/api/userInfo';
export default {
	data() {
		return {
			pool: 0,
			extract: '',
			service_fee: 0.0,
			showModal: false,
			is_out: false,
			is_lowest: false,
			is_post: false,
			lowest: 1,
			fee: 0,
			money: '',
			real_money: '',
			keyboradShow: false,
			isIphoneX: false,
			isRefuse: false,
			cart: false,
			cartlist: false,
			form: {
				bank_user: '',
				mobile: '',
				bank_name: '',
				bank_addr: '',
				bank_num: ''
			},
			siteList: [
				// {
				// 	id: 1,
				// 	name: '游X',
				// 	phone: '8888888****5523',
				// 	tag: [
				// 		// {
				// 		// 	tagText: '默认'
				// 		// }
				// 	],
				// 	site: '中国银行'
				// },
				// {
				// 	id: 1,
				// 	name: '张X',
				// 	phone: '8888888****5523',
				// 	tag: [
				// 		// {
				// 		// 	tagText: '默认'
				// 		// }
				// 	],
				// 	site: '中国建设'
				// }
			],
			bank_num: '',
			bank_id: '',
			phone: '',
			type: '',
      userInfo: {},
      actives:'',
      cash_rule:''
		};
	},
	watch: {
		extract(oldVal, newVal) {}
	},
	onLoad() {
		this.getBankList();
		this.getinfo();
		this.cashRuleData();
	},
	methods: {
		async getinfo() {
			await this.$http
				.get(profileme)
				.then(async r => {
					this.loading = false;
					console.log(r);
					uni.setStorageSync('userInfo', r.data);
					r.data.balance = r.data.balance / 100;
					this.userInfo = r.data;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		async cashRuleData() {
			await this.$http
				.get(cashRule)
				.then(async r => {
					this.loading = false;
					console.log(r);
				if(r.code==0){
          this.cash_rule=r.data.cash_rule
        }
				})
				.catch(() => {
					this.loading = false;
				});
		},
		async loadData() {
			const res = await this.$api.json('pool');
			this.lowest = res.least_money;
			this.fee = res.fee;
			this.pool = res.pool;
			this.$nextTick(() => {
				this.keyboradShow = true;
			});
		},
		regTest(data) {
			const regExp = /^([1-9]{1})(\d{15}|\d{18})$/;
			return regExp.test(data);
		},
		//校验手机格式
		checkMobile(mobile) {
			return RegExp(/^1[34578]\d{9}$/).test(mobile);
		},
		// stopKeyborad() {
		// 	// uni.hideKeyboard();
		// },
		// keyboradKey(key) {
		// 	this.extract = this.extract * 10 + key;
		// 	this.checkMoney();
		// },
		// keyboradDel() {
		// 	if (this.extract && this.extract > 0) {
		// 		let val = parseInt(this.extract / 10);
		// 		if (val == 0) val = '';
		// 		this.extract = val;
		// 		this.checkMoney();
		// 	}
		// },

		clickCart(item) {
			console.log(item);
			this.bank_num = item.bank_num;
			this.bank_id = item.id;
      this.cartlist = false;
      this.actives=item.id
		},
		getAll() {
			this.extract = this.userInfo.balance;
			this.checkMoney();
		},
		upCart() {
			this.cart = true;
			this.cartlist = false;

			this.form.bank_user = '';
			this.form.mobile = '';
			this.form.bank_name = '';
			this.form.bank_addr = '';
			this.form.bank_num = '';
		},
		upList() {
			this.cartlist = true;
		},
		onInput(e) {
			if (this.extract != '') {
				this.checkMoney();
			} else {
				this.is_out = false;
				this.is_lowest = false;
			}

			//正则表达试
			e.detail.value = e.detail.value.match(/^\d*(\.?\d{0,2})/g)[0] || null;
			//重新赋值给input
			this.$nextTick(() => {
				this.extract = e.detail.value;
			});

			// 这种方式是uni-app官方的方式,测试结果正确！
			// console.log(e.detail);
			// this.extract = e.detail.value;
		},
		deleteAddress(id) {
			uni.showModal({
				content: '确定要删除该银行卡信息吗？',
				success: e => {
					if (e.confirm) {
						console.log('点击了');
						this.handleAddressDelete(id);
					}
				}
			});
		},
		checkMoney() {
			if (!this.extract || this.extract < this.lowest) {
				this.is_lowest = true;
				this.is_post = false;
			} else if (this.extract > this.userInfo.balance) {
				this.is_out = true;
				this.is_lowest = false;
				this.is_post = false;
			} else {
				this.is_out = false;
				this.is_lowest = false;
				this.is_post = true;
			}
			// if(this.extract==''){
			//     this.extract=0
			// }
			if (parseFloat(this.extract).toString() == 'NaN') {
				this.is_post = false;
				this.$mHelper.toast('输入金额不合法');
			}
		},
		handleShowModel() {
			if (this.isRefuse) return;
			this.checkMoney();
			if (!this.is_post) return;
			let params = {
				bank_id: this.bank_id,
				money: this.extract
			};
			this.getTiXian(params);

			// this.showModal = true;
		},
		async getTiXian(params) {
			await this.$http
				.post(profileCash, params)
				.then(async r => {
					this.loading = false;
					if (r.code == 0) {
						// this.$mHelper.toast(r.msg)
						uni.showModal({
							title: '提示',
							content: r.msg,
							confirmText: '返回首页',
							cancelText: '继续提现',
							success: res => {
								if (res.confirm) {
									this.$mRouter.reLaunch({ route: '/pages/index/index' });
								} else if (res.cancel) {
									this.extract = '';
									this.getinfo();
								}
							}
						});
					}
				})
				.catch(() => {
					this.loading = false;
				});
		},
		getMoney() {
			this.showModal = false;
			if (this.isRefuse) return;
			this.isRefuse = true;
			setTimeout(() => {
				this.$api.msg('提现申请已提交，等待管理员处理');
			}, 500);
			setTimeout(() => {
				uni.navigateBack();
			}, 1000);
		},

		submit() {
			if (this.form.bank_user == '') {
				this.$mHelper.toast('请输入姓名');
				return false;
			}
			if (!this.checkMobile(this.form.mobile)) {
				this.$mHelper.toast('请输入正确的手机号');
				return false;
			}
			if (this.form.bank_name == '') {
				this.$mHelper.toast('请输入所属银行');
				return false;
			}
			if (this.form.bank_addr == '') {
				this.$mHelper.toast('请输入开户银行');
				return false;
			}
			if (!this.regTest(this.form.bank_num)) {
				this.$mHelper.toast('请输入正确的银行卡号');
				return false;
			}
			if (this.type == 'edit') {
				this.getBankEdit(this.form);
			} else {
				this.getBankAdd(this.form);
			}
		},
		// 添加银行卡列表
		async getBankAdd(params) {
			await this.$http
				.post(`${bankAdd}`, params)
				.then(r => {
					console.log(r);
					if (r.code == 0) {
						this.$mHelper.toast(r.msg);
						this.cart = false;
						this.cartlist = true;
						this.getBankList();
					}
				})
				.catch(err => {});
		},
		// 修改银行卡列表
		async getBankEdit(params) {
			await this.$http
				.post(`${bankEdit}`, params)
				.then(r => {
					console.log(r);
					if (r.code == 0) {
						this.$mHelper.toast(r.msg);
						this.cart = false;
						this.cartlist = true;
						this.type = '';
						this.getBankList();
					}
				})
				.catch(err => {});
		},
		// 获取银行卡列表
		async getBankList(params) {
			await this.$http
				.get(`${bankList}`, params)
				.then(r => {
					console.log(r);
					if (r.code == 0 || r.code == 200) {
						this.siteList = r.data;
						this.bank_num = r.data[0].bank_num;
            this.bank_id = r.data[0].id;
            this.actives=r.data[0].id
					}
				})
				.catch(err => {});
		},
		// 获取银行卡查看
		async getBankInfo(id) {
			let params = {
				id
			};
			await this.$http
				.get(`${bankInfo}`, params)
				.then(r => {
					console.log(r);
					if (r.code == 0) {
						this.form.bank_user = r.data.bank_user;
						this.form.mobile = r.data.mobile;
						this.form.bank_name = r.data.bank_name;
						this.form.bank_addr = r.data.bank_addr;
						this.form.bank_num = r.data.bank_num;
						this.form.id = r.data.id;
					}
				})
				.catch(err => {});
		},
		// 获取银行卡删除
		async handleAddressDelete(id) {
			let params = {
				id
			};
			await this.$http
				.post(`${bankDel}`, params)
				.then(r => {
					console.log(r);
					if (r.code == 0) {
						this.$mHelper.toast(r.msg);
						this.getBankList();
					}
				})
				.catch(err => {});
		},
		edit(id, type) {
			this.type = type;
			this.cart = true;
			this.getBankInfo(id);
		}
	},
	onPullDownRefresh() {}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #ededed;
}
.withdraw {
	padding: 20px;
	&-head {
		background-color: #f7f7f7;
		display: flex;
		align-content: center;
		padding: 20px 30px;
		font-size: 14px;
		&-to {
		}
		&-way {
			display: flex;
			flex-direction: column;
			align-content: center;
			margin-left: 20px;
			&-1 {
				color: #576b95;
				margin-bottom: 10px;
				.way-icon {
					width: 16px;
					height: 16px;
					margin-right: 5px;
					top: 2px;
				}
			}
			&-2 {
				color: #acacac;
				font-size: 12px;
			}
		}
	}
	&-body {
		background-color: #fff;
		padding: 20px 30px;
		font-size: 14px;
		.input-money {
			display: flex;
			align-content: center;
			font-weight: 600;
			border-bottom: 0.5px solid #eaeef1;
			.rmb {
				font-size: 2em;
				top: 10px;
				position: relative;
			}
			.t-input {
				height: 1.9em;
				font-size: 2.5em;
				border: none;
				position: relative;
				left: 3.5%;
				outline: none;
			}
		}
		.info-money {
			margin-top: 10px;
			font-size: 12px;
			margin-bottom: 20px;
			&-num {
				color: #b2b2b2;
			}
			&-all {
				color: #576b95;
			}
		}
		.tx {
			button {
				color: #b2b2b2;
			}
		}
		.tx-active {
			button {
				color: #fff;
				background: #07c160;
			}
		}
	}
	.keyboard {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #ebebeb;
		display: flex;
		justify-content: center;
		z-index: 2;
		flex-wrap: wrap;
		transition: all 0.2s ease-in 0.2s;
	}
	.active {
		bottom: -400rpx;
	}
	.keyboard-item {
		box-sizing: border-box;
		width: 250rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: #fff;
		font-size: 40rpx;
		color: #333;
		height: 99rpx;
		border: 1rpx solid #ebebeb;
		border-top: none;
		border-left: none;
	}
	.hide {
		opacity: 0;
	}
	.delte {
		background: none;
		box-shadow: none;
	}
	.delte image {
		width: 60rpx;
		height: 60rpx;
	}
	.isIphone {
		padding-bottom: 68rpx !important;
	}
	.fee {
		em {
			font-size: 0.5rem;
			font-style: normal;
		}
	}
}

// 银行卡列表
.item {
	margin-bottom: 20px;
	.item-sub {
		padding: 40rpx 20rpx;

		&.active {
      background-color: #ccc;
      border-radius: 10px;
		}
	}
	.top {
		display: flex;
		font-weight: bold;
		font-size: 34rpx;
		.phone {
			margin-left: 60rpx;
		}
		.tag {
			display: flex;
			font-weight: normal;
			align-items: center;
			text {
				display: block;
				width: 60rpx;
				height: 34rpx;
				line-height: 34rpx;
				color: #ffffff;
				font-size: 20rpx;
				border-radius: 6rpx;
				text-align: center;
				margin-left: 30rpx;
				background-color: rgb(49, 145, 253);
			}
			.red {
				background-color: red;
			}
		}
	}
	.bottom {
		display: flex;
		margin-top: 20rpx;
		font-size: 28rpx;
		justify-content: space-between;
		color: #999999;
	}
}
.addSite {
	display: flex;
	justify-content: space-around;
	width: 600rpx;
	line-height: 100rpx;
	position: absolute;
	bottom: 30rpx;
	left: 80rpx;
	background-color: red;
	border-radius: 60rpx;
	font-size: 30rpx;
	.add {
		display: flex;
		align-items: center;
		color: #ffffff;
		.icon {
			margin-right: 10rpx;
		}
	}
}
</style>
