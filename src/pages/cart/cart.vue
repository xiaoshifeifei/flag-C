<template>
	<view class="cart">
		<view v-if="cartList.length === 0" class="empty">
			<text class="iconfont icongouwuche" :class="'text-'+themeColor.name"></text>
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" :class="'text-'+themeColor.name" v-if="hasLogin" url="../category/category" open-type="switchTab">随便逛逛></navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" :class="'text-'+themeColor.name" @tap="navTo('/pages/public/login')">登录/注册 ></view>
			</view>
		</view>
		<!-- 购物车列表 -->
		<view class="goods-list" v-else>

			<view class="rf-cart-row" v-for="(row, index) in cartList" :key="index">
				<!-- 删除按钮 -->
				<view class="menu" @tap.stop="deleteCartItem(row.productId, 'one')" :class="'bg-'+themeColor.name">
					<text class="iconfont icon iconiconfontshanchu1"></text>
				</view>
				<!-- 商品 -->
				<view class="carrier" :class="[
						theIndex === index ? 'open' : oldIndex === index ? 'close' : ''
					]"
				 @touchstart="touchStart(index, $event)" @touchmove="touchMove(index, $event)" @touchend="touchEnd(index, $event)">
					<!-- checkbox -->
					<view class="checkbox-box" @tap="selected(index, row)">
						<view class="checkbox" :class="[
								parseInt(row.status, 10) === 0 ? `checkbox-disabled ${'text-'+themeColor.name}` : 'text-'+themeColor.name
							]">
							<view :class="[row.selected ? `on ${'bg-'+themeColor.name}` : '']"></view>
						</view>
					</view>
					<!-- 商品信息 -->
					<view class="goods-info">
						<view class="img">
							<image :src="row.productMainImage"></image>
						</view>
						<view class="info">
							<view class="title in2line" @tap="navTo(`/pages/product/product?id=${row.product.id}`)">
								{{ row.productName }}
							</view>
							<view class="state-wrapper">
								<view class="state" v-if="parseInt(row.status, 10) === 0">
									已失效
								</view>
							</view>
							<view class="price-number">
								<view class="price" v-if="parseInt(row.productStock, 10) >= 1">{{ moneySymbol }}{{
									row.productPrice
								}}</view>
								<view class="remark" v-else>{{ row.remark }}</view>
								<view class="number" v-if="parseInt(row.productStock, 10) >= 1">
									<view class="sub" @tap.stop="sub(row, index)">
										<text class="iconfont icon icon-jianhao"></text>
									</view>
									<view class="input" @tap.stop="discard">
										<input type="number" :class="'text-'+themeColor.name" v-model="row.quantity" @input.stop="numberChange(row, $event, index)" />
									</view>
									<view class="add" @tap.stop="add(row, index)">
										<text class="iconfont icon iconjia1"></text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 脚部菜单 -->
		<view class="footer" :style="{ bottom: footerbottom }" v-if="cartList.length !== 0">
			<view class="checkbox-box" @tap="allSelect">
				<view class="checkbox" :class="'text-'+themeColor.name">
					<view :class="[isAllselected ? `on ${'bg-'+themeColor.name}` : '']"></view>
				</view>
				<view class="text">全选</view>
			</view>
			<!-- <view class="delBtn" :class="'text-'+themeColor.name" @tap="deleteCartItem" v-if="selectedList.length > 0">删除</view> -->
			<view class="settlement">
				<view class="sum">合计:
					<view class="money">{{ moneySymbol }}{{ sumPrice }}</view>
				</view>
				<view class="btn" :class="'bg-'+themeColor.name" @tap="createOrder">结算({{ selectedList.length }})</view>
			</view>
		</view>
		<!-- 规格-模态层弹窗 -->
		<view class="popup spec show" v-if="specClass === 'show'" @touchmove.stop.prevent="stopPrevent" @tap="hideSpec">
			<!-- 遮罩层 -->
			<view class="mask" @tap="hideSpec"></view>
			<view class="layer" @tap.stop="stopPrevent">
				<rf-attr-content :isSelectedNum="false" :product="productDetail" @toggle="toggleSpec"></rf-attr-content>
			</view>
		</view>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
import {
  cartPreCreate,
  cartItemDel,
  cartItemList,
  cartItemUpdateNum,
  cartItemCount,
  cartItemUpdateSku,
  productDetail
} from '@/api/product'
import {
  mapMutations
} from 'vuex'
export default {
  components: {

  },
  data () {
    return {
      sumPrice: '0.00',
      headerPosition: 'fixed',
      headerTop: null,
      statusTop: null,
      showHeader: true,
      selectedList: [],
      isAllselected: false,
      // 控制滑动效果
      theIndex: null,
      oldIndex: null,
      isStop: false,
      cartList: [],
      hasLogin: null,
      footerbottom: 0,
      specClass: 'none',
      productDetail: {
        base_attribute_format: [],
        sku: []
      },
      specSelected: [],
      specChildList: [],
      specList: [],
      currentSkuId: '',
      moneySymbol: this.moneySymbol,
      loading: true,
      singleSkuText: this.singleSkuText
    }
  },
  onPageScroll (e) {
    // 兼容iOS端下拉时顶部漂移
    this.headerPosition = e.scrollTop >= 0 ? 'fixed' : 'absolute'
    this.headerTop = e.scrollTop >= 0 ? null : 0
    this.statusTop = e.scrollTop >= 0 ? null : -this.statusHeight + 'px'
  },
  // 下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
  onPullDownRefresh () {
    this.selectedList.length = 0
    this.isAllselected = false
    this.sumPrice = 0
    this.getCartItemList('refresh')
  },
  onShow () {
    /** update-mo  2021212 */
    // #ifdef H5
    this.footerbottom = uni.upx2px(100) + 'px'
    // #endif

    this.initData()
  },
  methods: {
    ...mapMutations(['setCartNum']),
    // 规格弹窗开关
    toggleSpec (row) {
      if (parseInt(row.status, 10) === 0) return
      if (this.specClass === 'show') {
        if (!this.hasLogin) {
          this.specClass = 'none'
          this.$mHelper.toast('请先登录！')
          return
        }
        this.handleCartItemUpdateSku(this.currentSkuId, row.skuId)
        this.specClass = 'hide'
        setTimeout(() => {
          this.specClass = 'none'
        }, 250)
      } else if (this.specClass === 'none') {
        if (row) {
          this.getProductDetail(row)
        }
      }
    },
    // 获取产品详情
    async getProductDetail (row) {
      this.currentSkuId = row.sku_id
      await this.$http
        .get(`${productDetail}`, {
          id: row.product_id
        })
        .then(async r => {
          this.productDetail = r.data
          this.productDetail.sku_name = row.sku_name
          this.specClass = 'show'
        })
    },
    hideSpec () {
      this.specClass = 'hide'
      setTimeout(() => {
        this.specClass = 'none'
      }, 250)
    },
    stopPrevent () {},
    // 删除选中购物车商品
    async deleteCartItem (id, type) {
      this.loading = true
      await this.$http
        .delete(`${cartItemDel}${id}`)
        .then((r) => {
          if (r.status) {
            this.$mHelper.toast(r.msg)
            return
          }
          this.initData()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 修改购物车商品sku
    async handleCartItemUpdateSku (skuId, newSkuId) {
      await this.$http
        .post(`${cartItemUpdateSku}`, {
          sku_id: skuId,
          new_sku_id: newSkuId
        })
        .then(() => {
          this.selectedList.length = 0
          this.isAllselected = false
          this.sumPrice = 0
          this.getCartItemList()
        })
    },
    // 数据初始化
    initData () {
      this.hasLogin = this.$mStore.getters.hasLogin
      if (this.hasLogin) {
        this.theIndex = null
        this.oldIndex = null
        this.selectedList.length = 0
        this.isAllselected = false
        this.sumPrice = 0
        this.getCartItemList()
      } else {
        this.cartList = []
        this.selectedList.length = 0
        this.loading = false
      }
    },
    // 通用跳转
    navTo (route) {
      if (!this.$mStore.getters.hasLogin) {
        uni.setStorageSync('backToPage', JSON.stringify({
          route: '/pages/cart/cart'
        }))
      }
      this.$mRouter.push({
        route
      })
    },
    // 获取购物车列表
    async getCartItemList (type) {
      await this.$http
        .get(`${cartItemList}`)
        .then(r => {
          this.loading = false
          if (type === 'refresh') {
            uni.stopPullDownRefresh()
          }
          if (r.status) {
            this.$mHelper.toast(r.msg)
            return
          }
          this.cartList = r.data.cartProductVoList
          let cartNum = 0
          r.data.cartProductVoList.forEach(item => {
            if (parseInt(item.productStock, 10) >= 1) {
              cartNum += item.quantity
            }
          })
          this.setCartNum(cartNum)
        })
        .catch(() => {
          this.cartList = []
          this.loading = false
          if (type === 'refresh') {
            uni.stopPullDownRefresh()
          }
        })
    },
    // 控制左滑删除效果
    touchStart (index, event) {
      // 多点触控不触发
      if (event.touches.length > 1) {
        this.isStop = true
        return
      }
      this.oldIndex = this.theIndex
      this.theIndex = null
      // 初始坐标
      this.initXY = [event.touches[0].pageX, event.touches[0].pageY]
    },
    touchMove (index, event) {
      // 多点触控不触发
      if (event.touches.length > 1) {
        this.isStop = true
        return
      }
      const moveX = event.touches[0].pageX - this.initXY[0]
      const moveY = event.touches[0].pageY - this.initXY[1]

      if (this.isStop || Math.abs(moveX) < 5) {
        return
      }
      if (Math.abs(moveY) > Math.abs(moveX)) {
        // 竖向滑动-不触发左滑效果
        this.isStop = true
        return
      }

      if (moveX < 0) {
        this.theIndex = index
        this.isStop = true
      } else if (moveX > 0) {
        if (this.theIndex != null && this.oldIndex === this.theIndex) {
          this.oldIndex = index
          this.theIndex = null
          this.isStop = true
          setTimeout(() => {
            this.oldIndex = null
          }, 150)
        }
      }
    },
    touchEnd (index, $event) {
      // 结束禁止触发效果
      this.isStop = false
    },
    // 选中商品
    selected (index, item) {
      if (parseInt(item.status, 10) === 0) return
      this.cartList[index].selected = !this.cartList[index].selected
      const i = this.selectedList.indexOf(this.cartList[index].productId)
      i > -1
        ? this.selectedList.splice(i, 1)
        : this.selectedList.push(this.cartList[index].productId)
      this.isAllselected = this.selectedList.length === this.cartList.length
      this.sum()
    },
    // 全选商品
    allSelect () {
      const len = this.cartList.length
      const arr = []
      for (let i = 0; i < len; i++) {
        // 当商品
        if (parseInt(this.cartList[i].status, 10) !== 0) {
          this.cartList[i].selected = !this.isAllselected
          arr.push(this.cartList[i].productId)
        }
      }
      this.selectedList = this.isAllselected ? [] : arr
      this.isAllselected = !(this.isAllselected || arr.length === 0)
      if (arr.length > 0) {
        this.sum()
      }
    },
    // 减少数量(执行接口)
    sub (item, index) {
      if (this.cartList[index].quantity <= 1) {
        return
      }
      this.cartList[index].quantity--
      this.numberChange(item)
    },
    // 增加数量(执行接口)
    add (item, index) {
      this.cartList[index].quantity++
      this.numberChange(item, undefined, index, 'add')
    },
    // 控制可输入购物车商品数量
    discard () {},
    // 监听购物车商品数量改变
    async numberChange (item, data, index, type) {
      if (data) {
        this.cartList[index].quantity = data.detail.value
      }
      await this.$http
        .put(`${cartItemUpdateNum}${item.productId}`, {
          quantity: item.quantity
        })
        .then(r => {
          if (r.status) {
            this.$mHelper.toast(r.msg)
            return
          }

          this.$http.get(`${cartItemCount}`).then(r => {
					  if (r.status) {
					    this.$mHelper.toast(r.msg)
					    return
					  }
					  this.setCartNum(r.data)
          })
          this.sum()
        })
        .catch(() => {
          if (type === 'add') {
            this.cartList[index].quantity--
          }
        })
    },
    // 创建订单
    async createOrder () {
      if (this.selectedList.length === 0) return
      const data = {}
      data.busType = 'single'
      data.productIdList = this.selectedList
      await this.$http
			  .post(`${cartPreCreate}`, data)
			  .then(r => {
			    if (r.status) {
			      this.$mHelper.toast(r.msg)
			    }

          this.$mRouter.push({
					  route: `/pages/order/create/order?id=${r.data.orderNo}`
          })
			  })
			  .catch(() => {
			  })
    },
    // 合计
    sum () {
      this.sumPrice = 0
      const len = this.cartList.length
      const arr = []
      for (let i = 0; i < len; i++) {
        if (this.cartList[i].selected) {
          arr.push(this.cartList[i])
          this.sumPrice = this.arrSort(arr)
        }
      }
      this.sumPrice = this.sumPrice.toFixed(2)
    },
    // 向下舍去小数点后两位
    floor (val) {
      return Math.floor(val * 100) / 100
    },
    // 计算相同商品不同规格价格
    arrSort (arr) {
      const map = {}
      const dest = []
      for (let i = 0; i < arr.length; i++) {
        const ai = arr[i]
        if (!map[ai.productId]) {
          dest.push({
            id: ai.productId,
            num: 0,
            price: 0,
            data: [ai]
          })
          map[ai.productId] = ai
        } else {
          for (let j = 0; j < dest.length; j++) {
            const dj = dest[j]
            if (dj.data[0].productId === ai.productId) {
              dj.data.push(ai)
              break
            }
          }
        }
      }
      dest.forEach(item => {
        item.data.forEach(item2 => {
          item.num += parseInt(item2.quantity, 10)
          item.price += parseInt(item2.quantity, 10) * item2.productPrice
        })
      })
      let amount = 0
      dest.forEach(item => {
        amount += item.price
      })
      return amount
    }
  }
}
</script>
<style lang="scss">
	page {
		background-color: #fff;
	}

	.checkbox-box {
		display: flex;
		align-items: center;

		.checkbox {
			width: 35upx;
			height: 35upx;
			border-radius: 100%;
			border: solid 2upx;
			display: flex;
			justify-content: center;
			align-items: center;

			.on {
				width: 25upx;
				height: 25upx;
				border-radius: 100%;
			}
		}

		.checkbox-disabled {
			border: solid 2upx $font-color-disabled;
		}

		.text {
			font-size: 28upx;
			margin-left: 10upx;
		}
	}

	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: #fff;
		top: 0;
	}

	.header {
		width: 92%;
		padding: 0 4%;
		height: 100upx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #fff;
		.title {
			font-size: 36upx;
		}
	}

	.place {
		background-color: #fff;
		height: 100upx;
	}

	.goods-list {
		width: 100%;
		padding: 0 0 100upx 0;

		.btn-clear {
			text-align: right;
			padding: 0 $spacing-lg;
			font-size: $font-base + 2upx;
		}

		.tis {
			width: 100%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
		}
	}

	.empty {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		padding-bottom: 100upx;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		background: #fff;

		.icongouwuche {
			font-size: $font-lg + 100upx;
		}

		.empty-tips {
			display: flex;
			font-size: $font-sm + 2upx;
			color: $font-color-disabled;

			.navigator {
				margin-left: 16upx;
			}
		}
	}

	.footer {
		width: 100%;
		padding: 0 2%;
		background-color: #fbfbfb;
		height: 100upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28upx;
		position: fixed;
		bottom: 0upx;
		z-index: 5;

		.delBtn {
			border: solid 1upx;
			padding: 0 24upx;
			height: 42upx;
			border-radius: 24upx;
			font-size: $font-sm;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.settlement {
			width: 52%;
			display: flex;
			justify-content: flex-end;
			align-items: center;

			.sum {
				font-size: $font-base;
				margin-right: 8upx;
				display: flex;
				justify-content: flex-end;

				.money {
					font-weight: 600;
				}
			}

			.btn {
				padding: 0 26upx;
				height: 50upx;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 30upx;
			}
		}
	}

	.popup .layer {
		bottom: 0;
	}
</style>
