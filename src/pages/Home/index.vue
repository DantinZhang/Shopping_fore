<template>
    <div>
        <!-- 三级联动已经注册为全局组件，因此不需要引入,直接用 -->
        <TypeNav></TypeNav>
        <ListContainer></ListContainer>
        <Recommend></Recommend>
        <Rank></Rank>
        <Like></Like>\
        <!-- v-for遍历生成floor，并把每个楼层的数据传给floor组件，使用props接收 -->
        <Floor v-for="floor in floorList" :key="floor.id" :eachFloor="floor"></Floor>
        <Brand></Brand>
    </div>
</template>

<script>
//引入其余组件
import ListContainer from './ListContainer';
import Recommend from './Recommend';
import Rank from './Rank';
import Like from './Like';
import Floor from './Floor';
import Brand from './Brand';
import { mapState } from 'vuex';

export default {
    name: "Home",
    components: { ListContainer, Recommend, Rank, Like, Floor, Brand },
    mounted() {
        this.$store.dispatch('home/getFloorList');
        this.$store.dispatch('login/getUserInfo');
    },
    computed: {
        ...mapState({ floorList: state => state.home.floorList })
    }
};
</script>

<style lang="less" scoped>

</style>