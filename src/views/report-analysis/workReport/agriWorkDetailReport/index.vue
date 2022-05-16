<template>
  <!-- 农机作业明细报表 -->
  <div class="app-container opreationSeason">
    <titleBox :headName="'农机作业明细报表'" />
    <basic-container class="basic-con">
      <div class="searchline">
        <el-form
          class="my-form"
          label-position="right"
          label-width="85px"
          :model="form"
        >
          <div class="formItem">
            <el-form-item label="选择农机: ">
              <el-input
                v-model="groupData.name"
                placeholder="请选择农机分组或农机"
                @focus="open"
              ></el-input>
            </el-form-item>
            <el-form-item label="审核状态:">
              <el-select v-model="form.auditFlag" placeholder="请选择审核状态">
                <el-option
                  v-for="item in auditSelection"
                  :label="item.label"
                  :value="item.auditFlag"
                ></el-option>
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
              <span style="diaplay: inline-block; width: 12px; color: #448dd5">
                —
              </span>
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
            <el-button
              v-if="btnPermis.btnView"
              type="primary"
              class="shadow-btn"
              plain
              round
              @click="handleClick('search')"
              >查询</el-button
            >
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
          >
          </el-table-column>
        </el-table>
      </div>
    </basic-container>
    <myPagination
      style="margin-top: 15px"
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
import { queryDriverJobDetail, exportDriverJobDetail } from "_api/report/work";
import { mapGetters, mapMutations } from "vuex";
import { dateFormat, handBlobDown } from "../../../../util/util";

export default {
  components: {
    titleBox,
    myPagination,
  },
  data() {
    return {
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        { prop: "groupName", label: "村(组)名称" },
        { prop: "driverName", label: "机主姓名" },
        { prop: "driverPhone", label: "机主电话" },
        { prop: "code", label: "农机车牌" },
        { prop: "computeArea", label: "作业面积(亩)" },
        { prop: "successArea", label: "合格面积(亩)" },
        { prop: "jobType", label: "作业类型" },
        { prop: "toolType", label: "机具类型" },
        { prop: "depth", label: "作业深度(公分) " },
      ],
      auditSelection: [
        {
          auditFlag: "",
          label: "全部",
        },
        {
          auditFlag: 1,
          label: "审核通过",
        },
        {
          auditFlag: 2,
          label: "审核不通过",
        },
      ],
      tableData: [],
      selection: [], // 选择的数据
      form: {
        auditFlag: "",
        bTimeEx: new Date(
          new Date(new Date().setMonth(0, 1)).setHours(0, 0, 0, 0)
        ),
        eTimeEx: new Date(
          new Date(new Date().setMonth(11, 31)).setHours(23, 59, 59, 999)
        ),
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
    ...mapGetters(["groupData","permissions",'globalSetting']),
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
    this.setGroupCheckBox(true);
    this.setGroupBoxType(2)
    this.getBtnPermis();
  },
  methods: {
    ...mapMutations({
      setGroupBoxStatus: "setGroupBoxStatus",
      setGroupCheckBox: "setGroupCheckBox",
      setGroupBoxType:"setGroupBoxType"
    }),
    // 打开农机分组框
    open() {
      // this.setGroupCheckBox(true);
      this.setGroupBoxStatus(true);
    },
    getBtnPermis() {
      this.btnPermis.btnView = this.permissions[window.global.buttonPremission.driverJobDetailReportView];
      this.btnPermis.btnExport = this.permissions[window.global.buttonPremission.driverJobDetailReportExport];
      //console.log('this.btnPermis',this.btnPermis)
      //console.log('this.permissions',this.permissions)
    },
    //查询数据
    async initData() {
      this.loading = true
      let res = await queryDriverJobDetail({
        page: this.page.currentPage,
        rows: this.page.pageSize,
        machineIds: this.groupData.children.toString(),
        bTimeEx: dateFormat(this.form.bTimeEx),
        eTimeEx: dateFormat(this.form.eTimeEx),
        auditFlag: this.form.auditFlag,
        jobType:this.globalSetting.jobType,
      });
      this.loading = false
      if(!res.code){
        this.tableData = res.data.rows;
        this.page.total = res.data.total;
      }
    },
    //报表导出
    async exportExcel() {
      this.loading = true
      let res = await exportDriverJobDetail({
        page: this.page.currentPage,
        rows: this.page.pageSize,
        machineIds: this.groupData.children.toString(),
        bTimeEx: dateFormat(this.form.bTimeEx),
        eTimeEx: dateFormat(this.form.eTimeEx),
        auditFlag: this.form.auditFlag,
        jobType:this.globalSetting.jobType,
      });
      if(res.data.success) {
        // let obj = encodeURI(res.data.obj)
        // let url = window.globalUrl.HOME_API + 'agri-web/rp/statistics/downloadExcel?filePath='+obj;
        // downloadPost(url)
        let obj = res.data.obj;
        let title = '农机作业明细报表.xls';
        let url = window.globalUrl.HOME_API + 'agri-web/rp/statistics/downloadExcel';
        handBlobDown(url,obj,title)
      } else {
        this.$message.error(res.data.msg || '导出失败')
      }
      this.loading = false
    },
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    check() {
      if (this.groupData.children.length > 0) {
        return true;
      } else {
        this.$message("请选择农机分组或农机");
      }
      return false;
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.initData();
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.initData();
    },
    handleClick(param) {
      if (this.check()) {
        if (param === "search") {
          this.page.currentPage = 1;
          this.initData();
        } else if (param === "export") {
          this.exportExcel();
        }
      }else{
      }
    },
    //处理序号问题
    indexMethod(index) {
      return (this.page.currentPage - 1) * this.page.pageSize + index + 1;
    },
  },
  mounted() {},
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
          // width: 17%;
          // /deep/ .el-form-item__label {
          //   padding: 0;
          // }
          .el-input{
            width: 150px;
            // width: 90%;
          }
          .el-select {
            width: 150px;
            // width: 15%;
          }
        }
        .item-data {
          width: 40%;
          .datepicker{
            width: 45%;
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