module.exports = {
    devServer: {
        port: 9999,
        hot: true,
        clientLogLevel: 'warning',
        open: true,
        disableHostCheck:true,
        overlay: {
            warnings: true,
            errors: true
        }
        // ,
        // proxy: {
        // 	'/': {
        // 		target: `http://flagcapi.qmwlxcx.com/api`,
        // 		changeOrigin: true,
        //         secure:false,
        // 		pathRewrite: {
        // 			'^/': ''
        // 		}
        // 	}
        // }
    }
};