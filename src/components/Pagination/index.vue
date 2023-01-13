<template>
    <div class="pagination">
        <button @click="$emit('getPageNo', pageNo - 1)" :disabled="pageNo === 1">上一页</button>
        <button v-if="startAndEndNumber.start > 1" @click="$emit('getPageNo', 1)">1</button>
        <button v-if="startAndEndNumber.start > 2" disabled>···</button>

        <button v-for="(n,index) in startAndEndNumber.end" :key="index" v-if="n >= startAndEndNumber.start"
            @click="$emit('getPageNo', n)" :class="{active: pageNo === n}">{{n}}</button>

        <button v-if="startAndEndNumber.end < totalPages - 1" disabled>···</button>
        <button v-if="startAndEndNumber.end < totalPages"
            @click="$emit('getPageNo', totalPages)">{{totalPages}}</button>
        <button @click="$emit('getPageNo', pageNo + 1)" :disabled="pageNo === totalPages">下一页</button>

        <button style="margin-left: 30px">共 {{total}} 条</button>
    </div>
</template>

<script>
export default {
    name: 'Pagination',
    //[当前页码，每页数据个数，总数据个数，连续页的个数]
    props: ['pageNo', 'pageSize', 'total', 'continues'],
    computed: {
        totalPages() {
            //小学数学，计算总页数，向上取整
            return Math.ceil(this.total / this.pageSize);
        },
        //计算连续页的开始和结束页码，方便后续展示
        startAndEndNumber() {
            let start = 0, end = 0;
            //1.如果总页数小于连续的页码，那么start应该是1，end应该是总页数
            //比如一共就4页，而连续页是5页
            if (this.totalPages < this.continues) {
                start = 1;
                end = this.total;
            }
            //2.如果总页数>=连续页码数，就属于正常且复杂的现象了
            else {
                // 1 ... 5 6 7 8 9 ... 30
                start = this.pageNo - Math.floor(this.continues / 2); //7-2
                end = this.pageNo + Math.floor(this.continues / 2);  //7+2

                //bug1:当前页是1，start计算成负数或0
                if (start < 1) {
                    start = 1;  //如果到最左边的，start就应该是1
                    end = this.continues;
                }
                //bug2:当前页是尾页，end计算成比尾页还大的数
                if (end > this.totalPages) {
                    start = this.totalPages - this.continues + 1;
                    end = this.totalPages;  //如果到最右边，end就应该是总页数
                }
            }
            let numObj = { "start": start, end: end };
            return numObj;  //这个计算属性的值就是一个带有start和end的对象
        }
    }
};
</script>

<style lang="less" scoped>
.pagination {
    text-align: center;

    button {
        margin: 0 5px;
        background-color: #f4f4f5;
        color: #606266;
        outline: none;
        border-radius: 2px;
        padding: 0 4px;
        vertical-align: top;
        display: inline-block;
        font-size: 13px;
        min-width: 35.5px;
        height: 28px;
        line-height: 28px;
        cursor: pointer;
        box-sizing: border-box;
        text-align: center;
        border: 0;

        &[disabled] {
            color: #c0c4cc;
            cursor: not-allowed;
        }

        &.active {
            cursor: not-allowed;
            background-color: #409eff;
            color: #fff;
        }
    }
}
</style>