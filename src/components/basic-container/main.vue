<template>
  <div
    :class="{'basic-container--block':block}"
    class="basic-container">
    <el-card>
      <slot/>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'BasicContainer',
  props: {
    block: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less">
.basic-container {
  box-sizing: border-box;
  margin-top: 16px;
  border: solid 1px #133460;
  border-radius: 0;
  padding: 18px 23px;
  height: calc(100% - 129px);
  .el-card {
    background: transparent;
    border: none;
    box-shadow: none;
    width: 100%;
    height: 100%;
    .el-card__body {
      padding: 0;
      height: 100%;
    }
  }
  // &:first-child {
  //   padding-top: 0;
  // }
  &--block {
    height: 100%;
    .el-card {
      height: 100%;
    }
  }
}
</style>
