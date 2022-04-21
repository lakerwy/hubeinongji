<template>
  <!-- 重复作业查询 -->
  <div class="repeat-working">
    <div style="padding: 15px 28px 0 27px;">
      <titleBox :headName="'重复作业管理'" />
    </div>
    <div class="query-con">
      <el-form class="my-form" label-position="left" label-width="85px" :model="form" :inline="true">
        <el-form-item label="分组名称:">
          <el-input v-model="groupData.name" placeholder="请选择分组名称" @focus="open"></el-input>
        </el-form-item>
        <el-form-item label="作业时间:">
          <el-date-picker
            class="datepicker"
            style="margin-right:8px;"
            v-model="form.jobStartTime"
            type="datetime"
            :clearable="false"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            prefix-icon="el-icon-date"
            placeholder="选择开始时间"
          ></el-date-picker>
          <!-- <span style="diaplay:inline-block;width:12px;"> — </span> -->
          <el-date-picker
            class="datepicker"
            v-model="form.jobEndTime"
            type="datetime"
            :clearable="false"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            prefix-icon="el-icon-date"
            placeholder="选择结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="重复面积:">
          <el-input v-model="form.min" style="margin-right:8px;" placeholder="最小面积（亩）"></el-input>
          <!-- <span style="diaplay:inline-block;width:12px;"> — </span> -->
          <el-input v-model="form.max" placeholder="最大面积（亩）"></el-input>
        </el-form-item>
        <el-form-item label="关键字:">
          <el-input v-model="form.type" placeholder="搜索设备号/车主姓名/车主手机号/农机车牌"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="btns" style="margin-left:6px;">
            <el-button type="primary" class="shadow-btn" @click="getRepeatArea(page,form)" round>查询</el-button>
            <el-button round type="primary" class="shadow-btn" plain>导出</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!-- <div class="btns">
        <el-button type="primary" class="shadow-btn" round>查询</el-button>
        <el-button round type="primary" class="shadow-btn" plain>导出</el-button>
        <img class="view" title="切换视图" src="img/working/icon-view.png" alt="" @click="isMap = !isMap;">
      </div> -->
    </div>
    <div class="view-con">
<!--      <div class="title" >-->
<!--        <img src="img/monitoring/icon-title.png" alt="">-->
<!--        <span>重复作业查询</span>-->
<!--      </div>-->
      <div class="my-table">
        <el-table
          :data="tableData"
          style="width: 100%"
          height="100%"
          border
          fit
          @selection-change="handleSelectChange"
        >
          <el-table-column
          type="selection"
          label="全选"
          width="55"
          fixed="left">
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="60"
            fixed="left">
          </el-table-column>
          <el-table-column
            label="操作"
            width="80"
            fixed="left">
            <template slot-scope="scope">
              <el-button class="table-btn" @click="handleAudit(scope.row)">审核</el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in columns"
            :key="item.label"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :align="item.align">
            <template v-if="item.children && item.children.length > 0">
              <el-table-column
                v-for="item2 in item.children"
                :key="item2.label"
                :prop="item2.prop"
                :label="item2.label"
                :width="item2.width"
                :formatter="item2.formatter"
              >
                </el-table-column>
            </template>
            <template slot-scope="scope">
              <span v-if="item.prop === 'differenceAnalyze'">
                <img 
                  style="vertical-align:middle;margin-right:9px;"
                  :src="scope.row[item.prop] == '严重重复' ? 'img/working/serious-point.png' : 'img/working/normal-point.png'"
                  alt="">
                {{scope.row[item.prop]}}
<!--                {{scope.row[item.prop] == 1 ? '严重重复' : '一般重复'}}-->
              </span>
              <span v-else>{{scope.row[item.prop]}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="myPage">
      <pagination
        :currentPage="page.currentPage"
        :total="page.total"
        :pageSize="page.pageSize" />
    </div>
    <myFooter />
  </div>
</template>

<script>
import pagination from '_com/myPagination/index'
import myFooter from '_com/footer/index'
import titleBox from '_com/contenBox/titleBox.vue'
import {mapGetters, mapMutations} from "vuex";
import {getRepeatAreaInfo} from "../../../api/working/repeat";
import {getMachineDict} from "../../../api/basic/machine";
import { filterDict } from '@/util/util.js'

export default {
  components: {
    pagination,
    myFooter,
    titleBox
  },
  data() {
    return {
      form: {},
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 100
      },
      columns: [
        {prop: 'differenceAnalyze', label: '重复程度', width: '200px'},
        {prop: 'repeatComputeAreaText', label: '重复面积', width: '160px'},
        {prop: '', label: '作业信息1', align: 'center', children: [
          {prop: 'originalOwnerName', label: '机手姓名', width: '160px'},
          {prop: 'originalOwnerPhone', label: '联系电话', width: '160px'},
          {prop: 'originalPlateNumber', label: '车牌号', width: '160px'},
          {prop: 'originalTerminalCode', label: '终端号码', width: '160px'},
          {prop: 'originalJobStartTime', label: '作业开始时间', width: '160px'},
          {prop: 'originalJobEndTime', label: '作业结束时间', width: '160px'},
          {prop: 'originalJobType', label: '作业类型', width: '160px', formatter: this.jobTypeFilter},
          {prop: 'originalAddress', label: '作业地址', width: '300px'},
        ]},
        {prop: 'deep', label: '作业信息2', align: 'center', children: [
          {prop: 'repeatOwnerName', label: '机手姓名', width: '160px'},
          {prop: 'repeatOwnerPhone', label: '联系电话', width: '160px'},
          {prop: 'repeatPlateNumber', label: '车牌号', width: '160px'},
          {prop: 'repeatTerminalCode', label: '终端号码', width: '160px'},
          {prop: 'repeatJobStartTime', label: '作业开始时间', width: '160px'},
          {prop: 'repeatJobEndTime', label: '作业结束时间', width: '160px'},
          {prop: 'repeatJobType', label: '作业类型', width: '160px', formatter: this.jobTypeFilter},
          {prop: 'repeatAddress', label: '作业地址', width: '300px'},
        ]},
      ],
      tableData: [],
      selection: [],
      jobType: [],
    }
  },
  computed: {
    ...mapGetters(['groupData'])
  },
  created(){
    this.getWorkType();
  },
  methods: {
    ...mapMutations({
      setGroupBoxStatus: 'setGroupBoxStatus',
      setGroupCheckBox: 'setGroupCheckBox'
    }),
    // 打开农机分组框
    open() {
      this.setGroupCheckBox(true);
      this.setGroupBoxStatus(true);
    },
    //获取作业类型字典
    async getWorkType(){
      let res = await getMachineDict({
        listType: 'job_type'
      });
      if(!res.code){
        this.jobType = res.data;
      }
    },
    jobTypeFilter(row){
      return filterDict(row.originalJobType, { labelKey: 'itemName', valueKey: 'itemCode' }, this.jobType)
    },
    //查询
    async getRepeatArea(page,form){
      let res = await getRepeatAreaInfo(Object.assign({
        groupName: this.groupData.name,
        page: page.currentPage,
        rows: page.pageSize
      },form));
      if(!res.code){
        this.tableData = res.data;
      }
    },
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    handleAudit(val) {
      val=Object.assign({
        groupName: this.groupData.name,
      },val);
      this.$router.push({path: '/audit-repeat-working', query: {row: JSON.stringify(val)}})
    }
  }
}
</script>

<style lang="less" scoped>
@vw:19.2vw;
.repeat-working {
  position: relative;
  .query-con {
    padding: 20px 0 0px 28px;
    display: flex;
    justify-content: space-between;
    .el-input {
      width: 168/@vw;
      min-width: 160px;
    }
    .el-select {
      width: 168/@vw;
      min-width: 160px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .btns {
      padding-right: 42/@vw;
      .el-button {
        width: 90px;
        height: 36px;
        padding: 0;
      }
    }
    .view {
      vertical-align: middle;
      margin-left: 40px;
      cursor: pointer;
    }

    /deep/ .el-form-item__label{
      text-align: right;
      padding: 0;
    }
  }
  .view-con {
    height: calc(100% - 295px);
    margin: 12px 19px 0 26px;
    // margin-top: 12px;
    padding: 30px 15px 15px 20px;
    //background-image: url('../../../assets/images/rect3.png');
    //background-size: 100% 100%;
    //background-position: 0 0;
    //background-repeat: no-repeat;
    position: relative;
    border: 1px solid #123b72;
    .title {
      color: #2d7de9;
      position: absolute;
      left: 0;
      top: -13px;
      font-size: 16px;
      img {
        vertical-align: sub;
        margin-right: 5px;
      }
    }
    .my-table {
      height: 100%;
    }
  }
  .myPage{
    margin: 0 19px 0 26px;
    padding: 13px 0 13px 19px;
    border: 1px solid #123b72;
    border-top: none;
  }
  
}
</style>