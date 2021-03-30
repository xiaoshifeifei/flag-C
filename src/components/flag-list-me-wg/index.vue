<template>
  <view>
    <view
      class="flex middle start padding"
      style="border-bottom: 1px solid #f5f5f5"
      v-if="weiguangc"
    >
      <text
        @click="clickCur(index)"
        class="title-cur"
        v-for="(item, index) in listmywg"
        :key="index"
        :class="[item.cur ? 'text-orange' : '']"
        style="margin-right: 10px"
      >
        {{ item.name }}
      </text>
    </view>

    <view v-if="list.length > 0">
      <block v-for="(item, index) in list" :key="index">
        <view class="cu-card dynamic" :class="isCard ? 'no-card' : ''">
          <view class="cu-item shadow">
            <view
              @click.stop="navToDetailPage(item.flag_id)"
              class="cu-list menu-avatar"
            >
              <view class="cu-item">
                <!-- <image :src="item.img"></image> -->
                <view
                  class="cu-avatar round lg"
                  :style="{ backgroundImage: `url(${item.avatar})` }"
                ></view>
                <view class="content flex-sub">
                  <view>{{ item.nickname || '暂无' }}</view>
                  <view class="text-gray text-sm flex">
                    <text class="margin-right">{{ item.time }}</text
                    ><text>进度 {{ item.process_days }}/{{ item.days }}</text>
                  </view>
                </view>
              </view>
            </view>
            <view @click.stop="navToDetailPage(item.flag_id)" class="text-content">
              {{ item.remark }}
            </view>
            <view
              class="grid flex-sub padding-lr"
              :class="isCard ? 'col-3 grid-square' : 'col-1'"
            >
              <view
                v-if="item.images.length>0"
                @click.stop="previewImage(item.img)"
                class="bg-img"
                :class="isCard ? '' : 'only-img'"
                :style="{ backgroundImage: `url(${item.img})` }"
              >
              </view>
              <view
                v-else
                @click.stop="previewImage($mAssetsPath.errorImage)"
                class="bg-img"
                :class="isCard ? '' : 'only-img'"
                :style="{ backgroundImage: `url(${$mAssetsPath.errorImage})` }"
              >
              </view>
            </view>
            <view class="flag-gray-bg padding-lr">
              <view
                style="padding-left: 0px"
                class="padding bg-grey lightcopy radius flex align-center justify-between"
                ><text class="text-orange margin-lr-xs"
                  >{{ moneySymbol }}{{ item.money / 100 }}</text
                ><text class="flex-sub text-cut">{{ item.content }}</text
                ><button
                  @click.stop="makeMoney(item.flag_id)"
                  class="cu-btn sm"
                  :class="[item.flag == 1 ? 'bg-graycopy' : 'bg-orange']"
                >
                  {{ item.flag == 1 ? '已围观' : '围观分钱' }}
                </button></view
              >
            </view>
            <view
              class="text-gray xt-sm text-right padding flex align-center justify-between"
              style="padding-right: 0px"
            >
              <view class="VueStar-re">
                <canvas
                  v-if="index == isidx"
                  class="VueStar"
                  canvas-id="thumsCanvas"
                  id="thumsCanvas"
                ></canvas>
                <view
                  @click.stop="thumbsUp(index, item.flag_id)"
                  class="cuIcon-appreciatefill margin-lr-xs"
                >
                  {{ item.applause }}</view
                >
              </view>
              <!-- <view>
								<view class="cuIcon-messagefill margin-lr-xs"> 30</view>
							</view> -->
              <view class="cu-bar input">
                <flag-send
								:id="item.flag_id"
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
                <button
                  @click="send"
                  class="cu-btn bg-orange round shadow-blur sm"
                >
                  发送
                </button> -->
              </view>
            </view>
          </view>
        </view>
        <div class="gray-line"></div>
      </block>
    </view>
    <view v-else>
      <rf-no-data :custom="true">
        <view class="no-data-title">
          {{ '暂无数据' }}
        </view>
        <!-- <view @tap="getProductDetail(productDetail.id)" slot="refresh" class="spec-color">重新加载</view> -->
      </rf-no-data>
    </view>
    <!--页面加载动画-->
    <rfLoading isFullScreen :active="loading"></rfLoading>
    <rf-back-top :scrollTop="scrollTop"></rf-back-top>
  </view>
</template>

<script>
import { clickGive, getMakeMoney, getCommentPl, flagmelist } from '@/api/basic';
export default {
  props: {
    // list: {
    // 	type: Array,
    // 	default() {
    // 		return [];
    // 	}
    // },
    // 是否以列表展示 | 列表或大图
    isList: {
      type: Boolean,
      default: false,
    },
    // 是否以列表展示 | 列表或大图
    bottom: {
      type: Number,
      default: 0,
    },
    flagtype: {
      type: Boolean,
      default: false,
    },
    weiguangc: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isCard: false,
      value: '',
      moneySymbol: this.moneySymbol,

      isCanvas: true,
      isidx: 0,
      thumbsUpContext: null,
      thumbsUpTimer: 0,
      thumbsUpQueue: {},
      thumbsUpWidth: 100,
      thumbsUpHeight: 300,

      startlist: [
        {
          title: 1,
        },
        {
          title: 1,
        },
        {
          title: 1,
        },
        {
          title: 1,
        },
        {
          title: 1,
        },
      ],
      iswg: false,
      orderwg: 'onlook', //排序：onlook：热门  money：金额
      list: [],
      listmywg: [
        {
          name: '默认',
          cur: true,
          orderwg: 'onlook',
        },
        {
          name: 'flag金额高',
          cur: false,
          orderwg: 'money',
        },
      ],
      loading: true,
      scrollTop: 0,
    };
  },
  created() {
    this.getWgList();
  },
  watch: {
    list(val) {
      this.list = val;
    },
  },

  mounted() {
    this.thumbsUpContext = uni.createCanvasContext('thumsCanvas');
    var that = this;
  },
  methods: {
    changeType(){
      
    },
    clickCur(idx) {
      this.wgidx = idx;
      this.listmywg.forEach((item, index) => {
        if (idx == index) {
          item.cur = true;
          this.orderwg = item.orderwg;
        } else {
          item.cur = false;
        }
      });
      this.getWgList();
    },
    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
    },
    // 跳转至商品详情页
    navToDetailPage(id) {
      this.$mRouter.push({
        route: `/pages/product/productwg?id=${id}`,
      });
    },

    IsCard(e) {
      this.isCard = e.detail.value;
    },
    //预览图片
    previewImage(img) {
      uni.previewImage({
        // current: index, //预览图片的下标
        urls: [img], //预览图片的地址，必须要数组形式
      });
    },
    InputFocus(e) {
      console.log(e);
    },
    InputBlur(e) {
      console.log(e);
      this.value = e.detail.value;
    },
    send() {
      this.$mHelper.toast('暂未开发');
      return false;
      this.commentPl();
      // this.$emit('send', this.value);
    },
    // 点赞
    //
    async getGive(flag_id) {
      let params = {
        flag_id,
      };
      await this.$http
        .post(`${clickGive}`, params)
        .then(async (r) => {
          this.loading = false;
          if (r.code == 0) {
            this.$mHelper.toast(r.msg);
            setTimeout(() => {
              this.getWgList();
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
        flag_id,
      };
      await this.$http
        .post(`${getMakeMoney}`, params)
        .then(async (r) => {
          this.loading = false;
          console.log(r.msg);
          if (r.code == 0) {
            this.$mHelper.toast(r.msg);
            setTimeout(() => {
              this.getWgList();
            }, 200);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 评论发送
    async commentPl() {
      let params = {
        order: this.orderwg,
      };
      await this.$http
        .get(`${getCommentPl}`, params)
        .then(async (r) => {
          this.loading = false;
          this.loadingType =
            this.categoryProductListwg.length >= r.data.total
              ? 'nomore'
              : 'more';
          this.categoryProductListwg = [
            ...this.categoryProductListwg,
            ...r.data.rows,
          ];
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 获取列表
    async getWgList() {
      // this.list = [];
      let params = {
        // order: this.orderwg
      };
      await this.$http
        .get(`${flagmelist}`, params)
        .then(async (r) => {
          this.loading = false;
          r.data.forEach((item) => {
            if (item.images) {
              item.img = item.images[0];
            }
          });
          //   console.log(r.data.total);
          // this.loadingType =this.categoryProductListwg.length >= r.data.total ? 'nomore': 'more';
          this.list = r.data;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    //点赞动画 start
    thumbsUp(index, flag_id) {
      console.log(index);
      this.getGive(flag_id);
      // 点赞
      this.$mHelper.toast('暂未开发');
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
          speed: 0.003,
          t: 0,
        },
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
        y: height,
      };
      const p1 = {
        x: this.getRandom(0.22 * width, 0.33 * width),
        y: this.getRandom(0.5 * height, 0.75 * height),
      };
      const p2 = {
        x: this.getRandom(0, 0.88 * width),
        y: this.getRandom(0.25 * height, 0.5 * height),
      };
      const p3 = {
        x: this.getRandom(0, 0.88 * width),
        y: this.getRandom(0, 0.125 * height),
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
        y,
      };
    },

    createThumbsAnimate() {
      let width = this.thumbsUpWidth,
        height = this.thumbsUpHeight;
      var that = this;
      Object.keys(that.thumbsUpQueue).forEach((key) => {
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
    },
    //点赞动画 end
  },
};
</script>

<style scoped lang="scss">
.cu-card > .cu-item {
  margin: 0 !important;
}

.cu-card.dynamic > .cu-item > .text-content {
  margin-top: 10px;
}

.cu-card.dynamic > .cu-item .only-img {
  width: 40%;
  height: 200upx;
  object-fit: cover;
}
</style>
