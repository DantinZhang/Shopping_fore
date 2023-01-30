//本文件用于存储购物车数据
import { reqShopCartList,changeIsChecked,reqDeleteGoodById } from '@/api';

const state = {
  cartList: [],
};

const actions = {
  //1.请求购物车数据
  async getShopCartList({ commit }) {
    let result = await reqShopCartList();
    let cartList = result.data[0].cartInfoList
    console.log('购物车数据：', cartList);
    commit('GETSHOPCARTLIST', cartList)
  },

  //2.修改购物车产品的勾选状态
  async changeChecked(context, {skuId, state}) {
    let result = await changeIsChecked(skuId,state);
    console.log('成功',result);
  },

  //3.点击全选按钮修改其他商品状态
  changeAllStates({dispatch, state}, isChecked) {
    let promiseArr = [];
    state.cartList.forEach( el => {
        let promise = dispatch('changeChecked', {skuId: el.skuId, state: isChecked});
        promiseArr.push(promise);
    });
    return Promise.all(promiseArr);
  },

  //4.删除购物车某条数据,第一个参数别忘了噢
  async deleteOneGood(context,skuId) {
    try{
      let result = await reqDeleteGoodById(skuId);
      console.log('删除成功',result);
    }catch(err) {
      console.log('错误！！嗷嗷嗷',err)
    }
  },

  //5.删除选中的所有商品
  deleteAllGoods({dispatch,state}) {
    //利用Promise.all来给组件反馈成功或失败
    let promiseArr = [];
    state.cartList.forEach(el => {
      if(el.isChecked == 0) return;
      if(el.isChecked == 1) { 
        let promise = dispatch('deleteOneGood', el.skuId);
        promiseArr.push(promise);
      }
    })
    return Promise.all(promiseArr);
  }
};

const mutations = {
  GETSHOPCARTLIST(state, value) {
    state.cartList = value;
  }
};
const getters = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}