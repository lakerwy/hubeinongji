<template>
  <div class="page">
    <myHeader @setting="openSetting" />
    <router-view class="container"></router-view>
    <settings v-if="isShowSetting" @close="closeSetting" />
    <el-dialog class="my-dialog group-dialog" :visible="isShowGroupBox" :show-close="false" @close="close">
      <groupBox class="group" :showCheckBox="isShowCheckBox" />
    </el-dialog>
  </div>
</template>

<script>
import myHeader from '../header/index'
import settings from '../settings/index'
import groupBox from '../groupBox/index'
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    myHeader,
    settings,
    groupBox
  },
  data() {
    return {
      isShowSetting: false, // 是否显示设置框
    }
  },
  computed: {
    ...mapGetters(['isShowGroupBox', 'isShowCheckBox'])
  },
  created() {
    // this.openMenu()
  },
  methods: {
    ...mapMutations({
      setGroupBoxStatus: 'setGroupBoxStatus'
    }),
    openMenu(item = {}) {
      this.$store.dispatch("GetMenu",{type: true,id: item.id}).then(data => {
          if (data.length !== 0) {
            this.$router.$avueRouter.formatRoutes(data, true);
          }
      });
    },
    openSetting(val) {
      this.isShowSetting = val;
    },
    closeSetting(val) {
      this.isShowSetting = val;
    },
    close() {
      this.setGroupBoxStatus(false);
    }
  }
}
</script>


<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
  // background: url("../../assets/images/bg.png");
  // background-size: 100% 100%;
    background: linear-gradient(to right,#0f1c40 20%,#0d2a54 52%, #0f1c40);
  .container {
    width: 100%;
    height: calc(100% - 79px);
    position: relative;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDQ4OCwgMjAyMC8wNy8xMC0yMjowNjo1MyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjZmU5ODI2Ny02MTZhLTliNDUtYmQ3MC1mNjJlNDNlODQ2MmMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NENDRTBDNjAwQzgyMTFFQzlCN0I4RTI0M0ZGREIyMjkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NENDRTBDNUYwQzgyMTFFQzlCN0I4RTI0M0ZGREIyMjkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YmZjMWJjZTYtYzVkOS0xNzQ5LTkwZGQtZjhhNWE4Yzk1MzY0IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MWQwNzliZmEtMjg1Mi1lNzQ2LWFmNTktMDY2YWRiZTQxNWI0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+g5vTzgAAAEBJREFUeNpi/P//PwMuwAIiPFoOMQIpJiBmhIr/21Fj948FymGCKYSC/zBB/MZCVf5DMvY/uuRfdGMZ8bkWIMAAi9oSDBnxIm0AAAAASUVORK5CYII=) repeat;
  }

  .group-dialog {
    /deep/ .el-dialog__header {
      display: none;
    }
    /deep/ .el-dialog {
      margin: 0 !important;
      width: 350px;
      height: 100%;
      max-height: 824px;
      border: 0;
      top: 198px;
      left: 26px;
    }
    /deep/ .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
