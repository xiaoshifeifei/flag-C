// 网络监听
const NetWork = {
    // 网络状态
    isConnect: false,
    // 监听网络状态
    On() {
        // 获取当前网络状态
        uni.getNetworkType({
            success: res => {
                if (res.networkType !== 'none') {
                    this.isConnect = true;
                    return;
                }

                uni.showModal({
                    title: '请先连接网络'
                });
            }
        });
        // 监听网络状态变化
        uni.onNetworkStatusChange(res => {
            this.isConnect = res.isConnected;
            if (!res.isConnected) {
                uni.showModal({
                    title: '提示',
                    content: '您目前处于断网状态,请先连接网络'
                });
            }
        });
    }
};
export default {
    NetWork
};