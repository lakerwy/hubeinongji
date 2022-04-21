<!--  -->
<template>
  <div class="title">
    <span>
      <slot>
        
      </slot>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted: {},

  methods: {},
};
</script>
<style lang='less' scoped>
    .title{
      // background-color: red;
      font-size: 16px;
      padding-left: 25px;
      color: #67c8ff;
      width: 134px;
      height: 34px;
      background: url("~@/assets/images/about-title-bg.png") no-repeat;
    }
</style>