<template>
<!-- 深松整地 -->
  <div class="working-detail-box">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="car-code">
          <img src="img/monitoring/icon-agricar.png" alt="">
          <span>{{typeFilter(data.jobType)}}</span>
          <span class="date">{{data.jobStartTime}}</span>
        </div>
        <el-button style="float: right; padding-top: 15px;" type="text" @click="close">
          <img src="img/monitoring/icon-close.png" alt="">
        </el-button>
      </div>

      <div class="form-con">
        <el-form label-position="right" :model="form">
          <el-form-item>
            <img class="form-icon" src="img/monitoring/carType.png" alt="">
            <span style="width:227px;">{{data.groupNameFullPath}}</span>
            <img 
              style="width:62px;height:49px;"
              :src="data.auditFlag == 1 ? 'img/working/icon-pass.png' : data.auditFlag == 2 ? 'img/working/icon-unpass.png' : 'img/working/icon-applying.png'" 
              alt="">
          </el-form-item>
          <el-form-item>
            <img class="form-icon" src="img/monitoring/carLocation.png" alt="">
            <span>{{data.address}}</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="working-detail">
        <div class="item" v-for="item in workingRates" :key="item.key">
          <div class="type"><img :src="item.img" alt=""></div>
          <div class="info">
            <p>{{item.name}}</p>
            <p v-if="item.key === 'depthRate'"><span class="num">{{Number((data[item.key] * 10000).toFixed(0)) / 100}}</span> {{item.unit}}</p>
            <p v-else><span class="num">{{data[item.key] || 0}}</span> {{item.unit}}</p>
          </div>
        </div>
      </div>
      <div class="working-detail">
        <div class="item2" v-for="item in workerInfo" :key="item.key">
          <img style="margin-right:12px;" :src="item.img" alt="">
          <span>{{data[item.key]  || '无'}}</span>
        </div>
      </div>
      <div class="btns">
        <el-button round type="primary" class="primary-btn-plain" plain @click="handleAudit">审核</el-button>
        <el-button round type="primary" class="primary-btn-plain" plain>上报</el-button>
        <el-button round type="primary" class="primary-btn-plain" plain @click="handleUpdate">修改</el-button>
        <el-button round type="primary" class="primary-btn-plain" plain @click="handleDelete">删除</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import{ getDictByListType } from '@/api/basic/index'
import { deleteJobArea } from '@/api/working/index'
import { filterDict } from '@/util/util.js'
export default {
  data() {
    return {
      workingRates: [
        {name: '作业面积', value: 0, key: 'computeArea', img: 'img/working/working-area.png',unit: '亩'},
        {name: '重复作业面积', value: 0, key: 'copyArea', img: 'img/working/working-area.png',unit: '亩'},
        {name: '作业深度', value: 0, key: 'deep', img: 'img/working/working-deep.png',unit: 'cm'},
        {name: '作业合格率', value: 0, key: 'depthRate', img: 'img/working/working-rate.png',unit: '%'},
      ],
      workerInfo: [
        {value: '', key: 'ownerName', img: 'img/monitoring/carUser.png'},
        {value: '', key: 'ownerPhone', img: 'img/working/2.png'},
        {value: '', key: 'plateNumber', img: 'img/working/3.png'},
        {value: '', key: 'terminalCode', img: 'img/working/1.png'},
      ],
      form: {},
      jobTypes: []
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    data: {
      handler: (newV, oldV) => {
        return newV
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.initTypes();
  },
  methods: {
    // 请求农机字典数据
    async initTypes() {
      let params = {
        listType: 'job_type'
      }
      let res = await getDictByListType(params);
      let {code, data} = res;
      if(code == 0) {
        this.jobTypes = data;
      }
    },
    // 农机类型字典回显
    typeFilter(val) {
      return filterDict(val, { labelKey: 'itemName', valueKey: 'itemCode' }, this.jobTypes)
    },
    // 删除
    handleDelete() {
      this.$confirm('确认要删除该数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let params = {
          rowIdsArry: this.data.rowId
        }
        let res = await deleteJobArea(params);
        const {code, msg} = res;
        if(code == 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.$emit('refreshData', 'del');
        } else {
          this.$message.error(msg || '删除失败')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    handleAudit() {
      this.$emit('handleClick', 'audit');
    },
    handleUpdate() {
      this.$emit('handleClick', 'update')
    },
    close() {
      this.$emit('close', 'isShowDetail', false)
    }
  }
}
</script>

<style lang="less" scoped>
.working-detail-box {
  width: 362px;
  .box-card {
    background: @base-darkBlue;
    /deep/ .el-card__body {
      padding-top: 16px;
    }
    .car-code {
      color: #2d7de9;
      display: inline-block;
      img {
        margin-right: 8px;
        vertical-align: middle;
      }
      .el-button {
        width: 46px;
        margin-left: 10px;
        padding: 0;
        height: 22px;
        color: #07d9ae !important;
        font-family: SourceHanSansCN-Regular;
        font-size: 14px;
        border-radius: 4px;
        border: solid 1px #0ab593 !important;
      }
      .date {
        font-size: 10px;
        color: @base-fontColor;
        margin-left: 16px;
        font-style: italic;
      }
    }
  }
  .form-con {
    .el-form {
      color: @base-fontColor;
      border-bottom: 1px dashed #0d2c5a;
    }
    .form-icon {
      vertical-align: revert;
      margin-right: 8px;
      margin-top: 4px;
    }
    .el-form-item {
      margin-bottom: 8px;
    }
    /deep/ .el-form-item__content {
      line-height: 24px;
      display: flex;
      align-items: flex-start;
    }
  }
  .working-detail {
    padding: 20px 5px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    border-bottom: 1px dashed #0d2c5a;
    color: @base-fontColor;
    text-align: center;
    .item {
      width: 50%;
      display: flex;
      align-items: center;
      margin-bottom: 18px;
      p {
        margin: 0;
      }
    }
    .item:nth-child(n+3) {
      margin-bottom: 7px;
    }
    .item2 {
      width: 50%;
      text-align: left;
      line-height: 28px;
      img {
        vertical-align: sub;
      }
    }
    .type {
      width: 55px;
      height: 55px;
      // background-color: #2880ad;
      background-image: url('../../../../assets/images/circle-bg.png');
      background-size: contain;
      background-position: 0 0;
      background-repeat: no-repeat;
      line-height: 55px;
      text-align: center;
      margin-right: 14px;
      img {
        vertical-align: middle;
      }
    }
    .info {
      color: #fefefe;
      text-align: left;
      p:first-child {
        color: @base-fontColor;
        margin-bottom: 5px;
      }
      .num {
        font-style: italic;
        font-size: 14px;
      }
    }
  }
  .btns {
    text-align: right;
    padding-top: 20px;
    .el-button {
      width: 70px;
      padding: 0;
      height: 32px;
      border: solid 1px #194260 !important;
      color: #80c5ff !important;
    }
  }

  /deep/ .el-card__header {
    border-image-source: url('../../../../assets/images/line.png');
    border-image-slice: 0 0 100% 0;
    border-image-width: 1px;
    // border-image-repeat: repeat;
  }
}
</style>