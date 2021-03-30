<!--本页面由uniapp切片工具生成，uni-app切片-可视化设计工具(一套代码编译到7个平台iOS、Android、H5、小程序)，软件下载地址：http://www.ymznkf.com/new_view_669.htm -->
<template>
	<view class="YmContent">
		<view class="checkout_success_1">
			<view class="share-text-box">
				<view class="share-title flex center middle"> <icon type="success" size="26" style="margin-right:10px;"/>恭喜您,{{ list.type_text }}创建成功</view>
				<view class="share-center animation-fada">需要邀请{{list.invite_min}}个好友监督</view>
				<view class="btn-box flex middle center">
					<view class="btns one" @click="goToMyFlag">前往我的flag</view>
					<view class="btns" @click="wxShare">邀请分享</view>
				</view>
			</view>
			<view class="checkout_success_11" v-if="false">
				<view class="checkout_success_15">
					<text decode="true" class="checkout_success_16">小维怡</text>
					<view class="checkout_success_17"> </view>
					<text decode="true" class="checkout_success_68">2</text>
					<text decode="true" class="checkout_success_18">￥10</text>
				</view>
				<text decode="true" class="checkout_success_21"
					>四季豆土豆混合孔干饭</text
				>
				<view class="checkout_success_26">
					<text decode="true" class="checkout_success_27">普州坛子肉</text>
					<view class="checkout_success_28"> </view>
					<text decode="true" class="checkout_success_29">1</text>
					<text decode="true" class="checkout_success_30">￥39</text>
					<text decode="true" class="checkout_success_31">￥36</text>
				</view>
				<text decode="true" class="checkout_success_19">常温</text>
				<view class="checkout_success_20">
					<view class="checkout_success_22"> </view>
					<text decode="true" class="checkout_success_23">1</text>
					<text decode="true" class="checkout_success_24">￥26</text>
					<text decode="true" class="checkout_success_25">￥18</text>
				</view>
				<image
					v-on:click="checkout_success_14_14_click()"
					src="/static/checkout_success/images/checkout_success_14_14.jpg"
					mode="scaleToFill"
					border="0"
					class="checkout_success_14"
				></image>
				<view class="checkout_success_32">
					<text decode="true" class="checkout_success_33">已优惠</text>
					<text decode="true" class="checkout_success_34">￥</text>
					<text decode="true" class="checkout_success_35">11</text>
					<text decode="true" class="checkout_success_36">实付</text>
					<text decode="true" class="checkout_success_37">￥</text>
					<text decode="true" class="checkout_success_38">64</text>
				</view>
			</view>
			<view class="checkout_success_12">
				<view class="checkout_success_41">
					<text decode="true" class="checkout_success_42"
						>{{ list.type_text }}信息</text
					>
					<!-- <text decode="true" class="checkout_success_43"
						>如需退款,请致电商家</text> -->
				</view>
				<view class="checkout_success_45"> </view>
				<view class="checkout_success_46">
					<text decode="true" class="checkout_success_47">当前邀请人数</text>
					<text decode="true" class="checkout_success_48">{{list.invite_num}}/{{list.invite_min}}</text>
				</view>
				<view class="checkout_success_46">
					<text decode="true" class="checkout_success_47">订单标题</text>
					<text decode="true" class="checkout_success_48">{{
						list.type_text
					}}</text>
					<!-- <button
						v-on:click="checkout_success_53_53_click()"
						class="checkout_success_53"
					>
						复制
					</button> -->
				</view>
				<view class="checkout_success_46">
					<text decode="true" class="checkout_success_47">订单内容</text>
					<text decode="true" class="checkout_success_48">{{
						list.content
					}}</text>
				</view>
				<view class="checkout_success_46" v-if="list.type != 3">
					<text class="checkout_success_47">商品名称</text>
					<text class="checkout_success_48">{{
						list.product ? list.product.product_name : ''
					}}</text>
				</view>
				<view class="checkout_success_58">
					<text decode="true" class="checkout_success_59">支付明细</text>
					<text decode="true" class="checkout_success_60"
						>￥{{ list.money / 100 }}</text
					>
				</view>
				<view class="checkout_success_62">
					<text decode="true" class="checkout_success_63">备注</text>
					<text decode="true" class="checkout_success_64">{{
						list.remark
					}}</text>
				</view>
				<view class="checkout_success_54">
					<text decode="true" class="checkout_success_55">创建时间</text>
					<text decode="true" class="checkout_success_56">{{ list.time }}</text>
				</view>
			</view>
			<!-- <view class="checkout_success_74"> </view> -->
			<view class="checkout_success_13" v-if="false">
				<image
					v-on:click="checkout_success_69_69_click()"
					src=""
					mode="scaleToFill"
					border="0"
					class="checkout_success_69"
				></image>
				<text decode="true" class="checkout_success_70">前往我的flag</text>
				<view class="checkout_success_71"> </view>
				<image
					v-on:click="checkout_success_72_72_click()"
					src=""
					mode="scaleToFill"
					border="0"
					class="checkout_success_72"
				></image>
				<text decode="true" class="checkout_success_73">分享邀请</text>
			</view>
		</view>
		<!-- 底部弹出 -->
		<u-action-sheet
			:list="actionSheetList"
			v-model="actionSheetShow"
			@click="actionSheetCallback"
		></u-action-sheet>
	</view>
</template>

<script>
import { getFlagRead } from '@/api/basic';
export default {
	data() {
		return {
			id: '',
			list: '',
			// 分享
			//   底部弹出
			actionSheetList: [
				{
					text: '分享到微信朋友'
				},
				{
					text: '分享到微信朋友圈'
				}
			],
			actionSheetShow: false,
			appShareDatas: {}
		};
	},

	onLoad(options) {
		this.id = options.id;
		this.getWgList(this.id);
	},
	computed: {},
	methods: {
		// 获取详情
		async getWgList(id) {
			let params = {
				flag_id: id
			};
			await this.$http
				.get(`${getFlagRead}`, params)
				.then(async r => {
					this.loading = false;
					console.log(r);
					this.list = r.data;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		goToMyFlag() {
			this.$mRouter.redirectTo({
				route: '/pages/wgsite/wgsite?homeguol=true'
			});
		},
		// 分享
		wxShare() {
			console.log('点击了');
			this.actionSheetShow = true;
		},
		// 点击actionSheet回调
		actionSheetCallback(index) {
			uni.hideKeyboard();
			this.appShareDatas = {
				href: this.list.product ? this.list.product.download : '',
				title: this.list.type_text ? this.list.type_text : '',
				summary: this.list.product ? this.list.product.product_name : '',
				imageUrl: this.list.product ? this.list.product.product_img : ''
			};
			console.log(this.appShareDatas);
			if (index == 0) {
				this.$mflagShare.shareFriend(this.appShareDatas);
			} else if (index == 1) {
				this.$mflagShare.shareFriendcricle(this.appShareDatas);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import './checkout_success.scss';
.share-text-box {
	background-color: #fff;
	padding-bottom: 30px;
	padding-top: 30px;
	border-bottom: 10px solid #ededed;
	.share-title {
		text-align: center;
		font-size: 36upx;
	}
	.share-center {
		margin-top: 30upx;
		text-align: center;
		font-size: 32upx;
		color: red;
	}
}
.btn-box {
	width: 100%;
	margin-top: 80upx;
	// margin-bottom: 60upx;
	.btns {
		border: 1px solid #ccc;
		border-radius: 50px;
		padding: 5px 10px;
	}
	.one {
		margin-right: 30px;
	}
}
</style>
