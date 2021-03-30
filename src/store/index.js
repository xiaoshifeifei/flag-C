import Vue from 'vue';
import Vuex from 'vuex';
import $mConstDataConfig from '@/config/constData.config';
import $mSettingConfig from '@/config/setting.config';

Vue.use(Vuex);
const ACCESSTOKEN = uni.getStorageSync('accessToken') || '';
const REFERRER = uni.getStorageSync('referrer') || '';
const USER = uni.getStorageSync('user') || {};
const REFRESHTOKEN = uni.getStorageSync('refreshToken') || '';
const GLOBALCONFIG = uni.getStorageSync('globalConfig') || {};
const CARTNUM = uni.getStorageSync('cartNum') || 0;
const NOTIFYNUM = uni.getStorageSync('notifyNum') || 0;
const IMHISTORY = uni.getStorageSync('imHistory') || [];
const IMNOREAD = uni.getStorageSync('imNoRead') || 0;
const THEMECOLOR = uni.getStorageSync('themeColor');
const USERNAME = uni.getStorageSync('loginusername') || '';
const store = new Vuex.Store({
    state: {
        // 用户token
        accessToken: ACCESSTOKEN,
        // 用户信息
        userInfo: USER,
        // 推荐人
        referrer: REFERRER,
        username: USERNAME,
        // 小程序openid
        openId: '',
        // 网络状态，用于下载提醒
        networkState: 'unknown',
        globalConfig: GLOBALCONFIG,
        refreshToken: REFRESHTOKEN,
        // 购物车数字角标
        cartNum: CARTNUM,
        // 消息中心数字角标
        notifyNum: NOTIFYNUM,
        // 历史聊天消息，仅保存最后100条
        imHistory: IMHISTORY,
        // 当前未读聊天消息数量
        imNoRead: IMNOREAD,
        // 当前是否处于聊天面板
        isImPanel: false,
        // 当前是否人工客服服务
        isStuffService: false,
        themeColor: THEMECOLOR,
        // 商品分类
        categories: []
    },
    getters: {
        // 全局配置
        themeColor: state => {
            let theme = state.themeColor;
            if (!theme) {
                theme = $mConstDataConfig.themeList.filter(
                    item => item.name === ($mSettingConfig.styleType || 'orange')
                )[0];
            }
            return theme;
        },
        // 全局配置
        globalConfig: state => {
            return state.globalConfig;
        },
        // 全局分类
        categories: state => {
            return state.categories;
        },
        // 获取网络状态
        networkStatus: state => {
            return state.networkState;
        },
        // 判断用户是否登录
        hasLogin: state => {
            return !!state.accessToken;
        }
    },
    mutations: {
        login(state, provider) {
            // console.log(provider)
            state.accessToken = provider.token;
            state.refreshToken = provider.refresh_token;
            state.username = provider.username;
            uni.setStorageSync('loginusername', provider.username)
            uni.setStorageSync('accessToken', provider.token);
            uni.setStorageSync('refreshToken', provider.refresh_token);
        },
        logout(state) {
            state.accessToken = '';
            state.refreshToken = '';
            state.username = '';
            state.userInfo = {};
            uni.removeStorageSync('accessToken');
            uni.removeStorageSync('loginusername');
            uni.removeStorageSync('refreshToken');
            uni.removeStorageSync('userInfo');
        },
        setReferrer(state, referrer) {
            state.referrer = referrer;
            uni.setStorageSync('referrer', referrer);
        },
        setOpenId(state, openId) {
            state.openId = openId;
            uni.setStorageSync('openId', openId);
        },
        setNetworkState(state, provider) {
            state.networkState = provider;
        },
        setCartNum(state, provider) {
            state.cartNum = provider;
            uni.setStorageSync('cartNum', provider);
            if (!provider || parseInt(provider, 10) === 0) {
                uni.removeTabBarBadge({
                    index: $mConstDataConfig.cartIndex
                });
            } else {
                uni.setTabBarBadge({
                    index: $mConstDataConfig.cartIndex,
                    text: provider.toString()
                });
            }
        },
        setCategories(state, provider) {
            state.categories = provider;
        },
        setNotifyNum(state, provider) {
            state.notifyNum = provider;
            uni.setStorageSync('notifyNum', provider);
            if (parseInt(provider, 10) === 0) {
                uni.removeTabBarBadge({
                    index: $mConstDataConfig.notifyIndex
                });
            } else {
                uni.setTabBarBadge({
                    index: $mConstDataConfig.notifyIndex,
                    text: provider.toString()
                });
            }
        },
        setGlobalConfig(state, provider) {
            state.globalConfig = provider;
            uni.setStorageSync('globalConfig', provider);
        },
        addImHistory(state, provider) {
            if (provider) {
                let data = state.imHistory;
                data.push(provider);
                uni.setStorageSync('imHistory', data);
                state.imHistory = data;
                if (!state.isImPanel) {
                    this.commit('addImNoRead', 1);
                }
            }
        },
        clearImHistory(state) {
            state.imHistory = [];
            uni.setStorageSync('imHistory', []);
            state.imNoRead = 0;
            uni.setStorageSync('imNoRead', 0);
        },
        addImNoRead(state, provider) {
            state.imNoRead = state.imNoRead + provider;
            // if (state.imNoRead > $mAppConfig.imHisotryNum) {
            // 	state.imNoRead = $mAppConfig.imHisotryNum;
            // }
            uni.setStorageSync('imNoRead', state.imNoRead);
        },
        setIsImPanel(state, provider) {
            state.isImPanel = provider;
            if (provider) {
                state.imNoRead = 0;
                uni.setStorageSync('imNoRead', 0);
            }
        },
        setIsStuffService(state, provider) {
            state.isStuffService = provider;
        },
        setThemeColor(state, val) {
            state.themeColor = val;
            uni.setStorageSync('themeColor', val);
        }
    },
    actions: {
        globalConfigChange({ commit }, info) {
            commit('setGlobalConfig', info);
        },
        networkStateChange({ commit }, info) {
            commit('setNetworkState', info);
        },
        logout({ commit }) {
            commit('logout');
        }
    }
});

export default store;