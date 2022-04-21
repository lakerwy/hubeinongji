<template>
  <div class="title">
    <span>
      {{headName}}
    </span>
  </div>
</template>

<script>
export default {
  name: "titleBox",
  props: {
    headName: {
      type: String,
      default: "农机信息"
    }
  },
}
</script>

<style scoped lang="less">
  .title {
    position: relative;
    width: 100%;
    // height: 44px;
    height: 30px;
    // background: url("../../assets/images/titleBox.png") no-repeat;
    background: url("../../assets/images/title_bg.png") no-repeat;
    background-size: 100% 100%;
    span {
      position: absolute;
      font-size: 16px;
      color: #67c8ff;
      left: 44px;
      top: -5px;
    }
  }
</style>