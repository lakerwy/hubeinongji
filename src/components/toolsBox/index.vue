<!--  -->
<template>
  <div class="wrapper">
    <div class="box" v-for="(item, index) in items" :key="index">
      <div v-if="index > 0" class="line"><img src="img/working/line.png" alt=""></div>
      <div class="item" @click="handleClick(item)">
        <el-tooltip class="item" effect="dark" :content="item.desc" placement="top">
          <div :class="['icon',item.url]"></div>
          <!-- <span>{{item.desc}}</span> -->
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "toolsBox",
  data() {
    return {
      items: [
        {
          desc: "面积",
          url: "icon-mj",
          activeClass: "icon-mj",
          active: false,
          event: "area",
        },
        {
          desc: "距离",
          url: "icon-jl",
          activeClass: "icon-jl",
          active: false,
          event: "distance",
        },
        {
          desc: "清空",
          url: "icon-qk",
          activeClass: "icon-qk",
          active: false,
          event: "clear",
        },
        {
          desc: "放大",
          url: "icon-fd",
          activeClass: "icon-fd",
          active: false,
          event: "zoomIn",
        },
        {
          desc: "缩小",
          url: "icon-sx",
          activeClass: "icon-sx",
          active: false,
          event: "zoomOut",
        },
        {
          desc: "平移",
          url: "icon-py",
          activeClass: "icon-py",
          active: false,
          event: "choose",
        },
        // {
        //   desc: "切换",
        //   url: "icon-qh",
        //   activeClass: "icon-qh",
        //   active: false,
        //   event: "change",
        // },
        {
          desc: "全屏",
          url: "icon-qp",
          activeClass: "icon-qp",
          active: false,
          event: "fullScreen",
        },
      ],
    };
  },
  methods: {
    handleClick(e) {
      this.$emit('handleToolClick', e)
    },
  },
};
</script>
<style lang='less' scoped>
.wrapper {
  // width: 435px;
	height: 42px;
  padding: 0 25px;
	background-color: #0b182d;
	border-radius: 21px;
  display: flex;
  // justify-content: space-evenly;
  .box {
    display: flex;
    // justify-content: space-between;
    align-items: center;
    color: @base-fontColor;
    cursor: pointer;
    .item {
      display: flex;
      align-items: center;
    }
    .icon {
      // display: inline-block;
      width: 21px;
      height: 21px;
      // margin-right: 5px;
      // outline: none;
    }
    .line {
      margin: 0 16px;
      img {
        vertical-align: middle;
      }
    }
    .icon-mj {
      background: url("../../assets/images/map-area.png") no-repeat center;
    }
    .icon-jl {
      background: url("../../assets/images/map-distance.png") no-repeat center;
    }
    .icon-qk {
      background: url("../../assets/images/map-clear.png") no-repeat center;
    }
    .icon-fd {
      background: url("../../assets/images/map-zoomIn.png") no-repeat center;
    }
    .icon-sx {
      background: url("../../assets/images/map-zoomOut.png") no-repeat center;
    }
    .icon-py {
      background: url("../../assets/images/map-drag.png") no-repeat center;
    }
    // .icon-qh {
    //   background: url("../../assets/images/map-change.png") no-repeat center;
    // }
    .icon-qp {
      background: url("../../assets/images/map-fullScreen.png") no-repeat center;
    }
    
  }
}
</style>
