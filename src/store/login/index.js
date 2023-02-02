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
        console.log(context);
        try {
            let result = await reqRegisterUser(phone, password, code);
            console.log(result);
            if(result.code == 200) {
                return '注册成功';
            }
            if(result.code == 223) {
                return '该用户已注册！'
            }
        }catch(err) {
            alert('请求失败',err.message);
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