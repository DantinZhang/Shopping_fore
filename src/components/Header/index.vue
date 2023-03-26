<template>
    <header class="header">
        <!-- 头部的第一行 -->
        <div class="top">
            <div class="container">
                <div class="loginList">
                    <p>尚品汇欢迎您！</p>
                    <p v-show="!userName">
                        <span>请</span>
                        <router-link to="/login">登录</router-link>
                        <router-link to="/register" class="register">免费注册</router-link>
                    </p>
                    <p v-show="userName">
                        <span>{{ userName }}</span>
                        <router-link to="/login" class="register" @click.native="logout">退出登录</router-link>
                    </p>
                </div>
                <div class="typeList">
                    <a href="###">我的订单</a>
                    <a href="###">我的购物车</a>
                    <a href="###">我的尚品汇</a>
                    <a href="###">尚品汇会员</a>
                    <a href="###">企业采购</a>
                    <a href="###">关注尚品汇</a>
                    <a href="###">合作招商</a>
                    <a href="###">商家后台</a>
                </div>
            </div>
        </div>
        <!--头部第二行 搜索区域-->
        <div class="bottom">
            <h1 class="logoArea">
                <router-link class="logo" to="/home">
                    <img src="./images/logo.png" alt />
                </router-link>
            </h1>
            <div class="searchArea">
                <form action="###" class="searchForm">
                    <input type="text" v-model="keyword" id="autocomplete" class="input-error input-xxlarge" />
                    <button class="sui-btn btn-xlarge btn-danger" type="button" @click="goSearch">搜索</button>
                </form>
            </div>
        </div>
    </header>
</template>

<script>

export default {
    name: 'Header',
    data() {
        return {
            keyword: ''
        }
    },
    mounted() {
        console.log('子组件挂载')
        //绑定一个全局事件，当我们删掉关键字面包屑时，输入框的文字也同时清空
        this.$bus.$on('deleteKeyword', () => this.keyword = "");
    },
    methods: {
        goSearch() {
            //搜索按钮的回调函数,需要向search路由跳转并传参给search
            //第一种传参方式:字符串
            // this.$router.push('/search/' + this.keyword + '?k=' + this.keyword.toUpperCase());
            //第二种传参方式:模板字符串
            // this.$router.push(`/search/${this.keyword}?k=${this.keyword.toUpperCase()}`);
            //第三种传参方式:对象写法
            //合并query参数
            this.$router.push({
                // path: '/search',  和params一起时不能用path只能name
                name: 'sousuo',
                params: { keyword: this.keyword },
                // query: { k: this.keyword.toUpperCase() },
                query: this.$route.query
            })
        },
        //退出登录，删除用户数据，删除token，跳回登录页
        logout() {
            this.$store.state.login.userInfo = {}; //删除仓库数据，不知道直接这样好不好
            localStorage.removeItem('token');  //删除token
            this.$router.push('/login'); //路由跳转回登录页
        }
    },
    computed: {
        userName() {
            return this.$store.state.login.userInfo.name;
        }
    }
};
</script>

<style lang="less" scoped>
.header {
    &>.top {
        background-color: #eaeaea;
        height: 30px;
        line-height: 30px;

        .container {
            width: 1200px;
            margin: 0 auto;
            overflow: hidden;

            .loginList {
                float: left;

                p {
                    float: left;
                    margin-right: 10px;

                    .register {
                        border-left: 1px solid #b3aeae;
                        padding: 0 5px;
                        margin-left: 5px;
                    }
                }
            }

            .typeList {
                float: right;

                a {
                    padding: 0 10px;

                    &+a {
                        border-left: 1px solid #b3aeae;
                    }
                }

            }

        }
    }

    &>.bottom {
        width: 1200px;
        margin: 0 auto;
        overflow: hidden;

        .logoArea {
            float: left;

            .logo {
                img {
                    width: 175px;
                    margin: 25px 45px;
                }
            }
        }

        .searchArea {
            float: right;
            margin-top: 35px;

            .searchForm {
                overflow: hidden;

                input {
                    box-sizing: border-box;
                    width: 490px;
                    height: 32px;
                    padding: 0px 4px;
                    border: 2px solid #ea4a36;
                    float: left;

                    &:focus {
                        outline: none;
                    }
                }

                button {
                    height: 32px;
                    width: 68px;
                    background-color: #ea4a36;
                    border: none;
                    color: #fff;
                    float: left;
                    cursor: pointer;

                    &:focus {
                        outline: none;
                    }
                }
            }
        }
    }
}
</style>