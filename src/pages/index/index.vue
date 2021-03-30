<template>
  <view class="rf-index">
    <!-- #ifndef H5 -->
    <!-- <image class="adimage" src="../../static/app/hb.png" mode="" @click="toAd()"></image> -->
    <!-- #endif -->

    <!--搜索导航栏   @tab="tabClick"  -->
    <rf-search-bar
      @search="navToSearch"
      title="扫一扫"
      icon="iconsaomiao"
     
      :merchantData="merchantData"
      :placeholder="hotSearchDefault"
    />
    <view class="headerBg"></view>
    <!-- <view class="headerWords">Flag，拼出价值，购出品质 </view> -->
    <!-- <view class="headerWords"> </view> -->
    <view
      :style="{
        paddingTop: merchantShow
          ? isOpenIndexCate
            ? 94 + statusBar + 'px'
            : 45 + statusBar + 'px'
          : isOpenIndexCate
          ? 58 + statusBar + 'px'
          : 25 + statusBar + 'px',
      }"
    >
      <block v-if="currentCate === 0">
        <!-- 轮播图1 -->
        <view class="swiper">
          <view class="swiper-box">
            <rf-swipe-dot
              :info="carouselList"
              mode="nav"
              :current="current"
              field="title"
            >
              <swiper @change="handleDotChange" autoplay="true">
                <swiper-item
                  v-for="(item, index) in carouselList"
                  @tap="indexTopToDetailPage(item)"
                  :key="index"
                >
                  <view class="swiper-item">
                    <image :src="item.img" mode="aspectFill" />
                  </view>
                </swiper-item>
              </swiper>
            </rf-swipe-dot>
          </view>
        </view>
        <!-- 首屏图标导航 -->
        <view class="cu-list home-icon grid col-4 no-border">
          <navigator
            :url="item.url"
            hover-class="none"
            class="cu-item"
            v-for="(item, index) in iconList"
            :key="index"
          >
            <view class="ellipseIcon">
              <!-- <image src="/static/up.gif" mode="aspectFill" v-if="item.color == 'pink'"></image> -->
              <view :class="'cuIcon-' + item.icon"></view>
              <!--<view class="cu-tag badge" v-if="item.badge!=0">
								<block v-if="item.badge!=1">{{item.badge>99?'99+':item.badge}}</block>
							</view> -->
              <view
                class="cuIcon-ellipse text-shadow"
                :class="'text-' + item.color"
              ></view>
            </view>
            <text>{{ item.name }}</text>
          </navigator>
        </view>
        <view class="gray-line"></view>
        <!-- 头部 -->
        <view class="cu-custom">
          <view class="nav bg-white home-nav text-left">
            <view
              class="cu-item"
              :class="index == TabCur ? 'text-orange cur' : ''"
              v-for="(item, index) in nav"
              :key="index"
              @tap="tabSelect(index)"
            >
              {{ item.name }}
            </view>
          </view>
        </view>
        <!--精选Flag团购-->
        <!-- 	@toList="
					navTo(
						`/pages/product/list?cate_id=${specialType.teamId}&isSpecial=2`
					)
				"
				 @detail="navToDetailPage"
				 -->
        <block v-if="TabCur == 0">
          <rf-floor-index
            icon="icontuijian21"
            :list="categoryProductList"
            :header="{ title: '商品', desc: 'Recommend Product' }"
          />
        </block>
        <block v-else-if="TabCur == 1">
          <rf-floor-index
            icon="icontuijian21"
            :flagtype="flagtypes"
            :list="categoryProductList"
            :header="{ title: '商品', desc: 'Recommend Product' }"
          />
        </block>
        <block v-else-if="TabCur == 2">
          <flag-list-wg  @send="send"></flag-list-wg>
        </block>
<!-- :list="categoryProductListwg" -->
        <!--网站备案号-->
        <view class="copyright" v-if="config.web_site_icp">
          {{ config.copyright_desc }}
          <a href="http://www.baidu.com">{{ config.web_site_icp }}</a>
        </view>
      </block>
      <!-- <view v-else class="index-cate-product-list">
        <rf-product-list
          :bottom="bottom"
          :list="categoryProductList"
        ></rf-product-list>
        <rf-load-more
          :status="loadingType"
          v-if="categoryProductList.length > 0"
        ></rf-load-more>
        <rf-empty
          :bottom="bottom"
          :info="'暂无该分类产品~'"
          v-if="categoryProductList.length === 0 && !productLoading"
        ></rf-empty>
      </view> -->
    </view>

    <!-- 底部弹出 -->
    <u-action-sheet
      :list="actionSheetList"
      v-model="actionSheetShow"
      @click="actionSheetCallback"
    ></u-action-sheet>
    <!--页面加载动画-->
    <rfLoading isFullScreen :active="loading"></rfLoading>
    <rf-back-top :scrollTop="scrollTop"></rf-back-top>
    <rf-back-home></rf-back-home>
  </view>
</template>
<script>
/**
 * @des 微商城首页
 *
 * @author stav stavyan@qq.com
 * @date 2020-01-08 14:14
 * @copyright 2019
 */
// import {
// 	productList
// } from '@/api/product';
import { bannerList, indexConfig, productList, falgdes,flaglist } from '@/api/basic';
import rfSwipeDot from '@/components/rf-swipe-dot';
import flagListWg from '@/components/flag-list-wg';
import rfFloorIndex from '@/components/rf-floor-index';
import rfSearchBar from '@/components/rf-search-bar';
import rfSwiperSlide from '@/components/rf-swiper-slide';
import rfProductList from '@/components/rf-product-list';
import listCell from '@/components/rf-list-cell';
import { mapMutations } from 'vuex';
export default {
  components: {
    rfFloorIndex,
    rfSwipeDot,
    rfProductList,
    rfSearchBar,
    flagListWg,
  },
  data() {
    return {
      current: 0, // 轮播图index
      carouselList: [], // 广告图
      hotProductList: [], // 热门商品列表
      recommendProductList: [], // 推荐商品列表
      guessYouLikeProductList: [], // 猜您喜欢商品列表
      newProductList: [], // 新品上市商品列表
      productCateList: [], // 商品栏目
      config: {
        // web_site_icp:'@zhiliao.com'
      }, // 商户配置
      announceList: [], // 公告列表
      share: {},
      loading: true,
      scrollTop: 0,
      kefuShow: true,
      loadingType: 'more',
      hotSearchDefault: '请输入商品关键字',
      newsBg: this.$mAssetsPath.newsBg,
      errorImage: this.$mAssetsPath.errorImage,
      appName: this.$mSettingConfig.appName,
      categoryList: [], // 分类列表
      categoryProductList: [], // 产品列表
      categoryProductListwg: [], // 围观列表
      currentCate: 0,
      hotRecommendList: this.$mConstDataConfig.hotRecommendList,
      productLoading: true,
      isOpenIndexCate: this.$mSettingConfig.isOpenIndexCate,
      moneySymbol: this.moneySymbol,
      merchantShow: false,
      merchantData: {},
      specialType: {
        hotId: '',
        perId: '',
        teamId: '',
      },
      iconList: [
        {
          icon: 'goodsnewfill',
          color: 'orange',
          badge: 0,
          name: 'Flag购',
          url: '/pages/signshop/signshop',
        },
        {
          icon: 'noticefill',
          color: 'pink',
          badge: 0,
          name: '挑战购',
          url: '/pages/tiaozshop/tiaozshop',
        },
        {
          icon: 'crownfill',
          color: 'blue',
          badge: 0,
          name: '围观广场',
          url: '/pages/wgsite/wgsite',
        },
        {
          icon: 'countdownfill',
          color: 'mauve',
          badge: 0,
          name: '立flag',
          url: '/pages/createflag/createflag',
        },
      ],
      nav: [
        {
          name: '精选flag团购',
        },
        {
          name: '精品挑战购',
        },
        {
          name: '热门围观',
        },
      ],
      TabCur: 0,
      scrollLeft: 0,
      flagtypes: true,
      value: '',
      type: 'text',
      border: true,

      // 商品列表参数
      page: 1,
      limit: 10,
      keywords: '',
      order: '', // sales 销量 plat_price 价格
      sort: 0, //倒序
      type: '1', //1：Flag列表 2：挑战列表

      // 热门围观
      pagewg: 1,
      limitwg: 10,
      keywordswg: '',
      orderwg: '', // sales 销量 plat_price 价格
      sortwg: 1, //正序
      typewg: '1', //1：Flag列表 2：挑战列表

      orderwg:'onlook',    //排序：onlook：热门  money：金额


      //   底部弹出
      actionSheetList: [
        {
          text: '去flag购搜索',
        },
        {
          text: '去挑战购搜索',
        },
      ],
      actionSheetShow: false,
    };
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  // onShow() {
  //   // 初始化购物车数量
  //   // this.setCartNum(uni.getStorageSync('cartNum'));
  //   this.initData();
  // },
  onLoad(){
     this.initData();
  },
  computed: {
    statusBar() {
      const e = uni.getSystemInfoSync();
      return e.statusBarHeight;
    },
    // 计算倒计时时间
    second() {
      return function (val) {
        return Math.floor(15 * 60 - (new Date() / 1000 - val));
      };
    },
    bottom() {
      let bottom = 0;
      bottom = 90;
      return bottom;
    },
    swipeCateList() {
      const list = this.productCateList;
      const result = [];
      for (let i = 0, len = list.length; i < len; i += 10) {
        result.push(list.slice(i, i + 10));
      }
      return result;
    },
  },
  onShareAppMessage() {
    const shareParams = {
      title: this.share.share_title || `欢迎来到${this.appName}`,
      path: '/pages/index/index',
    };
    return shareParams;
  },
  filters: {
    filterDiscountPrice(val) {
      const price = val.product && (val.product.price * val.discount) / 100;
      switch (val.decimal_reservation_number) {
        case 0:
          return (Math.floor(price * 100) / 100).toFixed(2);
        case 1:
          return (Math.floor(price * 100) / 100).toFixed(0);
        case 2:
          return (Math.floor(price * 100) / 100).toFixed(1);
        default:
          return (Math.floor(price * 100) / 100).toFixed(2);
      }
    },
    filterTotalSales(val) {
      if (val > 10000) {
        val = `${(val / 10000).toFixed(2)}w`;
      }
      return val;
    },
  },
  // 下拉刷新
  onPullDownRefresh() {
    // this.getIndexList('refresh');
  },
  // 加载更多
  onReachBottom() {
    // if (this.currentCate === 0) return;
    if (this.loadingType === 'nomore') return false;
    if (this.TabCur == 2) {
      // this.pagewg++;
      // this.loading = true;
      // this.getWgList();
      return false;
    }
    this.page++;
    this.loading = true;
    this.getProductList();
  },
  methods: {
    // 点击actionSheet回调
    actionSheetCallback(index) {
      uni.hideKeyboard();
      //   console.log(index);
      if (index == 0) {
        this.$mRouter.push({ route: '/pages/signshop/signshop' });
      } else if (index == 1) {
        this.$mRouter.push({ route: '/pages/tiaozshop/tiaozshop' });
      }
      // this.model.sex = this.actionSheetList[index].text;
    },

    // tab切换
    tabSelect(e) {
      // console.log(e);
      this.TabCur = e;
      this.scrollLeft = (e - 1) * 60;
      this.modalName = null;
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0,
      });

      this.type = e + 1;
      this.loading = true;
      this.page = 1;
      this.limit = 10;
      this.keywords = '';
      this.sort = 0;
      this.productLoading = true;
      this.categoryProductList = [];
      //   热门围观
      if (this.TabCur == 2) {
        this.loading = false;
        // this.pagewg = 1;
        // this.limitwg = 10;
        // this.keywordswg = '';
        // this.sortwg = 1;
        // this.categoryProductListwg = [];
        // this.getWgList();
        return false;
      }
      this.getProductList();
    },
    toAd() {
      uni.navigateTo({
        url: '../ads/rewardvideo',
      });
    },
    send(value) {
      //   console.log('首页数据', value);
    },
    // 顶部tab点击
    // tabClick({ id }) {
    // 	this.currentCate = id;
    // 	if (id === 0) return;
    // 	this.loading = true;
    // 	this.page = 1;
    // 	this.productLoading = true;
    // 	this.categoryProductList = [];
    // 	this.getProductList(id);
    // },
    // 获取围观列表
  
    async getWgList() {
  
      let params = {
        // page: this.pagewg,
        // limit: this.limitwg,
        // keywords: this.keywordswg,
        // order: this.orderwg,
        // sort: this.sortwg,
        // type: this.typewg,
        order:this.orderwg
      };
      await this.$http
        .get(`${flaglist}`, params)
        .then(async (r) => {
          this.loading = false;
          r.data.forEach(item=>{
            if(item.images){
              item.img=item.images[0]
            }
          })
          //   console.log(r.data.total);
          // this.loadingType =this.categoryProductListwg.length >= r.data.total ? 'nomore': 'more';
          this.loadingType ='more';
          this.categoryProductListwg = [
            ...this.categoryProductListwg,
            ...r.data
          ];
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 获取产品列表
    async getProductList() {
      
      let params = {
        page: this.page,
        limit: this.limit,
        keywords: this.keywords,
        order: this.order,
        sort: this.sort,
        type: this.type,
      };
      await this.$http
        .get(`${productList}`, params)
        .then(async (r) => {
          this.loading = false;
          this.productLoading = false;
          //   console.log(r.data.total);
          this.loadingType =
            this.categoryProductList.length >= r.data.total ? 'nomore' : 'more';
          this.categoryProductList = [
            ...this.categoryProductList,
            ...r.data.rows,
          ];
        })
        .catch(() => {
          this.loading = false;
          this.productLoading = false;
        });

      // await this.$http
      // 	.get(`${productList}`, params)
      // 	.then(async r => {
      // 		uni.setNavigationBarTitle({
      // 			title: this.appName
      // 		});
      // 		if (type === 'refresh') {
      // 			uni.stopPullDownRefresh();
      // 		}
      // 		if (r.status) {
      // 			this.$mHelper.toast(r.msg);
      // 			return;
      // 		}
      // 		// 首页参数赋值
      // 		this.loading = false;
      // 		this.initIndexData(r.data);
      // 	})
      // 	.catch(() => {
      // 		this.loading = false;
      // 		if (type === 'refresh') {
      // 			uni.stopPullDownRefresh();
      // 		}
      // 	});
    },
    ...mapMutations(['setCartNum']),
    // 监听轮播图切换
    handleDotChange(e) {
      this.current = e.detail.current;
    },
    // 数据初始化
    initData() {
      // this.TabCur=0
      // 设置购物车数量角标
      this.getIndexList();
      // this.initCartItemCount();
    },
    // 设置购物车数量角标
    async initCartItemCount() {
      if (
        this.$mStore.getters.hasLogin &&
        parseInt(uni.getStorageSync('cartNum'), 10) > 0
      ) {
        uni.setTabBarBadge({
          index: this.$mConstDataConfig.cartIndex,
          text: uni.getStorageSync('cartNum').toString(),
        });
      } else {
        uni.removeStorageSync('cartNum');
        uni.removeTabBarBadge({
          index: this.$mConstDataConfig.cartIndex,
        });
      }
    },
    // 通用跳转
    navTo(route) {
      this.$mRouter.push({
        route,
      });
    },
    // 跳转至分类模块
    navToCategory(id) {
      if (this.$mSettingConfig.appCateType === '2') {
        uni.setStorageSync('indexToCateId', id);
        this.$mRouter.reLaunch({
          route: '/pages/category/category',
        });
      } else {
        this.navTo(`/pages/product/list?cate_id=${id}`);
      }
    },
    // 通用跳转
    navToSearch() {
      // this.$mRouter.push({
      // 	//route: `/pages/index/search/search?data=${JSON.stringify(this.search)}`
      // 	route: '/pages/index/search/search'
      // });
      this.actionSheetShow = true;
    },
    // 跳至广告图指定页面
    indexTopToDetailPage(item) {
      this.navTo(`${item.url}`);
      // if (item.bannerType === 1) {
      // 	this.navTo(`/pages/index/notice/detail?id=${item.objId}`);
      // } else if (item.bannerType === 2) {
      // 	this.navTo(`/pages/product/product?id=${item.objId}`);
      // }
    },

    async getBannerData(type) {
      await this.$http
        .get(`${bannerList}`, {})
        .then(async (r) => {
          //   console.log(r);
          uni.setNavigationBarTitle({
            title: this.appName,
          });
          if (type === 'refresh') {
            uni.stopPullDownRefresh();
          }
          if (r.status) {
            this.$mHelper.toast(r.msg);
            return;
          }
          // 首页参数赋值
          this.carouselList = r.data.banner;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          if (type === 'refresh') {
            uni.stopPullDownRefresh();
          }
        });
    },
    // 获取主页数据
    async getIndexList() {
      this.getBannerData();
      this.getProductList();
    },
    // 首页参数赋值
    initIndexData(data) {
      for (const i in this.specialType) {
        if (data[i]) {
          this.specialType[i] = data[i];
        }
      }
      this.hotProductList = data.hot;
      this.recommendProductList = data.team;
      this.newProductList = data.per;
      this.$mHelper.handleWxH5Share(
        this.share.share_title || this.appName,
        this.share.share_desc || `欢迎来到${this.appName}商城`,
        this.share.share_link || this.$mConfig.hostUrl,
        this.share.share_cover || this.$mSettingConfig.appLogo
      );
    },
    // 跳转至商品详情页
    navToDetailPage(data) {
      const { id } = data;
      if (!id) return;
      this.$mRouter.push({
        route: `/pages/product/product?id=${id}`,
      });
    },
    // 跳转至分类页
    toCategory() {
      this.$mRouter.switchTab({
        route: '/pages/category/category',
      });
    },
  },
};
</script>
<style lang="scss">
page {
  background-color: $page-color-base;
}

@keyframes fade {
  from {
    transform: scale(0.9);
  }

  to {
    transform: scale(1.1);
  }
}

.adimage {
  width: 36px;
  height: 55px;
  position: fixed;
  bottom: 2px;
  right: 18px;
  z-index: 1000;
  animation: fade 0.75s infinite alternate;
}

.bg-search {
  background-color: $uni-color-primary;
}

.headerBg {
  background-color: $uni-color-primary;
  position: absolute;
  // top: -80px;
  // left: -50%;
  z-index: 0;
  width:100%;
  height: 280upx;
  // border-bottom-right-radius: 50%;
  // border-bottom-left-radius: 50%;
}
//  .headerBg {
//     height: 100px;
//     width: 100%;
//     position: relative;
//     z-index: 0;
//     overflow: hidden;
//  }
//     // background-image: linear-gradient(#5796f5, #8fe1db);
//     .headerBg::after {
//       content: '';
//       width: 120%;
//       height: 260px;
//       position: absolute;
//       left: -10%;
//       top: 0;
//       border-radius: 0 0 50% 50%;
//       background-image: linear-gradient(#f37b1d, #f37b1d);
//     }


.headerWords {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: #fa436a;
  color: #ffffff;
  text-align: center;
  height: 45px;
  line-height: 45px;
  font-size: 16px;
}

.rf-index {
  background-color: $color-white;

  /*爆款拼团*/
  .wrapper {
    border-radius: 10upx;

    .h-list {
      background-color: $page-color-base;
      white-space: nowrap;
      padding: 0 $spacing-sm;

      .h-item {
        margin: $spacing-sm $spacing-sm $spacing-sm 0;
        display: inline-block;
        background-color: $color-white;
        font-size: $font-sm;
        width: 280upx;
        border-radius: 6upx;

        .title {
          width: 280upx;
          white-space: normal;
          height: 60upx;
          line-height: 30upx;
          font-size: $font-sm;
          padding: 0 $spacing-sm;
          margin: $spacing-sm 0;
        }

        .last-line {
          padding: 0 $spacing-sm $spacing-base;
          margin-bottom: 5upx;
          display: flex;
          justify-content: space-between;
          align-items: center;

          /* 垂直居中 */
          .red {
            font-size: $font-sm;
            margin-right: 4upx;
          }
        }

        .price {
          font-size: $font-base - 2upx;
          line-height: 1;

          .m-price {
            margin-left: 8upx;
            color: $font-color-light;
            font-size: $font-sm;
            text-decoration: line-through;
          }
        }
      }
    }
  }

  /*轮播图*/
  .swiper {
    width: 100%;
    margin-bottom: 20upx;
    display: flex;
    justify-content: center;

    .swiper-box {
      width: 92%;
      height: 40vw;
      overflow: hidden;
      border-radius: 15upx;
      box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
      //兼容ios，微信小程序
      position: relative;
      z-index: 1;

      swiper {
        width: 100%;
        height: 40vw;

        swiper-item {
          image {
            width: 100%;
            height: 40vw;
          }
        }
      }
    }
  }

  /* 爆款推荐 */
  .hot-recommend {
    background-color: $color-white;
    display: flex;
    padding: $spacing-base $spacing-lg 0;

    .hot-recommend-image {
      width: 100%;
      height: 100%;
    }

    .left {
      flex: 3;
      height: 350upx;
      margin-right: 15upx;
    }

    .right {
      flex: 4;

      .hot-recommend-image {
        height: 170upx;
      }
    }
  }

  /*轮播图2*/
  .swiper-item-text {
    position: absolute;
    bottom: 16upx;
    left: 30upx;
    height: 48upx;
    line-height: 48upx;
    background: rgba(0, 0, 0, 0.2);
    width: 90%;
    color: $color-white;
    border-bottom-left-radius: 12upx;
    padding-left: 20upx;
  }

  /*新闻通知*/
  .swiper-slide-header {
    .iconfont {
      font-size: $font-lg + 8upx;
      font-weight: 600;
    }
  }

  /*分类列表*/
  .category-list-wrapper {
    .category-list {
      width: 100%;
      padding: $spacing-base;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .category {
        margin-top: 10upx;
        width: calc(20% - 20upx);
        height: 132upx;
        display: flex;
        text-align: center;
        flex-wrap: wrap;

        .img {
          width: 100%;
          display: flex;
          justify-content: center;

          image {
            width: 12vw;
            height: 12vw;
            border-radius: 50%;
          }
        }

        .text {
          margin-top: 16upx;
          width: 100%;
          display: flex;
          justify-content: center;
          font-size: 24upx;
          color: #3c3c3c;
        }
      }
    }
  }

  /*版权显示*/
  .copyright {
    margin: 10upx 0;
    width: 100%;
    text-align: center;
    color: #666;

    a {
      display: block;
      color: #666;
      text-decoration: none;
    }
  }

  /*限时抢购*/
  .order-item {
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 0 30upx;
    margin-bottom: 20upx;

    .goods-box-single {
      display: flex;
      padding: 40upx 10upx 10upx;
      height: 330upx;
      border-radius: 12upx;
      margin-top: 20upx;
      box-shadow: 2px 2px 10px rgba(66, 135, 193, 0.2); // 阴影
      border-bottom: 1px solid rgba(0, 0, 0, 0.05); // 边框
      position: relative;

      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0 30upx 0 24upx;
        overflow: hidden;

        .title {
          font-weight: bold;
          line-height: 1.2;
          margin: 10upx 0;
        }

        .attr-box {
          line-height: 1.2;
          margin-bottom: 8upx;
          margin-left: 10upx;
        }

        .last-line {
          margin-top: 3upx;
          display: flex;
          justify-content: space-between;
          align-items: center;

          /* 垂直居中 */
          .red {
            margin-right: 4upx;
          }
        }

        .price {
          font-size: $font-lg;
          line-height: 1;

          .m-price {
            margin-left: 8upx;
            color: $font-color-light;
            font-size: $font-sm;
            text-decoration: line-through;
          }
        }

        .triangle-wrapper {
          position: absolute;
          overflow: hidden;
          top: 0;
          right: 0;
          border-radius: 12upx;

          .triangle {
            color: #5eba8f;
            width: 0;
            height: 0;
            border-top: 120upx solid;
            opacity: 0.8;
            border-left: 120upx solid transparent;
          }

          .triangle-content {
            position: absolute;
            top: 28upx;
            right: 0;
            transform: rotate(45deg);
            font-size: $font-sm - 2upx;
            color: #fff;
          }
        }
      }
    }

    .action-box {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 90upx;
      position: relative;

      .discount-time {
        font-size: $font-sm;
        color: $uni-color-success;
        margin-right: 20upx;
      }
    }
  }

  .index-cate-product-list {
    padding-top: $spacing-sm;
    background-color: $page-color-base;

    .no-data {
      margin: 48upx 0;
      color: $font-color-light;
      display: flex;
      justify-content: center;
      align-items: center;

      .iconfont {
        margin-right: 20upx;
        font-size: $font-lg + 16upx;
      }
    }
  }
}
</style>
