<template>
	<!--	<picker mode="multiSelector"-->
	<!--	        :value="multiIndex"-->
	<!--	        :range="multiArray"-->
	<!--	        @change="handleValueChange"-->
	<!--	        @columnchange="handleColumnChange">-->
	<!--		<slot></slot>-->
	<!--	</picker>-->
	<picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" range-key="areaName" :range="multiArray">
		{{ multiStr }}
	</picker>
</template>

<script>
/* eslint-disable */
	import {
		provinceList
	} from '@/api/basic';
	export default {
		props: {
			// defaultRegions: {
			//     type: Array,
			// }
			defaultLevel: {
				type: Number,
				default: 3
			},
			addressData: {
				type: Object,
				default () {
					return {};
				}
			}
		},
		data() {
			return {
				multiArray: [],
				multiIndex: [0, 0, 0],
				multiStr: ''
			};
		},
		mounted() {
			this.$mHelper.log(this.addressData);
			this.getProvinceList();
		},
		methods: {
			async getProvinceList() {
				let _this = this
				let provinceIndex = 0;
				let cityIndex = 0;
				let areaIndex = 0;
				let province_name = null;
				let city_name = null;
				let area_name = null;
				await _this.$http.post(`${provinceList}`, {
					parentId: 0
				}).then(async r => {
					if (!r instanceof Array) {
						return
					}
					_this.multiArray[0] = r;
					if (_this.addressData.province_id) {
						r.forEach((item, index) => {
							if (
								parseInt(item.areaCode, 10) ===
								parseInt(_this.addressData.province_id, 10)
							) {
								provinceIndex = index;
								_this.addressData.province_id = item.areaCode;
								province_name = item.areaName;
							}
						});
					} else {
						_this.addressData.province_id = _this.multiArray[0][0].areaCode;
						province_name = _this.multiArray[0][0].areaName;
					}
					await _this.$http
						.post(`${provinceList}`, {
							parentId: _this.addressData.province_id
						})
						.then(async r => {

							if (!r instanceof Array) {
								return
							}
							_this.multiArray[1] = r;
							if (_this.addressData.city_id) {
								r.forEach((item, index) => {
									if (
										parseInt(item.areaCode, 10) ==
										parseInt(_this.addressData.city_id, 10)
									) {
										cityIndex = index;
										_this.addressData.city_id = item.areaCode;
										city_name = item.areaName;
									}
								});
							} else {
								_this.addressData.city_id = _this.multiArray[1][0].areaCode;
								city_name = _this.multiArray[1][0].areaName;
							}
							await _this.$http
								.post(`${provinceList}`, {
									parentId: _this.addressData.city_id
								})
								.then(r => {
									if (!r instanceof Array) {
										return
									}
									_this.multiArray[2] = r;
									if (_this.addressData.area_id) {
										r.forEach((item, index) => {
											if (
												parseInt(item.areaCode, 10) ==
												parseInt(_this.addressData.area_id, 10)
											) {
												areaIndex = index;
												_this.addressData.area_id = item.areaCode;
												area_name = item.areaName;
											}
										});
									} else {
										_this.addressData.area_id = _this.multiArray[2][0].areaCode;
										area_name = _this.multiArray[2][0].areaName;
									}
									_this.multiIndex = [provinceIndex, cityIndex, areaIndex];
									_this.multiStr = `${province_name}, ${city_name}, ${area_name}`;
									_this.$emit('getRegions', _this.addressData);
								});
						});
				});
			},
			async bindMultiPickerColumnChange(e) {
				let _this = this
				_this.multiIndex[e.detail.column] = e.detail.value;
				let provinceIndex = 0;
				let cityIndex = 0;
				let areaIndex = 0;
				let province_name = null;
				let city_name = null;
				let area_name = null;
				switch (e.detail.column) {
					case 0: //拖动第1列
						if (_this.multiIndex[0] === _this.multiIndex[0]) {
							_this.addressData.province_id = _this.multiArray[0][
								e.detail.value
							].areaCode;
							province_name = _this.multiArray[0][e.detail.value].areaName;
							await _this.$http
								.post(`${provinceList}`, {
									parentId: _this.multiArray[0][e.detail.value].areaCode
								})
								.then(async r => {
									if (!r instanceof Array) {
										return
									}
									_this.multiArray[1] = r;
									_this.addressData.city_id = _this.multiArray[1][0].areaCode;
									city_name = _this.multiArray[1][0].areaName;
									provinceIndex = e.detail.value;
									await _this.$http
										.post(`${provinceList}`, {
											parentId: _this.multiArray[1][e.detail.column].areaCode
										})
										.then(r => {
										if (!r instanceof Array) {
											return
										}
											_this.multiArray[2] = r;
											_this.addressData.area_id = _this.multiArray[2][0].areaCode;
											area_name = _this.multiArray[2][0].areaName;
											_this.multiIndex = [provinceIndex, 0, 0];
											_this.multiStr = `${province_name}, ${city_name}, ${area_name}`;
										});
								});
						}
						break;
					case 1: //拖动第2列
						if (_this.multiIndex[0] === _this.multiIndex[0]) {
							if (_this.multiIndex[1] === _this.multiIndex[1]) {
								_this.addressData.province_id = _this.multiArray[0][
									_this.multiIndex[0]
								].areaCode;
								province_name = _this.multiArray[0][_this.multiIndex[0]].areaName;
								_this.addressData.city_id = _this.multiArray[1][
									e.detail.value
								].areaCode;
								city_name = _this.multiArray[1][e.detail.value].areaName;
								cityIndex = e.detail.value;
								await _this.$http
									.post(`${provinceList}`, {
										parentId: _this.multiArray[1][e.detail.value].areaCode
									})
									.then(r => {
										if (!r instanceof Array) {
											return
										}
										_this.multiArray[2] = r;
										_this.addressData.area_id = _this.multiArray[2][0].areaCode;
										area_name = _this.multiArray[2][0].areaName;
										_this.multiIndex = [_this.multiIndex[0], cityIndex, 0];
										_this.multiStr = `${province_name}, ${city_name}, ${area_name}`;
									});
							}
						}
						break;
					case 2: //拖动第3列
						if (_this.multiIndex[0] === _this.multiIndex[0]) {
							if (_this.multiIndex[1] === _this.multiIndex[1]) {
								if (_this.multiIndex[2] === _this.multiIndex[2]) {
									_this.addressData.province_id = _this.multiArray[0][
										_this.multiIndex[0]
									].areaCode;
									province_name = _this.multiArray[0][_this.multiIndex[0]]
										.areaName;
									_this.addressData.city_id = _this.multiArray[1][
										_this.multiIndex[1]
									].areaCode;
									city_name = _this.multiArray[1][_this.multiIndex[1]].areaName;
									_this.addressData.area_id = _this.multiArray[2][
										e.detail.value
									].areaCode;
									area_name = _this.multiArray[2][e.detail.value].areaName;
									areaIndex = e.detail.value;
									_this.multiIndex = [
										_this.multiIndex[0],
										_this.multiIndex[1],
										areaIndex
									];
									_this.multiStr = `${province_name}, ${city_name}, ${area_name}`;
								}
							}
						}
						break;
				}
				_this.$emit('getRegions', _this.addressData);
			},
			// 将地区信息格式化成树形结构
			initArea(list) {
				let result = [];

				for (let i = 0; i <= list.length - 1; i++) {
					let item = list[i];
					if (item.type === 1) {
						result.push(item);
					}
					if (item.type === 2) {
						for (let j = 0; j <= result.length - 1; j++) {
							if (parseInt(item.pid) === parseInt(result[j].id)) {
								(!result[j].children) && (result[j].children = []);
								result[j].children.push(item);
							}
						}
					}
					if (item.type === 3) {
						for (let j = 0; j <= result.length - 1; j++) {
							for (let k = 0; k <= result[j].children.length - 1; k++) {
								if (parseInt(item.pid) === parseInt(result[j].children[k].id)) {
									(!result[j].children[k].children) && (result[j].children[k].children = []);
									result[j].children[k].children.push(item);
								}
							}
						}
					}
				}

				// 再次遍历省级元素，将港澳台三个没子元素的节点加上children属性。

				for (let i = result.length - 1; i >= 0; i--) {
					if (!result[i].children) {
						result[i].children = []
					}
				}
				return result;
			}
		}
	};
</script>
