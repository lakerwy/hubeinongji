<template>
  <!-- 边界  -->
  <div class="app-container opreationSeason">
    <titleBox :headName="'边界告警报表'" />
    <basic-container class="basic-con">
      <div class="searchline">
      <el-form class="my-form" label-position="right" label-width="85px" :model="form">
        <div class="formItem">
          <el-form-item label="农机分组:">
            <el-input v-model="groupData.name" placeholder="请选择农机分组" @focus="open"></el-input>
          </el-form-item>
          <el-form-item label="农机车牌:">
            <el-input v-model="form.plateNumber" placeholder="请输入农机车牌"></el-input>
          </el-form-item>
          <el-form-item class="item-data" label="作业时间:">
            <el-date-picker
              class="datepicker"
              v-model="form.bTimeEx"
              type="datetime"
              :clearable="false"
              prefix-icon="el-icon-date"
              placeholder="开始时间"
              :picker-options="startTime"
            ></el-date-picker>
            <span style="diaplay:inline-block;width:12px; color: #448dd5"> — </span>
            <el-date-picker
              class="datepicker"
              v-model="form.eTimeEx"
              type="datetime"
              :clearable="false"
              prefix-icon="el-icon-date"
              placeholder="结束时间"
              :picker-options="endTime"
            ></el-date-picker>
          </el-form-item>
          <el-button type="primary" class="shadow-btn" plain round @click="searchChange" v-if="btnPermis.btnView">
            查询
          </el-button>
          <div class="tableTool" @click="handleExport" v-if="btnPermis.btnExport">
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
import { mapMutations, mapGetters } from 'vuex';
import { queryBoundaryAlarm, exportBoundaryAlarm } from '_api/report/alarm.js'
import { dateFormat, downloadPost,handBlobDown} from '@/util/util'

export default {
  name: "department",
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
        { prop: "GROUP_NAME", label: "所属分组" },
        { prop: "PLATE_NUMBER", label: "车牌号码" },
        { prop: "OWNER_NAME", label: "机手姓名" },
        { prop: "OWNER_PHONE", label: "电话号码" },
        { prop: "TERMINAL_CODE", label: "终端编号" },
        { prop: "WARNING_DESC", label: "报警描述" },
        { prop: "btime", label: "开始时间" },
        { prop: "etime", label: "结束时间" },
      ],
      tableData: [],
      selection: [], // 选择的数据
      form: {
        bTimeEx: new Date(new Date(new Date().setMonth(0,1)).setHours(0,0,0,0)),
        eTimeEx: new Date(new Date(new Date().setMonth(11,31)).setHours(23,59,59,999)),
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
    ...mapGetters(['groupData','permissions','globalSetting'])
  },
  watch:{
    'globalSetting.bTime':{
        handler(newVal,oldVal){
        this.form.bTimeEx = newVal?newVal:this.form.bTimeEx
      },
        immediate: true
    },
    'globalSetting.eTime':{ 
      handler(newVal,oldVal){
      this.form.eTimeEx = newVal?newVal:this.form.eTimeEx
    },
        immediate: true
    }
  },
  created() {
    // this.initData()
    this.setGroupBoxType(2)
    this.setGroupCheckBox(true)
    this.getBtnPermis();
  },
  methods: {
    ...mapMutations({
      setGroupBoxType: "setGroupBoxType",
      setGroupCheckBox: 'setGroupCheckBox',
      setGroupBoxStatus: 'setGroupBoxStatus',
    }),
    // 打开农机分组框
    open() {
      this.setGroupBoxStatus(true);
      // this.setGroupCheckBox(true)
    },
    getBtnPermis() {
      this.btnPermis.btnView = this.permissions[window.global.buttonPremission.boundaryAlarmView];
      this.btnPermis.btnExport = this.permissions[window.global.buttonPremission.boundaryAlarmExport];
      //console.log('this.btnPermis',this.btnPermis)
      //console.log('this.permissions',this.permissions)
    },
    async initData() {
      this.loading = true
      let params = {
        btime: dateFormat(this.form.bTimeEx),
        etime: dateFormat(this.form.eTimeEx),
        machineid: this.groupData.children.toString(),
        page: this.page.currentPage,
        rows: this.page.pageSize,
        jobType:this.globalSetting.jobType,
        plateNumber:this.form.plateNumber
      }
      let res = await queryBoundaryAlarm(params);
      this.loading = false
      if(!res.code) {
        this.tableData = res.data.rows;
        this.page.total = res.data.total;
      }
    },
    // 查询
    searchChange() {
      if(this.groupData.children.length <= 0) {
        this.$message.info('请先选择分组');
        return;
      }
      this.page.currentPage = 1;
      this.initData();
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
    async handleExport() {
      this.loading = true
      let params = {
        btime: dateFormat(this.form.bTimeEx),
        etime: dateFormat(this.form.eTimeEx),
        machineid: this.groupData.children.toString(),
        page: this.page.currentPage,
        rows: this.page.pageSize,
        jobType:this.globalSetting.jobType,
        plateNumber:this.form.plateNumber,
      }
      let res = await exportBoundaryAlarm(params);
      if(res.data.success) {
        let obj = res.data.obj;
        let title = '边界警告报表.xls';
        let url = window.globalUrl.HOME_API + 'agri-web/rp/statistics/downloadExcel';
        handBlobDown(url,obj,title)
      } else {
        this.$message.error(res.data.msg || '导出失败')
      }
      this.loading = false
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
        // width: 600px;
        width: 40%;
        .datepicker {
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