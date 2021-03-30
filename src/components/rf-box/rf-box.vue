<template name="popup">
	<view @touchmove.stop.prevent="clear" class="">
		<view class="popup_mask" @touchmove.stop.prevent="clear"></view>
		<view class="popup_content">
			<view class="title">{{ title }}</view>
			<view class="explain_text">
				<slot></slot>
			</view>
			<view class="button">
				<view class="back" @tap="back">取消</view>
				<view class="consent" @tap="consent">{{okText}}</view>
			</view>
		</view>
        
	</view>
</template>

<script>
export default {
	name: 'popup',
	props: {
		title: {
			type: String,
			default: '提示'
        },
        okText: {
			type: String,
			default: '确认'
		},
	},
	data() {
		return {
			showPopup: true
		};
	},
	methods: {
		// 禁止滚动
		clear() {
		},
		back() {
			this.$emit('close');
			// // #ifdef APP-PLUS
			// plus.runtime.quit();
			// // #endif
		},
		// 关闭弹框
		consent() {
			this.$emit('ok');
		}
	}
};
</script>

<style lang="scss">
.popup_mask {
	position: fixed;
	bottom: 0;
	top: 0;
	left: 0;
	right: 0;
	background-color: rgba(0, 0, 0, 0.4);
	transition-property: opacity;
	transition-duration: 0.3s;
	opacity: 0;
	z-index: 98;
}

.popup_mask {
	opacity: 1;
}

.popup_content {
	overflow: hidden;
	box-sizing: border-box;
	padding: 40upx 20upx 0 20upx;
	position: fixed;
	bottom: 30%;
	border-radius: 8px;
	left: 50%;
	margin-left: -40%;
	right: 0;
	background: #ffffff;
	width: 80%;
	z-index: 99;

	.title {
		text-align: center;
		font-size: 34upx;
		padding: 10upx 0 0 0;
	}

	.explain_text {
		font-size: 30upx;
		padding: 30upx 30upx 40upx 30upx;
		line-height: 38upx;
        height: calc(100% - 80upx);
		.line {
			display: block;

			.path {
				color: #007aff;
				display: inline-block;
				text-align: center;
			}
		}
	}

	.button {
		display: flex;
		padding: 20upx;
		align-items: center;
		font-size: 34upx;
		justify-content: space-around;
		border-top: 1upx solid #f2f2f2;

		view {
			text-align: center;
		}
	}
}
</style>
