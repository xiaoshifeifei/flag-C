<template>
	<view class="rf-create-order">
		<view class="order" v-if="orderDetail">
			<!--选择地址-->
			<navigator
				url="/pages/user/address/address?source=1"
				class="rf-address-section"
			>
				<view class="order-content">
					<i class="iconfont iconshouhuodizhi"></i>
					<view v-if="addressData.name" class="cen">
						<view class="top">
							<text class="name">{{ addressData.name }}</text>
							<text class="mobile">{{ addressData.mobile }}</text>
						</view>
						<text class="address in1line"
							>{{ addressData.province }} {{ addressData.city
							}}{{ addressData.area }} {{ addressData.address }}</text
						>
					</view>
					<view class="no-default-address" v-else> 请选择收货地址 </view>
					<i class="iconfont iconyou"></i>
				</view>
				<image
					class="a-bg"
					src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvV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"
				></image>
			</navigator>
			<!--商品列表-->
			<view class="rf-goods-section">
				<view class="g-header b-b">
					<image class="logo" :src="logo"></image>
					<text class="name">商品列表</text>
				</view>
				<!-- 商品列表 -->
				<view
					class="g-item relative"
					v-for="(item, index) in orderDetail.orderItemVoList"
					:key="index"
				>
					<view class="g-item">
						<rf-image :preview="false" mode="aspectFit" :src="item.img">
						</rf-image>
						<view class="right">
							<view
								class=""
								@tap="navTo(`/pages/product/product?id=${item.productId}`)"
							>
								<text class="title clamp in2line">
									{{ item.name }}
								</text>
								<!-- 	<text class="spec">单价：{{ item.currentUnitPrice }}</text>
								<text class="spec">数量：{{ item.quantity }}</text> -->
								<view class="price-box">
									<text class="price-wrapper">
										<text class="tip"></text>
										<text
											v-if="orderFlag != 'flag'"
											:class="'text-' + themeColor.name"
											>{{ moneySymbol }}{{ item.price / 100 }}</text
										>
										<text v-else :class="'text-' + themeColor.name"
											>{{ moneySymbol }}{{ item.flag_price / 100 }}</text
										>
										<text class="number"></text>
									</text>
								</view>
							</view>

							<!-- <rf-number-box
								v-if="orderFlag != 'flag'"
								class="step"
								:value="cartCount"
								@eventChange="numberChange"
								:min="1"
								:max="10"
							></rf-number-box> -->
						</view>
					</view>
				</view>
			</view>

			<!-- 优惠明细 -->
			<block v-if="orderFlag != 'flag'">
				<view v-if="false" class="yt-list">
					<view class="yt-list-cell b-b" @tap="toggleMask('show')">
						<view class="cell-icon" :class="'bg-' + themeColor.name"> 券 </view>
						<text class="cell-tit clamp">优惠券</text>
						<text class="cell-tip" :class="'text-' + themeColor.name">
							{{ couponItem.title || '选择优惠券' }}
						</text>
						<text
							v-if="couponItem.title"
							@tap.stop="clearCoupon"
							class="iconfont iconshanchu4"
							:class="'text-' + themeColor.name"
						></text>
					</view>
					<!-- 			<view class="yt-list-cell b-b" @tap="showSinglePicker" v-if="pickerShippingType.length > 0">
					<view class="cell-icon" :class="'bg-' + themeColor.name">
						寄
					</view>
					<text class="cell-tit clamp">配送方式</text>
					<text class="cell-tip" :class="'text-' + themeColor.name">
						{{ currentShippingType.label || '选择配送方式' }}
					</text>
					<text class="cell-more wanjia wanjia-gengduo-d"></text>
				</view> -->
					<view
						class="yt-list-cell b-b"
						@tap="showCompanyPicker"
						v-if="
							parseInt(currentShippingType.value, 10) === 1 &&
								orderDetail.company.length > 0
						"
					>
						<view class="cell-icon" :class="'bg-' + themeColor.name"> 递 </view>
						<text class="cell-tit clamp">快递公司</text>
						<text class="cell-tip" :class="'text-' + themeColor.name">
							{{ (currentCompany && currentCompany.label) || '选择快递公司' }}
						</text>
						<text class="cell-more wanjia wanjia-gengduo-d"></text>
					</view>
					<view
						class="yt-list-cell b-b"
						@tap="showPickupPointPicker"
						v-if="parseInt(currentShippingType.value, 10) === 2"
					>
						<view class="cell-icon" :class="'bg-' + themeColor.name"> 提 </view>
						<text class="cell-tit clamp">门店自提点</text>
						<text
							class="cell-tip in1line"
							:class="
								currentPickupPoint && currentPickupPoint.label
									? 'text-' + themeColor.name
									: ''
							"
						>
							{{
								(currentPickupPoint && currentPickupPoint.label) ||
									'请选择自提点'
							}}
						</text>
						<text class="cell-more wanjia wanjia-gengduo-d"></text>
					</view>
					<!-- <view
					class="yt-list-cell b-b"
					v-if="pointExchangeType[0] == 2 || pointExchangeType[0] == 4"
				>
					<view class="cell-icon" :class="'bg-' + themeColor.name">
						分
					</view>
					<text class="cell-tit clamp">需要使用 {{ (orderDetail.preview && orderDetail.preview.point) || 0 }} 积分</text>
					<text class="cell-tip disabled"></text>
					<view class="cell-tip" :class="'text-' + themeColor.name">
						<label class="radio">
							<radio
								siza="mini"
								:color="themeColor.color"
								:disabled="true"
								:checked="true"
							/>
						</label>
					</view>
				</view> -->
					<!-- <view
					class="yt-list-cell b-b"
					v-if="
						(pointExchangeType[0] == 1 || pointExchangeType[0] == 3) &&
							pointConfig.is_open === 1 && maxUsePointFee > 0
					"
				>
					<view class="cell-icon" :class="'bg-' + themeColor.name">
						减
					</view>
					<text class="cell-tit clamp"
						>可用{{ maxUsePoint }}积分抵用{{ maxUsePointFee }}元</text
					>
					<text class="cell-tip disabled"></text>
					<view class="cell-tip" :class="'text-' + themeColor.name">
						<label class="radio">
							<radio
								siza="mini"
								:color="themeColor.color"
								@tap="handleIsUsePoint"
								:disabled="isUsePointDisabled"
								:checked="isUsePoint"
							/>
						</label>
					</view>
				</view> -->
				</view>
				<view class="yt-list">
					<view class="yt-list-cell desc-cell">
						<text class="cell-tit clamp">备注</text>
						<input
							class="desc"
							type="text"
							v-model="buyerMessage"
							placeholder="请填写备注信息"
							placeholder-class="placeholder"
						/>
					</view>
				</view>
			</block>
			<block v-else>
				<view class="rf-goods-section">
					<view class="g-header b-b">
						<image class="logo" :src="logo"></image>
						<text class="name">{{ type == 1 ? 'flag购' : '挑战购' }}</text>
					</view>
					<view @click="selectFlag" class="cu-bar bg-white home-ms margin-top">
						<view class="action">
							{{
								couponItemFlag.title ||
									`请选择您要参与的${
										this.liji == 'tiaoz' ? '挑战' : 'flag购'
									}项目`
							}}
						</view>
						<view class="action text-gray">
							<view><text class="cuIcon-right text-sm"></text></view>
						</view>
					</view>
				</view>
				<view class="rf-goods-section">
					<view class="g-header b-b">
						<image class="logo" :src="logo"></image>
						<text class="name"
							>{{ type == 1 ? 'flag购' : '挑战购' }}成立条件</text
						>
					</view>
					<view class="title clamp in2line padding">
						{{
							`48小时内邀请${this.liji == 'tiaoz' ? '3' : '5'}位新用户围观 ${
								this.liji == 'tiaoz' ? '挑战购' : 'flag购'
							} 成立条件,~~如不成立，则金额会全部原路退回`
						}}
					</view>
				</view>
				<view class="rf-goods-section">
					<view class="cu-bar bg-white home-ms margin-top">
						<view class="action"> 开始时间 </view>
						<view class="action text-gray">
							<view>
								明天
								<!-- <text class="cuIcon-right text-sm"></text> -->
							</view>
						</view>
					</view>
				</view>
			</block>

			<!-- 金额明细 -->
			<view class="yt-list" v-if="false">
				<view class="yt-list-cell b-b">
					<text class="cell-tit clamp">商品总价</text>
					<text class="cell-tip" :class="'text-' + themeColor.name"
						>{{ moneySymbol }}{{ orderDetail && orderDetail.payment }}</text
					>
				</view>
				<view class="yt-list-cell b-b" v-if="discountAmount > 0">
					<text class="cell-tit clamp">优惠金额</text>
					<text class="cell-tip" :class="'text-' + themeColor.name"
						>-{{ moneySymbol }}{{ discountAmount }}</text
					>
				</view>
				<!--营销金额优惠-->
				<view
					v-for="(item, index) in orderDetail.marketing_details"
					:key="index"
				>
					<view
						v-if="item.discount_money > 0 || item.give_point > 0"
						class="yt-list-cell b-b"
					>
						<text class="cell-tit clamp">{{ item.marketing_name }}</text>
						<text class="cell-tip">
							<text v-if="item.marketing_type === 'give_point'"
								>{{ givePoint(item.give_point) }} 积分</text
							>
							<text v-else :class="'text-' + themeColor.name"
								>-{{ moneySymbol }}{{ item.discount_money }}</text
							>
						</text>
					</view>
				</view>
				<view class="yt-list-cell b-b">
					<text class="cell-tit clamp">运费</text>
					<text class="cell-tip" :class="'text-' + themeColor.name">
						<text>{{ moneySymbol }}{{ shippingMoney }}</text>
					</text>
				</view>
				<view class="yt-list-cell b-b" v-if="invoiceAmount > 0">
					<text class="cell-tit clamp">发票税费</text>
					<text class="cell-tip" :class="'text-' + themeColor.name">
						<text>{{ moneySymbol }}{{ invoiceAmount }}</text>
					</text>
				</view>
				<navigator url="/pages/set/invoice/invoice?source=1" v-if="false">
					<view class="yt-list-cell b-b">
						<text class="cell-tit clamp">开具发票</text>
						<view class="cell-tip">
							<view class="invoice" v-if="invoiceItem.type">
								{{
									`电子发票 - ${
										parseInt(invoiceItem.type, 10) === 1 ? '公司' : '个人'
									} - ${invoiceItem.title}`
								}}
								<text
									@tap.stop="closeInvoice"
									class="iconfont iconshanchu4"
									:class="'text-' + themeColor.name"
								></text>
							</view>
							<text v-else>本次不开具发票</text>
							<view
								v-if="
									invoiceItem.type &&
										orderDetail.invoice &&
										orderDetail.invoice.list.length > 0
								"
							>
								<radio-group name="gender" class="gender">
									<label
										class="gender-item"
										v-for="(item, index) in orderDetail.invoice &&
											orderDetail.invoice.list"
										:key="index"
									>
										<radio
											@click.stop="handleInvoiceChange(item)"
											style="transform: scale(0.7)"
											class="gender-item-radio"
											:color="themeColor.color"
											:checked="index === 0"
										/>
										<text class="gender-item-text">{{ item }}</text>
									</label>
								</radio-group>
							</view>
						</view>
					</view>
				</navigator>
				<view class="yt-list-cell desc-cell">
					<text class="cell-tit clamp">备注</text>
					<input
						class="desc"
						type="text"
						v-model="buyerMessage"
						placeholder="请填写备注信息"
						placeholder-class="placeholder"
					/>
				</view>
			</view>
			<!-- 底部 -->
			<view class="footer">
				<view class="price-content in1line">
					<text>实付款</text>
					<text
						v-if="liji == 'liji'"
						class="price-tip"
						:class="'text-' + themeColor.name"
						>{{ moneySymbol }}{{ price / 100 }}</text
					>
					<!-- 转了 -->
					<text v-else class="price-tip" :class="'text-' + themeColor.name"
						>{{ moneySymbol }}{{ price / 100 }}</text
					>
					<text class="price" :class="'text-' + themeColor.name">
						<!-- {{
						`${realAmount} ${(maxUsePoint > 0 &&
							(isUsePoint ? ` + ${maxUsePoint} 积分` : '')) ||
							(orderDetail.preview && orderDetail.preview.point
								? ` + ${orderDetail.preview && orderDetail.preview.point} 积分`
								: '')}`
					}} -->
						{{ orderDetail.payment }}
					</text>
				</view>
				<!--orderDetail.preview.point-->
				<button
					class="submit"
					:class="'bg-' + themeColor.name"
					@tap="submit"
					:disabled="btnLoading"
					:loading="btnLoading"
				>
					提交订单
				</button>
				<text class="submit disabled" v-if="false"> 积分不足 </text>
			</view>
		</view>
		<!-- 404页面 -->
		<view v-if="!orderDetail.orderItemVoList && !loading">
			<rf-no-data class="rf-no-data" :custom="true">
				<view class="title">
					{{ errorInfo || '订单不存在' }}
				</view>
				<view @tap="getOrderDetail" slot="refresh" class="spec-color"
					>重新加载</view
				>
			</rf-no-data>
		</view>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<!-- 优惠券面板 -->
		<view
			class="mask"
			:class="maskState === 1 ? 'show' : 'none'"
			@tap="toggleMask"
		>
			<view class="mask-content" @tap.stop.prevent="stopPrevent">
				<!-- 优惠券列表 -->
				<view class="sub-list valid">
					<view
						class="row"
						v-for="(item, index) in orderDetail.coupons"
						:key="index"
						@tap.stop="selectCoupon(item)"
					>
						<view
							class="carrier"
							:class="
								parseFloat(amountGoods) > parseFloat(item.at_least)
									? ''
									: 'rf-opacity'
							"
						>
							<view class="title">
								<view class="flex align-center justify-center">
									<text
										style="margin-top: 0px"
										class="cell-icon"
										:class="'bg-' + themeColor.name"
										>{{
											parseInt(item.range_type, 10) === 2 ? '限' : '全'
										}}</text
									>
									<text class="cell-title">{{ item.title }}</text>
								</view>
								<view>
									<text
										class="price"
										:class="'text-' + themeColor.name"
										v-if="item.type === '1'"
										>{{ moneySymbol }}{{ item.money }}</text
									>
									<text
										class="price-discount"
										:class="'text-' + themeColor.name"
										v-else
										>{{ `${item.discount / 10}折` }}</text
									>
								</view>
							</view>
							<view class="term">
								<text
									>{{ item.start_time || time }}
									{{ item.end_time || time }}</text
								>
								<text class="at_least">满{{ item.at_least }}可用</text>
							</view>
							<view class="usage">
								<text>
									{{
										parseInt(item.range_type, 10) === 2
											? '部分产品使用'
											: '全场产品使用'
									}}
								</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 优惠券页面，仿mt -->
				<text
					class="no-coupon"
					v-if="orderDetail.coupons && orderDetail.coupons.length === 0"
					>暂无优惠券</text
				>
			</view>
		</view>
		<!-- 选择flag面板 -->
		<view
			class="mask"
			:class="maskState === 3 ? 'show' : 'none'"
			@tap="toggleMask"
		>
			<view class="mask-content" @tap.stop.prevent="stopPrevent">
				<!-- 选择flag列表 -->
				<view class="sub-list valid">
					<view
						class="row"
						v-for="(item, index) in flagList"
						:key="index"
						@tap.stop="selectCouponFlag(item)"
					>
						<!-- 置灰 -->
						<!-- 	:class="
								parseFloat(amountGoods) >
								parseFloat(item.at_least)
									? ''
									: 'rf-opacity'
							" -->
						<view class="carrier">
							<view class="title">
								<view class="flex align-center justify-center">
									<!-- 	<text style="margin-top: 0px;" class="cell-icon" :class="'bg-' + themeColor.name">{{
											parseInt(item.range_type, 10) === 2
												? '限'
												: 'Flag购物'
										}}</text> -->
									<text class="cell-title">{{ item.title }}</text>
								</view>
								<view>
									<!-- 							<text class="price" :class="'text-' + themeColor.name" v-if="item.type === '1'">{{ moneySymbol }}{{ item.money }}</text>
									<text class="price-discount" :class="'text-' + themeColor.name" v-else>{{ `${item.discount / 10}折` }}</text> -->
								</view>
							</view>
							<!-- 			<view class="term">
								<text>{{ item.start_time || time }}
									{{ item.end_time || time }}</text>
								<text class="at_least">满{{ item.at_least }}可用</text>
							</view>
							<view class="usage">
								<text>
									{{
										parseInt(item.range_type, 10) === 2
											? '部分产品使用'
											: '全场产品使用'
									}}
								</text>
							</view> -->
						</view>
					</view>
				</view>
				<!-- 优惠券页面，仿mt -->
				<text
					class="no-coupon"
					v-if="orderDetail.coupons && orderDetail.coupons.length === 0"
					>暂无优惠券</text
				>
			</view>
		</view>
		<rf-picker
			:themeColor="themeColor.color"
			ref="shippingTypePicker"
			mode="selector"
			:deepLength="1"
			@onConfirm="onShippingConfirm"
			:pickerValueArray="pickerShippingType"
		/>
		<rf-picker
			:themeColor="themeColor.color"
			ref="companyTypePicker"
			mode="selector"
			:deepLength="1"
			@onConfirm="onCompanyConfirm"
			:pickerValueArray="orderDetail.company"
		/>
		<rf-picker
			:themeColor="themeColor.color"
			ref="pickupPointPicker"
			mode="selector"
			:deepLength="1"
			@onConfirm="onPickupPointConfirm"
			:pickerValueArray="
				orderDetail.pickup_point_config && orderDetail.pickup_point_config.list
			"
		/>
	</view>
</template>
<script>
import rfNumberBox from '@/components/rf-number-box';
// import uCalendar from '@/uview-ui/components/u-calendar/u-calendar.vue'
import {
	productDetail,
	orderFreightFee,
	orderPreview,
	orderUpdate,
	taskList,
	addradd,
	addrlist
} from '@/api/product';
import { addressList } from '@/api/userInfo';
import rfPicker from '@/components/rf-picker';
import moment from '@/common/moment';
import rfNoData from '@/components/rf-no-data';
import { mapMutations } from 'vuex';
export default {
	components: {
		rfPicker,
		rfNoData,
		rfNumberBox
	},
	data() {
		return {
			// 日历
			show: false,
			mode: 'date',
			productDetailData: {},
			maskState: 0, // 优惠券面板显示状态
			isFullPayment: 0, // 是否全款预定，默认全款预定
			desc: '', // 备注
			payType: 1, // 1微信 2支付宝
			orderDetail: {
				orderItemVoList: [
					// 	{
					// 	productImage: 'https://www.yllook.com/attachment/images/2020/05/10/image_1589084887_lttNmcIv.jpg',
					// 	productName: '魅族魅族魅族00017 8GB+128GB 十七度灰 骁龙865 旗舰5G手机 30W快充 6400W后置主摄 90Hz屏幕 支持NFC 智能拍照游戏手机 - 复制 - 复制 - 复制 - 复制 - 复制 - 复制',
					// 	currentUnitPrice: '111',
					// 	quantity: '222',
					// 	totalPrice: '333'
					// },
				],
				coupons: [
					{
						at_least: '100',
						range_type: '1',
						title: '優惠券',
						discount: '10',
						start_time: '2020-10-10',
						end_time: '2020-10-10'
					},
					{
						at_least: '90',
						range_type: '1',
						title: '優惠券',
						discount: '10',
						start_time: '2020-10-10',
						end_time: '2020-10-10'
					}
				]
			},
			cartCount: 1,
			maxNum: {
				type: Number,
				default: 0
			},
			pointExchangeType: [],
			loadingType: 'more', // 加载更多状态
			pickerShippingType: [],
			btnLoading: false,
			currentShippingType: {
				value: ''
			},
			currentCompany: {},
			currentPickupPoint: {},
			cartIds: null,
			invoiceItem: {},
			addressData: {
				// receiverName: "北京市 鼓樓區",
				// receiverPhone: '189650691',
				// receiverAddress: '三盛托斯卡納'
			},
			couponItem: {},
			pointConfig: {},
			product: null,
			shippingMoney: 0,
			isUsePoint: false,
			isUsePointDisabled: false,
			data: {},
			orderNo: '',
			orderFlag: '',
			userInfo: {},
			use_point: 0,
			invoiceContent: null,
			loading: true,
			errorInfo: '',
			buyerMessage: '',
			promoCode: '',
			moneySymbol: this.moneySymbol,
			logo: this.$mSettingConfig.appLogo,
			singleSkuText: this.singleSkuText,

			// flag选择
			showflag: false,
			couponItemFlag: {},
			flagList: [],
			datas: {},
			page: 1,
			limit: 1000,
			type: '',
			price: '',
			pricedan: '',
			flag_price: '',
			product_id: '',
			liji: ''
		};
	},
	computed: {
		// 计算商品金额
		amountGoods() {
			// return this.orderDetail.preview && this.orderDetail.preview.product_money
			return 91;
		},
		// 计算优惠金额
		discountAmount() {
			const discountMoney = this.floor(
				((100 - this.couponItem.discount) / 100) * this.amountGoods
			);
			return parseInt(this.couponItem.type, 10) === 2
				? discountMoney
				: this.couponItem.money || 0;
		},
		// 计算实付金额
		realAmount() {
			const realAmount =
				this.amountGoods -
				this.discountAmount +
				parseFloat(this.shippingMoney) -
				(this.isUsePoint ? this.maxUsePointFee : 0);
			return (parseFloat(this.invoiceAmount) + realAmount > 0
				? parseFloat(this.invoiceAmount) + realAmount
				: 0
			).toFixed(2);
		},
		// 计算发票税费
		invoiceAmount() {
			const realAmount =
				this.amountGoods -
				this.discountAmount -
				(this.isUsePoint ? this.maxUsePointFee : 0);
			return this.invoiceItem.type
				? this.floor(
						(this.orderDetail.invoice.order_invoice_tax / 100) * realAmount
				  )
				: 0;
		},
		// 计算可用积分
		maxUsePoint() {
			// return this.orderDetail.max_use_point >
			// 	uni.getStorageSync('userInfo').account.user_integral
			//   ? uni.getStorageSync('userInfo').account.user_integral
			//   : this.orderDetail.max_use_point
			return 100;
		},
		// 计算最大积分可抵扣金额
		maxUsePointFee() {
			return this.maxUsePoint * this.pointConfig.convert_rate;
		},
		givePoint() {
			return function(val) {
				if (this.couponItem.discount) {
					return Math.floor((this.couponItem.discount / 100) * val);
				} else {
					return val;
				}
			};
		}
	},
	filters: {
		time(val) {
			return moment(val * 1000).format('YY/MM/DD HH:mm');
		}
	},
	onShow() {
		// if (this.addressData && this.addressData.realname) {
		// 	this.getOrderFreightFee()
		// }
	},
	onLoad(options) {
		// this.initData(options)
		this.orderFlag = options.type;
		console.log(this.orderFlag);
		this.id = options.id;
		this.liji = options.paytype;
		console.log(this.liji);
		// this.datas = JSON.parse(decodeURIComponent(options.data));

		this.getAddrList();
		this.getProductDetail();
	},
	methods: {
		// 获取详情
		// 获取产品详情
		async getProductDetail() {
			this.orderDetail.orderItemVoList = [];
			await this.$http
				.get(`${productDetail}?product_id=${this.id}`, {})
				.then(async r => {
					this.loading = false;
					const data = r.data;
					console.log(data);
					this.type = r.data.type;
					if (this.liji != 'liji') {
						this.price = r.data.flag_price;
					} else {
						this.price = r.data.price;
						this.pricedan = r.data.price;
					}
					// this.price = r.data.price;
					// this.pricedan = r.data.price;
					// this.flag_price = r.data.flag_price;
					this.product_id = r.data.product_id;
					this.orderDetail.orderItemVoList.push(data);
					uni.setNavigationBarTitle({
						title: data.name
					});
					if (this.liji == 'liji') {
					} else {
						this.getTaskList(r.data.type);
					}
				})
				.catch(err => {
					this.loading = false;
					this.errorInfo = err;
				});
		},
		// 获取任务列表
		async getTaskList(type) {
			// if (this.orderFlag == 'flag') {
			// 	this.type = 1
			// } else {
			// 	this.type = 2
			// }
			let params = {
				page: this.page,
				limit: this.limit,
				type
			};
			await this.$http
				.get(`${taskList}`, params)
				.then(async r => {
					this.loading = false;
					const data = r.data;
					this.flagList = data.rows;
				})
				.catch(err => {
					this.loading = false;
					this.errorInfo = err;
				});
		},
		// 获取地址
		async getAddrList() {
			// if (this.orderFlag == 'flag') {
			// 	this.type = 1
			// } else {
			// 	this.type = 2
			// }
			let params = {
				// page: this.page,
				// limit: this.limit,
				// type: this.type
			};
			await this.$http
				.get(`${addrlist}`, params)
				.then(r => {
					console.log(r);
					r.data.forEach(item => {
						if (item.is_default == 1) {
							this.addressData = item;
						}
					});
					console.log(this.addressData);
					this.loading = false;
				})
				.catch(err => {
					this.loading = false;
					this.errorInfo = err;
				});
		},

		// 选择flag项目
		selectFlag() {
			this.maskState = 3;
		},
		selectCouponFlag(item) {
			// if (parseFloat(item.at_least) > parseFloat(this.amountGoods)) {
			// 	this.$mHelper.toast('不满足优惠券使用条件~')
			// 	return
			// }

			this.maskState = 0;
			this.couponItemFlag = item;
		},
		...mapMutations(['setCartNum']),
		handleIsFullPayment(e) {
			this.isFullPayment = e.detail.value;
		},
		handleInvoiceChange(val) {
			this.invoiceContent = val;
		},
		navTo(route) {
			this.$mRouter.push({
				route
			});
		},
		// 不使用发票
		closeInvoice() {
			this.invoiceItem = {};
		},
		// 不使用优惠券
		clearCoupon() {
			this.couponItem = {};
		},
		// 向下取整
		floor(val) {
			return Math.floor(val * 100) / 100;
		},
		// 获取收货地址列表
		async getAddressList() {
			await this.$http
				.get(`${addressList}`, {
					page: this.page
				})
				.then(r => {
					if (r.status || !r.data.list) {
						this.$mHelper.toast('地址获取失败！');
						return;
					}
					let list = r.data.list;
					let d = list.filter(item => item.isDefault)[0] || list[0];
					this.addressData = d;
				})
				.catch(() => {});
		},
		// 是否使用积分抵扣
		handleIsUsePoint() {
			if (this.isUsePoint) {
				this.isUsePoint = false;
				this.use_point = 0;
			} else {
				this.isUsePoint = true;
				this.use_point = this.maxUsePoint;
			}
		},
		// 选择物流
		showSinglePicker() {
			this.$refs.shippingTypePicker.show();
		},
		// 选择快递公司
		showCompanyPicker() {
			this.$refs.companyTypePicker.show();
		},
		// 选择自提点
		showPickupPointPicker() {
			this.$refs.pickupPointPicker.show();
		},
		// 确定选择物流
		onShippingConfirm(e) {
			e.value = e.value[0];
			this.currentShippingType = e;
			if (this.currentShippingType.value.toString() === '2') {
				if (
					parseFloat(this.realAmount) >
					parseFloat(this.orderDetail.pickup_point_config.pickup_point_freight)
				) {
					this.shippingMoney = 0;
				} else {
					this.shippingMoney =
						parseFloat(this.orderDetail.pickup_point_config.pickup_point_fee) ||
						0;
				}
			} else {
				this.currentCompany = this.orderDetail.company[0];
				this.getOrderFreightFee();
			}
		},
		// 确定选择快递公司
		async onCompanyConfirm(e) {
			e.value = e.value[0];
			this.currentCompany = e;
			if (this.orderDetail.is_full_mail) {
				this.shippingMoney = 0;
				return;
			}
			this.getOrderFreightFee();
		},
		// 确定选择自提点
		async onPickupPointConfirm(e) {
			e.value = e.value[0];
			this.currentPickupPoint = e;
			if (this.currentPickupPoint) {
				this.shippingMoney =
					parseFloat(this.orderDetail.pickup_point_config.pickup_point_fee) ||
					0;
			}
		},
		// 计算运费
		async getOrderFreightFee() {
			const params = {};
			if (this.addressData) {
				params.address_id = this.addressData.id;
			}
			if (this.currentCompany) {
				params.company_id = this.currentCompany.value;
			}
			await this.$http
				.get(`${orderFreightFee}`, {
					...params,
					...this.data
				})
				.then(r => {
					this.shippingMoney = r.data.shipping_money || 0;
				});
		},
		// 数据初始化
		async initData(options) {
			this.promoCode = options.promo_code;
			this.orderNo = options.id;
			this.orderFlag = options.type;
			this.userInfo = uni.getStorageSync('userInfo');
			await this.getAddressList();
			// await this.getProInfo()
			await this.getOrderDetail();
		},
		async getProInfo() {
			await this.$http
				.get(`${productDetail}${this.data.sku_id}`, {})
				.then(async r => {
					this.loading = false;
					if (r.status) {
						this.$mHelper.toast('获取商品详情失败');
						return;
					}
					const data = r.data;
					data.is_open_logistics = true;
					data.pickup_point_config = {
						buyer_self_lifting: true,
						list: []
					};
					data.priceNow =
						this.data.buy_type === 'togther' ? data.spellPrice : data.price;
					this.productDetailData = data;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 获取订单详情
		async getOrderDetail() {
			await this.$http
				.get(`${orderPreview}/${this.orderNo}`)
				.then(r => {
					this.loading = false;
					if (r.status) {
						this.$mHelper.toast('获取订单详情失败');
					}
					this.orderDetail = r.data;
				})
				.catch(err => {
					this.loading = false;
					this.errorInfo = err;
				});
		},
		// 显示优惠券面板
		toggleMask(type) {
			if ('combination,wholesale,group_buy'.indexOf(this.data.type) !== -1) {
				this.$mHelper.toast('套餐购买/拼团/团购下单不支持选择购物券');
				return;
			}
			const timer = type === 'show' ? 10 : 300;
			const state = type === 'show' ? 1 : 0;
			this.maskState = 2;
			setTimeout(() => {
				this.maskState = state;
			}, timer);
		},
		numberChange(data) {
			console.log(data);

			let pricebox = parseInt(data.number * this.pricedan);
			this.price = pricebox;
		},
		changePayType(type) {
			this.payType = type;
		},
		async submit() {
			// await this.$mPayment.weixinPay(
			// 					'order',
			// 					this.orderInfo.order_id,
			// 					route
			// 				)

			const params = {};
			if (this.addressData.name) {
				// params.shippingId = this.addressData.id;
			} else {
				this.$mHelper.toast('请选择收货地址');
				return;
			}
			//   params.busType = this.orderDetail.busType;
			//   params.orderNo = this.orderDetail.orderNo;
			console.log(this.couponItemFlag);

			if (this.liji == 'liji') {
			} else {
				if (this.couponItemFlag.task_id) {
				} else {
					this.$mHelper.toast(
						`请选择您要参与的${this.liji == 'tiaoz' ? '挑战' : 'flag购'}项目`
					);
					return;
				}
			}

			params.remark = this.buyerMessage; // 备注
			//   await this.$http
			//     .post(`${orderUpdate}`, {
			//       shippingId: params.shippingId,
			//       orderNo: params.orderNo,
			//       remark: params.remark,
			//     })
			//     .then((r) => {
			//       if (r.status) {
			//         this.$mHelper.toast(r.msg);
			//         return;
			//       }
			//       this.navTo(`/pages/user/money/pay?id=${this.orderDetail.orderNo}`);
			//     });

			if (this.buyerMessage == '') {
				uni.removeStorageSync('remark');
			} else {
				uni.setStorageSync('remark', this.buyerMessage);
			}
			this.navTo(
				`/pages/user/money/pay?id=${this.product_id}&type=${this.type}&addr_id=${this.addressData.addr_id}&price=${this.price}&paytype=${this.liji}&task_id=${this.couponItemFlag.task_id}`
			);
		},
		stopPrevent() {},
		selectCoupon(item) {
			if (parseFloat(item.at_least) > parseFloat(this.amountGoods)) {
				this.$mHelper.toast('不满足优惠券使用条件~');
				return;
			}
			this.maskState = 0;
			this.couponItem = item;
		}
	}
};
</script>
<style lang="scss">
page {
	background: $page-color-base;
}

.order {
	padding-bottom: 100upx;

	.price-wrapper {
		margin-bottom: 10upx;
		flex: 1;

		.tip {
			font-size: $font-sm;
			color: $font-color-light;
		}

		.price {
			font-size: $font-sm;
			margin-bottom: 4upx;
		}

		.number {
			font-size: $font-sm;
			color: $font-color-base;
			margin-left: $font-sm;
		}

		.original-price {
			font-size: $font-sm;
			color: $font-color-light;
			margin-left: $spacing-sm;
			text-decoration: line-through;
		}
	}
}

.yt-list {
	margin-top: 16upx;
	background: #fff;

	.iconshanchu4 {
		margin-left: $spacing-sm;
	}
}

.yt-list-cell {
	display: flex;
	align-items: center;
	padding: 10upx 30upx 10upx 40upx;
	line-height: 70upx;
	position: relative;

	&.cell-hover {
		background: #fafafa;
	}

	&.b-b:after {
		left: 30upx;
	}

	.cell-icon {
		height: 32upx;
		width: 32upx;
		font-size: 22upx;
		text-align: center;
		line-height: 32upx;
		border-radius: 4upx;
		margin-right: 12upx;

		&.hb {
			background: #ffaa0e;
		}

		&.lpk {
			background: #3ab54a;
		}
	}

	.cell-more {
		align-self: center;
		font-size: 24upx;
		color: $font-color-light;
		margin-left: 8upx;
		margin-right: -10upx;
	}

	.cell-tit {
		flex: 1;
		font-size: 26upx;
		color: $font-color-light;
		margin-right: 10upx;
	}

	.cell-tip {
		max-width: 70%;
		font-size: 26upx;

		&.disabled {
			color: $font-color-light;
		}

		&.active {
			color: $base-color;
		}

		&.red {
			color: $base-color;
		}

		.invoice {
			display: flex;
			justify-content: space-between;
		}
	}

	&.desc-cell {
		.cell-tit {
			max-width: 90upx;
		}
	}

	.desc {
		flex: 1;
		font-size: $font-base;
		color: $font-color-dark;
	}
}

.footer {
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 98;
	display: flex;
	align-items: center;
	width: 100%;
	height: 90upx;
	justify-content: space-between;
	font-size: 30upx;
	background-color: #fff;
	color: $font-color-base;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);

	.price-content {
		padding-left: 30upx;
	}

	.price-tip {
		margin-left: 8upx;
	}

	.price {
		font-size: $font-lg;
	}

	.disabled {
		background-color: $border-color-dark;
	}
}

/* 优惠券面板 */
.mask {
	display: flex;
	align-items: flex-end;
	position: fixed;
	left: 0;
	top: var(--window-top);
	bottom: 0;
	width: 100%;
	background: rgba(0, 0, 0, 0);
	z-index: 99;
	transition: 0.3s;

	.mask-content {
		width: 100%;
		max-height: 70vh;
		min-height: 16vh;
		background: #f3f3f3;
		transform: translateY(100%);
		transition: 0.3s;
		overflow-y: scroll;

		.no-coupon {
			display: flex;
			justify-content: center;
			/* 水平居中 */
			line-height: 16vh;
		}
	}

	&.none {
		display: none;
	}

	&.show {
		background: rgba(0, 0, 0, 0.4);

		.mask-content {
			transform: translateY(0);
		}
	}
}

.rf-no-data {
	height: calc(100vh - 90upx);
}

.step {
	right: 0;
	left: initial !important;
}
</style>
