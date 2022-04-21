<template>
  <div>
    <div class="sub-view">
      <sidebar class="sidebar" />
      <router-view class="sub-con"></router-view>
    </div>
    <Footer />
  </div>
</template>

<script>
import sidebar from '../sidebar/index'
import Footer from '../footer/index'
export default {
  components: {
    sidebar,
    Footer
  }
}
</script>

<style lang="less" scoped>
.sub-view {
  width: 100%;
  height: 100%;
  display: flex;
  .sidebar {
    width: 240px;
  }
  .sub-con {
    margin: 32px 21px 0 21px;
    width: calc(100% - 282px);
  }
}
</style>