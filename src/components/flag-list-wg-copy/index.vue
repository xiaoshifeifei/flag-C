<template>
	<view>
		<block>
			<view
				class="flex middle start padding"
				style="border-bottom: 1px solid #f5f5f5"
			>
				<text
					@click="clickCurcopy(index)"
					class="title-cur"
					v-for="(item, index) in listmywgcopy"
					:key="index"
					:class="[item.cur ? 'text-orange' : '']"
					style="margin-right:10px;"
				>
					{{ item.name }}
				</text>
			</view>
			<!-- 我的flag -->
			<block v-if="list.length > 0">
				<view class="cu-card goods no-card padding">
					<view
						class="cu-item bg-white shadow"
						style="margin-bottom:20px;padding:10px;"
						v-for="(item, index) in list"
						:key="index"
						@tap.stop="navToDetailPage(item.flag_id)"
					>
						<view class="content">
							<view class="title">
								<view class="text-line2cut" style="font-weight:bold;">「{{item.type_text}}」 {{ item.content }}</view>
							</view>
							<view v-if="item.status==0" class="animation-fada text-red margin-top">需要邀请{{item.invite_min}}个好友监督</view>
							<view class="margin-top-xs">
								当前邀请人数：<text class="text-red text-xl">
									{{item.invite_num}}/{{item.invite_min}}
							</text></view>
							<view class="margin-top-xs">
								价格：<text class="text-price text-red text-xl">{{
									item.money / 100
								}}</text></view>
							<view class="margin-top-xs">
								已打卡：<text class="text-price text-gray text-del text-lg"
									>{{ item.process_days }}/{{ item.days }}</text
								></view
							>
							<view class="flex align-center flex-sub margin-top">
								<view class="text-gray text-sm margin-right"
									>围观人{{ item.onlook }}</view
								>
								<view class="text-gray text-sm flex-sub"
									>掌声{{ item.applause }}</view
								>
							</view>
							<view
								class="flex align-center flex-sub margin-top"
								v-if="item.flag_status == '进行中'"
							>
								<button class="cu-btn bg-orange round shadow sm">
									<text class="icon-lightfill"> </text>去打卡
								</button>
							</view>
							<view
								class="flex align-center flex-sub margin-top"
								v-if="item.flag_status == '未开始'"
							>
								<button class="cu-btn bg-orange round shadow sm">
									<text class="icon-lightfill"> </text>去分享
								</button>
							</view>
							<view class="flex justify-between align-end">
								<view class="flex align-center flex-sub">
									<view class="cu-progress round xs margin-right-sm flex-sub">
										<view
											class="bg-orange"
											:style="{ width: `${item.width}` }"
										></view>
									</view>
									<view class="text-gray text-sm flex-sub">{{
										item.width
									}}</view>
								</view>

								<view class="padding-left-xl text-right">
									<button
										@click.stop="shareWg()"
										class="cu-btn bg-orange round shadow sm"
									>
										<text class="icon-lightfill"> </text>{{ item.flag_status }}
									</button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
			<view v-else>
				<rf-no-data :custom="true">
					<view class="no-data-title">
						{{ '暂无数据' }}
					</view>
					<!-- <view @tap="getProductDetail(productDetail.id)" slot="refresh" class="spec-color">重新加载</view> -->
				</rf-no-data>
			</view>
		</block>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<rf-back-top :scrollTop="scrollTop"></rf-back-top>
	</view>
</template>

<script>
import { getMyFlag } from '@/api/basic';
export default {
	data() {
		return {
			isCard: false,
			value: '',
			moneySymbol: this.moneySymbol,

			isCanvas: true,
			isidx: 0,
			thumbsUpContext: null,
			thumbsUpTimer: 0,
			thumbsUpQueue: {},
			thumbsUpWidth: 100,
			thumbsUpHeight: 300,

			startlist: [
				{
					title: 1
				},
				{
					title: 1
				},
				{
					title: 1
				},
				{
					title: 1
				},
				{
					title: 1
				}
			],
			listmywgcopy: [
				{
					name: '未开始',
					cur: true,
					status: 0
				},
				{
					name: '进行中',
					cur: false,
					status: 2
				},
				{
					name: '已结束',
					cur: false,
					status: 3
				}
			],
			loading: true,
			scrollTop: 0,
			status: 0,
			list: []
		};
	},
	mounted() {
		this.thumbsUpContext = uni.createCanvasContext('thumsCanvas');
		var that = this;
		this.getWgList();
	},
	methods: {
		shareWg() {
			// this.$mHelper.toast('暂未开发');
			return false;
		},

		// 获取列表
		async getWgList() {
			// this.list = [];
			let params = {
				status: this.status
			};
			await this.$http
				.get(`${getMyFlag}`, params)
				.then(async r => {
					this.loading = false;
					r.data.forEach(item => {
						item.width =
							Math.round((item.process_days / item.days) * 10000) / 100.0 + '%';
					});
					this.list = r.data;
					console.log(this.list);
				})
				.catch(() => {
					this.loading = false;
				});
		},

		// 跳转至商品详情页
		navToDetailPage(flag_id) {
			this.$mRouter.push({
				route: `/pages/product/mywgdetail?id=${flag_id}`
			});
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		clickCurcopy(idx) {
			this.wgidxcopy = idx;
			console.log(idx);
			this.listmywgcopy.forEach((item, index) => {
				if (idx == index) {
					item.cur = true;
					this.status = item.status;
				} else {
					item.cur = false;
				}
			});
			this.loading = true;
			this.getWgList();
		},
		IsCard(e) {
			this.isCard = e.detail.value;
		},
		//预览图片
		previewImage() {
			uni.previewImage({
				// current: index, //预览图片的下标
				urls: [
					'https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg'
				] //预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
			});
		},
		InputFocus(e) {
			console.log(e);
		},
		InputBlur(e) {
			console.log(e);
			this.value = e.detail.value;
		},
		send() {
			this.$emit('send', this.value);
		}
	}
};
</script>

<style scoped lang="scss"></style>
