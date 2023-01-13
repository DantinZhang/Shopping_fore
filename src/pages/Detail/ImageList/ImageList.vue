<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(img,index) in skuImageList" :key="img.id">
        <img :src="img.imgUrl" :class="{active: currentIndex === index}" @click="changeCurIndex(index)">
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>
import Swiper from 'swiper'
export default {
  name: "ImageList",
  props: ['skuImageList'],
  data() {
    return {
      currentIndex: 0  //表示默认是第一张图
    }
  },
  watch: {
    //监听skuImageList数据的变化
    // 因为它会有一个从空数组变成有数据的过程（一切都因为请求数据是一个异步操作）
    skuImageList(newVal, oldVal) {
      //nextTick能保证页面结构先渲染出来，然后再执行回调函数
      this.$nextTick(function () {
        new Swiper(".swiper-container", {
          //前进后退按钮
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          slidesPerView: 4, // 显示几个图片设置
          slidesPerGroup: 1, // 每一次切换图片的个数
        });
      })
    }
  },
  methods: {
    changeCurIndex(index) {
      this.currentIndex = index;
      //点击的时候同时把图片的索引值传给上面的放大镜同步展示（兄弟组件通信）
      this.$bus.$emit('getCarouselImg', index)
    }
  }
}
</script>

<style lang="less" scoped>
.swiper-container {
  height: 56px;
  width: 412px;
  box-sizing: border-box;
  padding: 0 12px;

  .swiper-slide {
    width: 56px;
    height: 56px;

    img {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      padding: 2px;
      width: 50px;
      height: 50px;
      display: block;

      &.active {
        border: 2px solid #f60;
        padding: 1px;
      }
    }
  }

  .swiper-button-next {
    left: auto;
    right: 0;
  }

  .swiper-button-prev {
    left: 0;
    right: auto;
  }

  .swiper-button-next,
  .swiper-button-prev {
    box-sizing: border-box;
    width: 12px;
    height: 56px;
    background: rgb(235, 235, 235);
    border: 1px solid rgb(204, 204, 204);
    top: 0;
    margin-top: 0;

    &::after {
      font-size: 12px;
    }
  }
}
</style>