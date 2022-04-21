<template>
  <div class="contTable">
    <div class="searchBox">
      <el-form class="my-form" label-position="right" label-width="80px" :model="form" :inline="true">
        <el-form-item label="农机分组:" >
          <el-input v-model="groupData.name" placeholder="请选择农机分组"  @focus="setGroupBoxStatus(true)">
          </el-input>
        </el-form-item>
          <el-form-item label="机具类型:"  >
            <el-select v-model="form.toolType" clearable placeholder="请选择机具类型">
              <el-option v-for="item in toolTypeSelect" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
        <el-form-item label="机具识别码:"  label-width="85px">
          <el-input v-model="form.toolIfa" placeholder="请输入机具识别码"></el-input>
        </el-form-item>
        <el-form-item label="终端编号:" >
          <el-input v-model="form.terminalCode" placeholder="请输入终端编号"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn">
        <el-button type="primary" class="shadow-btn" round @click="search(page,form)">查询</el-button>
      </div>
    </div>
    <div class="table">
      <div class="table_btns">
        <div class="btn-left">
         <el-button type="primary" class="shadow-btn" round @click="addToolsInfo">新增</el-button>
        </div>
        <div class="btn-right">
          <!-- <div class="vertical"></div> -->
          <div class="tableTool" @click="importInfo">
            <img src="img/table_tool2.png" alt="">
            <span>报表导入</span>
          </div>
          <div class="vertical"></div>
          <div class="tableTool">
            <img src="img/table_tool3.png" alt="">
            <span>报表导出</span>
          </div>
          <div class="vertical"></div>
          <div class="tableTool" @click="delInfo">
            <img src="img/table_tool4.png" alt="">
            <span>删除</span>
          </div>
        </div>
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
            fixed="left">
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="60"
            fixed="left">
          </el-table-column>
          <el-table-column
            v-for="(item,index) in columns"
            :key="item.label"
            :prop="item.prop"
            :label="item.label"
            :width="item.width">
            <template slot-scope="scope">
              <el-button v-if="item.prop == 'toolIfa'" type="text" class="table-text-btn" @click="editToolsInfo(scope)">{{ scope.row[item.prop] }}</el-button>
              <span v-else>{{scope.row[item.prop]}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="myPage">
      <myPagination
        :currentPage="page.currentPage"
        :pageSize="page.pageSize"
        :total="page.total" 
        @current-change="currentChange"
        @size-change="sizeChange"
        />
    </div>
    <AddDialog ref="addDialog" @freshTable="search(page,form)"></AddDialog>
    <AddDialog ref="editDialog" @freshTable="search(page,form)"></AddDialog>
    <ImportDialog ref="importDialog"></ImportDialog>
  </div>
</template>

<script>
import AddDialog from "../dialog/addDialog"
import ImportDialog from  "../dialog/importDialog"
import myPagination from '_com/myPagination/index'
import {addCdTool,delCdTool,queryToolPage,updateCdTool} from "@/api/basic/tool"
import {getMachineDict} from "@/api/basic/machine";
import {mapGetters, mapMutations} from "vuex";
import {getSelectionIds} from "../../../../util/util";
import { delUser } from '../../../../api/admin/user'
import { machineForm } from '../../machinerInfo/js'


export default {
  name: "contTable",
  components: {
    AddDialog,
    ImportDialog,
    myPagination
  },
  data(){
    return{
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
      },
      form: {
        groupId:'',
        key:'',
        order:'',
        orderField:'',
        limit:10,
        terminalCode:'',
        toolIfa:'',//机具识别码
        toolType:'',//机具类型
      },
      tableData: [
      ],
      columns: [
        {prop: 'toolIfa', label: '机具识别码', width: '160px'},
        {prop: 'plateNumber', label: '农机', width: '160px'},
        {prop: 'toolTypeName', label: '机具类型', width: '160px'},
        {prop: 'terminalCode', label: '终端号', width: '160px'},
        {prop: 'toolWidth', label: '作业宽幅', width: '160px'},
        {prop: 'toolHeight', label: '机具高度（公分）', width: '160px'},
        {prop: 'toolName', label: '机具名称', width: '160px'},
        {prop: 'createdDate', label: '录入时间', width: '160px'},
        {prop: 'remark', label: '备注', width: ''},
      ],
      toolTypeSelect:[],//机具类型
      selection: [],
    }
  },
  computed:{  
    ...mapGetters(['groupData'])
  },
  created(){
    //获取机具类型
    this.getToolTypeSelect()
    this.searchToolList(this.page,this.form)
  },
  methods: {
    ...mapMutations({
      setGroupBoxStatus: 'setGroupBoxStatus',
    }),
    //查询事件
    search(page,form){
      this.searchToolList(page,form)
    },
    //翻页
    currentChange(current){
      this.page.currentPage = current;
      this.searchToolList(this.page,this.form);
    },
    sizeChange(size){
      this.page.pageSize = size;
      this.searchToolList(this.page,this.form);
    },
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    //新增机具
    addToolsInfo(){
      if(this.groupData.data){
        if(this.groupData.data.groupAttribute == 5 || this.groupData.data.groupAttribute == 9){
          this.$refs.addDialog.tag = 'add'
          this.$refs.addDialog.dialogVisible = true;
          this.$refs.addDialog.groupId =  this.groupData.data.id 
        }else{
          this.$message.error("选择农机分组需为合作社或个人终端")
        }
      }else{
        this.$message.error("请先选择农机分组")
      }
    },
    //编辑机具
    editToolsInfo(scope){
      this.$refs.editDialog.tag = 'edit'
      this.$refs.editDialog.dialogVisible = true;
      this.$refs.editDialog.form = {
          rowId:scope.row.rowId,
          toolName:scope.row.toolName,
          toolIfa:scope.row.toolIfa,
          toolWidth:scope.row.toolWidth,
          toolHeight:scope.row.toolHeight,
          remark:scope.row.remark,
          machineId:scope.row.machineId,
          toolType:scope.row.toolType,
          terminalCode:scope.row.terminalCode
      }
      this.$refs.editDialog.groupId = scope.row.belongGroupId
    },
    importInfo(){
      this.$refs.importDialog.dialogVisible = true;
    },
    //删除机具信息
    delInfo(){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.delToolById()
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //获取机具类型
    async getToolTypeSelect(){
      let res = await getMachineDict({
        listType: 'tool_type'
      });
      if(!res.code){
        this.toolTypeSelect = res.data;
      }
    },
    //列表查询
    async searchToolList(page,form){
      let groupId = this.groupData.ids || [];
      let res = await queryToolPage(Object.assign({
        groupId: groupId.join(','),
        limit: page.pageSize,
        page: page.currentPage,
      }, form))
      if(!res.code){
        this.tableData = res.data.list;
        this.page.total = res.data.totalCount;
      } else {
        this.$message.error('查询失败')
      }
    },
    //删除机具信息
    async delToolById(){
      let ids = getSelectionIds(this.selection,'rowId');
      let res = await delCdTool({
        rowIds: ids
      });
      if(!res.code){
        this.$message({
          type: 'success',
          message: res.msg
        });
        this.searchToolList(this.page,this.form);
      }
    },
  }
}
</script>

<style scoped lang="less">
.contTable {
  margin-top: 20px;
  margin-left: 27px;
  height: 100%;
  .searchBox {
    //width: 1583px;
    width: calc(100% - 27px);
    padding-bottom: 5px;
    position: relative;
    border-bottom: 1px solid #133460;

    /deep/ .el-form-item__label{
      padding: 0;
    }
    .el-form--inline .el-form-item {
      margin-right: 15px;
      margin-bottom: 10px;
    }
    /deep/.el-input {
      width: 215px;
    }
    .datepicker {
      width: 170px !important;
    }
    .btn {
      height: 36px;
      position: absolute;
      left: 1275px;
      bottom: 19px;
    }
  }
  .table {
    height: calc(100% - 76px);
    padding-right: 24px;
    .table_btns {
      margin: 15px 0;
      height: 31px;
      position: relative;
      .btn-left {
        height: 31px;
        display: flex;
      }
      .btn-right {
        position: absolute;
        height: 31px;
        top: 5px;
        right: 20px;
        display: flex;
        align-items: center;
        .vertical {
          height: 16px;
          width: 1px;
          border-right: 1px solid #294166;
          margin-left: 14px;
          margin-right: 14px;
        }
        .tableTool {
          display: flex;
          align-items: center;
          color: #aac2d6;
          font-size: 14px;
          cursor: pointer;
          img {
            margin-right: 5px;
          }
        }
      }
    }
    .my-table {
      height: calc(100% - 71px);
    }
  }

  .myPage {
    margin-left: -28px;
    margin-top: 5px;
  }
}
</style>