<template>
<el-dialog
      class="dialog"
      :title="'农机变更查询'"
      :visible.sync="dialogVisible"
      :width="'1000px'"
      top="20vh"
    >
    <div>
      <div class="ChangeQuery">
    <el-table :data="tableData" style="width: auto" :height="358">
      <el-table-column type="index" width="94px">
        <template slot-scope="scope">
          <div class="id-container">{{scope.$index+1}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="changeTime" label="更换时间" width="215px">
        <template slot-scope="scope">
          <div class="time-container">{{scope.row.changeTime}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="changeDesc" label="更换描述" width="595px">
        <template slot-scope="scope">
          <div class="time-container">{{scope.row.changeDesc}}</div>
        </template>
      </el-table-column>
    </el-table>
      <myPagination
        :currentPage="page.currentPage"
        :pageSize="page.pageSize"
        :total="page.total"
      />
      </div>
    </div>
    </el-dialog>
</template>

<script>
import myPagination from '_com/myPagination/index';
import {getMachineHistroy} from "../../../../api/basic/machine";

export default {
  components:{
    myPagination
  },
  props:['selectId'],
  data() {
    return {
      dialogVisible: false,
      tableData: [
        {
          id: 1,
          changeTime: "2021-8-20 10:53:11",
          changeDiscribe:
            "修改了：第三方终端偶爱高分红挨饿过后挨饿海购啊我i哈佛iOIROAIJEOIFJAGOI而佛ii奥法啊我刚好啊我i外哦哦啊饿哦额啊i哦啊大囧给",
        },
      ],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
      },
    };
  },
  watch: {
    "selectId": {
      handler(newName, oldName) {
        console.log(newName);
        if(newName){
          this.getMachineHistroy(this.page,newName);
        }
      },
      immediate: true
    }
  },
  methods: {
    async getMachineHistroy(page,id){
      let res= await getMachineHistroy({
        page: page.currentPage,
        limit: page.pageSize,
        machineId: id,
      });
      if(!res.code){
        this.tableData = res.data.list;
        this.page.total = res.data.totalCount;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.ChangeQuery {
  /deep/.el-table {
    background-color: transparent;
    border: none;
    padding-top: 35px;
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
        padding-bottom: 25px;
      }
}
    /deep/.el-table::before {
      width: 0;
      height: 0;
    }
</style>