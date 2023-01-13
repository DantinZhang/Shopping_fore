//本文件用于配置search模块的数据
import { reqSearchInfo } from '@/api'
export const search = {
    namespaced: true,
    state: {
        searchInfo: {}
    },
    actions: {
        async getSearchInfo(context, params = {}) {
            let result = await reqSearchInfo(params);  //这里至少要传一个默认参数：空对象，否则请求不成功
            if (result.code === 200) {
                context.commit('GETSEARCHINFO', result.data);
            }
        }
    },
    mutations: {
        GETSEARCHINFO(state, value) {
            state.searchInfo = value;
        }
    },
    //getters类似计算属性，可以简化仓库中的数据
    getters: {
        //当前形参是当前仓库的state
        goodsList(state) {
            //要等searchInfo的数据拿回来了再返回值，要不然可能就直接拿空对象了
            return state.searchInfo.goodsList || [];  //如果没网返回空数组
        },
        attrsList(state) {
            return state.searchInfo.attrsList || [];
        },
        trademarkList(state) {
            return state.searchInfo.trademarkList || [];
        },
        //商品的数据的总数
        total(state) {
            return state.searchInfo.total;
        }
    }
}