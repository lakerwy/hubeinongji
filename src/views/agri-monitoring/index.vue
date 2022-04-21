<template>
  <div class="monitoring-container" style="height:calc(100% - 91px);">
    <router-view></router-view>
    <Footer class="map-footer" />
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
  margin-top: 12px;
}
</style>