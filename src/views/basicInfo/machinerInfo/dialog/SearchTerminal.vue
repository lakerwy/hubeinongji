<template>
  <div>
    <el-dialog
      class="dialog"
      title="查询终端"
      :visible.sync="searchVisible"
      :width="'1100px'"
      top="30vh"
    >
      <div class="content">
        <el-form ref="form" :model="searchForm" label-width="90px" :inline="true">
          <el-form-item label="终端编号:">
            <el-input v-model="searchForm.terminalCode" placeholder="请输入终端编号" ></el-input>
          </el-form-item>
          <el-form-item label="是否包含SIM卡:" label-width="150px">
            <el-select v-model="searchForm.containSim" clearable>
              <el-option label="是" value="Y"></el-option>
              <el-option label="否" value="N"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="SIM卡号码:">
            <el-input v-model="searchForm.simNumber" placeholder="请输入SIM卡号码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: 30px" type="primary" class="shadow-btn" round @click="searchTerminalList" >查询</el-button>
          </el-form-item>
        </el-form>

        <div class="my-table">
          <el-table
            :data="tableData"
            style="width: 100%"
            height="100%"
            border
            v-loading="loading"
            @selection-change="handleSelectChange"
          >
            <el-table-column
              type="selection"
              label="全选"
              width="55"
              fixed="left">
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              width="60"
              fixed="left"
            >
            </el-table-column>
            <el-table-column prop="terminalCode" label="终端编号">
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

          <div class="myPage">
            <myPagination
              :currentPage="page.currentPage"
              :pageSize="page.pageSize"
              :total="page.total"
              @current-change="currentChange"
            />
          </div>
        </div>
      </div>
      <div class="commit">
        <el-button type="primary" class="shadow-btn" @click="cancel">取消</el-button>
        <el-button type="primary" class="shadow-btn" @click="save">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import myPagination from '_com/myPagination/index'
import {getInquireTerminal} from "../../../../api/basic/machine";

export default {
  components: {
    myPagination
  },
  data(){
    return{
      loading: false,
      searchVisible: false,
      searchForm: {},
      selection: [],
      columns: [
        {prop: 'containSim', label: '是否有SIM卡', width: '', formatter: row=>{
            return row.containSim == 'Y' ? "是" : "否"
          }},
        {prop: 'simNumber', label: 'SIM卡号码', width: ''},
        {prop: 'protocolName', label: '通信协议', width: ''},
        {prop: 'simOvertime', label: 'SIM卡结束时间', width: ''},
        {prop: 'manufacturer', label: '生产厂商', width: ''},
      ],
      tableData: [
      ],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      }
    }
  },
  methods: {
    cancel() {
      this.searchVisible = false
    },
    save(){
      if (this.selection.length != 1) {
        this.$message.info('请勾选一个终端信息');
        return;
      }
      this.$emit('getNewTerminalForm',this.selection[0]);
      this.searchVisible = false
    },
    //查询终端
    async searchTerminalList(){
      this.loading = true;
      let res = await getInquireTerminal(Object.assign({
        page: this.page.currentPage,
        rows: this.page.pageSize
      },this.searchForm))
      if(res){
        this.tableData = res.list;
        this.page.total = res.total;
        this.loading = false;
      }
    },
    currentChange(val){
      this.page.currentPage = val;
      this.searchTerminalList();
    },
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
  }
}
</script>

<style scoped lang="less">
.content {
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;
  .upload-demo {
    color: #9BB2C7;
    .shadow-btn {
      margin-left: 10px;
      margin-right: 20px;
    }
  }
  .upload {
    display: block;
    margin-top: 20px;
    color: #54A6D8;
  }

  .my-table {
    height: 200px;
  }
}

.dialog-footer {
  height: 30px;
  padding-right: 25px;
}
.myPage {
  margin-top: 25px;
}
.commit {
  display: flex;
  flex-direction: row-reverse;
  padding-right: 50px;
  margin-bottom: 20px;
  margin-top: 20px;
}
</style>