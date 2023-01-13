<template>
    <!-- 商品分类导航 -->
    <div class="type-nav">
        <div class="container">
            <div @mouseleave="leaveShow" @mouseenter="enterShow">
                <h2 class="all">全部商品分类</h2>
                <!-- 添加过渡动画 -->
                <transition name="sort">
                    <div class="sort" v-show="show">
                        <div class="all-sort-list2">
                            <!-- c1表示一级分类,c2表示二级分类,以此类推 ,goSearch是事件委派+编程导航-->
                            <div class="item bo" v-for="(c1, index) in categoryList" :key="c1.categoryId"
                                @mouseleave="leaveIndex" @click="goSearch">
                                <h3 @mouseenter="changeIndex(index)" :class="{ cur: currentIndex === index }">
                                    <a :data-categoryname="c1.categoryName" :data-category1id="c1.categoryId"
                                        href="javascript:;">{{ c1.categoryName }}</a>
                                </h3>
                                <!-- 二三级分类 -->
                                <div class="item-list clearfix"
                                    :style="{ display: currentIndex === index ? 'block' : 'none' }">
                                    <!-- <div class=" item-list clearfix" v-show="currentIndex === index"> -->
                                    <div class="subitem" v-for="c2 in c1.categoryChild" :key="c2.categoryId">
                                        <dl class="fore">
                                            <dt>
                                                <a :data-categoryname="c2.categoryName"
                                                    :data-category2id="c2.categoryId"
                                                    href="javascript:;">{{ c2.categoryName }}</a>
                                            </dt>
                                            <dd>
                                                <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                                                    <a :data-categoryname="c3.categoryName"
                                                        :data-category3id="c3.categoryId"
                                                        href="javascript:;">{{ c3.categoryName }}</a>
                                                </em>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <nav class="nav">
                <a href="###">服装城</a>
                <a href="###">美妆馆</a>
                <a href="###">尚品汇超市</a>
                <a href="###">全球购</a>
                <a href="###">闪购</a>
                <a href="###">团购</a>
                <a href="###">有趣</a>
                <a href="###">秒杀</a>
            </nav>
        </div>
    </div>
</template>
  
<script>
import { mapState } from 'vuex';
import throttle from 'lodash/throttle';  //引入节流函数,按需引入
export default {
    name: 'TypeNav',
    data() {
        return {
            currentIndex: -1, //代表鼠标谁都没移上去
            show: true  //显示或隐藏导航栏
        }
    },
    //组件挂载完毕后，可以向服务器发送请求
    mounted() {
        //通知Vuex发送请求，获取数据，存储于仓库中
        // this.$store.dispatch('home/categoryList');  //这段代码写到app.vue中
        //组件挂载完毕后显示或隐藏三级导航栏
        if (this.$route.name !== 'zhuye') {
            this.show = false;
        }
    },
    computed: {
        // ...mapState({
        //     //右侧需要的是一个函数，当使用这个计算属性时，右侧函数会立即执行
        //     //参数为state,是大仓库的state,可以顺着它找到小仓库的state
        //     categoryList: (state) => { return state.home.categoryList; }
        // })
        ...mapState('home', ['categoryList'])
    },
    watch:{
        categoryList(newVal) {
            console.log('变了')
        }
    },
    methods: {
        //1.1鼠标进入修改响应式数据currentIndex
        // changeIndex(index) {
        //     //index:鼠标移上某一个一级分类元素的索引值
        //     this.currentIndex = index;
        // },
        //1.2节流操作
        changeIndex: throttle(function (index) {
            this.currentIndex = index;
        }, 50),
        //2.一级分类鼠标移除的回调,鼠标离开一二三级分类就隐藏样式
        leaveIndex() {
            this.currentIndex = -1;
        },
        //3.路由跳转并传参
        goSearch(event) {
            //拿到当前点击对象的所有自定义属性，使用解构赋值接收
            let { categoryname, category1id, category2id, category3id, } = event.target.dataset;
            //判断，如果当前点击对象有categoryname这个自定义属性，就说明是a标签（因为没有肯定返回undefined）

            if (categoryname) {  //如果是a标签，就跳转并传参
                //1.首先定义一个query参数对象，先把categoryname拿过来
                let querydj = { categoryName: categoryname };
                //2.判断，如果收到了一级数据的id，就给querydj添加属性和值，以此类推
                if (category1id) {
                    querydj.category1Id = category1id; //添加属性
                } else if (category2id) {
                    querydj.category2Id = category2id; //添加属性
                } else {
                    querydj.category3Id = category3id; //添加属性
                }
                //这样querydj拿到了类别名字和id，就可以传参了
                // this.$router.push({
                //     name: 'sousuo',
                //     query: querydj  //把上面定义的那玩意儿拿过来
                // });

                //合并params参数
                // console.log({} === false)  //空对象既不是true也不是false
                this.$router.push({
                    name: 'sousuo',
                    query: querydj,  //把上面定义的那玩意儿拿过来
                    params: this.$route.params //合并params参数
                });
            };
        },
        //4.1鼠标进入时显示三级导航一二三级分类
        enterShow() {
            this.show = true;
        },
        //4.2鼠标离开时隐藏三级导航一二三级分类
        leaveShow() {
            //4.2.1如果在home组件中，就一直显示，其他组件鼠标离开即隐藏
            if (this.$route.name !== 'zhuye')
                this.show = false;
        }
    }
}

</script>

<style lang="less" scoped>
.type-nav {
    border-bottom: 2px solid #e1251b;

    .container {
        width: 1200px;
        margin: 0 auto;
        display: flex;
        position: relative;

        .all {
            width: 210px;
            height: 45px;
            background-color: #e1251b;
            line-height: 45px;
            text-align: center;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
        }

        .nav {
            a {
                height: 45px;
                margin: 0 22px;
                line-height: 45px;
                font-size: 16px;
                color: #333;
            }
        }

        .sort {
            position: absolute;
            left: 0;
            top: 45px;
            width: 210px;
            height: 461px;
            position: absolute;
            background: #fafafa;
            z-index: 999;

            .all-sort-list2 {
                .item {
                    h3 {
                        line-height: 30px;
                        font-size: 14px;
                        font-weight: 400;
                        overflow: hidden;
                        padding: 0 20px;
                        margin: 0;

                        a {
                            color: #333;
                        }
                    }

                    .item-list {
                        // display: none;
                        position: absolute;
                        width: 734px;
                        min-height: 460px;
                        background: #f7f7f7;
                        left: 210px;
                        border: 1px solid #ddd;
                        top: 0;
                        z-index: 9999 !important;

                        .subitem {
                            float: left;
                            width: 650px;
                            padding: 0 4px 0 8px;

                            dl {
                                border-top: 1px solid #eee;
                                padding: 6px 0;
                                overflow: hidden;
                                zoom: 1;

                                &.fore {
                                    border-top: 0;
                                }

                                dt {
                                    float: left;
                                    width: 54px;
                                    line-height: 22px;
                                    text-align: right;
                                    padding: 3px 6px 0 0;
                                    font-weight: 700;
                                }

                                dd {
                                    float: left;
                                    width: 415px;
                                    padding: 3px 0 0;
                                    overflow: hidden;

                                    em {
                                        float: left;
                                        height: 14px;
                                        line-height: 14px;
                                        padding: 0 8px;
                                        margin-top: 5px;
                                        border-left: 1px solid #ccc;
                                    }
                                }
                            }
                        }
                    }

                    // &:hover {
                    //     .item-list {
                    //         display: block;
                    //     }
                    // }
                }

                .cur {
                    background-color: skyblue;
                }
            }
        }

        // 三级导航内容部分过渡动画
        //过渡动画开始的状态
        .sort-enter,
        .sort-leave-to {
            height: 0px;
        }

        //过渡动画的结束状态
        .sort-enter-to,
        .sort-leave {
            height: 461px;
        }

        //定义动画时间，速率
        .sort-enter-active,
        .sort-leave-active {
            overflow: hidden;
            transition: all .1s linear;
        }
    }
}
</style>