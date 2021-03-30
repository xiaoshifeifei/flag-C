<template>
	<view ref="view" class="content-body">
		<!-- <SplashView ref="loadSplash" class="view" :style="{width:w+'px',height:h+'px'}">
		</SplashView> -->
        <BannerView ref="loadBanner"   class="view" > 
		 </BannerView>
	</view>
</template>
<script>
import fusionSdk from '@/fusionAd.js'
export default {
  data () {
    return {
      w: '',
      h: ''
    }
  },
  onReady () {},
  mounted() {
      console.log(this.$refs)
      	fusionSdk.loadBannerAd(this.$refs.loadBanner,"87913043270303744",
				{
					onAdShow:function(){
						console.log("onBannerShow")
					},
					
					onAdClick:function(){
						console.log("onBannerClick")
					}
				}
			)
  },
  onLoad () {
      	// fusionSdk.loadBannerAd(this.$refs.loadBanner,"87913043270303744",
		// 		{
		// 			onAdShow:function(){
		// 				console.log("onBannerShow")
		// 			},
					
		// 			onAdClick:function(){
		// 				console.log("onBannerClick")
		// 			}
		// 		}
		// 	)

    //   fusionSdk.loadSplashAd(this.$refs.loadSplash,"232887619380314112",
	// 			{
	// 				onAdShow:function(){
	// 					console.log("onSplashShow")
	// 				},
	// 				onAdClick:function(){
	// 					console.log("onSplashClick")
	// 					//广告被点击
	// 				},
					
	// 				onAdClosed:function(){
	// 					console.log("onSlashClosed")
	// 					//处理页面关闭和跳转逻辑
	// 				},
	// 				onAdError:function(code,msg){
	// 					uni.showToast({
	// 						title:msg
	// 					})
	// 				}
	// 			}
	// 		)
    // const that = this
    // setTimeout(function () {
    //   uni.getSystemInfo({
    //     success (res) {
    //       console.log(that.$refs.loadSplash)
    //       fusionSdk.loadSplashAd(that.$refs.loadSplash, '232887619380314112', {
    //         onAdShow: function () {

    //         },
    //         onAdClick: function () {

    //         },
    //         onAdClosed: function () {
    //           uni.reLaunch({
    //             url: '/pages/index/middleware/middleware'
    //           })
    //         },
    //         onAdError: function (code, msg) {
    //           // uni.switchTab({
    //           //   url: '/pages/category/category'
    //           // })
    //           alert('广告错误')
    //           uni.reLaunch({
    //             url: '/pages/index/middleware/middleware'
    //           })
    //         }
    //       })
    //     }
    //   })
    // }, 200)
  },
  onShow () {
    const that = this
    uni.getSystemInfo({
      success (res) {
        that.w = res.windowWidth
        that.h = res.windowHeight
      }
    })
  }
}
</script>

<style>
	.view {
		height: 1300upx;
		width: 750upx;
	}
</style>
