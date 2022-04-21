<template>
  <!-- 分组管理 -->
  <div class="app-container opreationSeason">
    <titleBox :headName="'重复作业警告报表'" />
    <basic-container class="basic-con">
      <div class="searchline">
      <el-form class="my-form" label-position="right" label-width="85px" :model="form">
        <div class="formItem">
          <el-form-item label="农机分组:">
            <el-input v-model="groupData.name" placeholder="请选择分组名称" @focus="open"></el-input>
          </el-form-item>
          <el-form-item label="农机信息:">
            <el-input v-model="form.region" placeholder="请输入农机信息"></el-input>
          </el-form-item>
          <el-form-item class="item-data" label="作业时间:">
            <el-date-picker
              class="datepicker"
              v-model="form.jobStartTime"
              type="datetime"
              :clearable="false"
              prefix-icon="el-icon-date"
              placeholder="开始时间"
            ></el-date-picker>
            <span style="diaplay:inline-block;width:12px; color: #448dd5"> — </span>
            <el-date-picker
              class="datepicker"
              v-model="form.jobEndTime"
              type="datetime"
              :clearable="false"
              prefix-icon="el-icon-date"
              placeholder="结束时间"
            ></el-date-picker>
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
import { mapMutations, mapGetters } from 'vuex';
import { queryData } from '@/api/report/analysisAlarm'

export default {
  name: "department",

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
      dialogVisible: false,
      dialogTitle: "新增分组",
      form: {
        jobStartTime: new Date(new Date(new Date().setMonth(0,1)).setHours(0,0,0,0)),
        jobEndTime: new Date(new Date(new Date().setMonth(11,31)).setHours(23,59,59,999)),
      },
      model: "",
      showMaps: false,
      editTitle: "",
      echartType:true,

    };
  },
  computed: {
    ...mapGetters(['groupData'])
  },
  created() {
    // this.initData();
  },
  methods: {
    ...mapMutations({
      setGroupBoxStatus: 'setGroupBoxStatus',
    }),
    // 打开农机分组框
    open() {
      this.setGroupBoxStatus(true);
    },
    async initData() {
      let params = {
        btime: this.form.jobStartTime,
        etime: this.form.jobEndTime,
        machineid: '',
        page: this.page.currentPage,
        rows: this.page.pageSize
      }
      let res = await queryData(params);
      // const {code, data} = res;
      // if(code == 0) {
        this.tableData = res.rows;
        this.page.total = res.total;
      // }
    },
    // 查询
    searchChange() {
      if(this.groupData.ids.length <= 0) {
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
    handleClick() {
      if(this.groupData.ids.length <= 0) {
        this.$message.info('请先选择分组');
        return;
      }
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
          width: 215px;
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