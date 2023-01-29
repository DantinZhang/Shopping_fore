//本文件用于存储购物车数据
import { reqShopCartList } from '@/api';

const state = {
  cartList: [],
};
const actions = {
  async getShopCartList({ commit }) {
    let result = await reqShopCartList();
    let cartList = result.data[0].cartInfoList
    console.log('购物车数据：', cartList);
    commit('GETSHOPCARTLIST', cartList)
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