<template>
<el-dialog
      class="dialog"
      title="终端变更记录"
      :visible.sync="dialogVisible"
      :width="'1000px'"
      top="20vh"
    >
    <div>
      <div class="ChangeQuery">
    <el-table :data="tableData" style="width: auto" :height="358">
      <el-table-column prop="id" label="序号" width="94px">
        <template slot-scope="scope">
          <div class="id-container">{{scope.$index+1}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="changeTime" label="更换时间" width="215px">
        <template slot-scope="scope">
          <div class="time-container">{{scope.row.changeTime}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="changeDiscribe" label="更换描述" width="595px">
        <template slot-scope="scope">
          <div class="time-container">{{scope.row.changeDesc}}</div>
        </template>
      </el-table-column>
    </el-table>
      <myPagination
        :currentPage="page.currentPage"
        :pageSize="page.pageSize"
        :total="page.total"
        @current-change="handleCurrentChange"
      />
      </div>
    </div>

    </el-dialog>
</template>

<script>
import myPagination from '_com/myPagination/index';
import {queryTerminalHistroy} from "../../../../api/basic";

export default {
  components:{
    myPagination
  },
  props: ['selectId'],
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
        pageSizes: [10,20,30,40,50,100]
      },
    };
  },
  watch: {
    "selectId": {
      handler(newName, oldName) {
        console.log(newName);
        if(newName){
          this.queryTerminalHistroy(newName);
        }
      },
      immediate: true
    }
  },
  methods: {
    async queryTerminalHistroy(id){
      let res = await queryTerminalHistroy({
        page: this.page.currentPage,
        limit: this.page.pageSize,
        terminalId: id
      });
      if(!res.code){
        this.tableData = res.data.list;
        this.page.total = res.data.totalCount;
      }
    },
    handleCurrentChange(val){
      this.page.currentPage = val;
      this.queryTerminalHistroy(this.selectId);
    }
  }
};
</script>

<style lang="less" scoped>
.ChangeQuery {
  border-width: 1px;
  border-color: rgb(100, 191, 255);
  border-style: solid;
  background-color: rgba(7, 29, 71, 0.902);
  box-shadow: inset 0px 0px 87px 0px rgba(20, 143, 255, 0.18);
  /deep/.el-table {
    background-color: transparent;
    border: none;
    margin-top: 35px;
    margin-left: 13px;
    margin-right: 14px;

    .cell {
      display: flex;
      flex-direction: row;
      align-items: center;
      .id-container{
        font-size: 14px;
        background-color: #022f5a;
        color: #aac2d6;
        height: 20px;
        width: 20px;
        border-radius: 10px;
        text-align: center;
      }
      .time-container{
        color: #aac2d6;
      }
    }
    td,
    tr,
    th.is-leaf {
      background-color: transparent;
      border: none;
    }
    td.gutter,
    th.gutter {
      background-color: transparent;
    }
    thead {
      background-color: #022f5a;
      color: #67c8ff;
    }
    .el-table--enable-row-hover,
    .el-table__body tr:hover > td {
      background-color: #022f5a;
    }

    /deep/.el-table--border {
      border: none;
    }
    .el-table--border::after,
    .el-table--group::after {
      width: 0;
    }
  }
      /deep/.el-pagination {
        padding-left: 16px;
        color: #aac2d6;
        margin-top: 35px;
        margin-bottom: 25px;
      }
}
    /deep/.el-table::before {
      width: 0;
      height: 0;
    }
</style>