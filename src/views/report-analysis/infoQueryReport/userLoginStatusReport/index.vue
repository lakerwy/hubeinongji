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
        <el-form-item label="用户名:">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>        
        <el-form-item label="离线天数:">
          <el-input v-model="form.offlineday" type="number" placeholder="请输入离线天数"></el-input>
        </el-form-item>
          <el-button type="primary" class="shadow-btn" plain round @click="searchChange"
            >查询</el-button>          
          <div class="tableTool" @click="handleClick('export')">
            <img src="img/table_tool3.png" alt="" />
            <span>报表导出</span>
          </div>
        </el-form>
      </div>
      <div class="my-table">
        <el-table
          :data="tableData"
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
          <el-table-column type="index" label="序号" width="120" fixed="left">
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
      style="margin-top: 32px"
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
import { getLoginData } from '@/api/report/infoService'

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
        total: 100,
      },
      
      columns: [
        { prop: "loginName", label: "用户名" },
        { prop: "groupNameFullPath", label: "用户地址" },
        { prop: "loginDate", label: "最近登录时间" },
        { prop: "longoutDate", label: "登出时间" },
        { prop: "currentStatus", label: "当前登录状态", formatter: this.statusFilter },
        { prop: "logOutDay", label: "离线天数" },
      ],
      tableData: [],
      selection: [], // 选择的数据
      dialogVisible: false,
      dialogTitle: "新增分组",
      form: {username: '', offlineday: ''},
      model: "",
      showMaps: false,
      editTitle: "",
      echartType:true,

    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      let params = {
        username: this.form.username,
        offlineday: this.form.offlineday,
        page: this.page.currentPage,
        rows: this.page.pageSize
      }
      let res = await getLoginData(params);
      // const {code, data} = res;
      // if(code == 0) {
        this.tableData = res.rows;
        this.page.total = res.total;
      // }
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
    statusFilter(row) {
      return row.currentStatus == '0' ? '在线' : '离线'
    },
     // 判断当前是否有选择数据
    checkData() {
      if(this.selection.length > 0) {
        return true;
      } else {
        this.$message({
          type: 'info',
          message: '请勾选需要操作的数据'
        }); 
      }
      return false;
    },
    handleClick() {
      
    }
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

      /deep/ .el-form-item__label {
        line-height: 36px;
      }

      .shadow-btn {
        height: 36px !important;
      }
    }

    .my-table {
      margin-top: 20px;
      height: calc(100% - 81px);

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