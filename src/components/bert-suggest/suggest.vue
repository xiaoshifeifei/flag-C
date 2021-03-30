<template>
  <view>
    <view class="margin-left u-config-item">
      <view class="u-item-title margin-bottom">反馈意见</view>
      <textarea
        v-model="content"
        placeholder="您的反馈对我们非常重要,请在此输入."
      ></textarea>
    </view>
    <view class="margin-left u-config-item">
      <view class="u-item-title">联系方式</view>
      <input
        v-model="contact"
        placeholder="手机 QQ或e-mail,方便我们联系您"
      />
    </view>

    <!-- <uni-card
			class="box"
			:isFull="true"
			title="上传图片"
			:thumbnail="imgListIcon"
		>
			<view class="imgs" v-for="(item, index) in data.imgList" :key="index">
				<image
					class="img"
					@click="previewImage(index)"
					:src="item.path"
					mode="aspectFit"
				/>
				<uni-icons
					@click="removeImage(index)"
					style="color: white; font-size: 30rpx;"
					type="closeempty"
					class="remove"
				></uni-icons>
			</view>
			<view class="imgs" @click="chooseImage">
				<view class="img add-img">
					<uni-icons
						style="position:absolute; line-height: 150rpx; font-size: 149rpx;"
						type="camera"
					></uni-icons>
				</view>
			</view>
		</uni-card> -->

    <button class="submit-btn" @click="submit">提交</button>
  </view>
</template>

<script>
import { feedback } from '@/api/userInfo';
export default {
  data() {
    return {
    
        imgList: [],
        content: '',
        contact: '',
   
    };
  },
  created() {},
  methods: {
    async submit() {
       
      if ( this.content == '') {
        this.$mHelper.toast('请输入意见');
        return false;
      }
      if (this.contact == '') {
        this.$mHelper.toast('请输入联系方式');
        return false;
      }
      let prames = {
        content: this.content,
        contact: this.contact,
      };
      await this.$http
        .post(feedback, prames)
        .then(async (r) => {
          this.loading = false;
          console.log(r);
          if (r.code == 0) {
            this.$mHelper.toast(r.msg)
            this.content=''
            this.contact=''
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    chooseImage() {
      let _self = this;
      uni.chooseImage({
        sizeType: ['compressed', 'original'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          _self.data.imgList = _self.data.imgList.concat(res.tempFiles);
        },
        fail: function (err) {
          console.log(err);
        },
      });
    },
    removeImage(index) {
      this.data.imgList.splice(index, 1);
    },
    previewImage(index) {
      uni.previewImage({
        current: index,
        urls: this.data.imgList.map((r) => r.path),
      });
    },
   
  },
};
</script>

<style lang="scss">
.box {
  margin-bottom: 20rpx;
}
.imgs {
  position: relative;
  display: inline-flex;
  flex-wrap: wrap;
  margin: 10rpx;
  width: 150rpx;
  height: 150rpx;
  .img {
    width: 100%;
    height: 100%;
    border-radius: 10rpx;
    border: 1rpx solid #ebebeb;
  }
  .remove {
    line-height: 30rpx;
    text-align: center;
    border-radius: 10rpx;
    position: absolute;
    right: 0rpx;
    top: 0rpx;
    width: 30rpx;
    height: 30rpx;
    font-weight: bold;
    background-color: #e53c25;
  }
  .add-img {
    background-color: #f0f0f0;
  }
}
.submit-btn {
  margin-top: 100upx;
  background-color: #07c160;
  color: #fff;
  width: 80%;
}

/* start--演示页面使用的统一样式--start */
.u-demo {
  padding: 25px 20px;
}

.u-demo-wrap {
  border-width: 1px;
  border-color: #ddd;
  border-style: dashed;
  background-color: rgb(250, 250, 250);
  padding: 20px 10px;
  border-radius: 3px;
}

.u-demo-area {
  text-align: center;
}

.u-no-demo-here {
  color: $u-tips-color;
  font-size: 13px;
}

.u-demo-result-line {
  border-width: 1px;
  border-color: #ddd;
  border-style: dashed;
  padding: 5px 20px;
  margin-top: 30px;
  border-radius: 5px;
  background-color: rgb(240, 240, 240);
  color: $u-content-color;
  font-size: 16px;
  /* #ifndef APP-NVUE */
  word-break: break-word;
  display: inline-block;
  /* #endif */
  text-align: left;
}

.u-demo-title,
.u-config-title {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
}

.u-config-item {
  margin-top: 25px;
}

.u-config-title {
  margin-top: 20px;
  padding-bottom: 5px;
}

.u-item-title {
  position: relative;
  font-size: 15px;
  padding-left: 8px;
  line-height: 1;
  margin-bottom: 11px;
}

.u-item-title:after {
  position: absolute;
  width: 4px;
  top: -1px;
  height: 16px;
  /* #ifndef APP-NVUE */
  content: '';
  /* #endif */
  left: 0;
  border-radius: 10px;
  background-color: $u-content-color;
}
/* end--演示页面使用的统一样式--end */
</style>
