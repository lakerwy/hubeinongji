<template>
  <div class="cont" style="height:calc(100% - 91px);">
    <div class="nav">
      <div class="nav-item" v-for="(item,index) in navList" :key="item.id" @click="changeNav(item,index)">
        <img :src="navIndex == index?'img/nav_hover.png':'img/nav.png'" alt="">
        <span :style="{color: navIndex == index?'#76ffed':'#9fd3ff'}">
          {{ item.value }}
        </span>
      </div>
    </div>
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/footer/index'
export default {
  components: {
    Footer
  },
  data() {
    return {
      navList: [
        {id: 1, value: '农机 一张图', path: '/onemap'},
        {id: 2, value: '农机 统计', path: '/farmStatis'},
        {id: 3, value: '作业 统计', path: '/workStatis'},
      ],
      navIndex: sessionStorage.getItem('agriMavIndex') ? sessionStorage.getItem('agriMavIndex') : 0,
    }
  },
  destroyed() {
    sessionStorage.setItem('agriMavIndex', 0)
  },
  methods: {
    changeNav(item, index) {
      this.navIndex = index;
      sessionStorage.setItem('agriMavIndex', this.navIndex)
      this.$router.push({path: item.path})
    },
  }

}
</script>

<style lang="less" scoped>
@vw: 19.2vw;
@vh: 10.8vh;
.page>.cont {
  background: url("../../assets/images/bg.png");
  background-size: 100% 100%;
  margin-top: 12px;
  position: relative;
  overflow: hidden;
}
.nav {
  z-index: 2;
  position: absolute;
  bottom: 73 / @vh;
  height: 113 /@vh;
  left: 724px;
  width: 472px;
  display: flex;
  align-items: center;
  justify-content: center;

  .nav-item {
    position: relative;
    padding: 0 20px 0 20px;
    cursor: pointer;
    //width: 120px;

    span {
      position: absolute;
      top: 20px;
      left: 54px;
      display: block;
      width: 50px;
      height: 46px;
      font-size: 16px;
      text-align: center;
      color: #9fd3ff;
    }
  }
}

</style>