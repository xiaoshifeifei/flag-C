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
					<!-- <view @click="navToDetailPage" class="cu-list menu-avatar">
            <view class="cu-item">
              <view
                class="cu-avatar round lg"
                style="
                  background-image: url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg);
                "
              ></view>
              <view class="content flex-sub">
                <view>凯尔我的详情</view>
                <view class="text-gray text-sm flex justify-between">
                  2019年12月3日
                </view>
              </view>
            </view>
          </view> -->
					<view class="flexView">
						<view class="scrollView">
							<view class="head-read">
								<view class="flex" style="padding-right:10px;">
									<!-- <image class="read-img" :src="1111" mode="aspectFill" /> -->
									<view class="flex-box">
										<!-- <view class="flex-box-text">姓名：{{ userData.name }}({{ userData.id }})</view> -->
										<view class="flex-box-text" style="font-size: 30upx"
											>￥{{ list.money / 100 }} {{ list.content }}</view
										>
										<view class="flex-box-text">
											围观 {{ list.onlook }}人 掌声 {{ list.applause }}</view>
										<view class="flex-box-text">
											当前邀请人数 : 	{{list.invite_num}}/{{list.invite_min}}</view>
												<view v-if="list.status==0" class="animation-fada flex-box-text margin-top">需要邀请{{list.invite_min}}个好友监督</view>
									</view>
									<!-- <view class="arrow arrow-one" @click="showModal = true"> -->
									<view @click.stop="wxShare()" class="sharewx"
										><image src="@/static/share/share.png"></image
									></view>
									<!-- </view> -->
								</view>
							</view>
							<view class="white-box">
								<view class="tx">
									<!-- <view class="tx-grid">
										<view class="tx-grid-text">
											<view class="title">可提现余额</view>
											<view class="money">
												<text>{{ 11 }}</text>
												<text class="money-b">元</text>
											</view>
										</view>
									</view> -->
									<!-- <view
										class="tx-grid"
										@click="navTo('/pages/withdraw/index', false)"
										><span class="tx-grid-comm-sign">立即提现</span></view> -->
								</view>
								<view class="palace palace-one">
									<view class="palace-grid">
										<view class="palace-grid-text">
											<view class="palace-grid-text-data">
												<text>{{ list.process_days }}/{{ list.days }}</text>
												<text class="palace-grid-text-data-b">天</text>
											</view>
											<view class="palace-grid-text-name">打卡进度</view>
										</view>
									</view>
									<view class="palace-grid">
										<view class="palace-grid-text">
											<view class="palace-grid-text-data">
												<text>{{ list.money / 100 }}</text>
												<text class="palace-grid-text-data-b">元</text>
											</view>
											<view class="palace-grid-text-name">挑战金</view>
										</view>
									</view>
									<view class="palace-grid">
										<view class="palace-grid-text">
											<view class="palace-grid-text-data">
												<text>{{ list.flag_status }}</text>
												<!-- <text class="palace-grid-text-data-b">元</text> -->
											</view>
											<view class="palace-grid-text-name">打卡状态</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>

					<view
						@click="navToDetailPage"
						style="margin-bottom: 0"
						class="text-content"
						v-if="list.product != null && list.type != 3"
					>
						{{ list.type_text }}：{{ list.product.product_name }}
					</view>

					<!-- <view class="flag-gray-bg padding-lr">
						<view
							style="padding-left: 0px"
							class="padding bg-grey lightcopy radius flex align-center justify-between"
							><text class="text-orange margin-lr-xs"
								>{{ moneySymbol }}10.00 围观:150</text
							><text class="flex-sub text-cut"></text>
							<button class="cu-btn bg-orange sm">围观分钱</button>
						</view>
					</view> -->
					<!-- 打卡记录 -->
					<!-- <view class="padding margin-top dongtai">打卡动态</view> -->
					<view class="cu-bar bg-white margin-top">
						<view class="action sub-title">
							<text class="text-xl text-bold text-orange">打卡动态</text>
							<text class="bg-orange" style="width: 2rem"></text>
							<!-- last-child选择器-->
						</view>
					</view>
					<view class="padding">
						<!-- <u-collapse> -->
						<!-- <u-collapse-item open :title="`${title} ${num}`"> -->
						<block v-if="dataList.length">
							<block v-for="(item, index) in dataList" :key="index">
								<view class="grid col-3">
									<view v-for="(item, index) in item.images" :key="index">
										<view @click.stop="doPreviewImage(item, index)" class="">
											<img class="public-img" :src="item" alt="" />
										</view>
									</view>
								</view>
								<view class="daka-text">{{ item.content }}</view>
								<view class="daka-text">
									<text class="margin-right">{{ item.create_time }}</text>
									<!-- <u-tag
											text="缺卡"
											mode="light"
											shape="circle"
											type="warning"
										/> -->
								</view>

								<u-line class="pabom" color="#ddd" />
							</block>
						</block>
						<block v-else>
							<view class="no-data-title text-center margin-top">
								{{ '暂无打卡数据' }}
							</view>
						</block>
						<!-- </u-collapse-item> -->
						<!-- </u-collapse> -->
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
			<view
				@click="showdaka = true"
				v-if="list.flag_status == '进行中'"
				class="page-bottom"
				style="padding: 20upx 0"
			>
				<view class="flex middle center flag-footer bg-orange"> 打卡 </view>
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
		<!-- 底部弹出 -->

		<u-action-sheet
			:list="actionSheetList"
			v-model="actionSheetShow"
			@click="actionSheetCallback"
		></u-action-sheet>

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

		<!--回到顶部-->
		<rf-back-top :scrollTop="scrollTop"></rf-back-top>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>

		<!-- 打卡弹窗 -->
		<u-popup mode="bottom" v-model="showdaka">
			<view class="content">
				<scroll-view
					scroll-y="true"
					style="height: 400upx; margin-top: 30px; margin-left: 30px"
				>
					<view class="flex middle">
						<view>上传图片:</view>
						<view class="wrap" style="width:100px;height:100px;">
							<u-upload
								:custom-btn="true"
								:show-progress="true"
								ref="uUpload"
								:show-upload-list="showUploadList"
								:action="action"
								:name="name"
								:header="header"
								@on-error="errorImg"
								@on-success="successImg"
								:max-count="maxCount"
							>
								<view
									slot="addBtn"
									class="slot-btn"
									hover-class="slot-btn__hover"
									hover-stay-time="100"
								>
									<u-icon
										v-if="!upimg"
										name="plus"
										size="60"
										color="#c0c4cc"
									></u-icon>
									<image
										v-else
										class="pre-item-image"
										:src="serveimg"
										mode="aspectFill"
									></image>
								</view>
							</u-upload>
						</view>
					</view>
					<view
						class="flex middle margin-top"
						style="width:calc(100% - 120upx);"
					>
						<view class="margin-right">输入备注:</view>
						<u-input v-model="dakavalue" :type="type" />
					</view>
				</scroll-view>
				<view class="confrim-btn">
					<u-button type="warning" @click="creatFlag">确定</u-button>
				</view>
			</view>
		</u-popup>
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
import { getFlagRead, getFlagLog, getupload, getflagsave } from '@/api/basic';
import {
	collectCreate,
	collectDel,
	pickupPointIndex,
	transmitCreate
} from '@/api/basic';
import { couponReceive, addressList } from '@/api/userInfo';
import { mapMutations } from 'vuex';
import indexConfig from '@/config/index.config';
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
			title: '打卡动态',
			num: '',
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

			loading: true,
			scrollTop: 0,
			list: {},
			dataList: [
				// {
				//   images: [
				//     'https://img14.360buyimg.com/babel/jfs/t1/107683/38/1017/367754/5df9d9c7E3f8b3885/1027b0d54c0f9633.jpg.webp',
				//   ],
				//   content: '第一天打卡',
				//   create_time: '2021-02-04 14:49:37',
				// },
				// {
				//   images: [
				//     'https://img14.360buyimg.com/babel/jfs/t1/107683/38/1017/367754/5df9d9c7E3f8b3885/1027b0d54c0f9633.jpg.webp',
				//   ],
				//   content: '第一天打卡',
				//   create_time: '2021-02-04 14:49:37',
				// },
			],
			showdaka: false,

			action: `${indexConfig.baseUrl}/flag/upload`, //
			// action: `http://flagsapi.qmwlxcx.com/backend/product/upload`, // 演示地址
			header: {
				authorization: 'Bearer ' + uni.getStorageSync('accessToken')
				// authorization:
				//   'Bearer ' +
				//   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MTI0NTM3NzUsIm5iZiI6MTYxMjQ1Mzc3NSwic2NvcGUiOiJiYWNrZW5kIiwidHlwZSI6InRva2VuIiwiZXhwIjoxNjEyNDgyNTc1LCJkYXRhIjp7InVpZCI6Mn19.s1QJwWzzBSdjhKR7kc_KubKe3kwdw2B7yhufZDj0lmg',
			},
			name: 'record_img',
			// name: 'product_img',
			showUploadList: false,
			upimg: false,
			serveimg: '',
			dakavalue: '',
			maxCount: 1,
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
	onShow() {},
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
		// 分享
		wxShare() {
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
		},

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

		successImg(data) {
			console.log(data);
			if (data.code == 0) {
				this.$mHelper.toast(data.msg);
				this.upimg = true;
				this.serveimg = data.data.url;
				setTimeout(() => {
					this.$refs.uUpload.clear();
				}, 100);
			}
		},
		errorImg(res) {
			console.log(res);
			this.$mHelper.toast('图片上传视频');
		},
		onReady() {
			// 得到整个组件对象，内部图片列表变量为"lists"
			this.lists = this.$refs.uUpload.lists;
			console.log(this.lists);
		},
		// upload() {
		//   console.log(uni.getStorageSync('accessToken'));

		//   uni.chooseImage({
		//     count: 1,
		//     sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
		//     sourceType: ['camera', 'album'], //从相册选择
		//     success: function (res) {
		//       const tempFilePaths = res.tempFilePaths;
		//       const uploadTask = uni.uploadFile({
		//         url: 'http://flagcapi.qmwlxcx.com/api/flag/upload',
		//         filePath: tempFilePaths[0],
		//         name: 'file',
		//         formData: {},
		//         header: {
		//           'Content-Type': 'multipart/form-data',
		//           authorization: 'Bearer ' + uni.getStorageSync('accessToken'),
		//         },
		//         success: function (uploadFileRes) {
		//           console.log(uploadFileRes.data);
		//         },
		//       });

		//       uploadTask.onProgressUpdate(function (res) {
		//         _self.percent = res.progress;
		//         console.log('上传进度' + res.progress);
		//         console.log('已经上传的数据长度' + res.totalBytesSent);
		//         console.log(
		//           '预期需要上传的数据总长度' + res.totalBytesExpectedToSend
		//         );
		//       });
		//     },
		//     error: function (e) {
		//       console.log(e);
		//     },
		//   });
		// },

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
		// 新建flag
		async getCreatFlag() {
			let params = {
				id: this.flag_id,
				images: this.serveimg,
				content: this.dakavalue
			};
			await this.$http
				.post(`${getflagsave}`, params)
				.then(async r => {
					this.loading = false;
					if (r.code == 0) {
						this.$mHelper.toast(r.msg);
						setTimeout(() => {
							this.getWgList();
							this.getDaKaJi();
						}, 500);
					}
				})
				.catch(() => {
					this.loading = false;
				});
		},
		creatFlag() {
			if (this.serveimg == '') {
				this.$mHelper.toast('请上传图片');
				return false;
			}
			if (this.dakavalue == '') {
				this.$mHelper.toast('请输入备注');
				return false;
			}
			this.showdaka = false;
			this.getCreatFlag();
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
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

		//点赞动画 start
		thumbsUp(index) {
			console.log(index);

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

.flexView {
	width: 100%;
	height: 100%;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	.scrollView {
		width: 100%;
		height: 100%;
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		position: relative;
		// padding-bottom: 116rpx;
		.head-read {
			background: linear-gradient(to right, #ff8440, #ff1e0f);
			background-color: #ff8440;
			padding-bottom: 100rpx;
			.flex {
				display: flex;
				align-items: center;
				padding: 50rpx;
				position: relative;
				.read-img {
					width: 120rpx;
					height: 120rpx;
					border-radius: 100%;
					overflow: hidden;
					margin-right: 20rpx;
					border: 4rpx solid rgba(255, 255, 255, 0.3);
				}
				.flex-box {
					flex: 1;
					min-width: 0;
					font-size: 26rpx;
					color: #333;
					&-text {
						margin: 10rpx 0;
						color: #f5f5f5;
						font-weight: normal;
					}
				}
				.arrow {
					position: relative;
					padding-right: 30rpx;
					span {
						font-size: 28rpx;
						color: white;
					}
					&:after {
						content: ' ';
						display: inline-block;
						height: 12rpx;
						width: 12rpx;
						border-width: 4rpx 4rpx 0 0;
						border-color: #848484;
						border-style: solid;
						transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
						position: relative;
						top: -4rpx;
						position: absolute;
						top: 50%;
						margin-top: -8rpx;
						right: 4rpx;
						border-radius: 2rpx;
					}
				}
				.arrow-one:after {
					border-color: white;
					margin-top: -6rpx;
				}
			}
		}
		.white-box {
			width: 94%;
			background: white;
			border-radius: 10rpx;
			margin: -120rpx auto 20rpx;
			box-shadow: 0 6rpx 20rpx #e7e7e7;
			.tx {
				padding-top: 26rpx;
				overflow: hidden;
				display: flex;
				justify-content: space-between;
				align-content: center;
				&-grid {
					box-sizing: border-box;
					&:first-child {
						margin-left: 40rpx;
					}
					&-comm-sign {
						display: block;
						border-radius: 40rpx 0 0 40rpx;
						font-size: 26rpx;
						padding: 16rpx 44rpx;
						background: linear-gradient(to right, #fef082, #ffc551);
						background-color: #fef082;
						color: #cf4400;
					}
					&-text {
						display: block;
						color: #333;
						font-size: 26rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						.title {
							font-size: 26rpx;
							font-weight: normal;
							color: #ff6423;
						}
						.money {
							font-size: 60rpx;
							color: #ff6423;
							letter-spacing: 2rpx;
							margin-bottom: 10rpx;
							&-b {
								font-size: 28rpx;
							}
						}
					}
				}
			}
			.palace {
				padding-bottom: 20rpx;
				overflow: hidden;
				display: flex;
				justify-content: center;
				&-grid {
					flex: 1;
					position: relative;
					box-sizing: border-box;
					&:not(:last-child) {
						&:after {
							width: 1rpx;
							height: 80rpx;
							background: #fddece;
							content: ' ';
							display: inline-block;
							position: absolute;
							top: 0;
							right: 0;
						}
					}
					&-text {
						display: block;
						text-align: center;
						color: #333;
						font-size: 32rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						&-name {
							font-size: 26rpx;
							font-weight: normal;
							color: #ff8a4a;
						}
						&-data {
							font-size: 32rpx;
							color: #ff8a4a;
							letter-spacing: 2rpx;
							margin-bottom: 5rpx;
							&-b {
								font-size: 20rpx;
							}
						}
					}
				}
			}
		}
	}
}

.flag-footer {
	height: 80upx;
	line-height: 80upx;
	text-align: center;
	width: 80%;
	border-radius: 100px;
	margin: 0 auto;
	color: #fff;
	font-size: 40upx;
}
</style>
<style lang="scss">
.wrap {
	padding: 24rpx;
}

.slot-btn {
	width: 200upx;
	height: 200rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background: rgb(244, 245, 246);
	border-radius: 10rpx;
}

.slot-btn__hover {
	background-color: rgb(235, 236, 238);
}

.pre-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
}

.pre-item {
	flex: 0 0 48.5%;
	border-radius: 10rpx;
	height: 140rpx;
	overflow: hidden;
	position: relative;
	margin-bottom: 20rpx;
}

.pre-item-image {
	width: 200upx;
	height: 200rpx;
}
.dongtai {
	font-size: 32upx;
	font-weight: bold;
}
.confrim-btn {
	background-color: $uni-color-primary;
}
</style>
