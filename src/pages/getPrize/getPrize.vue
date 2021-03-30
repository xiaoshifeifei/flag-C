<template>
	<div class="prizeMain">
		<img src="/static/prize/prize-banner.png" class="prize-banner" />
		<nine-prize :ds="dsNinePrize" @prizeDone="prizeDone"></nine-prize>
		<view class="ruleContainer">
			<view class="ruleTitle">活动规则</view>
			<view class="ruleList">
				<view>1.每次抽奖需消耗5积分</view>
				<view>2.参团一次（不论产品价格）可获得1积分</view>
			</view>
		</view>
	</div>
</template>

<script>
import {
  prizeList,
  newestPriList,
  getPrize
} from '@/api/userInfo.js'
import NinePrize from './components/NinePrize'
import iconBill from './assets/bill@2x.png'
import iconEnterprise from './assets/enterprise@2x.png'
import iconApply from './assets/apply@2x.png'
import avatarIcon from './assets/default_head_icon.png'
export default {
  name: 'app',
  components: {
    'nine-prize': NinePrize
  },
  data () {
    return {
      iconApply,
      iconEnterprise,
      iconBill,
      dsLights: 30, // 跑马灯小点个数
      dsNinePrize: [{
        id: 1,
        isSelect: true,
        img: avatarIcon,
        text: ''
      },
      {
        id: 2,
        isSelect: false,
        img: iconBill,
        text: ''
      },
      {
        id: 3,
        isSelect: false,
        img: iconApply,
        text: ''
      },
      {
        id: 4,
        isSelect: false,
        img: iconEnterprise,
        text: ''
      },

      {
        id: 5,
        isSelect: false,
        img: avatarIcon,
        text: ''
      },
      {
        id: 6,
        isSelect: false,
        img: iconBill,
        text: ''
      },
      {
        id: 7,
        isSelect: false,
        img: iconApply,
        text: ''
      },
      {
        id: 8,
        isSelect: false,
        img: iconEnterprise,
        text: ''
      }
      ],
      ctx: null,
      trangleBase: 0, // 三角形底边
      trangleHeight: 0, // 三角形高
      rotateDegree: 0,
      ds: 0
    }
  },

  async mounted () {
    await this.getlist()
  },
  methods: {
    async getlist (type) {
		  await this.$http
		    .post(`${prizeList}`, {

		    })
		    .then(r => {
		      this.loading = false
		      if (type === 'refresh') {
		        uni.stopPullDownRefresh()
		      }
          const data = r.data
          data.forEach(function (item) {
            item.isSelect = false
          })
		      this.dsNinePrize = data
		    })
		    .catch(err => {
		      this.dsNinePrize = []
		      this.errorInfo = err
		      this.loading = false
		      if (type === 'refresh') {
		        uni.stopPullDownRefresh()
		      }
		    })
    },
    prizeDone () {
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
	.prizeMain{
			width: 100vw;
			min-height: 100vh;
			padding-bottom: 1vh;
			// overflow: hidden;
			background-color: #F6486E;
	}
	.prize-banner{
		width: 80vw;
		margin: 2vh auto;
		margin-top: 0;
		display: block;
	}
	#nav {
		padding: 30px;

		a {
			font-weight: bold;
			color: #2c3e50;

			&.router-link-exact-active {
				color: #42b983;
			}
		}
	}
	.ruleContainer{
		width: 90vw;
		margin: 5vh auto;
		background-color: rgb(220, 29, 70);
		position: relative;
		color: white;
		padding: 20px;
		.ruleTitle{
			height: 40px;
			width: 130px;
			line-height: 40px;
			position: absolute;
			top: 0;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: rgb(254, 233, 99);
			border-radius: 20px;
			text-align: center;
			color: rgb(235, 35, 45);
			font-size: 16px;
		}
		.ruleList{
			margin-top: 20px;
			view{
				margin-top: 10px;
				color: white;
			}
		}
	}
</style>
