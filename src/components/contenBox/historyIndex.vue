<template>
  <section class="content-box boxbg">
    <div class="header" :class="currentIndex==0?'active':'normal'">
      <div class="title" @click="chooseIndex(0)">{{ headName }}</div>
      <div class="history" :class="currentIndex==1?'history_active':''" @click="chooseIndex(1)">{{ headName2 }}</div>
    </div>
    <section>
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
    },
    headName2: {
      type: String,
      default: ""
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
    };
  },
  methods: {
    chooseIndex(i){
      // this.currentIndex = i;
      this.$emit('chooseIndex',i)
    }
  }
};
</script>
<style lang="less" scoped>
.boxbg {
  border: solid 1px #07335d;
}
.content-box {
  text-align: left;
  width: 477px;
  margin-bottom: 10px;
  background: url("../../assets/images/kuang_bg.png");
  background-size: 100% 100%;
  .active {
    background: url("../../assets/images/titleBox/tab_hover.png") no-repeat;
  }
  .normal {
    background: url("../../assets/images/titleBox/tab.png") no-repeat;
  }
  .header {
    height: 44px;
    background-size: 100% 100%;
    display: flex;
    >div {
      margin-top: 5px;
      font-family: 'SourceHanSansCN';
      padding-left: 20px;
      font-size: 16px;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 34px;
      cursor: pointer;
    }
    .title {
      width: 163px;
    }
    .history {
      width: 199px;
      padding-left: 0px;
      text-align: center;
      margin-left: -40px;
      background-size: 100% 100%;
    }
    .history_active {
      background: url("../../assets/images/titleBox/tab2-1.png") no-repeat;
    }
  }
}
</style>
