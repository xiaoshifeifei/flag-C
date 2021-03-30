//@ts-check
import { http } from './request';
import config from './../config/constData.config';
import { updateUri } from '../api/userInfo';
/**
//  * @typedef {{status:number,data:{id:number,version:string,string:"测试",appUrl:string}}} GetVersionRes
 */

/**
 * 获取本地版本信息
 * @returns {Promise<PlusRuntimeWidgetInfo>}
 */
let getWidgetInfo = () => {
    return new Promise(ok => {
        plus.runtime.getProperty(plus.runtime.appid, async widgetInfo =>
            ok(widgetInfo)
        );
    });
};

/**
 * 获取服务器版本信息
//  * @returns {Promise<GetVersionRes>}
 */
let getVersion = async() => {
    // if (!config.updateUri)
    //     return
    // /** @type {GetVersionRes} */
    if (uni.getSystemInfoSync().platform === 'android') {
        var client_system = 0;
    } else {
        var client_system = 1;
    }
    let ds = await http.get(updateUri, { client_system });
    return ds;
};

/**
 * 下载更新包
 * @param {string} url 下载地址
 * @returns {Promise<null|DownloadSuccessData>}
 */
let downloadWidget = url => {
    console.log('url', url);
    return new Promise(ok => {
        uni.downloadFile({
            url,
            success: downloadResult => ok(downloadResult),
            fail: () => ok(null)
        });
    });
};

/**
 * 解析版本号
 * @param {string} v 版本号
 * @returns {number}
 */
let parseVersion = v => {
    return Number(v.replace(/[^0-9]/gi, ''));
};

/**
 * 安装更新
 * @param {string} path 更新包路径
 * @returns {Promise<any>}
 */
let installWidget = path => {
    return new Promise(ok => {
        plus.runtime.install(
            path, {
                force: false
            },
            () => ok(null),
            err => ok(err)
        );
    });
};

/** 获取版本更新 */
export async function getAppUpdate() {
    // #ifdef APP-PLUS
    /** 获取客户端当前的版本信息 */
    let widgetInfo = await getWidgetInfo();
    uni.setStorageSync('bendiapp', widgetInfo)
        /** 获取服务器版本信息 */
    let d = await getVersion();
    if (d.code != 0) return false
    uni.setStorageSync('appdata', d.data);
    console.log('---->', widgetInfo);
    console.log('---->', d);
    let v1 = parseVersion(d.data.version);
    let v2 = parseVersion(widgetInfo.version); //客户端

    /** 对比版本号 */
    console.log(v1)
    console.log(v2) //客户
    console.log(d && d.code == 0 && d.data && v1 - v2 > 0);
    if (d && d.code == 0 && d.data && v1 - v2 > 0) {
        uni.setStorageSync('isNewVersion', true)
        let ok = true;
        /** 判断如果是 android 系统*/
        if (uni.getSystemInfoSync().platform === 'android') {
            /** 弹窗提示 */
            ok = await new Promise(ok => {
                uni.showModal({
                    title: '发现新版本,火速更新',
                    content: `${d.data.remark}`,
                    // content: `发现更新\n客户端版本：${parseVersion(
                    // 	widgetInfo.version
                    // )}\n服务端版本${parseVersion(d.data.version)}`,
                    confirmText: '更新',
                    cancelText: `${d.data.is_force==1?'':'取消'}`,
                    success: e => ok(e.confirm)
                });
            });
        }
        if (!ok) return '';
        /** 根据服务器返回的地址下载更新包 */
        let res = await downloadWidget(d.data.url);
        if (res && res.tempFilePath) {
            /** 安装更新包 重启App */
            let ds = await installWidget(res.tempFilePath);
            console.log('点击安装', ds);
            if (ds) {
                uni.showModal({
                    title: '更新失败',
                    content: `${ds.message}`,
                    success: function(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                        } else if (res.cancel) {
                            console.log('用户点击取消');
                        }
                    }
                });
            } else {
                // uni.showToast({
                //     title: '更新成功',
                //     duration: 2000
                // });
                uni.showModal({
                    title: '更新成功',
                    content: '已经更新到最新版本,快去体验吧!',
                    confirmText: '确定',
                    cancelText: ''
                });


                plus.runtime.restart();
            }
        }
    } else {
        uni.setStorageSync('isNewVersion', false)
    }
    // #endif
    return '';
}