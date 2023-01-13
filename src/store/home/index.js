import { reqCategoryList, reqBannerList, reqFloorList } from '@/api';
//本文件用于配置home模块的数据
export const home = {
    namespaced: true,
    state: {
        //服务器返回对象，初始值就是对象，服务器返回数组，初始值就是数组
        categoryList: [],   //三级联动的数据
        bannerList: [],   //上边轮播图的数据
        floorList: []    //floor的数据
    },
    actions: {
        //通过api/index.js里面的接口函数调用，向服务器发请求，获取服务器数据
        //1.获取三级联动部分的数据
        async categoryList(context) {
            //await后面等待结果，如果请求成功，再往下走
            let result = await reqCategoryList();
            if (result.code === 200) {
                context.commit('CATEGORYLIST', result.data);
            }
        },
        //2.获取轮播图部分的数据
        async getBannerList(context) {
            let result = await reqBannerList();
            if (result.code === 200) {
                context.commit('GETBANNERLIST', result.data);
            }
        },
        //3.获取floor部分的数据
        async getFloorList({ commit: dj }) {   //解构赋值，起名dj
            let result = await reqFloorList();
            if (result.code === 200) {
                dj('GETFLOORLIST', result.data);
            }
        }
    },
    mutations: {
        //1.操作三级联动的数据
        CATEGORYLIST(state, value) {
            state.categoryList = value.slice(0, 15);
        },
        //2.操作轮播图的数据
        GETBANNERLIST(state, value) {
            state.bannerList = value;
        },
        //3.操作floor的数据
        GETFLOORLIST(state, value) {
            state.floorList = value;
        }
    },
    getters: {}
}