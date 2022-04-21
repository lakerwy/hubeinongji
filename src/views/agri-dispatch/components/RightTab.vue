<template>
  <div class="right-tab-container">
    <div class="title">
      <div>
        <img src="@/assets/images/agri-dispatch-right-title.png" alt=""/>
        <span>机收谷子</span>
      </div>
      <div>2021-8-15/2021-9-15</div>
      <img class="closeBtn" src="@/assets/images/agri-dispatch-right-close.png" @click="close" />
    </div>
    <div class="border"></div>
    <div class="details">
      <div class="details-item">
        <div class="img-container">
          <img src="@/assets/images/agri-dispatch-right1.png" alt=""/>
        </div>
        {{ "湖北省农机局" }}
      </div>
      <div class="details-item">
        <div class="img-container">
          <img src="@/assets/images/agri-dispatch-right2.png" alt=""/>
        </div>
        {{ "拟引入农机2台" }}
      </div>
      <div class="details-item">
        <div class="img-container">
          <img src="@/assets/images/agri-dispatch-right3.png" alt=""/>
        </div>
        {{ "张红生" }}
      </div>
      <div class="details-item">
        <div class="img-container">
          <img src="@/assets/images/agri-dispatch-right4.png" alt=""/>
        </div>
        {{ "13412123345" }}
      </div>
      <div class="details-item" style="width: 100px">
        <div class="img-container">
          <img src="@/assets/images/agri-dispatch-right5.png" alt=""/>
        </div>
        作业地址:
      </div>
      <div style="width: 224px; margin-top: 11px">
        {{ "湖北省武汉岭村啊福娃给我个阿访问过问过问尔格风格噶瑟夫rear啊35号" }}
      </div>
      <div class="details-item" style="width: 100px">
        <div class="img-container">
          <img src="@/assets/images/agri-dispatch-right6.png" alt=""/>
        </div>
        备注信息:
      </div>
      <div style="width: 224px; margin-top: 10px">{{ "现金结账、收割机" }}</div>
    </div>
    <div class="tab">
      <div class="tab-item" v-for="(item,index) in tabData" :key="index">
        <img :src="item.src" alt=""/>
        <div>
          <div class="tab-item-key">{{ item.type }}</div>
          <span class="tab-item-value">{{ item.value }}</span>{{ item.unit }}
        </div>
      </div>
    </div>
    <div class="dropdown-container">
      <el-dropdown>
        <div>
          <el-button type="primary">
            所有农机 <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
        </div>
        <el-dropdown-menu class="dropdown">
          <el-dropdown-item class="dropdown-item">附近农机(5km内)</el-dropdown-item>
          <el-dropdown-item class="dropdown-item">附近农机(10km内)</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="dropdown-border"></div>
      <el-dropdown>
        <div>
          <el-button type="primary">
            附近农机(5km内) <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
        </div>
        <el-dropdown-menu class="dropdown">
          <el-dropdown-item class="dropdown-item">附近农机(5km内)</el-dropdown-item>
          <el-dropdown-item class="dropdown-item">附近农机(10km内)</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="agri-aroud">
      <div class="agri-aroud-item" v-for="(item,index) in agriAroundItems" :key="index">
        <div class="agri-aroud-item-up-part">
          <div>
            <img src="@/assets/images/agri-dispatch-right11.png" alt="" style="margin-right:8px">{{ item.name }}
          </div>
          <div class="distance">{{ item.distance }}km</div>
        </div>
        <div class="agri-aroud-item-down-part"><img src="@/assets/images/agri-dispatch-right12.png" alt=""
                                                    style="margin-right:5px">
          <div class="address">{{ item.address }}</div>
        </div>
      </div>
    </div>
    <div class="pagination-container">
      <myPagination
        :currentPage="currentPage"
        :pageSize="pageSize"
        :total="total"/>
    </div>
  </div>
</template>

<script>
import myPagination from '_com/myPagination/index'

export default {
  components: {
    myPagination
  },
  data() {
    return {
      agriAroundItems: [
        {
          name: "清河",
          address: "山西省阳泉市平定县索还告诉私房话覅哦啊哈佛",
          distance: "55"
        }, {
          name: "哆啦A梦",
          address: "山西省阳泉市平定县索还告诉私房话覅哦啊哈佛",
          distance: "55"
        }, {
          name: "傻企鹅",
          address: "山西省阳泉市平定县索还告诉私房话覅哦啊哈佛",
          distance: "55"
        }, {
          name: "清河",
          address: "山西省阳泉市平定县索还告诉私房话覅哦啊哈佛",
          distance: "55"
        },
      ],
      tabData: [
        {id: 1, src: 'img/agri-dispatch-right7.png', type: '作业规模', value: '18.28', unit: '亩'},
        {id: 2, src: 'img/agri-dispatch-right8.png', type: '作业单价', value: '200', unit: '元/亩'},
        {id: 3, src: 'img/agri-dispatch-right9.png', type: '作业类型', value: '机收', unit: ''},
        {id: 4, src: 'img/agri-dispatch-right10.png', type: '作业种类', value: '谷子', unit: ''}
      ],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    close(){
      this.$parent.showRightTab = false;
    }
  }
};
</script>

<style lang='less' scoped>
.right-tab-container {
  width: 375px;
  height: 800px;
  background-color: rgba(4, 18, 44, 0.9);
  position: absolute;
  top: 10px;
  right: 20px;

  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-left: 14px;
    height: 50px;
    line-height: 50px;
    font-style: italic;
    color: #aac2d6;
    font-size: 14px;
    font-weight: 600;

    .closeBtn {
      padding-right: 20px;
      cursor: pointer;
    }

    span {
      font-style: normal;
      margin-left: 8px;
      font-weight: 900;
      font-size: 16px;
      color: #2d7de9;
    }
  }

  .border {
    height: 1px;
    display: flex;
    background: url("../../../assets/images/agri-dispatch-border-375.png");
    justify-content: center;
  }

  .details {
    height: 170px;
    margin-left: 20px;
    padding-top: 10px;
    font-size: 14px;
    color: #aac2d6;
    border-bottom: 1px solid #0c294e;
    width: 335px;

    .img-container {
      height: 20px;
      width: 18px;
      padding-right: 15px;
    }

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .details-item {
      width: 162px;
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  .tab {
    margin-left: 20px;
    width: 335px;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;

    .tab-item {
      margin-top: 18px;
      width: 162px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: white;
      img {
        margin-right: 10px;
      }

      .tab-item-key {
        color: #aac2d6;
        margin-bottom: 5px;
      }

      .tab-item-value {
        color: #fff;
        font-style: italic;
        font-size: 16px;
        margin-right: 2px;
      }
    }
  }

  .dropdown-container {
    margin-left: 20px;
    width: 335px;
    margin-top: 18px;
    height: 30px;
    margin-bottom: 15px;
    border: 1px solid #0a435b;
    display: flex;
    flex-direction: row;
    align-items: center;

    .dropdown-border {
      width: 1px;
      background-color: #0a435b;
      height: 17px;
    }
  }

  .agri-aroud {
    margin-left: 20px;
    width: 335px;
    height: 300px;
    overflow: auto;

    .agri-aroud-item {
      color: #aac2d6;
      font-size: 14px;

      .agri-aroud-item-up-part {
        border-top: 1px solid #1e415f;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-right: 15px;
        height: 44px;

        .distance {
          font-size: 16px;
          color: #2d7de9;
        }
      }

      .agri-aroud-item-down-part {
        height: 44px;
        display: flex;
        align-items: flex-start;
        flex-direction: row;

        .address {
          width: 305px;
          margin-left: 4px;
        }
      }
    }

    .agri-aroud-item:hover {
      background-color: rgba(0, 67, 124, 0.5);
      color: #FFFFFF;
    }
  }

  .pagination-container {
    margin-top: 9px;
    margin-left: 9px;
  }
}

/deep/ .el-button {
  background-color: transparent;
  border: none;
  color: #5281ad;
  width: 160px;
  border-radius: 0;
}

.dropdown {
  background-color: #06223b;
  border-radius: 0;
  border: none;

  .dropdown-item {
    color: #5181ac;
  }

  .dropdown-item:hover {
    background-color: #03335c;
    color: #FFF;
  }
}

//隐藏小箭头
.el-popper /deep/ .popper__arrow {
  border-bottom-color: #1EBEF4 !important;
  left: 50% !important;
  visibility: hidden;
}

</style>
