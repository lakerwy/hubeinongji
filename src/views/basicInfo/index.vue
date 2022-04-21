<template>
  <div class="contain" style="height:calc(100% - 91px);">
    <!-- <ChangeQuery/> -->
    <div class="nav">
      <ul>
        <li v-for="(item,index) in navlists" :key="item.id" :class="selectIndex == index?'active':''"
            @click="changeNavList(item,index)">
          <div class="img">
            <img :src="item.src" alt="">
          </div>
          <div>{{ item.title }}</div>
        </li>
      </ul>
    </div>
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
import Footer from "_com/footer/index"

export default {
  name: "index",
  components: {
    Footer,
  },
  data() {
    return {
      navlists: [
        {id: 5, src: 'img/icon_basic5.png', title: '安装审核', path: '/basic-install'},
        {id: 1, src: 'img/icon_basic.png', title: '农机信息', path: '/basic-machiner'},
        {id: 2, src: 'img/icon_basic2.png', title: '终端信息', path: '/basic-terminal'},
        {id: 3, src: 'img/icon_basic3.png', title: '机具信息', path: '/basic-machtools'},
        {id: 4, src: 'img/icon_basic4.png', title: '生产资源管理', path: '/basic-resource'},
      ],
      selectIndex: sessionStorage.getItem('basicIndex') ? sessionStorage.getItem('basicIndex') : 0,
    }
  },
  destroyed() {
    sessionStorage.setItem('basicIndex', 0)
  },
  methods: {
    changeNavList(item, i) {
      this.selectIndex = i;
      sessionStorage.setItem('basicIndex', this.selectIndex)
      this.$router.push({path: item.path})
    }
  },

}
</script>

<style scoped lang="less">

.contain{
  background:url("../../assets/images/background-item.png") repeat
}
@vw: 19.2vw;
@vh: 10.8vh;
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.contain {
  margin-top: 12px;
  position: relative;
}

.nav {
  width: 227px;
  height: 929 /@vh;
  //border-right: 1px solid #133460;

  li:hover, .active {
    color: #67c8ff;
    background: url("../../assets/images/nav_basic.png") no-repeat;
    background-size: 100% 100%;
  }

  li {
    width: 227px;
    height: 48px;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #ffffff;
    cursor: pointer;

    .img {
      width: 25px;
      display: flex;
      align-items: center;
      margin-left: 35px;
      margin-right: 10px;
    }
  }
}

</style>