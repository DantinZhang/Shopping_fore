<template>
  <div id="app">
    <Header></Header>
    <!-- 路由组件的出口 -->
    <router-view></router-view>
    <!-- <Footer v-show="$route.path === '/home' || $route.path === '/search'"></Footer> -->
    <Footer v-show="$route.meta.showFooter"></Footer>
  </div>
</template>

<script>
import Header from './components/Header/index.vue';
import Footer from './components/Footer/index.vue';

export default {
  name: 'App',
  components: { Header, Footer },
  mounted() {
    //通知Vuex发送请求，获取数据，存储于仓库中
    this.$store.dispatch('home/categoryList');
  }
}
</script>  

<style>

</style>
