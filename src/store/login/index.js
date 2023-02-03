//本文件是注册登录部分的仓库
import {reqRegisterCode, reqRegisterUser, reqUser, reqUserInfo} from '@/api';

const state = {
    registerCode: '',
    userInfo: {}, //保存用户数据
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
    },

    //2.登录
    async userLogin(context, {phone,password}) {
        let result = await reqUser(phone, password);
        if(result.code == 200) {
            localStorage.setItem('token',result.data.token);
        }
    },

    //3.请求用户数据
    async getUserInfo({commit}) {
        let result = await reqUserInfo();
        if(result.code == 200) {
            console.log(result);
            commit('GETUSERINFO',result.data);
        }else {
            console.log('请求用户信息失败，原因是：',result.message);
        }
    }
};
const mutations = {
    GETREGISTERCODE(state, value){
        state.registerCode = value;
    },
    GETUSERINFO(state, value) {
        state.userInfo = value;
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