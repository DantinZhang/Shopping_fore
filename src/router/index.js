//本文件用于配置路由
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

//引入路由规则信息
import routes from './routes.js';

//重写push和replace解决重复点击报错的问题
let originPush = VueRouter.prototype.push;
//第一个参数：告诉原来的push方法往哪里跳（还有传那些参数）
VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        //调用originPush，把this指向push的调用者
        originPush.call(this, location, resolve, reject);
    } else {
        originPush.call(this, location, () => { }, () => { });
    }
}

//创建路由器
const router = new VueRouter({
    //配置路由规则
    routes: routes,
    //配置滚动行为
    scrollBehavior(to, from, savedPosition) {
        // 始终滚动到顶部
        return { y: 0 }  //期望滚动到的位置，0意思是跳转后滚动条始终在最上方
    },
})
export default router;