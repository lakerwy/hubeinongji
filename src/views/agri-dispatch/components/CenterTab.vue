<template>
  <!-- 统计组件 -->
  <div class="statics-box">
    <div
      :class="['box', {'active': currentIndex === index}]"
      v-for="(item,index) in staTypes"
      :key="item.id"
      @click="changeType(item, index)">
      <p
        class="sta"
        :style="[{'color': item.id === 1 ? '#b7afff' : item.id === 2 ? '#3cfad3' : item.id === 3 ? '#f4b350'
        : '#00deff'},{'textShadow': item.id === 1 ? '0 0 36px #b7afff' : item.id === 2 ? '0 0 36px #3cfad3'
        : item.id === 3 ? '0 0 36px #f4b350':'0 0 36px #00deff'}]">
        <span class="num">{{ item.value }}</span>{{item.unit}}</p>
      <p class="type">{{ item.label }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'staticsBox',
  data() {
    return {
      staTypes: [
        {id: 1, label: '作业需求总量', value: 200, unit: ' 个'},
        {id: 2, label: '农机调度数量', value: 345, unit: ' 次'},
        {id: 3, label: '作业需求规模', value: 5000, unit: ' 亩'},
        {id: 4, label: '平均单价', value: 150, unit: ' 元/亩'},
      ],
      currentIndex: 0
    }
  },
  methods: {
    // 改变类型
    changeType(item, index) {
      this.currentIndex = index;
    }
  }
}
</script>

<style lang="less" scoped>
.statics-box {
  width: 850px;
  display: flex;
  justify-content: space-between;

  .box {
    width: 204px;
    height: 94px;
    background-color: #04122c;
    box-shadow: inset 2px 0px 16px 0px rgba(50, 111, 166, 0.8);
    border: solid 1px #1c91ff;
    text-align: center;
    cursor: pointer;

    .sta {
      color: #3cfad3;
      font-family: SourceHanSansCN-Medium;
      font-size: 16px;
      margin-bottom: 0;

      .num {
        font-family: DINNextW1G-MediumItalic;
        font-size: 30px;
        font-style: italic;
        margin-right: 5px;
      }
    }

    .type {
      margin: 0;
      color: #ffffff;
      font-family: SourceHanSansCN-Bold;
      font-size: 16px;
    }
  }

  .active {
    background-color: #04122c;
    box-shadow: inset 0px 0px 50px 0px rgba(0, 134, 255, 0.7);
  }
}
</style>