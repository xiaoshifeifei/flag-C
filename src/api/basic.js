/**
 *@des 公用基础
 */
// 基础
const bannerList = '/conf?type=banner'; // 首页banner
// 商品列表
const productList = '/product/list'; // 商品列表
const falgdes = '/conf?type=falg_des'; // falg需知
const engedes = '/conf?type=enge_des'; // 挑战需知
// const smssend = '/sms/send'; // 商品详情
// 任务列表
const taskList = '/task/list'; // 任务列表
const taskdetail = '/task/list'; // 任务详情
const addradd = '/addr/add'; // 添加地址
// 支付
const payCreate = '/order/normal';
const payFlag = '/order/falg';
const payEnge = '/order/enge';
const paylist = '/order/orderLog';
const record = '/flag/record';

// 热门围观

const flaglist = '/flag/list'; //围观列表
const flagmelist = '/flag/melist'; //围观列表
const clickGive = '/flag/applause'; //点赞
const getMakeMoney = '/flag/onlook'; //围观赚钱
const getCommentPl = '/comment/sendByFlag'; //围观评论
const getCommentList = '/comment/list'; //围观评论
const getMyFlag = '/flag/myflag'; //我的flag


const getFlagRead = '/flag/read'; //我的flag
const getFlagLog = '/flag/flagLog'; //我的flag
const getupload = '/flag/upload'; //我的flag
const getflagsave = '/flag/save'; //我的flag





// 获取省市区列表
const provinceList = '/areaList';
// 收藏商品
const collectCreate = '/tiny-shop/v1/common/collect/create';
// 删除收藏商品
const collectDel = '/tiny-shop/v1/common/collect/delete';

// 分享/转发
const transmitCreate = '/tiny-shop/v1/common/transmit/create';

// 广告
// const advList = '/tiny-shop/v1/common/adv/index';
// const advView = '/tiny-shop/v1/common/adv/view';
const advList = '';
const advView = '';

//查询激励视频是否奖励成功 1-免登录 2-业务
const checkReward1 =
    '/checkReward/123457?token=FD52D1881FFB89F2CAE82640165433DB';
const checkReward2 = '/checkReward/123457';

// 配置
const configList = '/tiny-shop/v1/common/config/index';

// // 首页banner
// const bannerList = '/bannerList';
// 首页
const indexConfig = '/indexConfig';

// 充值
// const payCreate = '/getPayUrl';

// 充值配置
const wechatConfig = '/tiny-shop/v1/third-party/wechat-js-sdk';

// 公告
// 公告列表
const notifyAnnounceIndex = '/noticeList';
// 公告详情
const notifyAnnounceView = '/notices';

// 版本检测
const versionsIndex = '/app-versions/versions/index';

// 版本检测
const pickupPointIndex = '/tiny-shop/v1/common/pickup-point/index';

// 站点帮助-列表
const helperIndex = '/tiny-shop/v1/common/helper/index';
// 站点帮助-详情
const helperView = '/tiny-shop/v1/common/helper/view';

// 设备绑定(app推送)
const bindingEquipment = '/tiny-shop/v1/member/auth/binding-equipment';
// 查询绑定状态
const authIsBinding = '/tiny-shop/v1/member/auth/is-binding';
// 第三方绑定
const authCreate = '/tiny-shop/v1/member/auth/create';

export {
    indexConfig,
    bannerList,
    provinceList,
    collectCreate,
    collectDel,
    transmitCreate,
    advList,
    advView,
    payCreate,
    configList,
    wechatConfig,
    notifyAnnounceIndex,
    notifyAnnounceView,
    versionsIndex,
    pickupPointIndex,
    helperIndex,
    helperView,
    bindingEquipment,
    authIsBinding,
    authCreate,
    checkReward1,
    checkReward2,
    productList,
    falgdes,
    engedes,
    // smssend,
    taskList,
    taskdetail,
    addradd,
    payFlag,
    payEnge,
    paylist,
    flaglist,
    clickGive,
    getMakeMoney,
    getCommentPl,
    flagmelist,
    getMyFlag,
    getFlagRead,
    getFlagLog,
    getupload,
    getflagsave,
    getCommentList,
    record
};