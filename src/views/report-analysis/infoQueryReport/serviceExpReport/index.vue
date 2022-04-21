<template>
  <!-- 服务到期报表 -->
  <div class="app-container opreationSeason">
    <titleBox :headName="'服务到期报表'" />
    <basic-container class="basic-con">
      <div class="searchline">
        <el-form
          ref="form"
          class="my-form"
          :model="form"
          label-width="85px"
          :inline="true"
        >
          <el-form-item label="农机分组: ">
            <el-input v-model="groupData.name" placeholder="请选择分组名称" @focus="open"></el-input>
          </el-form-item>
          <el-form-item label="过期时间:">
            <el-select v-model="form.selectType" placeholder="请选择过期时间">
              <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" class="shadow-btn" plain round @click="searchChange"
            >查询</el-button>          
            <el-button type="primary" class="shadow-btn" plain round @click="updateTime"
            >续约</el-button>
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
            :show-overflow-tooltip="item.showTooltip"
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

    <el-dialog 
      class="my-dialog" 
      title="续约" 
      :visible.sync="dialogVisible"
      width="597px"
      top="35vh">
      <el-form class="add-form" ref="form" :model="form" :rules="formRule" label-width="150px" inline>
        <el-form-item label="到期时间" prop="ETime">
          <el-date-picker class="datepicker" type="datetime" placeholder="选择日期" prefix-icon="el-icon-date" :default-time="'00:00:00'" :picker-options="pickerOptions" :clearable="false" v-model="form.ETime" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="shadow-btn" plain round @click="submit">提交</el-button>
        <el-button class="shadow-btn" plain round @click="close">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import titleBox from "_com/contenBox/titleBox.vue";
import myPagination from "_com/myPagination/index";
import { queryData, updateTime, excelOutPut } from '@/api/report/infoService.js';
import { mapGetters, mapMutations  } from 'vuex'
import { dateFormat } from '../../../../util/util'
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
        { prop: "code", label: "车牌号", width: '150px' },
        { prop: "groupName", label: "农机分组", width: '480px', showTooltip: true },
        { prop: "driverName", label: "农机手姓名" },
        { prop: "driverPhone", label: "联系电话" },
        { prop: "address", label: "机手地址", width: '350px' },
        { prop: "serverOverTime", label: "服务到期时间" },
      ],
      tableData: [],
      types: [
        {label: '全部', value: 1},
        {label: '已过期', value: 2},
        {label: '周内过期', value: 3},
        {label: '月内过期', value: 4},
      ],
      selection: [], // 选择的数据
      selectIds: [],
      dialogVisible: false,
      dialogTitle: "新增分组",
      form: {selectType: 1},
      model: "",
      showMaps: false,
      editTitle: "",
      echartType:true,
      dialogVisible: false,
      pickerOptions: {
        disabledDate: (val) => {
          return val <= new Date()
        }
      },
      formRule: {
        ETime: [
          {required: true, message: '请选择到期时间', trigger: 'change'}
        ]
      }
    };
  },
  computed: {
    ...mapGetters(['groupData'])
  },
  created() {
    
  },
  methods: {
    ...mapMutations({
      setGroupBoxStatus: 'setGroupBoxStatus',
      // setGroupCheckBox: 'setGroupCheckBox'
    }),
    // 打开农机分组框
    open() {
      // this.setGroupCheckBox(true);
      this.setGroupBoxStatus(true);
    },
    async initData() {
      let params = {
        groupid: this.groupData.ids.join(','),
        selectType: this.form.selectType,
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
    currentChange(val) {
      this.page.currentPage = val;
      this.initData();
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.initData();
    },
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
      this.selectIds = selection.map(item => {
        return item.rowId;
      })
    },
     // 判断当前是否有选择数据
    checkData() {
      if(this.selection.length > 0) {
        return true;
      } else {
        this.$message({
          type: 'info',
          message: '请勾选需要操作的农机信息'
        }); 
      }
      return false;
    },
    updateTime() {
      if(this.checkData()) {
        this.dialogVisible = true;
      }
    },
    submit() {
      let times = [];
      this.selection.map(item => {
        if(item.serverOverTime) {
          times.push(new Date(item.serverOverTime))
        }
      })
      this.$refs.form.validate(async valid => {
        if(valid) {
          let check = times.every(item => {
            return item < this.form.ETime
          })
          if(check) {
            let params = {
              rowIds: this.selectIds.join(','),
              time: dateFormat(this.form.ETime)
            }
            let res = await updateTime(params, new Date().getTime())
            const {success, msg} = res;
            if(success) {
              this.$message.success('续约成功');
              this.initData();
            } else {
              this.$message.error(msg || '续约失败')
            }
          } else {
            this.$message.info('时间必须大于之前服务结束时间!');
            return;
          }
        }
      })
    },
    close() {
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    },
    async handleClick() {
      if(this.groupData.ids.length <= 0) {
        this.$message.info('请先选择分组');
        return;
      }
      let params = {
        groupid: this.groupData.ids.join(','),
        selecttype1: this.form.selectType
      }
      let res = await excelOutPut(params);
      const {success, msg} = res;
      if(success) {

      } else {
        this.$message.error(msg || '导出失败')
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
      .el-form-item {
        margin-bottom: 0;
        margin-right: 20px;
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