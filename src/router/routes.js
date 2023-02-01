//src/router/routes.js本文件用于存储路由的配置规则信息

//引入路由组件
import Home from '../pages/Home';
import Search from '../pages/Search';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Detail from '@/pages/Detail';
import AddCartSuccess from '@/pages/AddCartSuccess';
import ShopCart from '@/pages/ShopCart';
//路由规则
export default [
    {
        name: 'gouwuche',
        path: '/shopcart',
        component: ShopCart,
        meta: {
            showFooter: true
        }
    },
    {
        name: 'zhuye',
        path: '/home',
        component: Home,
        meta: {
            showFooter: true
        }
    },
    {
        name: 'sousuo',
        path: '/search/:keyword?', //?代表params可传可不传
        component: Search,
        meta: {
            showFooter: true
        }
    },
    {
        name: 'denglu',
        path: '/login',
        component: Login,
        meta: {
            showFooter: false
        }
    },
    {
        name: 'zhuce',
        path: '/register',
        component: Register,
        meta: {
            showFooter: false
        }
    },
    {
        name: 'xiangqing',
        path: '/detail/:skuId?',  //商品id的占位符，跳转时我们要带上商品参数
        component: Detail,
        meta: {
            showFooter: true
        }
    },
    {
        name: 'jiaruchenggong',
        path: '/addcartsuccess',
        component: AddCartSuccess,
        meta: {
            showFooter: true
        }
    },
    //重定向,在项目跑起来时,访问/,立马让他定向到首页
    {
        path: '/',
        redirect: '/home' //每次运行都定位到home 
    }
]