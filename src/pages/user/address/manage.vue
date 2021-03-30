<template>
	<view class="address-manage rf-row-wrapper">
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input
				class="input"
				type="text"
				v-model="addressData.receiverName"
				@blur="handleRealNameChange"
				placeholder="收货人姓名"
				placeholder-class="placeholder"
			/>
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input
				class="input"
				type="number"
				v-model="addressData.receiverMobile"
				@blur="handleMobileChange"
				placeholder="收货人手机号码"
				placeholder-class="placeholder"
			/>
		</view>
		<view @click="showAddress()" class="row b-b">
			<text class="tit">选择地址</text>
			<!--地址三级联动-->
			<!-- <rf-pick-regions @change="handleGetRegions">{{
        addressData.address_name
      }}</rf-pick-regions> -->
			<text v-if="!show">{{ addressData.address_name || '请选择地址' }}</text>
			<u-picker
				v-else
				mode="region"
				@confirm="confirmClick"
				v-model="show"
			></u-picker>
		</view>
		<view class="row b-b">
			<text class="tit">详细地址</text>
			<input
				class="input"
				type="text"
				v-model="addressData.receiverAddress"
				@blur="bindAddressDetailsChange"
				placeholder="请输入详细地址"
				placeholder-class="placeholder"
			/>
		</view>
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch
				:checked="addressData.is_default ? true : false"
				:color="themeColor.color"
				@change="switchChange"
			/>
		</view>
		<button
			class="add-btn"
			:class="'bg-' + themeColor.name"
			:disabled="btnLoading"
			:loading="btnLoading"
			@tap="confirm"
		>
			提交
		</button>
		<!-- <button
			class="add-btn"
			:class="'bg-' + themeColor.name"
			:disabled="btnLoading"
			:loading="btnLoading"
			@tap="confirm"
			v-else
		>
			提交
		</button> -->

		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
/**
 * @des 收货地址列表
 *
 * @author stav stavyan@qq.com
 * @date 2020-03-10 18:00
 * @copyright 2019
 */
import { addressCreate, addressUpdate, addressDetail } from '@/api/userInfo';
import rfPickRegions from '@/components/flag-picker-address';
export default {
	components: {
		rfPickRegions
	},
	data() {
		return {
			addressData: {
				// receiverPhone: '',

				// address_name: '',
				// address: '',

				// receiverProvince: '',
				// receiverCity: '',
				// receiverDistrict: '',
				// province_id: '',

				is_default: false,
				receiverAddress: '', //详细地址
				receiverMobile: '',
				receiverName: '',
				address_name: ''
			},
			btnLoading: false,
			multiArray: [[], [], []],
			multiIndex: [0, 0, 0],
			loading: true,
			id: '',
			show: false,

			areaid: '',
			provinceid: '',
			cityid: '',
			addr_id: ''
		};
	},
	onLoad(options) {
		this.loading = false;
		this.initData(options);
		console.log(options.qu);
		this.qu = options.qu;
	},
	methods: {
		// 获取选择的地区
		handleGetRegions(data) {
			this.addressData.address_name = data.data.join(' ');
			console.log(data.data.join(''));
			// this.addressData.receiverProvince = e.province_id
			// this.addressData.receiverCity = e.city_id
			// this.addressData.receiverDistrict = e.area_id
		},
		confirmClick(e) {
			console.log(e);
			const area = e.area.label;
			const city = e.city.label;
			const province = e.province.label;
			this.addressData.address_name = `${province} ${city} ${area}`;

			this.areaid = e.area.value;
			this.provinceid = e.province.value;
			this.cityid = e.city.value;
		},
		showAddress() {
			this.show = true;
		},
		// 数据初始化
		async initData(options) {
			let title = '新增收货地址';
			if (options.type === 'edit') {
				title = '编辑收货地址';
				await this.getAddressDetail(options.id);
			} else {
				setTimeout(() => {
					this.loading = false;
				}, 1 * 1000);
			}
			this.manageType = options.type;
			uni.setNavigationBarTitle({
				title
			});
		},
		// 获取收货地址
		async getAddressDetail(id) {
			await this.$http
				.get(`${addressDetail}`, {
					addr_id: id
				})
				.then(async r => {
					this.loading = false;
					var r = await r.data;
					this.addressData.receiverName = r.name;
					this.addressData.receiverMobile = r.mobile;
					this.provinceid = r.province;
					this.cityid = r.city;
					this.areaid = r.area;
					this.addressData.receiverAddress = r.address;
					this.addressData.is_default = r.is_default;
					// this.addressData.address_name = `${r.province} ${r.city} ${r.area}`;
					this.addressData.address_name = this.qu;
					this.addr_id = r.addr_id;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		handleRealNameChange(e) {
			this.addressData.receiverName = e.detail.value;
		},
		bindAddressDetailsChange(e) {
			this.addressData.receiverAddress = e.detail.value;
		},
		handleMobileChange(e) {
			this.addressData.receiverMobile = e.detail.value;
		},
		switchChange(e) {
			console.log(this.addressData.is_default);
			this.addressData.is_default = e.detail.value;
		},
		// 提交
		confirm() {
			const data = this.addressData;
			if (!data.receiverName) {
				this.$mHelper.toast('请填写收货人姓名');
				return;
			}
			if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(data.receiverMobile)) {
				this.$mHelper.toast('请输入正确的手机号码');
				return;
			}
			if (!data.address_name) {
				this.$mHelper.toast('请选择地址');
				return;
			}
			if (!data.receiverAddress) {
				this.$mHelper.toast('请输入详细地址');
				return;
			}
			if (data.is_default) {
				data.is_default = 1;
			} else {
				data.is_default = 0;
			}

			this.btnLoading = true;
			if (this.manageType === 'edit') {
				this.handleAddressUpdate(data);
			} else {
				this.handleAddressCreate(data);
			}
		},
		async handleAddressUpdate(data) {
			await this.$http
				.post(`${addressUpdate}${this.id}`, {
					is_default: data.is_default,
					address: data.receiverAddress, //详细地址
					mobile: data.receiverMobile,
					name: data.receiverName,
					city: this.cityid,
					area: this.areaid,
					province: this.provinceid,
					addr_id: this.addr_id
				})
				.then(r => {
					this.btnLoading = false;
					this.$mHelper.toast('收货地址修改成功！');
					this.$mRouter.back();
				})
				.catch(() => {
					this.btnLoading = false;
				});
		},
		async handleAddressCreate(data) {
			await this.$http
				.post(`${addressCreate}`, {
					is_default: data.is_default,
					address: data.receiverAddress, //详细地址
					mobile: data.receiverMobile,
					name: data.receiverName,
					city: this.cityid,
					area: this.areaid,
					province: this.provinceid
				})
				.then(r => {
					this.btnLoading = false;
					if (r.code) {
						this.$mHelper.toast(`${r.msg}`);
						return;
					}
					// this.$mHelper.toast('收货地址创建成功！');
					this.$mRouter.back();
				})
				.catch(() => {
					this.btnLoading = false;
				});
		}
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
}

.address-manage {
	padding-top: 16upx;
}
</style>
