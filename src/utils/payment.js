/* eslint-disable */
// #ifdef H5
import { wechatConfig } from '@/api/basic';
import $mConfig from '@/config/index.config';
import jweixin from '@/common/jweixin';
// #endif
import { isBindingCheck } from '@/api/login';
import { payCreate, payFlag, payEnge } from '@/api/basic';
import { http } from '@/utils/request';
import mHelper from '@/utils/helper';
import mRouter from '@/utils/router';
import { orderPay, orderBuyByBalance } from '@/api/product';
export default {
    // 判断是否公众号（微信H5）
    isWechat() {
        // #ifdef H5
        const ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/micromessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
        // #endif
    },

    // wxjssdk
    async wxConfigH5(url) {
        if (this.isWechat()) {
            const jsApiList = JSON.stringify([
                'chooseWXPay',
                'scanQRCode',
                'updateAppMessageShareData',
                'updateTimelineShareData'
            ]);
            await http
                .post(`${wechatConfig}`, {
                    url: url,
                    jsApiList, // 需要调用微信的原生方法
                    debug: false // 是否打开调试
                })
                .then(r => {
                    jweixin.config({
                        ...r.data
                    });
                });
        }
    },

    /*
     *@des 微信支付
     *
     *@param order_group 订单:order;充值:recharge;
     *@param data 订单 {“order_id”:199} 充值 {“money”:100};
     */

    // /pages/user/money/success
    async weixinPay(params, type, route = '/pages/order/orderjilu/orderjilu') {
        console.log(params);
        uni.showLoading({ title: '支付中' });
        // #ifdef H5
        // if (!this.isWechat()) {
        // 	mHelper.toast('仅支持微信H5、微信小程序、APP支付');
        // 	return;
        // }
        // #endif
        // #ifdef MP-QQ
        // mHelper.toast('QQ小程序暂不支持充值');
        // return;
        // #endif

        /***  2020-12-11  莫   修改 */
        // await http
        // 	.post(`${payCreate}`, {
        // 		orderNo: orderNo,
        // 		payType: 'WXPAY'
        // 	})
        // 	.then(r => {

        // 		if (r.status) {
        // 			this.$mHelper.toast(r.msg)
        // 			return
        // 		}

        // 		// #ifdef H5
        // 		window.location.href = r.data.payUrl;
        // 		// #endif
        // 		 //#ifdef APP-PLUS
        // 		 plus.runtime.openURL(r.data.payUrl)
        // 		 //#endif
        // 	});
        // 	return;
        /***
         * 调用了 uni微信支付接口
         * */
        // #ifdef APP-PLUS

        // 直接支付

        if (type == 'liji') {
            console.log('我是liji');
            await http
                .post(`${payCreate}`, {
                    product_id: params.product_id,
                    address_id: params.address_id,
                    remark: params.remark
                })
                .then(r => {
                    console.log(r);
                    uni.requestPayment({
                        provider: 'wxpay', // 微信支付
                        orderInfo: JSON.stringify(r.data), //微信订单数据 r.data.config
                        success: function() {
                            uni.hideLoading();
                            mHelper.toast('支付成功');
                            mRouter.redirectTo({
                                route
                            });
                        },
                        fail: function(err) {
                            uni.hideLoading();
                            console.log('err', err);
                            mHelper.toast('支付已取消,请重新支付');
                        }
                    });
                });
        }

        // flag购物

        if (type == 'flag') {
            console.log('我是flag');
            await http
                .post(`${payFlag}`, {
                    product_id: params.product_id,
                    address_id: params.address_id,
                    task_id: params.task_id
                })
                .then(r => {
                    console.log(r);
                    uni.requestPayment({
                        provider: 'wxpay', // 微信支付
                        orderInfo: JSON.stringify(r.data), //微信订单数据 r.data.config
                        success: function() {
                            uni.hideLoading();
                            mHelper.toast('支付成功');
                            mRouter.redirectTo({
                                route: `/pages/createflag/ordersuccess?id=${r.data.flag_id}`
                            });
                        },
                        fail: function(err) {
                            uni.hideLoading();
                            console.log('err', err);
                            mHelper.toast('支付已取消,请重新支付');
                        }
                    });
                });
        }

        //挑战购物

        if (type == 'tiaoz') {
            console.log('我是tiaoz');
            await http
                .post(`${payEnge}`, {
                    product_id: params.product_id,
                    address_id: params.address_id,
                    task_id: params.task_id
                })
                .then(r => {
                    console.log(r);
                    uni.requestPayment({
                        provider: 'wxpay', // 微信支付
                        orderInfo: JSON.stringify(r.data), //微信订单数据 r.data.config
                        success: function() {
                            uni.hideLoading();
                            mHelper.toast('支付成功');
                            mRouter.redirectTo({
                                route: `/pages/createflag/ordersuccess?id=${r.data.flag_id}`
                            });
                        },
                        fail: function(err) {
                            uni.hideLoading();
                            console.log('err', err);
                            mHelper.toast('支付已取消,请重新支付');
                        }
                    });
                });
        }

        // #endif
        // // #ifndef APP-PLUS
        // await http
        // 	.post(`${payCreate}`, {
        // 		orderNo: orderNo,
        // 		payType: 'WXPAY'
        // 	})
        // 	.then(r => {

        // 		if (r.status) {
        // 			this.$mHelper.toast(r.msg)
        // 			return
        // 		}

        // 		// #ifdef H5
        // 		window.location.href = r.data.payUrl;
        // 		// #endif
        // 		 //#ifdef APP-PLUS
        // 		 plus.runtime.openURL(r.data.payUrl)
        // 		 //#endif
        // 	});
        // // #endif
    },

    /*
     *@des 支付宝支付
     *
     *@param order_group 订单:order;充值:recharge;
     *@param data 订单 {“order_id”:199} 充值 {“money”:100};
     */
    async aliPay(order_group, orderNo, route = '/pages/user/money/success') {
        // #ifdef MP-QQ
        mHelper.toast('QQ小程序不支持支付宝充值');
        return;
        // #endif
        // #ifdef MP-WEIXIN
        mHelper.toast('微信小程序不支持支付宝充值');
        return;
        // #endif
        await http
            .post(`${payCreate}`, {
                orderNo: orderNo,
                payType: 'ALIPAY'
            })
            .then(r => {
                if (r.status) {
                    this.$mHelper.toast(r.msg);
                    return;
                }

                // #ifdef H5
                window.location.href = r.data.payUrl;
                // #endif
                //#ifdef APP-PLUS
                plus.runtime.openURL(r.data.payUrl);
                //#endif
            });
    },

    /*
     *@des 余额支付
     *
     *@param data 支付参数
     */
    async balancePay(orderNo, route = '/pages/user/money/success') {
        await http
            .post(`${orderBuyByBalance}`, {
                orderNo: orderNo
            })
            .then(r => {
                if (r.status) {
                    mHelper.toast(r.msg);
                    return;
                }
                mRouter.redirectTo({
                    route
                });
            });
    }
};