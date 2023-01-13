<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread 面包屑，带有x的结构-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 三级联动面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">
              {{searchParams.categoryName}}<i @click="deleteCategory">×</i>
            </li>
            <!-- 搜索关键字面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">
              {{searchParams.keyword}}<i @click="deleteKeyword">×</i>
            </li>
            <!-- 品牌面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">
              {{searchParams.trademark.split(':')[1]}}<i @click="deleteTrademark">×</i>
            </li>
            <!-- 售卖属性面包屑 -->
            <li class="with-x" v-for="(prop,index) in searchParams.props" :key="index">
              {{prop.split(':')[1]}}<i @click="deleteProps(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @getTrademark="getTrademark" @getAttribute="getAttribute" />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <!-- 关键字排序 -->
              <ul class="sui-nav">
                <li :class="{active: isOne}">
                  <a href="#" @click="changeOrder('1')">
                    综合
                    <span v-show="isOne" class="iconfont"
                      :class="{'icon-arrow-down-full':isDown,'icon-arrow-up-full':isUp}"></span>
                  </a>
                </li>
                <li :class="{active: isTwo}">
                  <a href="#" @click="changeOrder('2')">
                    价格
                    <span v-show="isTwo" class="iconfont"
                      :class="{'icon-arrow-down-full':isDown,'icon-arrow-up-full':isUp}"></span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <!-- 商品列表 -->
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 声明式路由跳转并传参，把商品的id传过去 -->
                    <router-link :to="`/detail/${good.id}`">
                      <img :src="good.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥&nbsp</em>
                      <i>{{good.price}}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" title="促销信息，下单即赠送会员卡！">{{good.title}}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="fr page">
            <!-- 分页器 -->
            <Pagination :pageNo="searchParams.pageNo" :pageSize="searchParams.pageSize" :total="total" :continues="5"
              v-on:getPageNo="getPageNo" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import SearchSelector from './SearchSelector/SearchSelector.vue';
export default {
  name: 'Search',
  components: { SearchSelector },
  data() {
    return {
      searchParams: {
        category1Id: '',  //一级分类的ID
        category2Id: '', //二级分类的ID
        category3Id: '',  //三级分类的ID
        categoryName: '',  //分类的名字
        keyword: '',  //搜索那儿输入的关键字
        order: '1:desc',   //排序方式：1综合，2价格  asc升序  desc降序
        pageNo: 1,  //当前分页的页码
        pageSize: 10,   //每一页多少条数据
        props: [],  //存储商品属性
        trademark: ''  //品牌
      }
    }
  },
  beforeMount() {
    //后面两个对象依次覆盖前面重复的属性值，最后第一个对象原值改变，返回第一个对象
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
  },
  mounted() {
    console.log('发送ajax请求');
    this.getData();
  },
  methods: {
    getData() {
      //向Vuex仓库派发请求，拿仓库数据过来
      // this.$store.dispatch('search/getSearchInfo', {});
      this.$store.dispatch('search/getSearchInfo', this.searchParams);
    },
    deleteCategory() {
      //删除分类的名字和id，但置空的是本组件data内的数据，而不是$route中的query参数
      this.searchParams.categoryName = "";  //点击x后，名字置空，这样v-if就生效把节点弄没
      // this.searchParams.category1Id = undefined;  //写成undefined就不会带给服务器了，省带宽
      // this.searchParams.category2Id = undefined;  //id也要置空，这样服务器才会返回全部数据
      // this.searchParams.category3Id = '';
      this.$router.push({  //去掉地址栏的query参数
        name: 'sousuo',  //自己跳自己
        params: this.$route.params  //只传params（华为），query就被拿掉了
      });
      // this.getData();//发请求返回全部商品数据,但是由于监视$route，有上边就不用这行了
    },
    deleteKeyword() {
      //删除关键词，但置空的是本组件data内的数据，而不是$route中的params参数
      this.searchParams.keyword = undefined;//点击x后，关键字置空，这样v-if就生效把节点弄没
      this.$router.push({  //去掉地址栏的params参数
        name: 'sousuo',
        query: this.$route.query //只传query(有就筛选，没有就返回全部数据),params(华为)就被拿掉了
      });
      this.$bus.$emit('deleteKeyword'); //触发全局事件总线，把Header中的输入框关键字置空
      // this.getData(); //发请求返回全部数据,但是由于监视$route，有上边就不用这行了
    },
    deleteTrademark() {
      //删除品牌的面包屑并重新请求
      this.searchParams.trademark = undefined;
      this.getData();  //这里边不涉及$route里的参数修改，所以不能靠监视来派发请求
    },
    deleteProps(index) {
      //点击叉号时删除当前数组中的元素
      this.searchParams.props.splice(index, 1);//（start，deletecount），改变原数组
      this.getData();
    },
    getTrademark(trademark) {
      //整理品牌字段参数  按照接口文档格式写"ID:品牌名称"
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      //要记住，只有searchParams里的某属性为空时，才会返回该属性对应所有数据
      //所以下面这么写有bug是因为keyword置空了，但this.searchParams.trademark没有置空
      // this.$router.push({  
      //   name: 'sousuo',
      //   params: {keyword: trademark.tmName}
      // });
      this.getData();
    },
    getAttribute(attr, attrValue) {
      let prop = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      if (this.searchParams.props.indexOf(prop) === -1) {
        //加个判断：解决重复点击会重复显示多个面包屑的bug：props数组去重
        //如果props里没有该元素，就添加进去并发请求，如果已经有了就不发请求了
        this.searchParams.props.push(prop);
        this.getData();
      }
    },
    changeOrder(orderNumber) {
      //orderNumber是一个标记,代表用户点击的是综合(1)还是价格(2),用户点击时传过来
      //1.获取当前状态的排序类型
      let originOrderType = this.searchParams.order.split(':')[1];
      //2.直接改数据，传入当前点击的参数，排序类型取反，然后就能引起Vue重新解析模板
      this.searchParams.order = `${orderNumber}:${originOrderType === 'desc' ? 'asc' : 'desc'}`;
      //3.再次发送请求
      this.getData();
    },
    getPageNo(pageNo) {
      // 此回调用于通过分页器组件自定义事件获取关于分页器的参数
      this.searchParams.pageNo = pageNo;
      this.getData();
    }
  },
  computed: {
    // ...mapState({
    //   goodList: state => state.search.searchList.goodList,
    //   attrsList: state => state.search.searchList.attrsList,
    //   trademarkList: state => state.search.searchList.trademarkList
    // })
    ...mapGetters('search', ['goodsList', 'total']),
    //决定排序属性是否高亮的计算属性
    isOne() {
      //如果order中包含1，那么就是当前按综合排序，返回true给avtive样式
      return this.searchParams.order.includes('1');
    },
    isTwo() {
      //如果order中包含2，那么就是当前按价格排序，返回true给avtive样式
      return this.searchParams.order.includes('2');
    },
    //决定排序箭头显示上箭头还是下箭头
    isDown() {
      //如果order中包含desc，返回true，否则返回false
      return this.searchParams.order.includes('desc');
    },
    isUp() {
      //如果order中包含asc，返回true，否则返回false
      return this.searchParams.order.includes('asc');
    }
  },
  watch: {
    //$route竟然是data里的一个属性诶
    //监听路由的信息是否发生变化，如果发生变化就再次请求
    $route: {
      immediate: true,  //其实加上这句话，beforeMount和mounted里的东西都可以去掉
      handler() {
        //每次请求前，最好把相应的1，2，3级分类的id置空，不然有冗余不太好，本次请求就比较干净
        //别的不用重置，因为这三个是只传一个，其他的会直接被新值覆盖，没必要重置
        // Object.assign(this.searchParams, { category1Id: '' }, { category2Id: '' }, { category3Id: '' })
        this.searchParams.category1Id = undefined;
        this.searchParams.category2Id = undefined;//写成undefined就不会带给服务器了，省带宽
        this.searchParams.category3Id = ''; //不省带宽
        //每次参数变化，都要重新整理数据然后派发请求才行
        Object.assign(this.searchParams, this.$route.query, this.$route.params);
        this.getData();
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;
      }
    }
  }
}
</style>