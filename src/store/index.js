//本文件用于配置Vuex
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

//引入Vuex的小模块
import { home } from './home';
import { search } from './search';
import { detail } from './detail';
import shopcart from './shopcart';
import login from './login';

export default new Vuex.Store({
    modules: {
        home,
        search,
        detail: detail,
        shopcart,
        login
    }
})