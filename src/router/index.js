//本文件用于配置路由
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import store from '@/store';

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

//前置路由守卫
router.beforeEach(async (to,form,next) => {
    // 加了这个守卫，不写next()，就不会放行
    let token = localStorage.getItem('token'); //读取token的值
    //1.1用户是否登录（有没有token）
    if(token) {
        //2.1登录了就不能再回到登录页
        if(to.path == '/login') {
            next('/');
        }
        //2.2登陆了去其他的页面
        else {
            //3.1如果有用户数据，放行
            if(store.state.login.userInfo.name) {
                next();
            }
            //3.2如果没有用户数据，先请求成功再放行
            else {
                try {
                    //这个请求在挂载之前，所以刷新也会先请求
                    await store.dispatch('login/getUserInfo');
                    next();
                }catch(err) {
                    console.log('请求用户数据失败！',err);
                    //这里还有一种情况，token过期请求不到
                    //那么就要清空token，重新登录
                    localStorage.removeItem('token');
                    next('/login');
                }
            }
        }
    }
    //1.2如果没有登录
    else {
        //没登录不能去的路由地址
        let pages = ['/trade','/pay','/paysuccess','/center/myorder'];
        if(pages.includes(to.path)) {
            //如果没登陆往这几个页面跳，就回到登录页，并传想去的页面的地址
            //这样能提升用户体验，登录完成后直接跳到刚才的页面
            next(`/login?redirect=${to.path}`);
        }else {
            next();
        }
    }
})

export default router;