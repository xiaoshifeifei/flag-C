/* eslint-disable */
import Request from './request';
import mRouter from '@/utils/router';
import { refreshToken } from '@/api/login';
import indexConfig from '@/config/index.config';
import mHelper from '@/utils/helper';
import store from '@/store';

const http = new Request();

// request全局参数设置
http.setConfig(config => {
    /* 设置全局配置 */
    config.baseUrl = indexConfig.baseUrl; /* 根域名不同 */
    const systemInfo = uni.getSystemInfoSync();
    const systemInfoHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    };
    config.header = {
        ...config.header,
        ...systemInfoHeaders
    };
    return config;
});

let isRefreshing = false;
let requests = [];
http.interceptor.request(
    config => {
        console.log(config.url);
        /* 请求之前拦截器 */
        // authorization
        config.header['authorization'] =
            'Bearer ' + uni.getStorageSync('accessToken');
        // 单商户
        // config.header['merchant-id'] = uni.getStorageSync('merchantId') || 1;
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
);

// 刷新refreshToken
async function handleRefreshToken(refresh_token) {
    const params = {};
    // params.group = mHelper.platformGroupFilter();
    params.refresh_token = refresh_token;
    await http.post(refreshToken, params).then(async r => {
        // if (r.code == 1001) {
        //     store.commit('logout');
        //     return false;
        // }
        store.commit('login', r.data);
        isRefreshing = false;
    });
}
http.interceptor.response(
    async response => {
        /* 请求之后拦截器 */
        // if (response.statusCode == 200) {
        //     return response.data;
        // }
        switch (response.data.code) {
            // switch (response.statusCode) {
            case 0:
                return response.data;
            case 8030:
                return (response.data = []);
            case 1001:
                isRefreshing = false;
                // refreshToken 的返回状态为1001
                if (response.config.url === refreshToken) {
                    uni.removeStorageSync('accessToken');
                    await store.commit('logout');
                    uni.showModal({
                        content: '会话已过期，是否跳转登录页面？',
                        success: confirmRes => {
                            if (confirmRes.confirm) {
                                mHelper.backToLogin();
                                throw response.data.message;
                            }
                        }
                    });
                    break;
                } else {
                    // 如果refreshToken为空 则直接跳转登录
                    if (!store.state.refreshToken) {
                        uni.removeStorageSync('accessToken');
                        await store.commit('logout');
                        uni.showModal({
                            content: '您还未登录，是否跳转登录页面？',
                            success: confirmRes => {
                                if (confirmRes.confirm) {
                                    mHelper.backToLogin();
                                    throw response.data.message;
                                } else {
                                    mRouter.switchTab({
                                        route: '/pages/index/index'
                                    });
                                }
                            }
                        });
                        throw response.data.message;
                    } else {
                        // isRefreshing同一个页面只执行一次
                        if (!isRefreshing) {
                            isRefreshing = true;
                            // 刷新token
                            await handleRefreshToken(store.state.refreshToken, response);
                            requests.forEach(cb => cb());
                            requests = [];
                            isRefreshing = false;
                            return http.request(response.config);
                        } else {
                            return new Promise(resolve => {
                                // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                                requests.push(() => {
                                    resolve(http.request(response.config));
                                });
                            });
                        }
                    }
                }
                break;
                // case 405:
                // 	mHelper.toast('当前操作不被允许');
                // 	return Promise.reject(response.data.message);
                // case 404:
                // 	mHelper.toast('404了老铁');
                // 	return Promise.reject(response.data.message);
                // case 429:
                // 	mHelper.toast('请求过多，先休息一下吧');
                // 	return Promise.reject(response.data.message);
                // case 500:
                // 	mHelper.toast('服务器打瞌睡了');
                // 	return Promise.reject(response.data.message);
            default:
                mHelper.toast(response.data.msg);
                return Promise.reject(response.data.msg);
        }
    },
    error => {
        // console.log('1111', error.statusCode);
        switch (error.statusCode) {
            case 400:
                mHelper.toast('错误的请求');
                // return Promise.reject(response.data.message);
                break;
            case 405:
                mHelper.toast('当前操作不被允许');
                break;
            case 404:
                mHelper.toast('404了老铁~');
                break;
            case 429:
                mHelper.toast('请求过多，先休息一下吧');
                break;
            case 500:
                mHelper.toast('服务器打瞌睡了,请检查网络,或者退出重新登录');
                break;
            default:
                return Promise.reject(error);
        }

        // return Promise.reject(error);
    }
);

export { http };