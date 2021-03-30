<template>
	<view>
		<view class="cu-bar input">
			<u-input
				cursor-spacing="10"
				class="solid-bottom"
				:clearable="false"
				v-model="value"
				placeholder="给我鼓励下吧"
				type="text"
			/>
			<button @click="send(id)" class="cu-btn bg-orange round shadow-blur sm">
				发送
			</button>
		</view>
	</view>
</template>

<script>
import { getCommentPl } from '@/api/basic';
export default {
	data() {
		return {
			value: ''
		};
	},
	props: {
		id: {
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
	created() {
		// console.log(this.id)
	},
	methods: {
		send(id) {
			console.log(id);
			// this.$mHelper.toast('暂未开发');
			// return false;
			if (this.value == '') {
				this.$mHelper.toast('请输入评论');
				return false;
			}
			this.commentPl(id);
			// this.$emit('send', this.value);
		},
		// 评论发送
		async commentPl(id) {
			//  this.$emit("pChangeType")
			let params = {
				flag_id: id,
				content: this.value
			};
			await this.$http
				.post(`${getCommentPl}`, params)
				.then(async r => {
					if (r.code == 0) {
						this.$mHelper.toast(r.msg);
						this.$emit('pLChangeType');
						this.value = '';
					}
				})
				.catch(() => {});
		}
	}
};
</script>

<style lang="scss"></style>
