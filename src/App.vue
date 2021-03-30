<script>
/* eslint-disable */
import Vue from 'vue';
import { memberInfo } from '@/api/userInfo';
import { productCate } from '@/api/product';
import { mapMutations } from 'vuex';
export default {
	async onLaunch() {
		await this.initData();
		this.$libs.NetWork.On();
	},
	methods: {
		...mapMutations(['setCartNum', 'setNotifyNum']),
		// 数据初始化
		async initData() {
			// uni.setTabBarStyle({
			// 	selectedColor: this.themeColor.color,
			// 	borderStyle: 'white'
			// });
			// this.themeColor.tabList &&
			// 	this.themeColor.tabList.forEach((selectedIconPath, index) => {
			// 		uni.setTabBarItem({
			// 			index,
			// 			selectedIconPath
			// 		});
			// 	});
			// await this.getCategories();

			// 获取页面设置配置
			const token = uni.getStorageSync('accessToken');
			// 获取系统title高度
			await this.initSystemInfo();
			if (token) {
				// await this.handleVerifyAccessToken(token);
			}
			if (this.$mStore.getters.hasLogin) {
				// 初始化购物车数量
				this.setCartNum(uni.getStorageSync('cartNum') || 0);
				this.setNotifyNum(uni.getStorageSync('notifyNum') || 0);
			}
		},
		async getCategories() {
			await this.$http
				.get(productCate, {})
				.then(r => {
					if (r.status) {
						return;
					}
					let data = r.data;
					data = this.setCategoriesValue(data);
					this.$mStore.commit('setCategories', r.data);
				})
				.catch(() => {});
		},
		setCategoriesValue(data) {
			for (let i = 0; i <= data.length - 1; i++) {
				let item = data[i];
				item.value = item.id;
				for (let j = 0; j < item.children.length; j++) {
					item.children[j].value = item.children[j].id;
				}
			}
			return data;
		},
		// 初始化系统信息
		initSystemInfo() {}

		// 检验token是否有效
		// async handleVerifyAccessToken(token) {
		//   await this.$http
		//     .get(memberInfo, {
		//       token,
		//     })
		//     .then((r) => {
		//       if (r.status) {
		//         this.$mStore.commit('logout');
		//         return;
		//       }
		//       this.$mStore.commit('login', r.data);
		//     });
		// },
	}
};
</script>
<style>
>>> .u-collapse-body {
	height: 100vh !important;
}
.cuIcon-appreciatefill {
	width: 80upx;
	height: 80upx;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
<style lang="scss">
@import 'uview-ui/index.scss';
// 导入colorUI
@import '/static/css/colorui/main.css';
@import '/static/css/colorui/icon.css';
@import '/static/css/colorui/animation.css';
// 导入阿里巴巴矢量图标库
/*#ifdef MP*/
@import './static/css/iconfont/iconfont.css';
/*#endif*/
/*#ifndef MP*/
@import url('https://at.alicdn.com/t/font_1681579_dwilkcq6mvg.css');
/*#endif*/
@import './static/css/reset.scss';
@import './static/css/uni.scss';
@import './static/css/style.scss';
.public-img {
	width: 80%;
	height: 160upx;
	object-fit: cover;
}
.pabom {
	margin-bottom: $spacing-base !important;
	margin-top: $spacing-base !important;
}

.flag-gray-bg {
	margin-top: $spacing-lg;
}

.VueStar-re {
	position: relative;
}

.VueStar {
	position: absolute;
	top: -600upx;
	left: -80upx;
	width: 100px;
	height: 300px;
}
// icon 列表
.cu-list.home-icon.grid,
.cu-list.home-sort.grid {
	padding: 10upx 20upx 0;
}

.cu-list.home-sort.grid .cu-item {
	justify-content: center;
	align-items: center;
}

.cu-list.home-icon.grid .ellipseIcon {
	height: 100upx;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
}

.cu-list.home-icon.grid .ellipseIcon view:first-child {
	position: relative;
	z-index: 2;
	color: #ffffff;
	margin: auto;
	width: initial;
}

.cu-list.home-icon.grid .ellipseIcon image {
	position: absolute;
	width: 90upx;
	height: 90upx;
	z-index: 9;
}

.cu-list.home-icon.grid .ellipseIcon .cu-tag.badge {
	z-index: 2;
	border: 1px solid #fff;
	box-sizing: content-box;
	box-shadow: 6upx 6upx 8upx rgba(204, 69, 59, 0.2);
}

.cu-list.home-icon.grid .ellipseIcon .cuIcon-ellipse {
	position: absolute;
	z-index: 0;
	top: 4upx;
	font-size: 90upx;
	margin: auto;
	bottom: 0;
}

// 瀑瀑流
.findCard {
	display: flex;
	padding: 0 10upx;
}

.findCard .cu-card {
	flex: 1;
}

.findCard .cu-card.goods .cu-item {
	margin: 20upx 10upx !important;
}

.findCard .cu-card.goods.col-goods > .cu-item .content {
	padding: 10rpx 15upx;
}

.findCard .cu-card.goods.col-goods > .cu-item .content .title {
	font-size: 24upx;
	font-weight: 300;
}

.findCard .cu-card.goods.col-goods > .cu-item .flex .text-cut {
	width: 150upx;
	margin-left: 10upx;
}

// 导航栏
.nav {
	margin: 5upx 10px;
	// margin-bottom: 30upx;
	// border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.nav.home-nav {
	// width: 100%;
	left: 0;
	height: 100upx;
	z-index: 1126;
}

.home-custom .nav.home-nav {
	padding-right: 110upx;
}

.home-nav .cu-item {
	padding: 0 10upx;
	position: relative;
}

.home-nav .cu-item.cur {
	font-size: 36upx;
	border-bottom: 0px;
	font-weight: bold;
}

.home-nav .cu-item.cur::after {
	content: '';
	width: 30upx;
	height: 8upx;
	border-radius: 30upx;
	background: currentcolor;
	display: block;
	position: absolute;
	bottom: 6upx;
	left: 0;
	right: 0;
	margin: auto;
}

.gray-line {
	height: 6upx;
	background-color: #f8f8f8;
}
// 分享
.sharewx {
	margin-right: 10px;
	margin-left: 10px;
}
.sharewx > image {
	width: 50upx;
	height: 50upx;
}

// 动画
@keyframes mymove {
	0% {
		transform: scale(0.9);
		-webkit-transform: scale(0.9);
	}
	50% {
		transform: scale(1);
		-webkit-transform: scale(1);
	}
	100% {
		transform: scale(0.9);
		-webkit-transform: scale(0.9);
	}
}
.animation-fada {
	animation: mymove 1s ease infinite !important;
}
</style>
