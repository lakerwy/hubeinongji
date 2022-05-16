<template>
  <div
    class="controlContainer"
    ref="controlContainer"

  >
    <div class="control"></div>
    <div
      v-show="showTip && tipValue"
      ref="controlTip"
      class="tips"
      :style="{left:`${leftWidth - 30}px`}"
    >{{ tipValue }}</div>
    <!-- <div
      class="period-item"
      v-for="(item,index) in periodsStyle"
      :key="index"
      :style="{left:`${item.left}px`,width:`${item.width}px`}"
    ></div> -->
    <div
      class="period-item"
      :style="{width:`${leftWidth}px`}"
    ></div>
    <div
      v-show="showCircle"
      class="circle"
      :style="{left:`${leftWidth}px`}"
    >
      <div class="inCircle"></div>
    </div>
  </div>
</template>

<script>
import { stableSort } from 'ol/array';
export default {
  data() {
    return {
      showTip: true, // 显示进度条值
      // tipValue: 12, // 进度条值
      showCircle: true,
      // controlDivLeft: 0, // 进度条的left
      percent: 0,
    };
  },
  updated() {
    // //console.log("playBar is update:",this.percent);
  },
  computed: {
    leftWidth: function () { // 球的位置 进度的长度
      let res = (this.percent * this.controlDivWidth).toFixed(2);
      return Number(res);
    },
    tipValue: function() {
      let val = this.percent ? (this.percent * 100).toFixed(2) + '%' : '';
      return val;
    }
  },
  mounted() {
    this.controlDivWidth = this.$refs.controlContainer.offsetWidth - 10;
    // this.controlDivLeft = this.$refs.controlContainer.offsetLeft;
    // this.circleLeft = this.controlDivLeft;
  },
  methods: {
    
  }
};
</script>

<style lang="less" scoped>
@vw: 19.2vw;

.controlContainer {
  width: 100%;
  position: relative;
  .control {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    cursor: pointer;
  }
  .tips {
    position: absolute;
    left: 0;
    top: 12px;
    // background: rgba(40, 52, 69, 0.6);
    border: 1px solid rgba(74, 100, 138, 1);
    border-radius: 2px;
    padding: 0 3px;
    font-size: 12px;
    color: @base-fontColor;
  }
  .period-item {
    position: absolute;
    height: 4px;
    margin-top: -4px;
    background: rgba(0, 208, 251, 1);
    cursor: pointer;
    pointer-events: none; // 屏幕上面的鼠标事件
  }
  .circle {
    margin-top: -8px;
    position: absolute;
    width: 12px;
    height: 12px;
    background: rgba(0, 208, 251, 1);
    box-shadow: 0 0 6px 0 rgba(32, 38, 46, 1);
    border-radius: 50%;
    .inCircle {
      width: 4px;
      height: 4px;
      background: rgba(0, 134, 162, 1);
      box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      margin: 4px auto;
    }
  }
}
</style>
