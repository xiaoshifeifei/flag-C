<template>
	<view class="rf-product-detail">
		<!--顶部返回按钮-->
		<!--#ifdef MP-WEIXIN-->
		<text class="back-btn iconfont iconzuo" @tap="navBack"></text>
		<!--#endif-->
		<!--header-->
		<view class="detail">
			<!--顶部商品轮播图-->
			<view class="cu-card dynamic no-card">
				<view class="cu-item shadow">
					<view @click="navToDetailPage" class="cu-list menu-avatar">
						<view class="cu-item">
							<view
								class="cu-avatar round lg"
								:style="{ backgroundImage: `url(${list.avatar})` }"
							></view>
							<view class="content flex-sub">
								<view>{{ list.nickname || '暂无' }}</view>
								<view class="text-gray text-sm flex justify-between">
									{{ list.time }}
								</view>
							</view>
						</view>
					</view>
					<view
						@click="navToDetailPage"
						style="padding-top: 10px"
						class="text-content"
					>
						{{ list.content }}
					</view>

					<view class="flag-gray-bg padding-lr">
						<view
							style="padding-left: 0px"
							class="padding bg-grey lightcopy radius flex align-center justify-between"
							><text class="text-orange margin-lr-xs"
								>{{ moneySymbol }}{{ list.money / 100 }} 围观:{{
									list.onlook
								}}人</text
							><text class="flex-sub text-cut"></text
							><button
								@click="makeMoney(list.flag_id)"
								class="cu-btn bg-orange sm"
								:class="[list.flag == 1 ? 'bg-graycopy' : 'bg-orange']"
							>
								{{ list.flag == 1 ? '已围观' : '围观分钱' }}
							</button></view
						>
					</view>
					<!-- 打卡记录 -->
					<view class="cu-bar bg-white margin-top">
						<view class="action sub-title">
							<text class="text-xl text-bold text-orange">{{
								`${title} ${list.process_days}/${list.days}`
							}}</text>
							<text class="bg-orange" style="width: 2rem"></text>
							<!-- last-child选择器-->
						</view>
					</view>
					<view class="padding">
						<!-- <u-collapse>
              <u-collapse-item 
                open
                :title="`${title} ${list.process_days}/${list.days}`"
              > -->
						<block v-if="dataList.length > 0">
							<block v-for="(item, index) in dataList" :key="index">
								<view class="grid col-3">
									<view v-for="(item, index) in item.images" :key="index">
										<view @click.stop="doPreviewImage(item, index)" class="">
											<img class="public-img" :src="item" alt="" />
										</view>
									</view>
								</view>
								<view class="daka-text">打卡说明:{{ item.content }}</view>
								<view class="daka-text">{{ item.create_time }}</view>
								<u-line class="pabom" color="#ddd" />
							</block>
						</block>
						<block v-else>
							<view class="no-data-title text-center margin-top">
								{{ '暂无打卡数据' }}
							</view>
						</block>
						<!-- </u-collapse-item>
            </u-collapse> -->
					</view>
					<view class="gray-line"></view>

					<view class="cu-bar bg-white margin-top">
						<view class="action sub-title">
							<text class="text-xl text-bold text-orange">{{ `评论` }}</text>
							<text class="bg-orange" style="width: 2rem"></text>
							<!-- last-child选择器-->
						</view>
					</view>

					<flag-comment :id="list.flag_id" ref="upDataList"></flag-comment>

					<!-- 评论 -->
					<view v-if="false" class="padding">
						<u-collapse>
							<u-collapse-item open :title="`${comment}${commentNum}条`">
								<block v-for="(item, index) in 6" :key="index">
									<view class="cu-list">
										<view class="cu-item flex">
											<view
												class="cu-avatar round lg margin-lr"
												style="
                          background-image: url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);
                        "
											></view>
											<view class="content flex-sub">
												<view class="text-grey">凯尔</view>
												<view class="text-gray text-sm flex">
													<view class="">
														我已天理为凭，踏入这片荒芜，不再受凡人的枷锁遏制。我已天理为凭，踏入这片荒芜，不再受凡人的枷锁遏制。
													</view>
												</view>
											</view>
										</view>
									</view>
									<u-line class="pabom" color="#ddd" />
								</block>
							</u-collapse-item>
						</u-collapse>
					</view>
					<!-- 评论 -->
				</view>
			</view>
			<!--商品信息-->
			<view v-if="false" class="introduce-section">
				<view class="introduce-first-line">
					<view
						class="price-box point-box"
						v-if="product.point_exchange_type == 4"
					>
						该商品仅需
						<text class="price">{{ product.point_exchange }} 积分</text>
					</view>
					<view class="price-box" v-else>
						<view class="price-first-line">
							<image
								class="member-level"
								mode="aspectFit"
								v-if="
									product.memberDiscount != [] &&
										product.memberDiscount &&
										product.memberDiscount.discount > 0 &&
										userInfo
								"
								:src="vipPrice"
							>
							</image>
							直购 :
							<text class="price" :class="'text-' + themeColor.name"
								>{{ moneySymbol }}{{ product.price }}</text
							>
						</view>
						<view
							class="m-price-wrapper"
							v-if="product.spellPrice && product.price > product.spellPrice"
						>
							flag购 : <text>{{ moneySymbol }}{{ product.spellPrice }}</text>
						</view>
					</view>
					<!-- <view class="collect" @tap="toFavorite">
						<view class="iconfont" :class="[ favorite ? `text-${themeColor.name} iconshixin1` : 'iconguanzhu']"></view>
						<text>收藏</text>
					</view> -->
				</view>
				<view class="introduce-second-line">
					<view class="title">
						<text>{{ product.name }}</text>
						<text class="sketch" style="font-size: 12px">{{
							product.subtitle
						}}</text>
					</view>
					<view class="share" v-if="false">
						<rf-tag
							type="gray"
							size="small"
							tui-tag-class="tui-tag-share tui-size"
							shape="circleLeft"
						>
							<button
								class="share-btn"
								open-type="share"
								:class="'text-' + themeColor.name"
								@tap.stop="share()"
							>
								<text class="iconfont iconfenxiang"></text>
								<text class="tui-share-text tui-gray">分享</text>
							</button>
						</rf-tag>
					</view>
				</view>
				<view class="introduce-second-line-c">
					<view class="title bg-grey lightcopy radius">
						<text>{{ product.name }}</text>
						<text class="sketch" style="font-size: 12px">{{
							product.subtitle
						}}</text>
					</view>
				</view>

				<!-- <view class="product-tag">
					<uni-tag
						@tap="openPoster"
						class="tag"
						circle
						type="base"
						text="生成海报"
						size="small"
					/>
				</view> -->
				<!-- <view class="data" v-if="product">
					<text class="item">快递: {{ product.shipping_type === '1' ? '包邮' : '买家自付' }}</text>
					<text class="item">库存： {{ product.stock }}</text>
					<text v-if="product.address_name" class="item in1line">{{ product.address_name }}</text>
				</view> -->
			</view>
			<!--商品参数-->
			<view style="display: none" class="c-list">
				<!--商品库存-->
				<rf-item-popup
					title="商品库存"
					v-if="parseInt(product.stock, 10) > 0"
					:isEmpty="parseInt(product.stock, 10) === 0"
					empty="库存不足"
				>
					<view slot="content">
						{{ currentStock || product.stock || 0 }} {{ product.unit || '件' }}
					</view>
				</rf-item-popup>

				<!--积分活动-->
				<rf-item-popup
					title="积分活动"
					v-if="product.point_exchange_type !== '1'"
				>
					<view slot="content" class="con-list">
						<text v-if="product.point_exchange_type"
							>兑换类型:
							{{ product.point_exchange_type | pointExchangeTypeFilter }}</text
						>
						<text v-if="parseInt(product.give_point, 10) > 0"
							>赠送类型:
							{{ product.integral_give_type | integralGiveTypeFilter }}</text
						>
						<text v-if="parseInt(product.give_point, 10) > 0"
							>下单可获得: {{ product | givePointFilter }}积分</text
						>
						<text v-if="product.point_exchange != 0"
							>兑换所需积分: {{ product.point_exchange }}
						</text>
						<text v-if="product.max_use_point != 0"
							>可使用抵扣积分: {{ product.max_use_point }}</text
						>
						<text
							class="buy-now"
							@tap="addCart('buy', true)"
							v-if="product.point_exchange_type == 3"
							>积分兑换 >>
						</text>
					</view>
				</rf-item-popup>
				<!--购买类型-->
				<rf-item-popup
					title="购买类型"
					@hide="hideService"
					:specClass="specClass"
					@show="toggleSpec"
				>
					<view slot="content">
						<text class="selected-text" v-if="currentSkuName === singleSkuText"
							>{{ currentCartCount }} {{ product.unit || '件' }}</text
						>
						<text class="selected-text" v-else-if="currentSkuName"
							>{{ currentSkuName }} * {{ currentCartCount }}</text
						>
						<text class="selected-text" v-else>请选择规格</text>
					</view>
					<view slot="right"><text class="iconfont iconyou"></text></view>
					<view slot="popup" @click.stop="stopPrevent">
						<rf-attr-content
							:type="type"
							:product="product"
							:minNum="minNum"
							:maxNum="maxNum"
							@toggle="toggleSpec"
						></rf-attr-content>
					</view>
				</rf-item-popup>
				<rf-item-popup
					title="拼团信息"
					v-if="toGetherData.shouldNumber"
					@hide="hideTogetherInfo"
					:specClass="togtherClass"
					@show="toggleTogetherInfo"
				>
					<view slot="content" class="con-list">
						<text class="selected-text"
							>开团人数：{{
								toGetherData && toGetherData.shouldNumber
							}}
							人</text
						>
						<text class="selected-text"
							>当前参与人数：{{
								toGetherData && toGetherData.realityNumber
							}}
							人</text
						>
					</view>

					<view
						slot="popup"
						@click.stop="stopPrevent"
						class="togetherlistContainer"
					>
						<view class="user-list">
							<text>已参与用户：</text>
							<text
								class="selected-text"
								v-for="(item, i) in toGetherData.itemInfoVoList"
								:key="i"
								>{{ item.realName }}--{{ item.userName }}</text
							>
						</view>
					</view>
				</rf-item-popup>
				<!--优惠券-->
			</view>
			<!-- 评价 -->
			<view style="display: none" class="eva-section" @tap="toEvaluateList">
				<view class="e-header">
					<text class="tit">评价({{ product.comment_num || 0 }})</text>
					<text class="tip" v-if="product.match_ratio"
						>好评率 {{ product.match_ratio }}%</text
					>
					<text class="tip" v-else>暂无评价信息</text>
					<i class="iconfont iconyou"></i>
				</view>
				<view
					class="eva-box"
					v-if="product.evaluate && product.evaluate.length > 0"
				>
					<image
						class="portrait"
						:src="
							(product.evaluate &&
								product.evaluate[0] &&
								product.evaluate[0].member_head_portrait) ||
								headImg
						"
						mode="aspectFill"
					></image>
					<view class="right">
						<view class="name">
							<text>
								{{
									(product.evaluate &&
										product.evaluate[0] &&
										product.evaluate[0].member_nickname) ||
										'匿名用户'
								}}
							</text>
							<rf-rate
								v-if="evaluateList.length > 0"
								size="16"
								disabled="true"
								:value="evaluateList[0].scores"
								:active-color="themeColor.color"
							/>
						</view>
						<text class="con in2line">{{
							(product.evaluate &&
								product.evaluate[0] &&
								product.evaluate[0].content) ||
								'这个人很懒，什么都没留下~'
						}}</text>
						<view class="bot">
							<text class="attr"
								>购买类型：{{
									(product.evaluate &&
										product.evaluate[0] &&
										product.evaluate[0].sku_name) ||
										singleSkuText
								}}</text
							>
							<text class="time">{{
								product.evaluate &&
									product.evaluate[0] &&
									product.evaluate[0].created_at | time
							}}</text>
						</view>
					</view>
				</view>
			</view>
			<!--底部商品详情-->
			<view v-if="false" class="detail-desc">
				<view class="d-header">
					<text>商品详情</text>
				</view>
				<rf-parser
					class="product-detail"
					:html="product.detail"
					lazy-load
				></rf-parser>
			</view>
			<!-- 底部操作菜单 -->
			<view class="page-bottom">
				<view
					class="text-gray xt-sm text-right flex align-center justify-between"
					style="width: 100%; padding-right: 0px; padding-left: 15px"
				>
					<view class="VueStar-re">
						<canvas
							v-if="index == isidx"
							class="VueStar"
							canvas-id="thumsCanvas"
							id="thumsCanvas"
						></canvas>
						<text
							@click="thumbsUp(0, list.flag_id)"
							class="cuIcon-appreciatefill margin-lr-xs"
						>
							{{ list.applause }}</text
						>
					</view>

					<view class="cu-bar input">
						<flag-send
							:id="list.flag_id"
							v-on:pLChangeType="changeType"
						></flag-send>
						<!-- <u-input
							cursor-spacing="10"
							class="solid-bottom"
							:clearable="false"
							v-model="value"
							placeholder="给我鼓励下吧"
							type="text"
						/>
						<button @click="send" class="cu-btn bg-orange round shadow-blur sm">
							发送
						</button> -->
					</view>
				</view>
			</view>
		</view>
		<!-- 分享引导 -->
		<view
			class="popup spec show"
			v-if="shareClass === 'show'"
			@touchmove.stop.prevent="stopPrevent"
			@tap="hideShareSpec"
		>
			<!-- 遮罩层 -->
			<view class="mask" @tap="hideShareSpec"></view>
			<view class="share-bg">
				<image :src="shareBg"></image>
			</view>
		</view>
		<view class="hideCanvasView" v-if="canvasShow">
			<canvas
				class="hideCanvas"
				canvas-id="default_PosterCanvasId"
				:style="{
					width: (poster.width || 10) + 'px',
					height: (poster.height || 0) + 'px'
				}"
			></canvas>
		</view>
		<!--回到顶部-->
		<!-- <rf-live v-if="product.name"></rf-live> -->
		<!--#ifdef MP-->
		<rf-nav></rf-nav>
		<!--#endif-->
		<view
			class="popup spec show"
			v-if="kefuShow"
			@touchmove.stop.prevent="stopPrevent"
			@tap="hide"
		>
			<!-- 遮罩层 -->
			<view class="mask" @tap="hide"></view>
			<view class="kefu-bg">
				<image :src="appServiceQr"></image>
			</view>
		</view>
	</view>
</template>
<script>
/**
 *@des 封装商品详情
 *@author stav stavyan@qq.com
 *@blog https://stavtop.club
 *@date 2020/05/15 16:22:24
 */
import rfItemPopup from '@/components/rf-item-popup';
import moment from '@/common/moment';
import rfAttrContent from '@/components/rf-attr-content';
import rfRate from '@/components/rf-rate/rf-rate';
import rfBadge from '@/components/rf-badge/rf-badge';
import uniTag from '@/components/uni-tag/uni-tag';
import rfNav from '@/components/rf-nav';
import rfLive from '@/components/rf-live';
import { cartItemCount, orderPreCreate, cartItemCreate } from '@/api/product';
import {
	collectCreate,
	collectDel,
	pickupPointIndex,
	transmitCreate
} from '@/api/basic';
import { couponReceive, addressList } from '@/api/userInfo';
import { mapMutations } from 'vuex';

import { getFlagRead, getFlagLog, getMakeMoney, clickGive } from '@/api/basic';
export default {
	name: 'rfProductDetail',
	props: {
		product: {
			type: Object,
			default() {
				return {};
			}
		},
		toGetherData: {
			type: Object,
			default() {
				return {};
			}
		},
		userInfo: {
			type: Object,
			default() {
				return {};
			}
		},
		url: {
			type: String,
			default: ''
		},
		marketType: {
			type: String,
			default: 'buy_now'
		},
		flag_id: {
			type: String,
			default: '0'
		}
	},
	components: {
		rfNav,
		rfItemPopup,
		rfBadge,
		rfLive,
		rfRate,
		uniTag,
		rfAttrContent
	},
	data() {
		return {
			appServiceQr: this.$mSettingConfig.appServiceQr,
			kefuShow: false,
			addressClass: 'none',
			canvasShow: true,
			logo: this.$mSettingConfig.appLogo,
			vipPrice: this.$mAssetsPath.vipPrice,
			posterShow: false,
			serviceClass: 'none', // 服务弹窗
			togtherClass: 'none', // 拼团信息
			ladderPreferentialClass: 'none', // 阶梯优惠弹窗
			attributeValueClass: 'none', // 商品参数弹窗
			specClass: 'none', // 商品参数弹窗
			couponClass: 'none', // 优惠券弹窗
			shareClass: 'none', // 分享引导弹窗
			fullGiveClass: 'none', // 满减送弹窗
			cartType: null, // 下单类型
			couponList: [], // 优惠券列表
			currentStock: null,
			currentSkuPrice: null,
			currentSkuName: null,
			currentCartCount: 1,
			evaluateList: [],
			hasLogin: this.$mStore.getters.hasLogin,
			cartNum: uni.getStorageSync('cartNum'),
			addressTypeList: this.$mConstDataConfig.addressTypeList,
			tabCurrentIndex: 0,
			loading: true,
			errorInfo: '',
			headImg: this.$mAssetsPath.headImg,
			isPointExchange: false,
			shareBg: this.$mAssetsPath.shareBg,
			appServiceType: this.$mSettingConfig.appServiceType,
			productPosterQrType: this.$mSettingConfig.productPosterQrType,
			appName: this.$mSettingConfig.appName,
			shareFrom: '',
			poster: {},
			promoCode: '',
			addressList: [],
			moneySymbol: this.moneySymbol,
			state: 1,
			singleSkuText: this.singleSkuText,
			thirdPartyQrCodeImg: '',

			//   打卡记录
			title: '打卡记录',
			num: '2/21',
			comment: '评价',
			commentNum: '6',

			isCanvas: true,
			isidx: 0,
			index: 0,
			thumbsUpContext: null,
			thumbsUpTimer: 0,
			thumbsUpQueue: {},
			thumbsUpWidth: 100,
			thumbsUpHeight: 300,

			value: '',
			list: {},
			dataList: [
				// {
				//   images: [
				//     'https://img14.360buyimg.com/babel/jfs/t1/107683/38/1017/367754/5df9d9c7E3f8b3885/1027b0d54c0f9633.jpg.webp',
				//   ],
				//   content: '第一天打卡',
				//   create_time: '2021-02-04 14:49:37',
				// },
			]
		};
	},
	async onShareAppMessage() {
		// #ifdef MP
		await this.$http
			.post(`${transmitCreate}`, {
				topic_type: 'product',
				topic_id: this.productId
			})
			.then(() => {
				return {
					title: this.productDetail.name,
					path: `/pages/product/product?id=${this.productId}`
				};
			});
		// #endif
	},
	filters: {
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm');
		},
		pointExchangeTypeFilter(val) {
			const type = [
				'',
				'非积分兑换',
				'积分加现金',
				'积分兑换或直接购买',
				'只支持积分兑换'
			];
			return type[parseInt(val, 10)];
		},
		integralGiveTypeFilter(val) {
			const type = ['固定积分', '百分比'];
			return type[parseInt(val, 10)];
		},
		givePointFilter(val) {
			return val.integral_give_type === '1'
				? Math.round(
						(parseInt(val.give_point, 10) / 100) * parseInt(val.minSkuPrice, 10)
				  )
				: parseInt(val.give_point, 10);
		}
	},
	computed: {
		type() {
			return 'buy_now';
		},
		// 购买按钮禁用
		buyBtnDisabled() {
			return parseInt(this.currentStock || this.product.stock, 10) === 0;
		},
		// 添加购物车按钮禁用
		addCartBtnDisabled() {
			return (
				this.product.point_exchange_type === '2' ||
				this.product.point_exchange_type === '4' ||
				parseInt(this.currentStock || this.product.stock, 10) === 0 ||
				this.product.is_virtual === '1'
			);
		},
		// 最小购买数量
		minNum() {
			return 1;
		},
		// 最小购买数量
		maxNum() {
			const maxNum = 0;
			return maxNum;
		},
		favorite() {
			return !!this.product.myCollect;
		},
		// 计算倒计时时间
		second() {
			return function(val) {
				return Math.floor(val - new Date() / 1000);
			};
		},
		currentProductPrice() {
			let price;
			if (this.type === 'buy_now') {
				if (
					this.product.memberDiscount &&
					this.product.memberDiscount.length !== 0
				) {
					// eslint-disable-next-line
					this.product.minSkuPrice =
						this.product.minSkuPrice *
						(1 - this.product.memberDiscount.discount / 100).toFixed(2);
					// eslint-disable-next-line
					this.product.maxSkuPrice = this.product.maxSkuPrice
						? (
								this.product.maxSkuPrice *
								(1 - this.product.memberDiscount.discount / 100)
						  ).toFixed(2)
						: 0;
				}
				// eslint-disable-next-line
				price =
					this.currentSkuPrice ||
					(this.product.maxSkuPrice &&
					this.product.minSkuPrice !== this.product.maxSkuPrice
						? this.product.minSkuPrice + ' ~ ' + this.product.maxSkuPrice
						: parseFloat(this.product.minSkuPrice).toFixed(2));
				return price;
			}
			return parseFloat(price || '0').toFixed(2);
		}
	},
	mounted() {
		this.getWgList();
		this.getDaKaJi();
		this.thumbsUpContext = uni.createCanvasContext('thumsCanvas');
		var that = this;
	},
	methods: {
		// 发送
		changeType() {
			this.$refs.upDataList.getComment(this.list.flag_id);
		},
		// 点赞
		//
		async getGive(flag_id) {
			let params = {
				flag_id
			};
			await this.$http
				.post(`${clickGive}`, params)
				.then(async r => {
					this.loading = false;
					if (r.code == 0) {
						this.$mHelper.toast(r.msg);

						setTimeout(() => {
							this.getWgList();
							this.getDaKaJi();
						}, 200);
					}
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 围观分钱
		async makeMoney(flag_id) {
			let params = {
				flag_id
			};
			await this.$http
				.post(`${getMakeMoney}`, params)
				.then(async r => {
					this.loading = false;
					console.log(r.msg);
					if (r.code == 0) {
						this.$mHelper.toast(r.msg);
						setTimeout(() => {
							this.getWgList();
							this.getDaKaJi();
						}, 200);
					}
				})
				.catch(() => {
					this.loading = false;
				});
		},

		// 获取列表
		async getWgList() {
			let params = {
				flag_id: this.flag_id
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
		// 获取列表
		async getDaKaJi() {
			let params = {
				flag_id: this.flag_id
			};
			await this.$http
				.get(`${getFlagLog}`, params)
				.then(async r => {
					this.loading = false;
					console.log(r);
					if (r.data) {
						this.dataList = r.data;
					} else {
						this.dataList = [];
					}
				})
				.catch(() => {
					this.loading = false;
				});
		},

		...mapMutations(['setCartNum']),
		// 返回上一页
		navBack() {
			this.$mRouter.back();
		},
		hide() {
			this.kefuShow = false;
		},
		// 分享商品
		share() {
			// #ifdef H5
			if (this.$mPayment.isWechat()) {
				this.shareClass = 'show';
			} else {
				this.$mHelper.h5Copy(this.url);
			}
			// #endif
			// #ifdef APP-PLUS
			this.$mHelper.handleAppShare(
				this.url,
				this.appName,
				this.product.name,
				this.product.picture
			);
			// #endif
		},
		// 通用跳转
		navTo(route) {
			if (
				this.appServiceType === '1' &&
				route === '/pages/product/service/index'
			) {
				this.kefuShow = true;
				return;
			}
			if (!this.hasLogin) {
				this.$mHelper.backToLogin();
			} else {
				if (this.appServiceType === '0') {
					this.$mHelper.toast('暂不提供客服功能');
				} else {
					this.$mRouter.push({
						route
					});
				}
			}
		},
		// 弹窗显示
		showPopupService(type, list) {
			if (list.length === 0) return;
			this[type] = 'show';
		},
		// 关闭服务弹窗
		hideService() {
			this.specClass = 'none';
			this.couponClass = 'none';
			this.serviceClass = 'none';
			this.ladderPreferentialClass = 'none';
			this.attributeValueClass = 'none';
			this.fullGiveClass = 'none';
		},
		// 获取优惠券
		async getCoupon(item) {
			if (!this.hasLogin) {
				await this.$mHelper.backToLogin();
				return;
			}
			await this.$http
				.post(`${couponReceive}`, {
					id: item.id
				})
				.then(() => {
					this.$mHelper.toast('领取成功');
				});
		},
		// 跳转至评价列表
		toEvaluateList() {
			if (
				!this.product.evaluateStat ||
				parseInt(this.product.comment_num, 10) === 0
			)
				return;
			this.$mRouter.push({
				route: `/pages/order/evaluation/list?comment_num=${
					this.product.comment_num
				}&evaluateStat=${JSON.stringify(this.product.evaluateStat)}`
			});
		},
		// 顶部tab点击
		// tabClick(index, state) {
		//   this.page = 1;
		//   this.addressList.length = 0;
		//   this.tabCurrentIndex = index;
		//   this.state = state;
		//   const api = this.state === 1 ? addressList : pickupPointIndex;
		//   this.getAddressList(api);
		// },
		// 获取收货地址列表
		async getAddressList(api) {
			await this.$http.get(api, {}).then(r => {
				this.addressList = r.data;
			});
		},
		// 规格弹窗开关
		toggleSpec(row) {
			if (!this.product.id) return;
			if (this.specClass === 'show') {
				this.currentStock = row.stock;
				this.currentSkuPrice = row.price;
				this.currentSkuName = row.skuName;
				this.currentCartCount = row.cartCount;
				const skuId = row.skuId;
				if (parseInt(this.currentStock, 10) === 0) {
					this.$mHelper.toast('库存不足');
					return;
				}
				if (this.cartType === 'cart') {
					this.handleCartItemCreate(skuId);
				} else if (this.cartType === 'buy') {
					this.buy('single');
				} else if (this.cartType === 'buy-togther') {
					this.buy('togther');
				}
				this.cartType = null;
				this.specClass = 'hide';
				setTimeout(() => {
					this.specClass = 'none';
				}, 250);
			} else if (this.specClass === 'none') {
				this.specClass = 'show';
			}
		},
		toggleTogetherInfo() {
			if (this.togtherClass === 'show') {
				this.togtherClass = 'hide';
				setTimeout(() => {
					this.togtherClass = 'none';
				}, 250);
			} else if (this.togtherClass === 'none') {
				this.togtherClass = 'show';
			}
		},
		// 海报弹窗开关
		async openPoster() {
			this.$mHelper.toast('该版本不支持生成海报');
		},
		hideSpec() {
			this.specClass = 'hide';
			setTimeout(() => {
				this.specClass = 'none';
			}, 250);
		},
		hideTogetherInfo() {
			this.togtherClass = 'hide';
			setTimeout(() => {
				this.togtherClass = 'none';
			}, 250);
		},
		hideShareSpec() {
			this.shareClass = 'hide';
			setTimeout(() => {
				this.shareClass = 'none';
			}, 250);
		},
		// 添加商品至购物车
		async handleCartItemCreate() {
			await this.$http
				.post(`${cartItemCreate}`, {
					selected: true,
					productId: this.product.id
				})
				.then(r => {
					if (r.status) {
						this.$mHelper.toast(r.msg);
						return;
					}
					this.$http.get(`${cartItemCount}`).then(r => {
						if (r.status) {
							this.$mHelper.toast(r.msg);
							return;
						}
						this.setCartNum(r.data);
						this.cartNum = r.data;
					});
					this.$mHelper.toast('添加购物车成功');
				});
		},
		// 收藏
		async toFavorite() {
			if (!this.product.id) return;
			if (!this.hasLogin) {
				this.specClass = 'none';
				await this.$mHelper.backToLogin();
			} else {
				this.favorite ? this.handleCollectDel() : this.handleCollectCreate();
			}
		},
		// 收藏商品
		async handleCollectCreate() {
			await this.$http
				.post(`${collectCreate}`, {
					topic_id: this.product.id,
					topic_type: 'product'
				})
				.then(() => {
					this.$mHelper.toast('收藏成功');
					this.$emit('product');
				});
		},
		// 取消收藏商品
		async handleCollectDel() {
			await this.$http
				.delete(`${collectDel}?id=${this.product.myCollect.id}`)
				.then(() => {
					this.$mHelper.toast('取消收藏成功');
					this.$emit('product');
				});
		},
		async buy(type) {
			await this.$http
				.post(`${orderPreCreate}`, {
					productId: this.product.id,
					productNum: this.currentCartCount,
					busType: type
				})
				.then(r => {
					if (r.status) {
						this.$mHelper.toast(r.msg);
						return;
					}
					this.$mRouter.push({
						route: `/pages/order/create/order?id=${r.data.orderNo}`
					});
				});
		},
		addCart(type, isPointExchange) {
			console.log(type, isPointExchange);
			// if (!this.product.id) return
			// if (!this.hasLogin) {
			//   this.$mHelper.backToLogin()
			//   return
			// }
			if (type === 'cart') {
				this.cartType = type;
				this.isPointExchange = isPointExchange;
				this.handleCartItemCreate();
			} else if (type === 'buy-togther') {
				// this.cartType = type
				// this.isPointExchange = isPointExchange
				// this.currentCartCount = 1
				// this.buy('togther')
				this.$mRouter.push({
					route: `/pages/order/create/order?id=183&type=flag`
				});
			} else {
				// this.specClass = 'show'
				// this.cartType = type
				// this.isPointExchange = isPointExchange
				this.$mRouter.push({
					route: `/pages/order/create/order?id=183`
				});
			}
		},
		stopPrevent() {},
		// callService () {
		//   window.location.href = 'tel:' + this.$mConstDataConfig.servicePhone
		// }

		// 预览图片
		doPreviewImage(url, index) {
			// console.log(this.dataList)
			console.log(url, index);
			uni.previewImage({
				// current: index, //预览图片的下标
				urls: [url] //预览图片的地址，必须要数组形式
			});
			// if (!this.dataList.images[0]) return;
			// const images = this.dataList.images.map(item => item.url || item.path);
			// uni.previewImage({
			// 	urls: images,
			// 	current: url,
			// 	success: () => {
			// 		// this.$emit('on-preview', url, this.lists, this.index);
			// 	},
			// 	fail: () => {
			// 		uni.showToast({
			// 			title: '预览图片失败',
			// 			icon: 'none'
			// 		});
			// 	}
			// });
		},

		//点赞动画 start
		thumbsUp(index, flag_id) {
			console.log(index);
			this.getGive(flag_id);
			this.isidx = index;
			const image =
				'../../static/thumbsUpImage/' + this.getRandomInt(1, 11) + '.png';
			const anmationData = {
				id: new Date().getTime(),
				timer: 0,
				opacity: 0.5,
				pathData: this.generatePathData(),
				image: image,
				factor: {
					speed: 0.004,
					t: 0
				}
			};
			if (Object.keys(this.thumbsUpQueue).length > 0) {
				this.thumbsUpQueue[anmationData.id] = anmationData;
			} else {
				this.thumbsUpQueue[anmationData.id] = anmationData;
				this.createThumbsAnimate();
			}
		},

		getRandom(min, max) {
			return Math.random() * (max - min) + min;
		},

		getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},

		generatePathData() {
			let width = this.thumbsUpWidth,
				height = this.thumbsUpHeight;
			const p0 = {
				x: 0.65 * width,
				y: height
			};
			const p1 = {
				x: this.getRandom(0.22 * width, 0.33 * width),
				y: this.getRandom(0.5 * height, 0.75 * height)
			};
			const p2 = {
				x: this.getRandom(0, 0.88 * width),
				y: this.getRandom(0.25 * height, 0.5 * height)
			};
			const p3 = {
				x: this.getRandom(0, 0.88 * width),
				y: this.getRandom(0, 0.125 * height)
			};
			return [p0, p1, p2, p3];
		},

		updatePoint(data, factor) {
			const p0 = data[0];
			const p1 = data[1];
			const p2 = data[2];
			const p3 = data[3];
			const t = factor.t;
			const cx1 = 3 * (p1.x - p0.x);
			const bx1 = 3 * (p2.x - p1.x) - cx1;
			const ax1 = p3.x - p0.x - cx1 - bx1;
			const cy1 = 3 * (p1.y - p0.y);
			const by1 = 3 * (p2.y - p1.y) - cy1;
			const ay1 = p3.y - p0.y - cy1 - by1;
			const x = ax1 * (t * t * t) + bx1 * (t * t) + cx1 * t + p0.x;
			const y = ay1 * (t * t * t) + by1 * (t * t) + cy1 * t + p0.y;
			return {
				x,
				y
			};
		},

		createThumbsAnimate() {
			let width = this.thumbsUpWidth,
				height = this.thumbsUpHeight;
			var that = this;
			Object.keys(that.thumbsUpQueue).forEach(key => {
				const anmationData = that.thumbsUpQueue[+key];
				const { x, y } = this.updatePoint(
					anmationData.pathData,
					anmationData.factor
				);
				const speed = anmationData.factor.speed;
				anmationData.factor.t += speed;
				var curWidth = 40;
				curWidth = (height - y) / 1.5;
				curWidth = Math.min(40, curWidth);
				var curAlpha = anmationData.opacity;
				curAlpha = y / height;
				curAlpha = Math.min(1, curAlpha);
				that.thumbsUpContext.globalAlpha = curAlpha;
				that.thumbsUpContext.drawImage(
					anmationData.image,
					x - curWidth / 2,
					y,
					curWidth,
					curWidth
				);
				if (anmationData.factor.t > 1) {
					delete that.thumbsUpQueue[anmationData.id];
				}
				if (y > height) {
					delete that.thumbsUpQueue[anmationData.id];
				}
			});
			that.thumbsUpContext.draw();
			if (Object.keys(that.thumbsUpQueue).length > 0) {
				that.thumbsUpTimer = setTimeout(() => {
					that.createThumbsAnimate();
				}, 5);
			} else {
				clearTimeout(that.thumbsUpTimer);
				that.thumbsUpContext.draw();
			}
		}
		//点赞动画 end
	}
};
</script>
<style lang="scss">
.u-collapse-body {
	height: auto !important;
}
.daka-text {
	padding-bottom: 15upx;
	font-size: $font-base;
}

.rf-product-detail {
	background-color: #fff !important;
	.back-btn {
		position: fixed;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			border-bottom: 1upx solid rgba(0, 0, 0, 0.01);

			image {
				width: 100%;
				height: 100%;
			}

			.content {
				position: absolute;
				right: $spacing-base;
				bottom: $spacing-base;
			}
		}
	}

	.detail {
		padding-bottom: 60upx;
	}

	.service {
		padding: $spacing-base $spacing-lg 0;

		.row {
			font-size: $font-lg;
			margin-bottom: $spacing-sm;
		}
	}

	.selected-text {
		margin-right: 4upx;
	}

	.sub-list {
		margin: 40upx 0 80upx;

		.row {
			width: 100%;
			margin-bottom: $spacing-lg;
		}
	}

	.share-bg {
		image {
			position: fixed;
			z-index: 100;
			width: 70vw;
			height: 45vw;
			right: $spacing-base;
			top: $spacing-base;
		}
	}

	.layer {
		position: fixed;
		z-index: 99;
		bottom: 0;
		width: 100%;
		border-radius: 10upx 10upx 0 0;
		background-color: #fff;

		.rf-list {
			max-height: 60vh;
			padding-bottom: 0;
			margin-bottom: $spacing-sm;
		}
	}

	.togetherlistContainer {
		padding: 10px 15px;
		max-height: 61.8vh;
		overflow-y: auto;

		.user-list {
			text {
				display: block;
				margin: 5px 0;
			}
		}
	}

	// 拼团公告
	.rf-swiper-slide {
		margin-top: 20upx;

		.label {
			margin-left: 10upx;
		}
	}

	// 玩法介绍
	.play-way {
		background-color: $color-white;
		padding: 0 20upx;
		margin: 20upx 0;
		font-size: $font-base;

		.title {
			border-bottom: 1px solid #eee;
			padding: $spacing-base 0;
			display: flex;
			justify-content: space-between;

			.iconfont {
				margin-left: 0.13rem;
				font-size: 0.28rem;
				color: #717171;
			}
		}

		.way {
			font-size: $font-base - 2upx;
			padding: 20upx 0;
			display: flex;

			.item {
				flex: 1;
				text-align: center;

				.tip {
					font-size: 0.22rem;
					color: #a5a5a5;
				}
			}

			.arrow {
				width: 40upx;

				.iconfont {
					color: $font-color-light;
					font-weight: 100;
				}
			}
		}
	}

	.assemble {
		background-color: #fff;

		.assemble-item {
			height: 120upx;
			border-bottom: 1px solid #f0f0f0;

			.pictxt {
				display: flex;
				justify-content: space-between;

				.picture {
					display: flex;

					image {
						width: 80upx;
						height: 80upx;
						margin: 20upx 0;
						border-radius: 50%;
					}

					.text {
						line-height: 120upx;
						margin-left: 20upx;
					}
				}

				.right {
					display: flex;
					align-items: center;

					.time-wrapper {
						text-align: right;
						margin-right: 20upx;

						.lack {
							font-size: $font-sm;

							.font-color-red {
								margin: 0 4upx;
							}
						}

						.time {
							font-size: $font-sm;
							color: $font-color-light;
						}
					}

					.spellBnt {
						font-size: $font-sm;
						width: 120upx;
						height: 48upx;
						display: flex;
						justify-content: center;
						align-items: center;
						border-radius: 48upx;
					}
				}
			}
		}
	}

	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			height: 40upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;

			.buy-now {
				color: $uni-color-primary;
			}
		}

		.red {
			color: $uni-color-primary;
		}
	}

	.kefu-bg {
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 98;

		image {
			width: 60vw;
			height: 60vw;
			border-radius: 12upx;
			z-index: 98;
		}
	}
}

.product-detail {
	padding: 0 $spacing-lg;
}
// 新
.introduce-second-line-c {
	padding: $spacing-base;
}
.introduce-second-line-c .title {
	padding: $spacing-sm;
}
</style>
