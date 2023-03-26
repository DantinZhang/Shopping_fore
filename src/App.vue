<template>
  <div id="app">
    <h1>{{ num }}</h1>
    <button @click="changeNum">点击！！！！</button>
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
  data() {
    return {
      num: 0,
    }
  },
  components: { Header, Footer },
  mounted() {
    console.log('父组件挂载')
    //通知Vuex发送请求，获取数据，存储于仓库中
    this.$store.dispatch('home/categoryList');
  },
  methods: {
    changeNum() {
      this.num++;
    }
  }
}
</script>  

<style>

</style>
