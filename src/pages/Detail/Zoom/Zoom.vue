<template>
  <div class="spec-preview">
    <!-- 主图 -->
    <img :src="imgObj.imgUrl" />

    <!-- 放鼠标移动事件的区域 -->
    <div class="event" @mousemove="handlerMask"></div>

    <!-- 放大后的图片 -->
    <div class="big">
      <img :src="imgObj.imgUrl" ref="big" />
    </div>

    <!-- 主图的遮罩 -->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
export default {
  name: "Zoom",
  props: ['skuImageList'],
  data() {
    return {
      index: 0
    }
  },
  computed: {
    imgObj() {
      return this.skuImageList[this.index] || {};  //undefined不能点啥啥啥,会报错,空数组的[0]==undefined
    }
  },
  methods: {
    getCarouselImg(index) {
      this.index = index;
    },
    //放大镜效果实现
    handlerMask(e) {
      //1.获取这个遮罩层的dom元素
      let mask = this.$refs.mask;
      //2.计算定位的left和top
      let x = e.offsetX - mask.offsetWidth / 2;
      let y = e.offsetY - mask.offsetHeight / 2;
      //3.约束条件防止盒子跑出去
      if (x < 0) x = 0; //防止从左边跑出去
      if (x > mask.offsetWidth) x = mask.offsetWidth; //防止从右边跑出去
      if (y < 0) y = 0; //防止从上边跑出去
      if (y > mask.offsetHeight) y = mask.offsetHeight; //防止从下边跑出去
      //4.修改dom样式
      mask.style.left = x + 'px';
      mask.style.top = y + 'px';

      //右边的放大图跟着变化
      let big = this.$refs.big;
      big.style.top = - 2 * y + 'px';
      big.style.left = - 2 * x + 'px';
    }
  },
  mounted() {
    //全局事件总线，获取兄弟组件传过来的图片索引值
    this.$bus.$on('getCarouselImg', this.getCarouselImg);
  },
}
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover~.mask,
  .event:hover~.big {
    display: block;
  }
}
</style>