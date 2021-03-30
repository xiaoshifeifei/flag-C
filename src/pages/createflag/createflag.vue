<template>
  <view class="product">
    <view class="createflag-box">
      <view class="cu-bar bg-white">
        <view class="action sub-title">
          <text class="text-xl text-bold text-orange">flag购名称</text>
          <text class="bg-orange" style="width: 2rem"></text>
          <!-- last-child选择器-->
        </view>
      </view>
      <view class="cu-form-group">
        <textarea
          class="padding cu-textarea"
          maxlength="-1"
          v-model="content"
          @input="textareaAInput"
          placeholder="请输入flag购名称"
        ></textarea>
      </view>
      <view class="cu-bar bg-white">
        <view class="action sub-title">
          <text class="text-xl text-bold text-orange">坚持天数</text>
          <text class="bg-orange" style="width: 2rem"></text>
          <!-- last-child选择器-->
        </view>
      </view>
      <view class="grid margin-bottom margin-right text-center col-5">
        <view
          class="grid margin-bottom text-center flex align-center justify-center"
          v-for="(item, index) in dayList"
          :key="index"
        >
          <view
            v-if="item.type == 'input'"
            @click="clickCur(index, item.id)"
            class="day-create"
            :class="[item.cur ? 'bg-orange' : 'bg-gray-zj']"
          >
            <input
              v-model="item.day"
              @input="onInput"
              @focus="InputFocus"
              @blur="InputBlur"
              cursorSpacing="100"
              cursor-spacing="100"
              :placeholder="item.text"
              type="number"
            />

            <!-- <u-input
                  cursor-spacing="100"
                  :clearable="false"
                  v-model="value"
                  :placeholder="item.day"
                  type="number"
                /> -->
          </view>
          <view
            v-else
            @click="clickCur(index, item.id)"
            class="day-create"
            :class="[item.cur ? 'bg-orange' : 'bg-gray-zj']"
            >{{ item.day }}天</view
          >
        </view>
      </view>
      <u-cell-group>
        <u-cell-item title="开始时间" value="明天"></u-cell-item>
      </u-cell-group>
    </view>

    <!-- 底部操作菜单 -->
    <view class="page-bottom" style="padding: 10px 0">
      <u-button
        @tap="navTo('/pages/createflag/makemoney')"
        shape="circle"
        style="width: 80%; padding: 20px 0"
        size="medium"
        type="warning"
        >创建flag</u-button
      >
    </view>

    <!--回到顶部-->
    <rf-back-top :scrollTop="scrollTop"></rf-back-top>
    <!-- 404页面 -->
    <view v-if="!productDetail.name && !loading">
      <rf-no-data :custom="true">
        <view class="no-data-title">
          {{ errorInfo || '暂无数据' }}
        </view>
        <view
          @tap="getProductDetail(productDetail.id)"
          slot="refresh"
          class="spec-color"
          >重新加载</view
        >
      </rf-no-data>
    </view>
    <!--顶部下拉菜单-->
    <rf-nav-detail @hide="hideNavDetail" :popupShow="navDetailShow">
    </rf-nav-detail>
    <!--页面加载动画-->
    <rfLoading isFullScreen :active="loading"></rfLoading>
  </view>
</template>
<script>
import rfProductDetail from '@/components/rf-product-detail';
import rfBackTop from '@/components/rf-back-top';
import rfNoData from '@/components/rf-no-data';
export default {
  components: {
    rfProductDetail,
    rfBackTop,
    rfNoData,
  },
  data() {
    return {
      productDetail: {
        name: '111',
      },
      toGetherData: {
        realityNumber: 0,
        shouldNumber: 0,
      },
      loading: true,
      errorInfo: '',
      userInfo: {},
      scrollTop: 0,
      currentUrl: '',
      navDetailShow: false,
      appName: this.$mSettingConfig.appName,
      content: '',
      dayList: [
        {
          day: '14',
          cur: true,
          id: 1,
        },
        {
          day: '21',
          cur: false,
          id: 2,
        },
        {
          day: '30',
          cur: false,
          id: 3,
        },
        {
          day: '100',
          cur: false,
          id: 4,
        },
        {
          day: '',
          cur: false,
          type: 'input',
          id: 5,
          text: '自定义',
        },
      ],
    };
  },
  // #ifndef MP
  onNavigationBarButtonTap(e) {
    const index = e.index;
    if (index === 0) {
      this.navDetailShow = true;
    }
  },
  // #endif
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  async onLoad(options) {
    this.loading = false;
  },
  methods: {
    textareaAInput(e) {
      console.log(e.detail);
      console.log(this.content);
    },
    // 隐藏顶部导航
    hideNavDetail() {
      this.navDetailShow = false;
    },
    clickCur(idx, id) {
      this.dayList.forEach((item, index) => {
        if (idx == index) {
          item.cur = true;
        } else {
          item.cur = false;
          if (item.id == 5) {
            item.day = '';
          }
        }
      });
    },
    InputFocus(e) {},
    InputBlur(e) {},
    onInput(e) {
      console.log(e.detail);
      this.dayList.forEach((item) => {
        if (item.id == 5) {
          // item.day = parseInt(e.detail.value);
          this.$nextTick(()=>{
            item.day = parseInt(e.detail.value);
          })
        }
      });
    },
    navTo(route, type) {
      if (type === 'tab') {
        this.$mRouter.switchTab({
          route,
        });
      } else {
        if (this.content == '') {
          this.$mHelper.toast('请输入flag购名称');
          return false;
        }

        this.dayList.forEach((item) => {
          if (item.cur) {
            item.content = this.content;

            if (item.day == '' || isNaN(item.day)) {
              this.$mHelper.toast('请输入天数');

              return false;
            }

            uni.setStorageSync('creatFlag', item);
            this.$mRouter.push({
              route,
            });
            return false;
          }
        });
      }
    },
  },
};
</script>
<style scoped lang="scss">
.day-create {
  padding: 15upx;
  border-radius: 10px;
}

.bg-gray-zj {
  background-color: #f8f8f9;
}

page {
  background: $color-white !important;
}

body {
  background: $color-white !important;
}

.createflag-box {
  // padding-top: 80upx;
  background-color: $color-white !important;
  height: 100vh;
}

.cu-textarea {
  border-radius: 10px;
  border: 1px solid #bbb;
  padding: 30upx !important;
  height: 200px !important;
}
</style>
