<template>
  <!-- 操作日志报表 -->
  <div class="app-container opreationSeason">
    <titleBox :headName="'操作日志报表'" />
    <basic-container class="basic-con">
      <div class="searchline">
      <el-form class="my-form" label-position="right" label-width="85px" :model="form">
        <div class="formItem">
          <el-form-item label="操作账号:">
            <el-input v-model="form.userName"  placeholder="请输入操作账号"></el-input>
          </el-form-item>
          <el-form-item label="操作模块:">
            <el-input v-model="form.operModule" placeholder="请输入操作模块"></el-input>
          </el-form-item>
          <el-form-item class="item-data" label="操作时间:">
            <el-date-picker
              class="datepicker"
              v-model="form.operStartTimeS"
              type="datetime"
              :clearable="false"
              prefix-icon="el-icon-date"
              placeholder="开始时间"
            ></el-date-picker>
            <span style="diaplay:inline-block;width:12px; color: #448dd5"> — </span>
            <el-date-picker
              class="datepicker"
              v-model="form.operEndTimeS"
              type="datetime"
              :clearable="false"
              prefix-icon="el-icon-date"
              placeholder="结束时间"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div class="formItem">
          <el-form-item label="操作类型:">
            <el-select v-model="form.bitName" placeholder="请选择操作类型">
              <el-option v-for="item in optTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作结果:">
            <el-select v-model="form.operResult" placeholder="placeholder">
              <el-option v-for="item in resTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" class="shadow-btn" plain round @click="searchChange"
            >查询</el-button>       
          <div class="tableTool" @click="handleClick('export')">
            <img src="img/table_tool3.png" alt="" />
            <span>报表导出</span>
          </div>
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
      :pageSize="form.row"
      :total="page.total"
      @current-change="currentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import titleBox from "_com/contenBox/titleBox.vue";
import myPagination from "_com/myPagination/index";
import { selectOperlog } from '@/api/report/infoService.js'

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
        { prop: "operModule", label: "操作模块" },
        { prop: "userName", label: "用户名称" },
        { prop: "bitName", label: "操作类型" },
        { prop: "operResult", label: "操作结果", formatter: this.statusFilter },
        { prop: "operDesc", label: "操作描述" },
        { prop: "operTime", label: "操作时间" },
        { prop: "clientIp", label: "客户端IP" },
      ],
      tableData: [],
      selection: [], // 选择的数据
      dialogVisible: false,
      dialogTitle: "新增分组",
      form: {
        userName:"",
        operModule:"",
        operModule:"",
        operEndTimeS:"",
        bitName:"全部",
        operResult:"全部",
        page:1,
        row:10
      },
      optTypes: [
        {label: '全部', value: '全部'},
        {label: '修改', value: '修改'},
        {label: '删除', value: '删除'},
        {label: '增加', value: '增加'},
        {label: '导入', value: '导入'},
        {label: '导出', value: '导出'},
        {label: '查询', value: '查询'},
        {label: '深度上报', value: '深度上报'},
        {label: '管理范围', value: '管理范围'},
        {label: '续约到期', value: '续约到期'},
        {label: '补传照片', value: '补传照片'},
        {label: '迁移分组', value: '迁移分组'},
        {label: '重置密码', value: '重置密码'},
        {label: '面积上报', value: '面积上报'},
        {label: '面积审核', value: '面积审核'},
      ],
      resTypes: [
        {label: '全部', value: '全部'},
        {label: '执行成功', value: '执行成功'},
        {label: '执行失败', value: '执行失败'},
      ],
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
        userName: this.form.username,
        operModule: this.form.operModule,
        operStartTimeS: this.form.operStartTimeS,
        operEndTimeS: this.form.operEndTimeS,
        bitName: this.form.bitName,
        operResult: this.form.operResult,
        filePath: this.form.filePath,
        page: this.page.currentPage,
        rows: this.page.pageSize
      }
      let res = await selectOperlog(params);
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
    statusFilter(row) {
      return row.operResult == '0' ? '执行成功' : '执行失败'
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.initData();
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.initData();
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
          width: 100%;
        }
      }
      .item-data {
        width: 600px;
        .datepicker {
          width: 40% !important;
        }
      }
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