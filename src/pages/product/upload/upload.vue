<template>
	<view class="userinfo">
		<view class="input-content">
			<view class="input-item">
				<text class="tit">商品名称:</text>
				<input type="text" v-model="profileInfo.name" placeholder="请输入商品名称" />
			</view>
			<view class="input-item">
				<text class="tit">商品副标题:</text>
				<input type="text" v-model="profileInfo.subtitle" placeholder="请输入商品副标题" />
			</view>

			<view class="input-item">
				<text class="tit">商品类型:</text>
				<radio-group @change="handleTypeChange">
					<label class="gender-item" v-for="(item, index) in proType" :key="index">
						<radio class="gender-item-radio" :color="themeColor.color" :value="item.value" :checked="item.value === profileInfo.proType" />
						<text class="gender-item-text">{{ item.name }}</text>
					</label>
				</radio-group>
			</view>
			<view class="input-item">
				<text class="tit">商品分类:</text>
				<input type="text" disabled v-model="categoryText" placeholder="请选择分类" @click="showCatePicker" />
			</view>
			<view class="input-item">
				<text class="tit">价格:</text>
				<input type="number" v-model="profileInfo.price" placeholder="请输入价格" />
			</view>
			<view class="input-item">
				<text class="tit">成本价格:</text>
				<input type="number" v-model="profileInfo.costPrice" placeholder="请输入成本价格" />
			</view>
			<view class="input-item">
				<text class="tit">拼团价格:</text>
				<input type="number" v-model="profileInfo.spellPrice" placeholder="不参与拼团可不填写" />
			</view>
			<view class="input-item">
				<text class="tit">库存数量:</text>
				<input type="number" v-model="profileInfo.stock" placeholder="请输入库存数量" />
			</view>
			<view class="input-item">
				<text class="tit">商品详情:</text>
				<textarea type="text" v-model="profileInfo.detail" placeholder="请输入商品详情">
				</textarea>
			</view>
			<view class="input-item">
				<text class="tit">产品主图:</text>

				<!--头像 + 背景-->
				<view class="user-section">
					<!--h5直接上传头像-->
					<view class="portrait-box1" @tap="uploadImage('mainImage')">
						<image class="portrait" :src="profileInfo.mainImage || headImg"></image>
					</view>
				</view>
			</view>
			<view class="input-item">
				<text class="tit">产品子图:</text>

				<!--头像 + 背景-->
				<view class="user-section subImages">
					<!--h5直接上传头像-->
					<view class="portrait-box1" @tap="uploadImage('subImages')">
						<image class="portrait" :src="headImg"></image>
					</view>
					<view class="portrait-box1 subImages-list" v-for="(item, i) in profileInfo.subImages" :key="i + '-img'">
						<rf-image class="portrait" :src="item"></rf-image>
						<text class="cell-more iconfont iconguanbi" @click="deleteSubImg(i)"></text>
					</view>
				</view>
			</view>

			<button class="confirm-btn" :class="'bg-' + themeColor.name" :disabled="btnLoading" :loading="btnLoading" @tap="toUpdateInfo">
				上传商品
			</button>
		</view>

		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>

		<!--进度条加载-->
		<rf-load-progress :height="CustomBar" :progress="loadProgress">

		</rf-load-progress>
		<rf-picker class="catepicker" ref="catePicker" mode="multiLinkageSelector" :pickerValueDefault="[0, 0]"
		 :pickerValueArray="cateList" @onConfirm="cateChange"></rf-picker>

	</view>
</template>

<script>
/**
	 * @des 修改用户信息
	 *
	 * @author stav stavyan@qq.com
	 * @date 2020-01-10 14:28
	 * @copyright 2019
	 */
import {
  uploadImage,
  storeApplyInfo
} from '@/api/userInfo'
import {
  uploadProduct
} from '@/api/product'
import {
  delEptItem
} from '@/common/utils'
import rfPicker from '@/components/rf-picker'
export default {
  components: {
    rfPicker
  },
  data () {
    return {
      loadProgress: 0,
      CustomBar: this.CustomBar,
      notCheckKeys: ['spellPrice'],
      categoryText: '',
      profileInfo: {
        name: '',
        subtitle: '',
        mainImage: '',
        subImages: [],
        detail: '',
        costPrice: '',
        price: '',
        spellPrice: '',
        categoryId: '',
        stock: '',
        proType: '3'
      },
      loading: true,
      headImg: this.$mAssetsPath.uploadImg,
      btnLoading: false,
      cateList: [],
      proType: [{
        value: '1',
        name: '爆款'
      }, {
        value: '2',
        name: '预售'
      }, {
        value: '3',
        name: '无'
      }]
    }
  },
  watch: {
    '$mStore.getters.categories': function () {
      let list = JSON.parse(JSON.stringify(this.$mStore.getters.categories))
      list[0] = ''
      list = delEptItem(list)
      this.cateList = list
    }
  },
  onLoad () {
    let list = JSON.parse(JSON.stringify(this.$mStore.getters.categories))
    this.loading = false
    list[0] = ''
    list = delEptItem(list)
    this.cateList = list
    // this.getStoreInfo()
  },
  methods: {
    async getStoreInfo () {
      await this.$http
        .post(`${storeApplyInfo}`, {})
        .then((r) => {
          if (r.status) {
            return
          }
          const profileInfo = JSON.parse(JSON.stringify(this.profileInfo))
          r.data.shopType = r.data.shopType.toString()
          for (const i in r.data) {
            if (profileInfo.hasOwnProperty(i)) {
              profileInfo[i] = r.data[i]
            }
          }
          this.profileInfo = profileInfo
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    showCatePicker () {
      this.$refs.catePicker.show()
    },
    cateChange (v) {
      console.log(v)
      this.categoryText = v.label
      if (v.value && v.value.length === 2) {
        this.profileInfo.categoryId = v.value[1]
      } else {
        this.profileInfo.categoryId = this.cateList[0][0].value
      }
    },
    // 上传头像
    uploadImage (key) {
      // 从相册选择图片
      const _this = this
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success: function (res) {
          _this.handleUploadFile(res.tempFilePaths, key)
        }
      })
    },
    // 上传头像
    handleUploadFile (data, key) {
      const _this = this
      const filePath = data.path || data[0]
      _this.$http
        .upload(uploadImage, {
          filePath,
          name: 'file',
          formData: {
            filedir: 'productinfo/'
          }
        })
        .then(r => {
          if (r.status) {
            _this.$mHelper.toast('文件上传失败')
            return
          }
          if (key === 'subImages') {
            _this.profileInfo[key].push(r.data)
          } else {
            _this.profileInfo[key] = r.data
          }
        }).catch(e => {
          _this.$mHelper.toast('文件上传失败')
        })
    },
    deleteSubImg (index) {
      let subImages = JSON.parse(JSON.stringify(this.profileInfo.subImages))
      subImages[index] = ''
      subImages = delEptItem(subImages)
      this.profileInfo.subImages = subImages
    },
    // 监听日期更改
    bindDateChange (e) {
      this.date = e.target.value
    },
    // 监听类型更改
    handleTypeChange (e) {
      this.profileInfo.shopType = e.detail.value
    },
    // 更新用户信息
    async toUpdateInfo () {
      const data = this.profileInfo
      const netKeys = this.notCheckKeys
      for (const i in data) {
        if (data.hasOwnProperty(i) && (!data[i] && netKeys.indexOf(i) === -1)) {
          this.$mHelper.toast('请填写完表单')
          return
        }
      }
      if (data.spellPrice && parseFloat(data.spellPrice) >= parseFloat(data.price)) {
        this.$mHelper.toast('拼团加个必须小于普通价格')
        return
      }
      this.handleUpdateInfo()
    },
    // 更新商品信息
    async handleUpdateInfo () {
      this.btnLoading = true
      this.loadProgress = this.loadProgress + 6
      const timer = setInterval(() => {
        this.loadProgress = this.loadProgress + 6
      }, 50)
      const profileInfo = JSON.parse(JSON.stringify(this.profileInfo))

      if (profileInfo.subImages.length > 0) {
        profileInfo.subImages = profileInfo.subImages.join(',')
      }
      await this.$http
        .post(uploadProduct, {
          ...profileInfo
        })
        .then((r) => {
          clearInterval(timer)
          this.loadProgress = 0
          this.btnLoading = false
          if (r.status) {
            this.$mHelper.toast('资料上传失败')
            return
          }
          this.$mHelper.toast('恭喜您, 商品上传成功!')
          setTimeout(() => {
            this.$mRouter.back()
          }, 1 * 1000)
        })
        .catch(() => {
          this.$mHelper.toast('商品上传失败!')
          this.loadProgress = 0
          this.btnLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
	page {
		background-color: $color-white;
	}

	.userinfo {
		.user-section {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			height: 220upx;
			overflow: hidden;
			position: relative;

			.bg {
				position: absolute;
				left: 0;
				top: 0;
				width: 100vw;
				opacity: 0.84;
			}

			.portrait-box {
				clear: both;
				z-index: 2;
			}

			.portrait {
				position: relative;
				width: 200upx;
				height: 200upx;
				border-radius: 50%;
				border: 6upx solid #fff;
			}

			.yticon {
				position: absolute;
				line-height: 1;
				z-index: 5;
				font-size: 48upx;
				color: #fff;
				padding: 4upx 6upx;
				border-radius: 6upx;
				background: rgba(0, 0, 0, 0.4);
			}

			.pt-upload-btn {
				right: 0;
				bottom: 10upx;
			}

			.bg-upload-btn {
				right: 20upx;
				bottom: 16upx;
			}
		}

		.subImages {
			flex-wrap: wrap;
			height: auto;

			.subImages-list {
				position: relative;

				.iconfont {
					position: absolute;
					right: 1px;
					top: 0;
					font-size: 18px;
				}
			}
		}

		.input-content {
			padding: 40upx 60upx;

			.input-item {
				display: flex;
				padding: 0 30upx;
				background: $page-color-light;
				min-height: 80upx;
				line-height: 80upx;
				border-radius: 4px;
				margin-bottom: 30upx;

				&:last-child {
					margin-bottom: 0;
				}

				.tit {
					width: 160upx;
					font-size: $font-sm + 2upx;
					color: $font-color-base;
					flex-shrink: 0;
				}

				input,
				.catepicker {
					width: calc(100% - 100upx);
					height: 80upx;
					line-height: 80upx;
					font-size: $font-base + 2upx;
					color: $font-color-dark;
				}

				textarea {
					width: calc(100% - 100upx);
					height: 280upx;
					line-height: 80upx;
					font-size: $font-base + 2upx;
					color: $font-color-dark;
				}

				.date {
					height: 80upx;
					line-height: 80upx;
					font-size: $font-base + 2upx;
					color: $font-color-dark;
				}

				.gender-item {
					margin-right: 20upx;

					.gender-item-text {
						padding-left: 10upx;
					}

					radio .wx-radio-input.wx-radio-input-checked {
						background: $uni-color-primary;
						border-color: $uni-color-primary;
					}
				}
			}
		}
	}
</style>
