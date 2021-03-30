/**
产品详情
 */


const productDetail = '/product/read';

// 任务列表
const taskList = '/task/list'; // 任务列表
const taskdetail = '/task/list'; // 任务详情
const addradd = '/addr/add'; // 添加地址
const addrlist = '/addr/list'; // 添加地址
const bankAdd = '/bank/add'; // 添加银行卡
const bankList = '/bank/list'; // 银行卡列表
const bankInfo = '/bank/info'; // 银行卡查看
const bankEdit = '/bank/edit'; // 银行卡编辑
const bankDel = '/bank/del'; // 银行卡删除













// 首页列表
const indexList = '/tiny-shop/v1/index/index';
// 首页列表
const uploadProduct = '/shop/commodity/uploading';
// 产品分类列表
const productCate = '/categories';
// 首页推荐分类
const productCateList = '/tiny-shop/v1/product/cate/list';
// 产品列表
const productList = '/products';
// 产品搜索列表
const productSearchList = '/products/searchList';

// 商家个人产品列表
const shopProList = '/shop/products';
// // 产品详情
// const productDetail = '/products/';
// 产品详情
const produTogtherlist = '/products/productGroupsItemInfo';
// 组合套餐详情
const combinationView = '/tiny-shop/v1/marketing/combination/view';
// 猜您喜欢
const guessYouLikeList = '/tiny-shop/v1/product/product/guess-you-like';
// 添加购物车
const cartItemCreate = '/carts';
// 购物车列表
const cartItemList = '/carts';
// 更新购物车
const updateCartList = '/carts/';
// 购物车数量
const cartItemCount = '/carts/products/sum';
// 删除购物车商品
const cartItemDel = '/carts/';
// 清空购物车
const cartItemClear = '/tiny-shop/v1/member/cart-item/clear';
// 修改购物车商品数量
const cartItemUpdateNum = '/carts/';
// 修改购物车商品sku
const cartItemUpdateSku = '/carts/';

// 品牌列表
const brandIndex = '/tiny-shop/v1/product/brand/index';

// 预创建订单
const orderPreCreate = '/orders';
// 购物车预创建订单
const cartPreCreate = '/createCategory';

const getPayUrl = '/getPayUrl';

// 订单余额购买
const orderBuyByBalance = '/orders/orderPaid';
// 订单预览
const orderPreview = '/orders';
// 订单预览
const orderUpdate = '/orders/updateOrderInfo';

// 取消未支付订单
const orderClose = '/tiny-shop/v1/member/order/close';
// 订单支付
const orderPay = '/tiny-shop/v1/common/pay/create';
// 选择快递运费计算
const orderFreightFee = '/tiny-shop/v1/order/order/freight-fee';

// 商品评价列表
const evaluateList = '/tiny-shop/v1/product/evaluate/index';

// 商品评价列表
const orderProductExpressDetails =
    '/tiny-shop/v1/member/order-product-express/details';

// 拼团
// 拼团产品
const wholesaleProductIndex = '/tiny-shop/v1/marketing/wholesale-product/index';
// 开团列表
const wholesaleIndex = '/tiny-shop/v1/marketing/wholesale/index';
// 开团详情
const wholesaleView = '/tiny-shop/v1/marketing/wholesale/view';
// 开团详情
const wholesaleGroupState = '/tiny-shop/v1/marketing/wholesale/group-state';
// 我的开团列表
const myWholesaleIndex = '/tiny-shop/v1/member/wholesale/index';

// 限时折扣
// 限时折扣列表
const discountProductIndex = '/tiny-shop/v1/marketing/discount-product/index';

// 团购
// 团购商品列表
const groupBuyIndex = '/tiny-shop/v1/marketing/group-buy/index';

// 砍价
// 砍价商品列表
const bargainProductIndex = '/tiny-shop/v1/marketing/bargain-product/index';
// 创建砍价
const bargainLaunchCreate = '/tiny-shop/v1/marketing/bargain-launch/create';
// 砍价详情
const bargainLaunchView = '/tiny-shop/v1/marketing/bargain-launch/view';
// 帮好友砍价
const bargainPartakeCreate = '/tiny-shop/v1/marketing/bargain-partake/create';
// 我的砍价列表
const bargainLaunchIndex = '/tiny-shop/v1/marketing/bargain-launch/index';

// 我的砍价列表
const miniProgramLiveIndex = '/tiny-shop/v1/marketing/mini-program-live/index';

// 我的砍价列表
const thirdPartyQrCode = '/tiny-shop/v1/third-party/qr-code';

export {
    indexList,
    uploadProduct,
    productCate,
    productCateList,
    productList,
    productSearchList,
    produTogtherlist,
    shopProList,
    guessYouLikeList,
    productDetail,
    combinationView,
    cartItemCreate,
    orderUpdate,
    cartItemList,
    cartItemDel,
    cartItemClear,
    cartItemUpdateNum,
    brandIndex,
    orderBuyByBalance,
    orderPreCreate,
    cartPreCreate,
    getPayUrl,
    orderClose,
    orderPay,
    orderFreightFee,
    evaluateList,
    orderPreview,
    orderProductExpressDetails,
    cartItemUpdateSku,
    cartItemCount,
    wholesaleProductIndex,
    wholesaleIndex,
    wholesaleView,
    wholesaleGroupState,
    myWholesaleIndex,
    discountProductIndex,
    groupBuyIndex,
    bargainProductIndex,
    bargainLaunchCreate,
    bargainLaunchView,
    bargainPartakeCreate,
    bargainLaunchIndex,
    miniProgramLiveIndex,
    thirdPartyQrCode,
    updateCartList,
    taskList,
    taskdetail,
    addradd,
    addrlist,
    bankAdd,
    bankList,
    bankInfo,
    bankEdit,
    bankDel
};