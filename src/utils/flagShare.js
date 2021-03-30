export default {
    shareFriend(data) {
        //分享到微信朋友
        uni.share({
            provider: 'weixin',
            scene: 'WXSceneSession',
            type: 0,
            href: data.href, //这地址太长了，就省略了
            title: data.title,
            summary: data.summary,
            imageUrl: data.imageUrl,
            success: res => {
                console.log('success:' + JSON.stringify(res));
            },
            fail: function(err) {
                this.$mHelper.toast('分享失败');
                console.log('fail:' + JSON.stringify(err));
            }
        });
    },

    // 分享到微信朋友圈
    shareFriendcricle(data) {
        uni.share({
            provider: 'weixin',
            scene: 'WXSenceTimeline',
            type: 0,
            href: data.href, //这地址太长了，就省略了
            title: `${data.title} ${data.summary}`,
            summary: `${data.title} ${data.summary}`,
            imageUrl: data.imageUrl,
            success: res => {
                console.log('success:' + JSON.stringify(res));
            },
            fail: function(err) {
                console.log('fail:' + JSON.stringify(err));
            }
        });
    }
};