<template>
  <!-- 补助资金明细报表 -->
  <div class="app-container opreationSeason">
    <titleBox :headName="'补助资金明细报表'" />
    <basic-container class="basic-con">
      <div class="searchline">
      <el-form class="my-form" label-position="right" label-width="85px" :model="form">
        <div class="formItem">
          <el-form-item label="农机分组: ">
            <el-input v-model="groupData.name" placeholder="请选择农机分组" @focus="open"></el-input>
          </el-form-item>
          <el-form-item label="作业类型:">
            <el-select v-model="jobType" :clearable="true" placeholder="请选择作业类型" :disabled="globalSetting.jobType != ''">
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
      :pageSize="page.pageSize"
      :total="page.total"
      @current-change="currentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import titleBox from "_com/contenBox/titleBox.vue";
import myPagination from "_com/myPagination/index";
import {queryAssistanceFunds,exportAssistanceFunds} from '_api/report/subsidy';
import {getMachineDict} from "@/api/basic/machine";
import { mapGetters, mapMutations  } from 'vuex'
import { dateFormat, handBlobDown,filterDict} from '@/util/util'


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
        { prop: "driverName", label: "补助对象"},
        { prop: "", label: "账号"},
        { prop: "driverPhone", label: "联系电话"},
        { prop: "jobType", label: "作业类型",formatter:this.jobTypeFilter},
        { prop: "checkedPassArea", label: "作业面积(亩)" },
        { prop: "mark", label: "补助标准(元/亩)" },
        { prop: "money", label: "补助金额(元) " },
      ],
      tableData: [],
      jobTypeSelect:[
        {
          itemCode:'',
          itemName:'全部'
        }
      ],
      selection: [], // 选择的数据
      form: {
        bTimeEx: new Date(
          new Date(new Date().setMonth(0, 1)).setHours(0, 0, 0, 0)
        ),
        eTimeEx: new Date(
          new Date(new Date().setMonth(11, 31)).setHours(23, 59, 59, 999)
        ),
        jobType:'',
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
      },
      set:function(val){
        this.form.jobType = val
      }
    },
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
  created() {
    this.getJobTypeSelection();
    // this.initData();
    this.setGroupBoxType(1);
    this.getBtnPermis();
  },
  methods: {
    ...mapMutations({
      setGroupBoxStatus: 'setGroupBoxStatus',
      // setGroupCheckBox: 'setGroupCheckBox'，
      setGroupBoxType: "setGroupBoxType",

    }),
    open() {
      this.setGroupBoxStatus(true);
    },
    getBtnPermis() {
      this.btnPermis.btnView = this.permissions[window.global.buttonPremission.assisDetailView];
      this.btnPermis.btnExport = this.permissions[window.global.buttonPremission.assisDetailExport];
      //console.log('this.btnPermis',this.btnPermis)
      //console.log('this.permissions',this.permissions)
    },
    //查询作业类型
    async getJobTypeSelection(){
      let res = await getMachineDict({
        listType: 'job_type'
      })
      if(!res.code){
        this.jobTypeSelect = this.jobTypeSelect.concat(res.data)
      }
    },
    //查询数据
    async initData() {
      this.loading = true
      let res = await queryAssistanceFunds({
        currentPage: this.page.currentPage,
        pageSize:this.page.pageSize,
        groupId:this.groupData.ids.toString(),
        jobType:this.form.jobType,
        bTimeEx:dateFormat(this.form.bTimeEx),
        eTimeEx:dateFormat(this.form.eTimeEx)
      })
      this.loading = false
      if(!res.code){
      this.tableData = res.data.rows
      this.page.total = res.data.total
      }
    },
    async exportExcel(){
      this.loading = true
      let res = await exportAssistanceFunds({
        currentPage: this.page.currentPage,
        pageSize:this.page.pageSize,
        groupId:this.groupData.ids.toString(),
        jobType:this.form.jobType,
        bTimeEx:dateFormat(this.form.bTimeEx),
        eTimeEx:dateFormat(this.form.eTimeEx) 
      })
      if(res.data.success) {
        let obj = res.data.obj;
        let title = '补助资金明细报表.xls';
        let url = window.globalUrl.HOME_API + 'agri-web/rp/statistics/downloadExcel';
        handBlobDown(url,obj,title)
      } else {
        this.$message.error(res.data.msg || '导出失败')
      }
      this.loading = false
    },    
    //工作类型格式化
    jobTypeFilter(row) {
        return filterDict(
          row.jobType,
          {labelKey: "itemName", valueKey: "itemCode"},
          this.jobTypeSelect
        );
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
    check() {
      if (this.groupData.ids.length > 0) {
        return true;
      } else {
        this.$message("请先选择农机分组");
      }
      return false;
    },
    handleClick(param){
      if(this.check()){
        if(param === 'search'){
        this.page.currentPage = 1;
          this.initData()
        } else if(param === 'export'){
          this.exportExcel()
        }
      }
    },
    indexMethod(index) {
      return (this.page.currentPage - 1) * this.page.pageSize + index + 1;
    },
  },
  mounted() {
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
        // width: 305px;
        // /deep/ .el-form-item__label {
        //   padding: 0;
        // }
        .el-input{
          width: 130px;
        }
        .el-select {
          // width: 215px;
        }
      }
      .item-data {
        // width: 560px;
        width: 35%;
        .datepicker{
          width: 45% !important;
        }
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
      float: right;
      margin-bottom: 10px;
      margin-top: 5px;
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