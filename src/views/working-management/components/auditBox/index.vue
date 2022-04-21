<template>
<!-- 作业工况组件 -->
  <div class="audit-box">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="search-type">
          <div class="active" >
            <img src="img/monitoring/icon-title.png" alt="">
            <span>作业查询</span>
          </div>
        </div>
        <el-button style="float: right; padding-top: 15px;" type="text" @click="close">
          <img src="img/monitoring/icon_unfolded.png" alt="">
        </el-button>
      </div>
      <div class="form-con">
        <el-form class="my-form" label-position="right" label-width="80px" :model="form">
          <el-form-item label="重复面积:">
            <el-input v-model="row.repeatComputeAreaText" placeholder="请输入重复面积"></el-input>
          </el-form-item>
          <el-form-item label="重复程度:">
            <el-select v-model="row.differenceAnalyze" style="width:100%;" placeholder="请选择重复程度">
              <el-option label="一般重复" value="0"></el-option>
              <el-option label="严重重复" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="list-con">
        <div class="list" v-for="(item,index) in 2" :key="item">
          <div class="title">作业信息{{index+1}}</div>
          <div class="info active"  @click="handleClick(index, item)">
            <el-form class="my-form" label-position="right" :model="form" label-width="80px">
              <el-form-item label="农机分组:">
                <span>{{ row.groupName }}</span>
              </el-form-item>
              <el-form-item label="车牌号:">
                <span>{{ row.originalPlateNumber }}</span>
              </el-form-item>
              <el-form-item label="终端编号:">
                <span>{{ row.originalTerminalCode }}</span>
              </el-form-item>
              <el-form-item label="机手姓名:">
                <span>{{ row.originalOwnerName }}</span>
              </el-form-item>
              <el-form-item label="作业时间:">
                <span>{{ row.originalJobStartTime }}</span>
              </el-form-item>
              <el-form-item label="位置:">
                <span>{{ row.originalCpLongtude }},{{row.originalCpLatitude}}</span>
              </el-form-item>
              <el-form-item label="作业地址:">
                <span>{{ row.originalAddress }}</span>
              </el-form-item>
              <el-form-item label="作业类型:">
                <span>{{ row.originalJobType }}</span>
              </el-form-item>
              <el-form-item label="作业面积:">
                <span style="color: #07d9ae;">{{ row.repeatComputeAreaText }}</span>
              </el-form-item>
            </el-form>
            <div class="btns">
              <el-button class="shadow-btn" plain round>审核通过</el-button>
              <el-button class="shadow-btn" plain round>审核不通过</el-button>
            </div>
          </div>
        </div>
      </div>
      <myPagination
        style="margin-left: 10px"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :total="total" />
    </el-card>
  </div>
</template>

<script>
import myPagination from '_com/myPagination/index'
import {getMachineDict} from "../../../../api/basic/machine";
import { filterDict } from '@/util/util.js'

export default {
  name: 'workingQueryBox',
  props: ["row"],
  components: {
    myPagination
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      form: {},
      currentIndex: 0,
      jobType: [],
    }
  },
  created() {
    this.getWorkType();
  },
  methods: {
    //获取作业类型字典
    async getWorkType(){
      let res = await getMachineDict({
        listType: 'job_type'
      });
      if(!res.code){
        this.jobType = res.data;
        this.row.originalJobType = this.jobTypeFilter(this.row);
      }
    },
    jobTypeFilter(row){
      return filterDict(row.originalJobType, { labelKey: 'itemName', valueKey: 'itemCode' }, this.jobType)
    },
    // 收起面板
    close() {

    },
    // 选择
    handleClick(index, item) {
      this.currentIndex = index;
    }
  }
}
</script>

<style lang="less" scoped>
@vw:19.2vw;
@vh:10.8vh;
.audit-box {
  width: 400px;
  height: calc(100% - 65px);
  .box-card {
    background: @base-darkBlue;
    height: 100%;
    .clearfix:after {
      clear: both
    }
    .search-type {
      display: inline-flex;
      line-height: 48px;
      color: @base-fontColor;
      div {
        // width: 128px;
        cursor: pointer;
        img {
          vertical-align: sub;
          margin-right: 5px;
        }
      }
      .active {
        color: #2d7de9;
      }
    }
    .form-con {
      .el-form-item {
        margin-bottom: 16px;
      }
    }
    .list-con {
      padding: 0 10px;
      // height: 574px;
      height: calc(100% - 182px);
      overflow-y: auto;
      .list:first-child {
        margin-top: 0;
      }
      .list {
        width: 100%;
        color: @base-fontColor;
        margin-top: 18px;
        .title {
          line-height: 32px;
          color: #fff;
          text-align: center;
          background-image: linear-gradient(90deg, 
            rgba(0, 0, 0,.2) 10%,
            rgba(23, 134, 199,.3) 50%, 
            rgba(0, 0, 0,.2) 90%);
          box-shadow: 0px 3px 2px 0px 
            rgba(0, 0, 0, 0.35);
        }
        .info {
          border: solid 1px rgba(40, 128, 173,.2);
          color: #80c5ff;
          margin-top: 9px;
          padding: 10px 12px;
          cursor: pointer;
          .el-form-item {
            margin-bottom: 4px;
          }
          /deep/ .el-form-item__label {
            color: @base-fontColor;
            line-height: 24px;
          }
          /deep/ .el-form-item__content {
            line-height: 24px;
            span {
              font-family: SourceHanSansCN-Regular;
              line-height: 24px;
            }
          }
        }
        .active {
          background-color: rgba(0, 67, 124,.1);
          span {
            color: #ffffff;
          }
        }
      }
    }
    .pagination {
      margin-top: 16px;
    }
  }
  /deep/ .el-card__header {
    border-image-source: url('../../../../assets/images/line.png');
    border-image-slice: 0 0 100% 0;
    border-image-width: 1px;
    // border-image-repeat: repeat;
  }
  /deep/ .el-card__body {
    padding-bottom: 12px;
    padding-left: 12px;
    height: calc(100% - 76px);
    overflow-y: auto;
  }
  .btns {
    text-align: left;
    margin-top: 10px;
    .el-button {
      width: 90px;
      height: 32px;
      margin-right: 10px;
      padding: 0;
    }
  }
}
</style>