<template>
  <div>
    <div class="tools">
      <div class="icon_btn" @click="showTools=!showTools">
        <img :src="showTools?'img/iconBtn.png':'img/iconBtn2.png'" alt="">
      </div>
      <div class="icon_point" v-if="showTools">
        <ul>
          <li
            v-for="(item,index) in iconList"
            :key="index"
            :class="item.isSelect?'active':''"
            @click="setPoint(item)"
          >
            <div class="img">
              <img :src="item.src" alt="">
            </div>
            <div>{{ item.title }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iconList: [
        {id: 1, src: 'img/icon_point2.png', title: '合作社', type: 'cooperative', isSelect: false},
        {id: 2, src: 'img/icon_point3.png', title: '维修站', type: 'pit', isSelect: false},
        {id: 3, src: 'img/icon_point4.png', title: '加油站', type: 'gasstation', isSelect: false},
        {id: 4, src: 'img/icon_point5.png', title: '销售站点', type: 'sales', isSelect: false},
        {id: 5, src: 'img/icon_point8.png', title: '农资信息', type: 'machiner', isSelect: false},
        {id: 6, src: 'img/icon_point7.png', title: '全部', type: 'all', isSelect: false},
      ],
      showTools: true,
    }
  },
  created() {
    this.setPoint(this.iconList[5]);
  },
  methods: {
    setPoint(item){
      item.isSelect = !item.isSelect;
      if(item.type == 'all'){
        this.iconList.forEach(x=>{
          x.isSelect = item.isSelect;
        })
      } else {
        let temp = 0;
        for (let i = 0; i < this.iconList.length - 1; i++) {
          if(this.iconList[i].isSelect){
            temp++;
          }
        }
        this.iconList[5].isSelect = temp == this.iconList.length-1;
      }
      this.$emit('setPoint', item)
    },
  }
}
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
  top: 414 /@vh;
  height: 304px;

  .icon_btn {
    position: absolute;
    top: 60px;
    left: -26px;
    cursor: pointer;
  }

  .icon_point {
    width: 303px;
    background: url("../../../../assets/images/iconBg2.png");
    background-size: 100% 100%;

    .active {
      background: url("../../../../assets/images/iconSelectBg.png") repeat-x;
      background-size: 100% 100%;
    }

    li:nth-child(2), li:nth-child(5) {
      width: 100px;
    }

    li:nth-child(3), li:nth-child(6) {
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

  li:nth-child(1){
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
      background-color: #409EFF;
      border-color: #409EFF;
    }
    /deep/ .is-indeterminate .el-checkbox__inner {
      background-color: #409EFF;
      border-color: #409EFF;
    }
  }
}

</style>