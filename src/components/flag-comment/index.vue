<template>
	<view style="padding-bottom:120upx;">
		<block v-if="commentList.length>0">
			<view class="comment" v-for="(res, index) in commentList" :key="index">
				<view class="left"
					><image :src="res.comment_member_avatar" mode="aspectFill"></image
				></view>
				<view class="right">
					<view class="top">
						<view class="name">{{ res.comment_member_nickname }}</view>
						<!-- <view class="like" :class="{ highlight: res.isLike }">
						<view class="num">{{ res.likeNum }}</view>
						<u-icon
							v-if="!res.isLike"
							name="thumb-up"
							:size="30"
							color="#9a9a9a"
							@click="getLike(index)"
						></u-icon>
						<u-icon
							v-if="res.isLike"
							name="thumb-up-fill"
							:size="30"
							@click="getLike(index)"
						></u-icon>
					</view> -->
					</view>
					<view class="content">{{ res.comment_content }}</view>
					<!-- <view class="reply-box">
					<view class="item" v-for="(item, index) in res.replyList" :key="item.index">
						<view class="username">{{ item.name }}</view>
						<view class="text">{{ item.contentStr }}</view>
					</view>
					<view class="all-reply" @tap="toAllReply" v-if="res.replyList != undefined">
						共{{ res.allReply }}条回复
						<u-icon class="more" name="arrow-right" :size="26"></u-icon>
					</view>
				</view> -->
					<view class="bottom">
						{{ res.create_time }}
						<!-- <view class="reply">回复</view> -->
					</view>
				</view>
			</view>
		</block>
		<block v-else>
			<view class="no-data-title text-center margin-top">
				{{ '暂无评论数据' }}
			</view>
		</block>
	</view>
</template>

<script>
import { getCommentList } from '@/api/basic';
export default {
	data() {
		return {
			commentList: [
				// {
				// 	id: 1,
				// 	name: '叶轻眉',
				// 	date: '12-25 18:58',
				// 	contentText:
				// 		'我不信伊朗会没有后续反应，美国肯定会为今天的事情付出代价的',
				// 	url: 'https://cdn.uviewui.com/uview/template/SmilingDog.jpg',
				// 	allReply: 12,
				// 	likeNum: 33,
				// 	isLike: false,
				// 	replyList: [
				// 		{
				// 			name: 'uview',
				// 			contentStr: '代码优美简洁，宇宙超级无敌彩虹旋转好用，用它！'
				// 		},
				// 		{
				// 			name: '粘粘',
				// 			contentStr:
				// 				'今天吃什么，明天吃什么，晚上吃什么，我只是一只小猫咪为什么要烦恼这么多'
				// 		}
				// 	]
				// }
			]
		};
	},
	props: {
		id: {
			type: Number,
			default: 0
		}
	},
	watch: {
		id(old) {
			this.id = old;
			this.getComment(this.id);
		}
	},
	created() {
		// console.log(this.id);
	},
	methods: {
		// // 跳转到全部回复
		// toAllReply() {
		// 	uni.navigateTo({
		// 		url: '/pages/template/comment/reply'
		// 	});
		// },
		// 点赞
		// getLike(index) {
		// 	this.commentList[index].isLike = !this.commentList[index].isLike;
		// 	if (this.commentList[index].isLike == true) {
		// 		this.commentList[index].likeNum++;
		// 	} else {
		// 		this.commentList[index].likeNum--;
		// 	}
		// },

		// 评论列表
		async getComment(id) {
			//  this.$emit("pChangeType")
			let params = {
				flag_id: id,
				page: 1,
				limit: 10000
			};
			await this.$http
				.get(`${getCommentList}`, params)
				.then(async r => {
					if (r.code == 0) {
						this.commentList = r.data.rows;
					}
				})
				.catch(() => {});
		}
	}
};
</script>

<style lang="scss" scoped>
.comment {
	display: flex;
	padding: 30upx;
	.left {
		image {
			width: 64upx;
			height: 64upx;
			border-radius: 50%;
			background-color: #f2f2f2;
		}
	}
	.right {
		// flex: 1;
		padding-left: 20upx;
		font-size: 30upx;
		width: calc( 100% - 80upx );
		word-wrap: break-word;
		word-break: normal;
		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 10upx;
			.name {
				color: $uni-color-primary;
			}
			.like {
				display: flex;
				align-items: center;
				color: #9a9a9a;
				font-size: 26upx;
				.num {
					margin-right: 4upx;
					color: #9a9a9a;
				}
			}
			.highlight {
				color: #5677fc;
				.num {
					color: #5677fc;
				}
			}
		}
		.content {
			margin-bottom: 10upx;
			// word-wrap: break-word; word-break: normal;
		}
		.reply-box {
			background-color: rgb(242, 242, 242);
			border-radius: 12upx;
			.item {
				padding: 20upx;
				border-bottom: solid 2upx $u-border-color;
				.username {
					font-size: 24upx;
					color: #999999;
				}
			}
			.all-reply {
				padding: 20upx;
				display: flex;
				color: #5677fc;
				align-items: center;
				.more {
					margin-left: 6upx;
				}
			}
		}
		.bottom {
			margin-top: 20upx;
			display: flex;
			font-size: 24upx;
			color: #9a9a9a;
			.reply {
				color: #5677fc;
				margin-left: 10upx;
			}
		}
	}
}
</style>
