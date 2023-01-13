<template>
    <div class="swiper-container" id="floor1Swiper">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="carousel in carousels" :key="carousel.id">
                <img :src=carousel.imgUrl>
            </div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>

        <!-- 如果需要导航按钮 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
    </div>
</template>

<script>
import Swiper from 'swiper';
export default {
    name: 'Carousel',
    props: ['carousels'],
    watch: {
        //监听carousels数据的变化
        carousels: {
            immediate: true,  //不管数据变没变，上来先执行一次handler
            //当数据从空数组变成有数据时（ajax请求成功），执行handler函数
            //但是，当前函数执行的时机只能保证数据有了，但是v-for是否执行结束不知道
            //而v-for执行完毕的时候，页面才有结构
            handler(newVal, oldVal) {
                //nextTick能保证页面结构先渲染出来，然后再执行回调函数
                this.$nextTick(function () {
                    var mySwiper = new Swiper(".swiper-container", {
                        loop: true,
                        cssMode: true,
                        navigation: {
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                        },
                        pagination: {
                            el: ".swiper-pagination",
                            clickable: true, // 点击小球的时候也切换
                        },
                        mousewheel: true,
                        keyboard: true,
                    });
                })
            }
        }
    }
};
</script>