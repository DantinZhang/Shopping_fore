//本文件是注册登录部分的仓库
import {reqRegisterCode} from '@/api';

const state = {
    registerCode: '',
};
const actions = {
    async getRegisterCode({commit}, phone) {
        try{
            let result = await reqRegisterCode(phone);
            commit('GETREGISTERCODE', result.data);
        }catch(err) {
            console.log(err.message);
        }
    }
};
const mutations = {
    GETREGISTERCODE(state, value){
        state.registerCode = value;
    }
};
const getters = {};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}