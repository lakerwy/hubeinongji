<template>
  <div>
    <div :class="show? 'hideicon' : 'showicon'" @click="close">
      <button class="pbw_button"> 点击查询 </button>
    </div>

    <div class="left-tab-container" :class="show ? 'show':'hide'">
      <div class="title">
        <p>
          <img
            src="@/assets/images/agri-dispatch-left-title.png"
            style="margin-right: 8px"
            alt=""
          />作业需求总量
        </p>
        <img src="@/assets/images/agri-dispatch-takeback.png" alt="" :class="{'rightimg':!show}" @click="close" />
      </div>

      <div class="border"></div>

      <div class="dropdown-container">
        <el-dropdown>
          <div>
            <el-button type="primary">
              作物类型 <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
          </div>
          <el-dropdown-menu class="dropdown">
            <el-dropdown-item class="dropdown-item"
              >附近农机(5km内)</el-dropdown-item
            >
            <el-dropdown-item class="dropdown-item"
              >附近农机(10km内)</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown>
          <div>
            <el-button type="primary" class="aaa">
              作物类型 <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
          </div>
          <el-dropdown-menu slot="dropdown" class="dropdown">
            <el-dropdown-item class="dropdown-item">黄金糕</el-dropdown-item>
            <el-dropdown-item class="dropdown-item">狮子头</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div class="item-container">
        <div
          v-for="(item, index) in details"
          class="item"
          :class="activeIndex == index ? 'active' : ''"
          :key="index"
          @click="itemHandleClick(item, index)"
        >
          <div class="order-number">{{ item.id }}</div>
          <div>
            <div class="item-up-part">
              <div class="item-up-part-left">{{ item.time }}</div>
              <div class="item-up-part-right">{{ item.cropType }}</div>
            </div>
            <div class="item-down-part">
              <p style="width: 165px">作业规模：{{ item.scale }}亩</p>
              <p>拟引进农机量：{{ item.agriNeeded }}辆</p>
            </div>
          </div>
        </div>
      </div>

      <!-- pbw修改适配小的界面 -->
      <div class="pagination-container">
        <myPagination
          :currentPage="currentPage"
          :pageSize="pageSize"
          Layout="sizes, prev, slot, next, ->, total"
          :total="total"
        />
      </div>
    </div>
  </div>
</template>

<script>
import myPagination from "_com/myPagination/index";

export default {
  components: {
    myPagination,
  },
  data() {
    return {
      show:true,
      details: [
        {
          id: 1,
          time: "2021-08-01/2021-09-01",
          cropType: "机收谷子",
          scale: 18.2,
          agriNeeded: 5,
        },
        {
          id: 1,
          time: "2021-08-01/2021-09-01",
          cropType: "机收谷子",
          scale: 18.2,
          agriNeeded: 5,
        },
        {
          id: 1,
          time: "2021-08-01/2021-09-01",
          cropType: "机收谷子",
          scale: 18.2,
          agriNeeded: 5,
        },
        {
          id: 1,
          time: "2021-08-01/2021-09-01",
          cropType: "机收谷子",
          scale: 18.2,
          agriNeeded: 5,
        },
        {
          id: 1,
          time: "2021-08-01/2021-09-01",
          cropType: "机收谷子",
          scale: 18.2,
          agriNeeded: 5,
        },
        {
          id: 1,
          time: "2021-08-01/2021-09-01",
          cropType: "机收谷子",
          scale: 18.2,
          agriNeeded: 5,
        },
        {
          id: 1,
          time: "2021-08-01/2021-09-01",
          cropType: "机收谷子",
          scale: 18.2,
          agriNeeded: 5,
        },
        {
          id: 1,
          time: "2021-08-01/2021-09-01",
          cropType: "机收谷子",
          scale: 18.2,
          agriNeeded: 5,
        },
        {
          id: 1,
          time: "2021-08-01/2021-09-01",
          cropType: "机收谷子",
          scale: 18.2,
          agriNeeded: 5,
        },
        {
          id: 1,
          time: "2021-08-01/2021-09-01",
          cropType: "机收谷子",
          scale: 18.2,
          agriNeeded: 5,
        },
      ],
      activeIndex: -1,
      currentPage: 1,
      pageSize: 10,
      total: 100,
    };
  },
  methods: {
    itemHandleClick(item, i) {
      this.activeIndex = i;
      this.$emit("itemHandleClick", item);
    },
    close(){
      this.show = !this.show;
    }
  },
};
</script>

<style lang="less" scoped>
.pbw_button{
  background-color: #07223c;
  color: white;
  position: absolute;
  top: 10px;
  left: 0;
}
.hideicon{
  display: none;
}
.showicon{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}
.hide{
  animation: hideanimation 1s linear forwards;
  position: absolute;
}
.show{
  animation: showanimation 1s linear forwards;
  position: absolute;
}
.rightimg{
  animation: imganimation 0.5s linear forwards;
}
@keyframes hideanimation
{
    from {left: 0;}
    to {left: -400px;}
}
@keyframes showanimation
{
    from {left: -400px;}
    to {left: 0;}
}
@keyframes imganimation
{
    from {transform: rotate(0deg);}
    to {transform: rotate(180deg);}
}

.left-tab-container {
  width: 400px;
  // height: 800px;
  height: calc(100% - 10px);
  background-color: rgba(4, 18, 44, 0.9);
  position: absolute;
  left: 0;
  top: 10px;

  .title {
    height: 45px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 16px;
    color: #2d7de9;
    padding-left: 20px;
    padding-right: 25px;
    justify-content: space-between;
    font-weight: 600;
  }

  .border {
    height: 1px;
    background: url("../../../assets/images/agri-dispatch-border-400.png");
    margin-bottom: 10px;
  }

  .dropdown-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 15px;
    margin-top: 5px;
  }

  .item-container {
    // height: 630px;
    height: calc(100% - 165px);
    overflow-y: scroll;
    margin-right: 8px;

    .item {
      display: flex;
      flex-direction: row;
      height: 70px;
      color: #aac2d6;
      margin-left: 20px;
      font-size: 14px;
      margin-top: 10px;
      cursor: pointer;

      .order-number {
        width: 25px;
        background-color: #194260;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .item-up-part {
        height: 34.5px;
        background-color: #06213b;
        display: flex;
        width: 325px;
        border-bottom: 1px #163552 solid;
        padding-left: 8px;
        line-height: 34.5px;

        .item-up-part-left {
          width: 210px;
          border-right: solid 1px #163552;
        }

        .item-up-part-right {
          padding-left: 10px;
          color: #80c5ff;
        }
      }

      .item-down-part {
        height: 34.5px;
        background-color: #06213b;
        padding-left: 8px;
        line-height: 34.5px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }

    .item:hover,
    .active {
      .order-number {
        background-color: #0a3549;
      }

      .item-up-part,
      .item-down-part {
        background-image: -webkit-linear-gradient(left, #092e40, #1886ba);
        color: #ffffff;
      }
    }
  }

  .pagination-container {
    margin-top: 10px;
    margin-left: 10px;
  }
}

/deep/ .el-button {
  background-color: transparent;
  border: 1px #356e97 solid;
  color: #5281ad;
  width: 160px;
  border-radius: 0;

  .el-icon-arrow-down {
    margin-left: 50px;
  }
}
</style>