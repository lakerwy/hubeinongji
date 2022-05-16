<template>
  <!-- 作业汇总报表 -->
  <div class="app-container opreationSeason">
    <titleBox :headName="'作业汇总报表'" />
    <basic-container class="basic-con">
      <div class="searchline">
      <el-form class="my-form" label-position="right" label-width="85px" :model="form">
        <div class="formItem">
          <el-form-item label="农机分组: ">
            <el-input v-model="groupData.name" placeholder="请选择农机分组" @focus="open"></el-input>
          </el-form-item>
          <el-form-item label="作业类型:">
            <el-select v-model="jobType" placeholder="请选择作业类型" :disabled="globalSetting.jobType != ''" :clearable="true">
              <el-option v-for="item in jobTypeSelect" :label="item.itemName" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="item-data" label="起止时间: ">
            <el-date-picker
              class="datepicker"
              v-model="form.bTimeEx"
              type="date"
              :clearable="false"
              prefix-icon="el-icon-date"
              placeholder="开始时间"
              :picker-options="startTime"
            ></el-date-picker>
            <span style="diaplay:inline-block;width:12px; color: #448dd5"> — </span>
            <el-date-picker
              class="datepicker"
              v-model="form.eTimeEx"
              type="date"
              :clearable="false"
              prefix-icon="el-icon-date"
              placeholder="结束时间"
              :picker-options="endTime"
            ></el-date-picker>
          </el-form-item>
          <el-button type="primary" class="shadow-btn" plain round @click="handleClick('search')" v-if="btnPermis.btnView">
            查询
          </el-button>
          <div class="tableTool" @click="handleClick('export')" v-if="btnPermis.btnExport">
            <img src="img/table_tool3.png" alt="" />
            <span>报表导出</span>
          </div>
        </div>
        </el-form>
      </div>
      <div class="my-table">
        <el-table
          :data="tableData"      
          v-loading="loading"
          element-loading-background="rgba(0, 0, 0, 0.1)"
          style="width: 100%"
          height="100%"
          @selection-change="handleSelectChange"
        >
          <el-table-column
            type="selection"
            label="全选"
            width="55"
            fixed="left"
          >
          </el-table-column>
          <el-table-column type="index" label="序号" width="120" fixed="left" :index="indexMethod">
          </el-table-column>
          <el-table-column
            v-for="item in columns"
            :key="item.label"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :formatter="item.formatter"
          >
          </el-table-column>
        </el-table>
      </div>
    </basic-container>
    <myPagination
      style="margin-top: 22px"
      :currentPage="page.currentPage"
      :pageSize="page.rows"
      :total="page.total"
      @current-change="currentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import titleBox from "_com/contenBox/titleBox.vue";
import myPagination from "_com/myPagination/index";
import {queryJobSummary , exportJobSummary} from "_api/report/work";
import { mapGetters, mapMutations  } from 'vuex'
import { dateFormat, handBlobDown, filterDict} from '../../../../util/util'
import {getMachineDict} from "@/api/basic/machine";


export default {
  components: {
    titleBox,
    myPagination,
  },
  data() {
    return {
      searchForm: {},
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        { prop: "groupName", label: "村(组)名称",width:"610px" },
        { prop: "jobType", label: "作业类型",formatter:(row,column)=>{
          return filterDict(row.jobType,{ labelKey: "itemName", valueKey: "itemCode" },this.jobTypeSelect)
        }},
        { prop: "jobTime", label: "作业时间",width:"200px" },
        { prop: "checkedPassArea", label: "合格作业面积(亩) " },
        { prop: "", label: "村(组)负责人 " },
        { prop: "", label: "联系电话 " },
        { prop: "", label: "审核意见 " },
      ],
      tableData: [],
      jobTypeSelect:[{
        itemCode:"",
        itemName:"全部"
      }],
      selection: [], // 选择的数据
      form: {
        bTimeEx: new Date(
          new Date(new Date().setMonth(0, 1)).setHours(0, 0, 0, 0)
        ),
        eTimeEx: new Date(
          new Date(new Date().setMonth(11, 31)).setHours(23, 59, 59, 999)
        ),
        jobType:"",
      },
      startTime:{
        disabledDate: time => {
          let endDateVal = this.form.eTimeEx;
          if(endDateVal) {
            //小于结束时间
            return time > new Date(endDateVal);
          }
        },
        cellClassName: () => {}
      },
      endTime:{
        disabledDate: time => {
          let startDateVal = this.form.bTimeEx;
          if(startDateVal) {
            return time < new Date(startDateVal);
          }
        },
        cellClassName: () => {}
      },
      btnPermis: {  //按钮权限
        btnView: true,
        btnExport: true,
      },
      loading:false
    };
  },
  computed: {
    ...mapGetters(['groupData','permissions','globalSetting']),
    jobType:{
      get:function(){
        if(this.globalSetting.jobType){
          this.form.jobType = this.globalSetting.jobType
        }
        return this.form.jobType
        // return this.globalSetting.jobType ? this.globalSetting.jobType : this.form.jobType
      },
      set:function(val){
        this.form.jobType = val
      }
    }
  },
  created() {
    this.getJobTypeSelection();
    // this.setGroupBoxType(1)
    // this.setGroupCheckBox(true)
    this.getBtnPermis()
  },
  watch:{
    'globalSetting.bTime':{
        handler(newVal,oldVal){
        this.form.bTimeEx = newVal?newVal:this.form.bTimeEx
      },
        immediate: true
    },
    'globalSetting.eTime':
    { handler(newVal,oldVal){
      this.form.eTimeEx = newVal?newVal:this.form.eTimeEx
    },
        immediate: true
    }
  },
  methods: {
    ...mapMutations({
      setGroupBoxType: 'setGroupBoxType',
      setGroupCheckBox: "setGroupCheckBox",
      setGroupBoxStatus: 'setGroupBoxStatus',
    }),
    // 打开农机分组框
    open() {
      this.setGroupBoxStatus(true);
    },
    getBtnPermis() {
      this.btnPermis.btnView = this.permissions[window.global.buttonPremission.jobSummaryView];
      this.btnPermis.btnExport = this.permissions[window.global.buttonPremission.jobSummaryExport];
      //console.log('this.btnPermis',this.btnPermis)
      //console.log('this.permissions',this.permissions)
    },
    //请求数据
    async initData() {
      this.loading = true
      let res = await queryJobSummary({
        page:this.page.currentPage,
        rows:this.page.pageSize,
        groupId: this.groupData.ids.toString(),
        bTimeEx: dateFormat(this.form.bTimeEx),
        eTimeEx: dateFormat(new Date(new Date(this.form.eTimeEx).setHours(23, 59, 59, 999))),
        jobType:this.form.jobType,
      })
      this.loading = false
      if(!res.code){
        this.tableData = res.data.rows;
        this.page.total = res.data.total;
      }
    },
    //报表导出
    async exportExcel(){
      this.loading = true
      let res = await exportJobSummary({
        page:this.page.currentPage,
        rows:this.page.pageSize,
        groupId: this.groupData.ids.toString(),
        bTimeEx: dateFormat(this.form.bTimeEx),
        eTimeEx: dateFormat(new Date(new Date(this.form.eTimeEx).setHours(23, 59, 59, 999))),
        jobType:this.form.jobType,
      })
      if(res.data.success) {
        // let obj = encodeURI(res.data.obj)
        // let url = window.globalUrl.HOME_API + 'agri-web/rp/statistics/downloadExcel?filePath='+obj;
        // downloadPost(url)
        let obj = res.data.obj;
        let title = '作业汇总报表.xls';
        let url = window.globalUrl.HOME_API + 'agri-web/rp/statistics/downloadExcel';
        handBlobDown(url,obj,title)
      } else {
        this.$message.error(res.data.msg || '导出失败')
      }
      this.loading = false
    } ,
    //查询作业类型
    async getJobTypeSelection(){
      let res = await getMachineDict({
        listType: 'job_type'
      })
      if(!res.code){
        this.jobTypeSelect = this.jobTypeSelect.concat(res.data) ;
      }
    },
    check(){
      if(this.groupData.ids && this.groupData.ids.length > 0){
        return true
      }else{
        this.$message("请先选择农机分组")
      }
      return false
    },
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.initData();
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.initData();
    },
    handleClick(param){
      if(this.check()){
      if(param === 'search'){
        this.page.currentPage = 1;
        this.initData()
      }else if(param === 'export'){
        this.exportExcel()
      }
      }
    },
    //处理序号问题
    indexMethod(index) {
      return (this.page.currentPage - 1) * this.page.pageSize + index + 1;
    },
  },
};
</script>

<style lang="less" scoped>
.opreationSeason {
  .basic-con {
    .my-form {
     .formItem {
      width: 100%;
      display: flex;  
      .el-form-item {
        margin-right: 15px;
        margin-bottom: 10px;
        width: 305px;
        // /deep/ .el-form-item__label {
        //   padding: 0;
        // }
        .el-input, .el-select {
          width: 215px;
        }
      }
      .item-data {
        width: 560px;
      }
    }
  }

    .my-table {
      margin-top: 20px;
      height: calc(100% - 90px);

      /deep/ .el-table {
        height: calc(100% - 54px);
      }
    }
  }
  .searchline {
      padding-bottom: 18px;
      border-bottom: 1px solid #133460;
      margin-bottom: 5px;
      .tableTool {
      display: flex;
      align-items: center;
      color: #aac2d6;
      font-size: 14px;
      cursor: pointer;
      position: absolute;
      right: 45px;
      height: 36px;
      img {
        margin-right: 5px;
      }
    }
  }

}
</style>