//本文件用于存储Detail详情页的数据
import { reqDetailData, reqShopCarMsg } from '@/api';
export const detail = {
    namespaced: true,
    state: {
        detailData: {}
    },
    actions: {
        //异步请求，拿到详情页数据
        async getDetailData(context, skuId) {
            let result = await reqDetailData(skuId);
            if (result.code === 200) {
                context.commit('GETDETAILDATA', result.data);
            }
        },
        //加入购物车
        //异步请求，把商品id和数量发送给服务器，参数解构赋值并自己起名
        async sendShopCarMsg(context, { skuId: id, skuNum: num }) {
            let result = await reqShopCarMsg(id, num);
            //这里只是把购物车数据给服务器，但是服务器不需要返回什么东西
            //所以这里我们不用再三连环了，通过dispatch把数据给服务器就已经欧了
            console.log(result.code);
            if (result.code === 200) {
                //返回的是成功的标记
                return 'ok';
            } else {
                //返回的是失败的标记
                return Promise.reject(new Error('faile'));
            }
        }
    },
    mutations: {
        GETDETAILDATA(state, value) {
            state.detailData = value;
        }
    },
    //简化数据
    getters: {
        categoryView(state) {
            //因为返回的时候可能异步操作还没把数据请求过来，所以要加个或空
            //服务器数据回来后，把state中的原数据替换，getters就能读到值，然后重新响应
            return state.detailData.categoryView || {};
        },
        skuInfo(state) {
            return state.detailData.skuInfo || {};
        },
        spuSaleAttrList(state) {
            return state.detailData.spuSaleAttrList || [];
        },
    }
}