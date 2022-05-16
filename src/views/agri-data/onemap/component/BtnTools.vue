<template>
  <div>
    <div class="tools">
      <div class="icon_btn" @click="showTools = !showTools">
        <img :src="showTools ? 'img/iconBtn.png' : 'img/iconBtn2.png'" alt="" />
      </div>
      <div class="icon_point" v-if="showTools">
        <ul>
          <li
            v-for="(item, index) in layers"
            :key="index"
            :class="item.visible ? 'active' : ''"
            @click="setPoint(item)"
          >
            <div class="img">
              <img :src="item.src" alt="" />
            </div>
            <div>{{ item.title }}</div>
          </li>
          <li
            :class="iconAll.visible ? 'active' : ''"
            @click="setPoint(iconAll)"
          >
            <div class="img">
              <img :src="iconAll.src" alt="" />
            </div>
            <div>{{ iconAll.title }}</div>
          </li>
        </ul>
      </div>
    </div>
    <!--<div class="point" v-if="false">
            <ul>
                <li>
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="handleAllChange">
                    </el-checkbox>
                    <div class="pointImg">
                        <img src="img/icon1.png" alt="">
                    </div>
                    <span>全部</span>
                </li>
                <li
                        v-for="(item,index) in pointList"
                        :key="index"
                >
                    <el-checkbox v-model="item.checked" @change="checked=>handleChange(checked,item)">
                    </el-checkbox>
                    <div class="pointImg">
                        <img :src="item.src" alt="">
                    </div>
                    <span>{{ item.title }}</span>
                </li>
            </ul>
        </div>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      layers: this.iconList,
      iconAll: {
        src: "img/icon_point7.png",
        title: "全部",
        type: "all",
        searchkey: "",
        minZoom: 0,
        visible: false,
      },
      showTools: true,
      pointList: [
        { id: 2, src: "img/icon2.png", title: "农机", checked: false },
        { id: 3, src: "img/icon3.png", title: "合作社", checked: true },
        { id: 4, src: "img/icon4.png", title: "维修站", checked: false },
        { id: 5, src: "img/icon5.png", title: "加油站", checked: false },
        { id: 6, src: "img/icon6.png", title: "销售站点", checked: false },
        { id: 7, src: "img/icon7.png", title: "耕作地块", checked: false },
      ],
      checkedAll: false,
      isIndeterminate: true,
      checkedArray: [],
    };
  },
  created() {
    // this.setPoint(this.iconList[0]);
    //setTimeout(1000,)
    //this.setPoint(this.iconAll);
    // this.setPoint(this.iconList[5]);
  },
  mounted() {
      this.$bus.$on("isClose", (message) => {
      this.showTools = message;
      //console.log(this.showTools);
      // debugger;
    });
    //this.setPoint(this.iconList[5]);
  },
  props: {
    iconList: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    setPoint(item) {
      item.visible = !item.visible;
      if (item.type == "all") {
        this.layers.forEach((x) => {
          x.visible = item.visible;
        });
      } else {
        let temp = 0;
        for (let i = 0; i < this.layers.length; i++) {
          if (this.layers[i].visible) {
            temp++;
          }
        }
        this.iconAll.visible = temp == this.layers.length;
      }
      this.$emit("setPoint", item);
    },
    handleAllChange(val) {
      if (val) {
        this.pointList.forEach((i) => {
          i.checked = true;
        });
      } else {
        this.pointList.forEach((i) => {
          i.checked = false;
        });
      }
      this.isIndeterminate = false;
    },
    handleChange(val, item) {
      item.checked = val;
      let temp = 0;
      this.pointList.forEach((i) => {
        if (i.checked) {
          temp++;
        }
      });
      this.checkedAll = temp == this.pointList.length;
      this.isIndeterminate = temp > 0 && temp < this.pointList.length;
    },
  },
};
</script>

<style lang="less" scoped>
@vw: 19.2vw;
@vh: 10.8vh;
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tools {
  position: fixed;
  right: 0;
  top: 314 / @vh;
  height: 304px;

  .icon_btn {
    position: absolute;
    top: 110px;
    left: -26px;
    cursor: pointer;
  }

  .icon_point {
    width: 303px;
    background: url("../../../../assets/images/iconBg.png");
    background-size: 100% 100%;

    .active {
      background: url("../../../../assets/images/iconSelectBg2.png") repeat-x;
      background-size: 100% 100%;
    }

    li:nth-child(2),
    li:nth-child(5) {
      width: 100px;
    }

    li:nth-child(3),
    li:nth-child(6) {
      width: 98px;
    }

    li {
      margin-left: 1px;
      display: inline-block;
      width: 102px;
      height: 99px;
      text-align: center;
      color: #aac2d6;
      font-size: 14px;
      cursor: pointer;

      .img {
        height: 31px;
        padding-top: 23px;
        padding-bottom: 10px;
      }
    }
  }
}

.point {
  position: absolute;
  bottom: 81px;
  right: 29px;
  width: 222px;
  height: 266px;
  background: url("../../../../assets/images/pointbg.png") no-repeat;
  background-size: 100% 100%;

  li:nth-child(1) {
    margin-top: 5px;
  }

  li {
    height: 37px;
    line-height: 37px;
    color: #aac2d6;
    margin-left: 26px;
    display: flex;
    align-items: center;

    .pointImg {
      width: 20px;
      display: flex;
      align-items: center;
      margin: 0 10px 0 16px;
    }

    /deep/ .el-checkbox__inner {
      background-color: transparent;
      border-color: #aac2d6;
    }

    /deep/ .is-checked .el-checkbox__inner {
      background-color: #409eff;
      border-color: #409eff;
    }

    /deep/ .is-indeterminate .el-checkbox__inner {
      background-color: #409eff;
      border-color: #409eff;
    }
  }
}
</style>