/**
 *@des 个人中心相关接口
 
 */

// 创建收货地址
const addressCreate = '/addr/add';

// 删除收货地址
const addressDelete = '/addr/del';


// 默认收货地址
const addressDetail = '/addr/read';

const addressUpdate = '/addr/edit';
const profileme = '/profile/me';
const serviceTel = '/conf?type=service_tel';
const balance = '/profile/balance';
const profileCash = '/profile/cash';
const vipConfig = '/conf?type=vip_config';
const cashRule = '/conf?type=cash_rule';
const feedback = '/profile/feedback';
const setVip = '/order/setVip';
const orderFlagset = '/flag/set';

// 获取我的订单
const orderList = '/order/orderList';
// 取消订单
const cancelPay = '/order/cancelPay';
// 确认收货
const changestatus = '/order/changestatus';
// 继续支付
const contPay = '/order/contPay';

const updateUri = '/version/new'; //版本更新
const appShare = '/conf?type=app_share'; //版本更新













// 个人信息
const memberInfo = '/user';
// 个人信息
const memberOtherInfo = '/userInfo';
// 商家申请
const storeApply = '/shop/apply';
const storeApplyInfo = '/shop/info';
const storeProNumInfo = '/hotPre';
const userTeam = '/userTeam';
// 个人信息修改
const memberUpdate = '/tiny-shop/v1/member/member/update';
// 个人信息修改
const openVip = '/openVip';
// 个人信息修改
const openAgent = '/openAgent';

// 收货地址列表
const addressList = '/shippings';
// 默认收货地址
const addressDefault = '/tiny-shop/v1/member/address/default';
// 默认收货地址
// const addressDetail = '/shippingId';
// // 创建收货地址
// const addressCreate = '/shippings';
// // 更新收货地址
// const addressUpdate = '/shippings/';
// // 删除收货地址
// const addressDelete = '/shippings/';
// flag记录
const togtherList = '/fightGroupsItem';
// 申请提现
const toWithdraw = '/rechargeAmount';

// 获取优惠券列表
const couponList = '/getUserPrizeList';
// 获取我的优惠券列表
const myCouponList = '/tiny-shop/v1/member/coupon/index';
// 优惠券详情
const couponDetail = '/tiny-shop/v1/marketing/coupon-type/view';
// 领取优惠券
const couponReceive = '/tiny-shop/v1/marketing/coupon-type/create';
const couponClear = '/tiny-shop/v1/member/coupon/clear';
const prizeList = '/getGiftList';
const newestPriList = '/getAllPrizeList';
const getPrize = '/luckyPrize';

// // 获取我的订单
// const orderList = '/orders';
// 取消订单
const cancleOrder = '/orders/';
// 订单确认收货
const orderTakeDelivery = '/orders/determineReceived';
// 订单确认发货
const orderMakeDelivery = '/orders/determineDelivery';
// 退货/退款申请
const orderRefundApply = '/tiny-shop/v1/member/order-product/refund-apply';
// 产品退货提交物流
const orderProductSalesReturn =
    '/tiny-shop/v1/member/order-product/refund-sales-return';
// 关闭退货/退款申请
const closeOrderRefundApply = '/tiny-shop/v1/member/order-product/refund-close';
// 获取订单详情
const orderDetail = '/orders/';
// 删除已关闭订单
const orderDelete = '/tiny-shop/v1/member/order/delete';

// 获取我的足迹
const footPrintList = '/tiny-shop/v1/member/footprint/index';
// 删除我的足迹
const footPrintDel = '/tiny-shop/v1/member/footprint/delete';

// 收藏列表
const collectList = '/tiny-shop/v1/member/collect/index';

// 积分余额日志
const creditsLogList = '/payInfo';

// 创建订单评价
const evaluateCreate = '/tiny-shop/v1/member/evaluate/create';
// 追加评价
const evaluateAgain = '/tiny-shop/v1/member/evaluate/again';
// 订单商品
const orderProductIndex = '/tiny-shop/v1/member/order-product/index';

// 发票列表
const invoiceList = '/tiny-shop/v1/member/invoice/index';
// 发票列表
const invoiceCreate = '/tiny-shop/v1/member/invoice/create';
// 发票编辑
const invoiceUpdate = '/tiny-shop/v1/member/invoice/update';
// 发票详情
const invoiceDetail = '/tiny-shop/v1/member/invoice/view';
// 默认发票
const invoiceDefault = '/tiny-shop/v1/member/invoice/default';
// 删除发票
const invoiceDel = '/tiny-shop/v1/member/invoice/delete';
// 开票列表
const orderInvoiceList = '/tiny-shop/v1/member/order-invoice/index';
// 发票补领
const orderInvoiceCreate = '/tiny-shop/v1/member/order-invoice/create';

// 意见反馈列表
const opinionList = '/tiny-shop/v1/member/opinion/index';
// 意见反馈创建
const opinionCreate = '/tiny-shop/v1/member/opinion/create';
// 意见反馈详情
const opinionDetail = '/tiny-shop/v1/member/opinion/view';

// 第三方授权列表
const thirdPartyAuthList = '/tiny-shop/v1/member/auth/index';
// 解除第三方授权列表
const thirdPartyAuthDelete = '/tiny-shop/v1/member/auth/delete';

// 充值金额
const rechargeConfigIndex = '/tiny-shop/v1/member/recharge-config/index';

const recharge = '/createPayInfo';

// 订单售后
// 申请退款/退货
const orderCustomerRefundApply = '/tiny-shop/v1/member/order-customer/apply';
// 退货提交物流
const orderCustomerSalesReturn =
    '/tiny-shop/v1/member/order-customer/sales-return';
// 退款/退货关闭申请
const orderCustomerRefundClose = '/tiny-shop/v1/member/order-customer/close';

// 上传图片
const uploadImage = '/file/upload';

// 消息通知
// 消息列表
const notifyIndex = '/tiny-shop/v1/member/notify/index';
// 消息详情
const notifyView = '/tiny-shop/v1/member/notify/view';
// 单个消息阅读
const notifyRead = '/tiny-shop/v1/member/notify/read';
// 全部已读
const notifyReadAll = '/tiny-shop/v1/member/notify/read-all';
// 删除一条或者多条
const notifyClear = '/tiny-shop/v1/member/notify/clear';
// 清空消息记录
const notifyClearAll = '/tiny-shop/v1/member/notify/clear-all';
// 未读消息个数
const notifyUnRreadCount = '/tiny-shop/v1/member/notify/un-read-count';
// 消息提醒配置
const notifySubscriptionConfigIndex =
    '/tiny-shop/v1/member/notify-subscription-config/index';
// 修改消息提醒配置
const notifySubscriptionConfigUpConfig =
    '/tiny-shop/v1/member/notify-subscription-config/up-config';

// 虚拟码列表
const orderProductVirtualIndex =
    '/tiny-shop/v1/member/order-product-virtual/index';
// 虚拟码详情
const orderProductVirtualView =
    '/tiny-shop/v1/member/order-product-virtual/view';
// 虚拟码详情
const productVirtualVerificationVerify =
    '/tiny-shop/v1/order/product-virtual-verification/verify';

// 会员等级
const memberLevelIndex = '/vip/buyPackageList';


//最后一次提现记录
const lastPayInfo = '/lastPayInfo'

//修改支付密码 POST  username 账号手机号码  password 密码   verification 验证码
const payPassword = '/user/retrievePayPassword'
    //验证支付密码 POST  payPassword 密码
const validationPayPassword = '/user/validationPayPassword'
    //查询支付密码是否存在
const hasPayPassword = '/user/isPayPassword'
    //查询拼团人数
const userLevelTeam = '/userLevelTeam'

export {
    payPassword,
    validationPayPassword,
    hasPayPassword,
    userLevelTeam,
    memberInfo,
    memberOtherInfo,
    memberUpdate,
    storeApply,
    storeApplyInfo,
    recharge,
    openVip,
    openAgent,
    userTeam,
    storeProNumInfo,
    toWithdraw,
    addressList,
    addressCreate,
    addressDefault,
    addressDetail,
    addressUpdate,
    addressDelete,
    togtherList,
    couponList,
    myCouponList,
    couponClear,
    couponDetail,
    prizeList,
    newestPriList,
    getPrize,
    orderList,
    orderRefundApply,
    closeOrderRefundApply,
    orderProductSalesReturn,
    orderDetail,
    orderDelete,
    orderTakeDelivery,
    orderMakeDelivery,
    couponReceive,
    footPrintList,
    footPrintDel,
    collectList,
    creditsLogList,
    evaluateCreate,
    evaluateAgain,
    invoiceList,
    invoiceCreate,
    invoiceUpdate,
    invoiceDetail,
    invoiceDefault,
    invoiceDel,
    orderInvoiceCreate,
    orderInvoiceList,
    uploadImage,
    opinionList,
    opinionCreate,
    opinionDetail,
    thirdPartyAuthList,
    thirdPartyAuthDelete,
    rechargeConfigIndex,
    orderCustomerSalesReturn,
    orderCustomerRefundApply,
    orderCustomerRefundClose,
    orderProductIndex,
    notifyIndex,
    notifyView,
    notifyRead,
    notifyReadAll,
    notifyClear,
    notifyClearAll,
    notifyUnRreadCount,
    notifySubscriptionConfigUpConfig,
    notifySubscriptionConfigIndex,
    orderProductVirtualIndex,
    orderProductVirtualView,
    productVirtualVerificationVerify,
    memberLevelIndex,
    cancleOrder,
    lastPayInfo,
    profileme,
    cancelPay,
    contPay,
    vipConfig,
    setVip,
    updateUri,
    balance,
    profileCash,
    orderFlagset,
    serviceTel,
    feedback,
    changestatus,
    appShare,
    cashRule
};