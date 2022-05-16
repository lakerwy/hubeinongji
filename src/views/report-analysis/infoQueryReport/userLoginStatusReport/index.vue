<template>
  <!-- 用户登录情况报表 -->
  <div class="app-container opreationSeason">
    <titleBox :headName="'用户登录情况报表'" />
    <basic-container class="basic-con">
      <div class="searchline">
        <el-form
          ref="form"
          class="my-form"
          :model="form"
          label-width="85px"
          :inline="true"
        >
        <el-form-item label="农机分组:">
              <el-input
                v-model="groupData.name"
                placeholder="请选择农机分组"
                @focus="open"
              ></el-input>
            </el-form-item>
        <el-form-item label="用户名:">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
          <el-form-item class="item-data" label="登录时间:">
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
        <!-- <el-form-item label="离线天数:">
          <el-input v-model.number="form.offlineday"  placeholder="请输入离线天数"></el-input>
        </el-form-item> -->
          <el-button type="primary" class="shadow-btn" plain round @click="searchChange" v-if="btnPermis.btnView"
            >查询</el-button>          
          <div class="tableTool" @click="exportClick" v-if="btnPermis.btnExport">
            <img src="img/table_tool3.png" alt="" />
            <span>报表导出</span>
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
import { getLoginData, exportLoginExcel , DownloadExcel} from '@/api/report/infoService'
import { mapGetters , mapMutations } from "vuex";
import {handBlobDown} from "@/util/util"

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
       form: {
        username:"",
        bTimeEx: new Date(new Date() - 1000 * 60 * 60 * 24 * 30),
        eTimeEx: new Date(),
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
      columns: [
        { prop: "loginName", label: "用户名" },
        { prop: "groupNameFullPath", label: "用户地址" },
        { prop: "loginDate", label: "登录时间" },
        { prop: "longoutDate", label: "登出时间" },
        { prop: "clientIp", label: "登录ip地址" },
        // { prop: "currentStatus", label: "当前登录状态", formatter: this.statusFilter },
        // { prop: "logOutDay", label: "离线天数" },
      ],
      tableData: [],
      selection: [], // 选择的数据
      // form: {username: '', offlineday: ''},
      btnPermis: {  //按钮权限
        btnView: true,
        btnExport: true,
      },
      loading:false
    };
  },
  computed: {
    ...mapGetters(["groupData",'permissions',"globalSetting"]),
  },
  
  created() {
    this.initData();
    this.getBtnPermis();
    this.setGroupCheckBox(true)
  },
  methods: {
    ...mapMutations({
      setGroupBoxStatus: "setGroupBoxStatus",
      setGroupCheckBox: 'setGroupCheckBox',
      setGroupBoxType:'setGroupBoxType'
    }),
    open() {
      this.setGroupBoxStatus(true);
    },
    getBtnPermis() {
      this.btnPermis.btnView = this.permissions[window.global.buttonPremission.userLoginView];
      this.btnPermis.btnExport = this.permissions[window.global.buttonPremission.userLoginExport];
    },
    async initData() {
      this.loading = true
      let params = {
        groupIds:this.groupData.children.toString(),
        username: this.form.username,
        // offlineday: this.form.offlineday,
        page:{
          page:this.page.currentPage,
          rows:this.page.pageSize
        },
        beginTime: this.globalSetting.bTime,
        endTime: this.globalSetting.eTime,
        jobType:this.globalSetting.jobType,

      }
      let res = await getLoginData(params);
      this.loading = false
      if(!res.code){        
        this.tableData = res.data.list[0];
        this.page.total = res.data.total; 
      }
    },

    // 查询
    searchChange() {
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
    // statusFilter(row) {
    //   return row.currentStatus == '0' ? '在线' : '离线'
    // },
    async exportClick() {
      this.loading = true
      let params = {
        groupIds:this.groupData.children.toString(),
        username: this.form.username,
        // offlineday: this.form.offlineday,
        page:{
          page:this.page.currentPage,
          rows:this.page.pageSize
        },
        beginTime: this.globalSetting.bTime,
        endTime: this.globalSetting.eTime,
        jobType:this.globalSetting.jobType,
      }
      let res =  await exportLoginExcel(params)
      if(res.data.success){
        let obj = res.data.obj;
        let title = '操作日志报表.xls';
        let url = window.globalUrl.HOME_API + 'agri-web/rp/statistics/downloadExcel';
        handBlobDown(url,obj,title)
      }else{
        this.$message.error(res.data.msg || "导出失败")
      }
      this.loading = false
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
      .el-form-item {
        margin-bottom: 20px;
        margin-right: 20px;
        width: 305px;
        /deep/.el-input {
          width: 215px;
        }
      }
      .item-data {
        // width: 600px;
        width: 40%;
        .datepicker {
          width: 47% !important;
        }
      }
      /deep/ .el-form-item__label {
        line-height: 36px;
      }
      .shadow-btn {
        height: 36px !important;
      }
    }

    .my-table {
      margin-top: 20px;
      height: calc(100% - 100px);

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
      height: 36px;
      float: right;
      img {
        margin-right: 5px;
      }
    }
  }

}
</style>