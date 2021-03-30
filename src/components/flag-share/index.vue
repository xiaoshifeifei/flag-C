<template>
	<view>
		<view @click.stop="wxShare()" class="sharewx"
			><image src="@/static/share/share.png"></image
		></view>
		<!-- 底部弹出 -->

			<u-action-sheet
				:list="actionSheetList"
				v-model="actionSheetShow"
				@click="actionSheetCallback"
			></u-action-sheet>

	</view>
</template>

<script>
export default {
	data() {
		return {
			//   底部弹出
			actionSheetList: [
				{
					text: '分享到微信朋友'
				},
				{
					text: '分享到微信朋友圈'
				}
			],
			actionSheetShow: false
		};
	},
	props: {
		contentHeight: {
			type: Number,
			default: 0
		},
		//是否是tabbar页面
		hasTabbar: {
			type: Boolean,
			default: false
		},
		shareList: {
			type: Array,
			default: function() {
				return [];
			}
		}
	},
	created() {},
	methods: {
		// 微信分享
		wxShare() {
			this.actionSheetShow = true;
		},
		// 点击actionSheet回调
		actionSheetCallback(index) {
			uni.hideKeyboard();
			//   console.log(index);
			if (index == 0) {
				this.$mflagShare.shareFriend();
			} else if (index == 1) {
				this.$mflagShare.shareFriendcricle();
			}
		}
	}
};
</script>

<style lang="scss">

</style>
