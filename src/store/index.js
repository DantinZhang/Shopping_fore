//本文件用于配置Vuex
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

//引入Vuex的小模块
import { home } from './home';
import { search } from './search';
import { detail } from './detail';

export default new Vuex.Store({
    modules: {
        home,
        search,
        detail: detail
    }
})