//本文件是注册登录部分的仓库
import {reqRegisterCode, reqRegisterUser} from '@/api';

const state = {
    registerCode: '',
};
const actions = {
    //1.获取验证码
    async getRegisterCode({commit}, phone) {
        try{
            let result = await reqRegisterCode(phone);
            commit('GETREGISTERCODE', result.data);
        }catch(err) {
            console.log(err.message);
        }
    },
    //2.注册用户
    async sendRegisterUser(context,{ phone, password, code}) {
        try {
            let result = await reqRegisterUser(phone, password, code);
            console.log(result);
        }catch(err) {
            alert(err.message);
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