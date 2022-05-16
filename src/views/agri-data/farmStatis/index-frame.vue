<!--  -->
<template>
  <div>
    <iframe v-show="iframeState" class="iframe" id="show-iframe" frameborder=0 name="showHere" scrolling=auto src="https://www.bing.com"></iframe>
  </div>
</template>

<script>
export default {
  data () {
    return {
      iframeState:true,
      
    };
  },

  components: {},

  computed: {},

  mounted: {},

  methods: {}
}

</script>
<style lang='less' scoped>
.iframe{
  height: 500px;
  width: 100%;
}
</style>