<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul v-for="good in cartList" :key="good.id" class="cart-list">
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" 
            @change="changeState(good.skuId, good.isChecked)" 
            :checked="good.isChecked == 1">
          </li>
          <li class="cart-list-con2">
            <img :src="good.imgUrl">
            <div class="item-msg">{{ good.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ good.skuPrice }}.00</span>
          </li>
          <li class="cart-list-con5">
            <!-- ---------------------------------------------------------------- -->
            <!-- 1.减号 -->
            <a href="javascript:void(0)" class="mins" 
            @click="changeSkuNum('sub', good, -1)">-</a>
            <!-- 2.输入任意值 -->
            <input autocomplete="off" 
            type="text" 
            :value="good.skuNum" 
            minnum="1" 
            class="itxt"
            @blur="changeSkuNum('custom', good, $event.target.value)"
            >
            <!-- 3.加号 -->
            <a href="javascript:void(0)" class="plus" 
            @click="changeSkuNum('add', good, 1)">+</a>
          </li>
          <!-- ------------------------------------------------------------------- -->
          <li class="cart-list-con6">
            <span class="sum">{{good.skuPrice * good.skuNum}}</span>
          </li>
          <li class="cart-list-con7">
            <a href="javascript:;" class="sindelet" @click="deleteOneGood(good.skuId)">删除</a>
            <br>
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" 
        :checked="isAllChecked && cartList.length>0"
        @click="selectAllOrNot"
        >
        <span>全选</span>
      </div>
      <div class="option">
        <a href="javascript:;" @click="deleteAllSelected">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <a class="sum-btn" href="###" target="_blank">结算</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
//引入节流
import throttle from 'lodash/throttle';

  export default {
    name: 'ShopCart',
    mounted() {
      this.getData();
    },
    methods: {
      //1.函数1：请求购物车数据
      getData() {
        this.$store.dispatch('shopcart/getShopCartList');
      },

      //2.函数2：修改某个商品勾选状态
      async changeState(goodId, goodState) {
        try {
          //点击某个商品勾选框时，就发请求修改它的勾选状态
          let stateFlag = goodState == 1 ? 0 : 1; 
          await this.$store.dispatch('shopcart/changeChecked', {skuId: goodId, state: stateFlag});
          this.getData();
        }
        catch(err) {
          //如果修改失败，那么就提示
          alert('修改失败！',err);
        }
      },

      //3.函数3：全选按钮控制所有勾选框
      async selectAllOrNot() {
        let stateFlag = this.isAllChecked ? 0 : 1;
        try {
          let result = await this.$store.dispatch('shopcart/changeAllStates',stateFlag);
          console.log(result);//全是undefined，说明那个请求只写了resolve()，没传值
          this.getData();
        } catch(err) {
          console.log('出现错误',err);
        }
      },

      //4.删除某个购物车商品
      deleteOneGood(skuId) {
        //try-catch捕获一下，如果删除失败，那么就会抛出错误，返回错误的Promise
        //如果删除成功，那么没写返回值返回undefined，默认是成功的Promise
        try {
          this.$store.dispatch('shopcart/deleteOneGood',skuId);
          this.getData();
        } catch(err) {
          console.log('删除失败',err)
        }
      },

      //5.删除选中的所有商品
      async deleteAllSelected() {
        //Promise.all返回一个Promise，只有全部成功了才是成功
        try{
          await this.$store.dispatch('shopcart/deleteAllGoods');
          this.getData();
        }catch(err) {
          console.log('删除过程出现了问题',err.message);
        }
      },

      //6.修改商品的数量
      changeSkuNum: throttle(async function(type, good, disnum) {
        console.log(type, good, disnum);
        switch(type) {
          //如果是减号，那么不能减到0
          case 'sub':
            //有个bug，如果连续点减号，那么可能会变成负数
            //这是因为连续快速点击，请求还来不及发送，数据没改，所以每次disnum都是-1
            //解决办法就是节流，给服务器一些缓冲的时间，防止数据不同步出现上述bug
            if(good.skuNum > 1) {
              disnum = -1;
            }else {
              disnum = 0;
            }
            break;
          case 'add':
            disnum = 1;
            break;
          case 'custom':
            let checkNum = disnum * 1  //任何非数值字符串乘以数值都是NaN
            if(isNaN(checkNum) || disnum < 1) {
              disnum = 0;
            }else {
              //避免用户输入小数点，所以转化为整形
              disnum = parseInt(disnum) - good.skuNum; //需要传的是它们的差值（接口规定）
            }
            break;
        }
        //发请求，修改购物车商品的数量。
        try {
          await this.$store.dispatch('detail/sendShopCarMsg',{skuId: good.skuId, skuNum: disnum})
          //如果成功，就再次请求数据刷新页面
          this.getData();
        }
        catch(err) {
          alert('修改数量出现了错误！',err);
        }
      },800)
    },
    computed: {
      ...mapState('shopcart',['cartList']),
      //计算总价
      totalPrice() {
        let totalPrice = 0;
        this.cartList.forEach( el => {
          if(el.isChecked == 1) {
            totalPrice += el.skuNum * el.skuPrice;
          }
        });
        return totalPrice;
      },
      //是否全部选中的标志
      isAllChecked() {
        //全选按钮是否选中，取决于每个是否都选中
        return this.cartList.every(el => {
          return el.isChecked == 1;
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .cart {
    width: 1200px;
    margin: 0 auto;

    h4 {
      margin: 9px 0;
      font-size: 14px;
      line-height: 21px;
    }

    .cart-main {
      .cart-th {
        background: #f5f5f5;
        border: 1px solid #ddd;
        padding: 10px;
        overflow: hidden;

        &>div {
          float: left;
        }

        .cart-th1 {
          width: 25%;

          input {
            vertical-align: middle;
          }

          span {
            vertical-align: middle;
          }
        }

        .cart-th2 {
          width: 25%;
        }

        .cart-th3,
        .cart-th4,
        .cart-th5,
        .cart-th6 {
          width: 12.5%;

        }
      }

      .cart-body {
        margin: 15px 0;
        border: 1px solid #ddd;

        .cart-list {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          overflow: hidden;

          &>li {
            float: left;
          }

          .cart-list-con1 {
            width: 15%;
          }

          .cart-list-con2 {
            width: 35%;

            img {
              width: 82px;
              height: 82px;
              float: left;
            }

            .item-msg {
              float: left;
              width: 150px;
              margin: 0 10px;
              line-height: 18px;
            }
          }

          .cart-list-con4 {
            width: 10%;

          }

          .cart-list-con5 {
            width: 17%;

            .mins {
              border: 1px solid #ddd;
              border-right: 0;
              float: left;
              color: #666;
              width: 6px;
              text-align: center;
              padding: 8px;
            }

            input {
              border: 1px solid #ddd;
              width: 40px;
              height: 33px;
              float: left;
              text-align: center;
              font-size: 14px;
            }

            .plus {
              border: 1px solid #ddd;
              border-left: 0;
              float: left;
              color: #666;
              width: 6px;
              text-align: center;
              padding: 8px;
            }
          }

          .cart-list-con6 {
            width: 10%;

            .sum {
              font-size: 16px;
            }
          }

          .cart-list-con7 {
            width: 13%;

            a {
              color: #666;
            }
          }
        }
      }
    }

    .cart-tool {
      overflow: hidden;
      border: 1px solid #ddd;

      .select-all {
        padding: 10px;
        overflow: hidden;
        float: left;

        span {
          vertical-align: middle;
        }

        input {
          vertical-align: middle;
        }
      }

      .option {
        padding: 10px;
        overflow: hidden;
        float: left;

        a {
          float: left;
          padding: 0 10px;
          color: #666;
        }
      }

      .money-box {
        float: right;

        .chosed {
          line-height: 26px;
          float: left;
          padding: 0 10px;
        }

        .sumprice {
          width: 200px;
          line-height: 22px;
          float: left;
          padding: 0 10px;

          .summoney {
            color: #c81623;
            font-size: 16px;
          }
        }

        .sumbtn {
          float: right;

          a {
            display: block;
            position: relative;
            width: 96px;
            height: 52px;
            line-height: 52px;
            color: #fff;
            text-align: center;
            font-size: 18px;
            font-family: "Microsoft YaHei";
            background: #e1251b;
            overflow: hidden;
          }
        }
      }
    }
  }
</style>