const CONFIG = {
    // 开发环境配置
    development: {
        assetsPath: '/static', // 静态资源路径
        // baseUrl: 'http://47.92.198.159:8080', // 后台接口请求地址
        baseUrl: 'http://flagcapi.qmwlxcx.com/api', // 后台接口请求地址
        // baseUrl: '', // 后台接口请求地址
        // hostUrl: 'http://47.92.198.159:8080', // H5地址(前端运行地址)
        // baseUrl: '', // 后台接口请求地址
        // hostUrl: '', // H5地址(前端运行地址)
        websocketUrl: '', // websocket服务端地址
        weixinAppId: '' // 微信公众号appid
    },
    // 生产环境配置
    production: {
        assetsPath: '/static', // 静态资源路径
        baseUrl: 'http://flagcapi.qmwlxcx.com/api', // 后台接口请求地址 生产:165.238  开发:198.159
        // hostUrl: 'http://47.92.165.238:8080', // H5地址(前端运行地址)
        // baseUrl: 'http://localhost:8080', // 后台接口请求地址
        // hostUrl: 'http://localhost:8080', // H5地址(前端运行地址)
        websocketUrl: '', // websocket服务端地址
        weixinAppId: '' // 微信公众号appid
    }

};
export default CONFIG[process.env.NODE_ENV];
