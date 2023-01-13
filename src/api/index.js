//本文件用于：API的统一管理
import requests from './request';  //axios请求后台ajax数据
import mockRequests from './mockRequest';  //axios请求后台mock数据

//1.三级联动（导航部分）的接口
// 地址：/api/product/getBaseCategoryList get 无参数
export const reqCategoryList = function () {
    //发请求,返回一个axios请求，而axios请求又返回一个Promise
    return requests({
        url: '/product/getBaseCategoryList',
        method: 'get'
    });
}

//2.上边轮播图部分的接口
//  地址：/mock/banner
export const reqBannerList = function () {
    //发请求另外一种写法
    return mockRequests.get('/banner');
}

//3.floor部分的接口
//  /mock/floor
export const reqFloorList = () => mockRequests.get('/floor');

//4.Search模块的接口
// 地址：/api/list  post 需要带参数，且参数params至少有个默认值（空对象{}）否则会请求失败
export const reqSearchInfo = function (params) {
    return requests({
        url: '/list',
        method: 'post',
        data: params  //请求体参数
    })
}

//5.Detail模块的接口
//地址：/api/item/{ skuId }  get  参数skuId商品Id，必选,这里地址意思是解构赋值，不是对象
export const reqDetailData = function (skuId) {
    return requests({
        url: `/item/${skuId}`,
        method: 'get',
    })
}


//6.添加到购物车的接口(对已有物品进行数量改动)
// 地址：/api/cart/addToCart/{ skuId }/{ skuNum }  post  参数skuId和skuNum
// 这个请求只需要给服务器发数据，不需要返回什么东西
export const reqShopCarMsg = (skuId, skuNum) => {
    return requests.post(`/cart/addToCart/${skuId}/${skuNum}`);
}
