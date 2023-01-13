import Vue from 'vue';
import App from './App.vue';
Vue.config.productionTip = false;
//三级联动组件————注册全局组件
import TypeNav from './components/TypeNav';   //三级联动
Vue.component(TypeNav.name, TypeNav);
import Carousel from './components/Carousel';  //轮播图
Vue.component('Carousel', Carousel);
import Pagination from './components/Pagination';  //分页器
Vue.component('Pagination', Pagination);

//引入路由
import router from './router';
//引入Vuex
import store from './store'

//引入模拟数据的js文件，让它先执行一下
import './mock/mockServe';

//引入轮播图插件样式swiper
import 'swiper/css/swiper.css';

new Vue({
  render: h => h(App),
  //配置全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
  //注册路由信息,这里注册完之后所有组件都拥有了$route和$router的信息
  router,
  //注册仓库信息，注册之后所有组件实例都拥有了$store
  store
}).$mount('#app')
