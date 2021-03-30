<template>
	<view class="userinfo">
		<view class="input-content">
			<view class="input-item">
				<text class="tit">公司名称:</text>
				<input type="text" v-model="profileInfo.companyName" placeholder="请输入公司名称" />
			</view>
			<view class="input-item">
				<text class="tit">注册地址:</text>
				<input type="text" v-model="profileInfo.companyAddress" placeholder="请输入注册地址" />
			</view>
			<view class="input-item">
				<text class="tit">法人姓名:</text>
				<input type="text" v-model="profileInfo.corporateName" placeholder="请输入法人姓名" />
			</view>
			<view class="input-item">
				<text class="tit">法人电话:</text>
				<input type="text" v-model="profileInfo.corporatePhone" placeholder="请输入法人电话" />
			</view>
			<view class="input-item">
				<text class="tit">客服电话:</text>
				<input type="text" v-model="profileInfo.servicePhone" placeholder="请输入客服电话" />
			</view>
			<view class="input-item">
				<text class="tit">经营范围:</text>
				<textarea type="text" v-model="profileInfo.scopeBusiness" placeholder="请输入经营范围">
				</textarea>
			</view>
			<view class="input-item">
				<text class="tit">商家类型:</text>
				<radio-group @change="handleTypeChange">
					<label class="gender-item" v-for="(item, index) in storeTypes" :key="index">
						<radio class="gender-item-radio" :color="themeColor.color" :value="item.value" :checked="item.value === profileInfo.shopType" />
						<text class="gender-item-text">{{ item.name }}</text>
					</label>
				</radio-group>
			</view>
			<view class="input-item">
				<text class="tit">营业执照:</text>

				<!--头像 + 背景-->
				<view class="user-section">
					<view class="portrait-box1" @tap="uploadImage('licensePhoto')">
						<image class="portrait" :src="profileInfo.licensePhoto || headImg"></image>
					</view>
				</view>
			</view>
			<view class="input-item">
				<text class="tit">法人身份证:</text>

				<!--头像 + 背景-->
				<view class="user-section">
					<view class="portrait-box1" @tap="uploadImage('corporatePhoto')">
						<image class="portrait" :src="profileInfo.corporatePhoto || headImg"></image>
					</view>
				</view>
			</view>
			<view class="input-item">
				<text class="tit">收款银行:</text>
				<input v-model="profileInfo.bankInfo" placeholder="请输入收款银行" />
			</view>
			<view class="input-item">
				<text class="tit">银行账号:</text>
				<input v-model="profileInfo.bankAccount" placeholder="请输入银行账号" />
			</view>
			<view class="input-item">
				<text class="tit">支付宝:</text>
				<input v-model="profileInfo.zfbAccount" placeholder="请输入支付宝" />
			</view>
			<view class="input-item">
				<text class="tit">微信:</text>
				<input v-model="profileInfo.wxAccount" placeholder="请输入微信" />
			</view>
			<button class="confirm-btn" :class="'bg-' + themeColor.name" :disabled="btnLoading" :loading="btnLoading" @tap="toUpdateInfo">
				修改资料
			</button>
		</view>

		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>

		<!--进度条加载-->
		<rf-load-progress :height="CustomBar" :progress="loadProgress"></rf-load-progress>
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
  storeApply,
  uploadImage,
  storeApplyInfo
} from '@/api/userInfo'
import moment from '@/common/moment'

export default {
  data () {
    return {
      loadProgress: 0,
      CustomBar: this.CustomBar,
      notCheckKeys: ['wxAccout', 'zfbAccout'],
      profileInfo: {
        companyName: '',
        companyAddress: '',
        corporateName: '',
        corporatePhone: '',
        servicePhone: '',
        scopeBusiness: '',
        shopType: '',
        licensePhoto: '',
        corporatePhoto: '',
        bankInfo: '',
        bankAccount: '',
        zfbAccount: '',
        wxAccount: ''
      },
      storeTypes: [{
        value: '1',
        name: '线上'
      },
      {
        value: '2',
        name: '线下'
      }
      ],
      date: moment().format('YYYY-MM-DD'),
      token: null,
      loading: true,
      headImg: this.$mAssetsPath.uploadImg,
      userBg: this.$mAssetsPath.userBg,
      btnLoading: false
    }
  },
  onLoad () {
    this.getStoreInfo()
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
            filedir: 'storeinfo/'
          }
        })
        .then(r => {
          if (r.status) {
            _this.$mHelper.toast('文件上传失败')
            return
          }
          _this.profileInfo[key] = r.data
        }).catch(e => {
          _this.$mHelper.toast('文件上传失败')
        })
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
      this.handleUpdateInfo()
    },
    // 更新用户信息
    async handleUpdateInfo () {
      this.btnLoading = true
      this.loadProgress = this.loadProgress + 6
      const timer = setInterval(() => {
        this.loadProgress = this.loadProgress + 6
      }, 50)
      await this.$http
        .post(`${storeApply}`, {
          ...this.profileInfo
        })
        .then((r) => {
          clearInterval(timer)
          this.loadProgress = 0
          if (r.status) {
            this.$mHelper.toast('资料上传失败')
            return
          }
          this.$mHelper.toast('恭喜您, 资料上传成功!')
          setTimeout(() => {
            this.$mRouter.back()
          }, 1 * 1000)
        })
        .catch(() => {
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
				}

				input {
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
