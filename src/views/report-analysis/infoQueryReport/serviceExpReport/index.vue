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
            <el-input v-model="groupData.name" placeholder="请选择农机分组" @focus="open"></el-input>
          </el-form-item>
          <el-form-item label="过期时间:">
            <el-select v-model="form.selectType" placeholder="请选择过期时间">
              <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" class="shadow-btn" plain round @click="searchChange" v-if="btnPermis.btnView"
            >查询</el-button>          
            <el-button type="primary" class="shadow-btn" plain round @click="updateTime" v-if="btnPermis.btnRenew"
            >续约</el-button>
          <div class="tableTool" @click="handleClick('export')" v-if="btnPermis.btnExport">
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
            :show-overflow-tooltip="item.showTooltip"
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
import { dateFormat ,handBlobDown} from '../../../../util/util'

export default {
  components: {
    titleBox,
    myPagination,
  },
  data() {
    return {
      dialogVisible:false,
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
        { prop: "address", label: "机手地址", width: '300px' },
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
      form: {selectType: 1},
      pickerOptions: {
        disabledDate: (val) => {
          return val <= new Date()
        }
      },
      formRule: {
        ETime: [
          {required: true, message: '请选择到期时间', trigger: 'change'}
        ]
      },
      btnPermis: {  //按钮权限
        btnView: true,
        btnRenew: true,
        btnExport: true,
      },
      loading:false
    };
  },
  computed: {
    ...mapGetters(['groupData','permissions',"globalSetting"])
  },
  created() {
    this.setGroupBoxType(1);
    this.getBtnPermis();
    //this.setGroupTree(1)
  },
  
  methods: {
    ...mapMutations({
      setGroupBoxStatus: 'setGroupBoxStatus',
      // setGroupCheckBox: 'setGroupCheckBox'
      setGroupBoxType: "setGroupBoxType",

    }),
    // 打开农机分组框
    open() {
      this.setGroupBoxStatus(true);
    },
    getBtnPermis() {
      this.btnPermis.btnView = this.permissions[window.global.buttonPremission.serviceOverView];
      this.btnPermis.btnRenew = this.permissions[window.global.buttonPremission.serviceOverRenew];
      this.btnPermis.btnExport = this.permissions[window.global.buttonPremission.serviceOverView];
      //console.log('this.btnPermis',this.btnPermis)
      //console.log('this.permissions',this.permissions)
    },
    async initData() {
      this.loading = true
      let params = {
        groupId: this.groupData.ids.toString(),
        selectType: this.form.selectType,
        page:{
          page: this.page.currentPage,
          rows: this.page.pageSize,
        },
        bTimeEx: this.globalSetting.bTime,
        eTimeEx: this.globalSetting.eTime,
        jobType:this.globalSetting.jobType,

      }
      let res = await queryData(params);
      this.loading = false
      // const {code, data} = res;
      if(!res.code) {
        this.tableData = res.data.rows;
        this.page.total = res.data.total;
      }
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
            let res = await updateTime(params)
            const {success, msg} = res;
            if(success) {
              this.$message.success('续约成功');
              this.dialogVisible = false
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
    //导出
    async handleClick() {
      this.loading = true
      if(this.groupData.ids.length <= 0) {
        this.$message.info('请先选择分组');
        return;
      }
      let params = {
        groupId: this.groupData.ids.join(','),
        selectType: this.form.selectType,
        page:{
          page: this.page.currentPage,
          rows: this.page.pageSize
        },
        bTimeEx: this.globalSetting.bTime,
        eTimeEx: this.globalSetting.eTime,
        jobType:this.globalSetting.jobType,
      }
      let res = await excelOutPut(params);
      // const {success, obj , msg} = res;
      if(res.data.success) {
        // let obj = encodeURI(res.data.obj)
        // let url = window.globalUrl.HOME_API + 'agri-web/rp/statistics/downloadExcel?filePath='+obj;
        // downloadPost(url)
        let obj = res.data.obj;
        let title = '服务到期报表.xls';
        let url = window.globalUrl.HOME_API + 'agri-web/rp/statistics/downloadExcel';
        handBlobDown(url,obj,title)
      } else {
        this.$message.error(res.data.msg || '导出失败')
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