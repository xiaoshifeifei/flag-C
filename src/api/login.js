/**
 *@des 登录注册相关接口
 *@param login.js
 */

//flag购 start
// 登录获取手机验证码
const smsLogCode = '/sms/send';

// 手机验证码注册登录
const registerByPass = '/sms/login';

// 注册获取手机验证码
const smsRegCode = '/sms/send';
// 刷新token
const refreshToken = '/refresh';
// 退出登录
const logout = '/logout';
//flag购 end































// // 密码注册
// const registerByPass = '/user/register';

// 密码登录
const loginByPass = '/user/login';

// 微信授权登录
const wechatH5Login = '/tiny-shop/v1/third-party/wechat';

// 微信小程序授权登录
const mpWechatLogin = '/tiny-shop/v1/third-party/wechat-mp';

// App微信授权登录
const thirdPartyWechatOpenPlatform =
    '/tiny-shop/v1/third-party/wechat-open-platform';

// 密码重置
const updatePassword = '/user/retrieve';

// 第三方绑定
const authLogin = '/tiny-shop/v1/member/auth/create';

// 查询绑定状态
const isBindingCheck = '/tiny-shop/v1/member/auth/is-binding';

// 手机号登录
const loginBySmsCode = '/tiny-shop/v1/site/mobile-login';

// 注册获取手机验证码
// const smsRegCode = '/user/sendRegisteredCode';
// // 登录获取手机验证码
// const smsLogCode = '/user/sendLoginCode';
// 修改密码获取手机验证码
const smsChangePwdCode = '/user/sendRetrieveCode';

// 退出登录
// const logout = '/user/logout';

// 刷新token
// const refreshToken = '/tiny-shop/v1/site/refresh';

// 登录令牌有效性检测
const verifyAccessToken = '/tiny-shop/v1/site/verify-access-token';

export {
    registerByPass,
    loginByPass,
    isBindingCheck,
    wechatH5Login,
    mpWechatLogin,
    thirdPartyWechatOpenPlatform,
    authLogin,
    updatePassword,
    smsRegCode,
    smsLogCode,
    smsChangePwdCode,
    loginBySmsCode,
    logout,
    refreshToken,
    verifyAccessToken
};