<template>
  <div class="monitoring-container">
    <router-view></router-view>
<!--    <Footer class="map-footer" />-->
  </div>
</template>

<script>

import Footer from '@/components/footer/index'
export default {
  components: {
    Footer
  },
}
</script>

<style lang="less" scoped>
.monitoring-container {
  position: relative;
  height:100%;
}
</style>