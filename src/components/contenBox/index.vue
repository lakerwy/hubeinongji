<template>
  <section class="content-box boxbg">
    <div class="header">
      <div class="title">{{ headName }}</div>
    </div>
    <section class="content">
      <slot />
    </section>
  </section>
</template>
<script>
export default {
  props: {
    headName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="less" scoped>
.boxbg {
  border: solid 1px #07335d;
}
.content-box {
  text-align: left;
  width: 100%;
  background: url("../../assets/images/kuang_bg.png");
  background-size: 100% 100%;
  .header {
    height: 44px;
    background: url("../../assets/images/kuang_line.png") no-repeat;
    background-size: 100% 100%;
    .title {
      font-family: 'SourceHanSansCN';
      padding-left: 20px;
      font-size: 16px;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 44px;
    }
  }
  .content{
    height: calc(100% - 44px);
    overflow: scroll;
  }
}
</style>
