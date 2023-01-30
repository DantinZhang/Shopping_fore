//本文件用于存储购物车数据
import { reqShopCartList,changeIsChecked } from '@/api';

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
      try {
        let promise = dispatch('changeChecked', {skuId: el.skuId, state: isChecked});
        promiseArr.push(promise);
      } catch(err) {
        console.log(`${el.skuNam}修改失败`,err);
      }
    });
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