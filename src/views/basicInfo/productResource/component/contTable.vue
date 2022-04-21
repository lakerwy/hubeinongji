<template>
  <div class="contTable">
    <div class="searchBox">
      <el-form class="my-form" label-position="right" label-width="80px" :model="form" :inline="true">
        <el-form-item label="资源类别:" >
          <el-select v-model="form.resourcesType" placeholder="请选择资源类别">
            <el-option v-for="(item,index) in resourcesTypeSelect" :label="item.itemName" :value="item.itemCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称:"  label-width="85px">
          <el-input v-model="form.resourcesName" placeholder="请输入资源名称"></el-input>
        </el-form-item>
        <el-form-item label="联系姓名:" >
          <el-input v-model="form.ownerName" placeholder="请输入联系姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" >
          <el-input v-model="form.ownerPhone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn">
        <el-button type="primary" class="shadow-btn" @click="getResourcesList(page,form)" round>查询</el-button>
      </div>
    </div>
    <div class="table">
      <div class="table_btns">
        <div class="btn-left">
          <el-button type="primary" class="shadow-btn" round @click="addClick">新增</el-button>
          <!-- <el-button type="primary" class="shadow-btn" round @click="deletetClick">删除</el-button> -->
          <!-- <el-button type="primary" class="shadow-btn" round @click="importClick">导入</el-button> -->
          <!-- <el-button type="primary" class="shadow-btn" round >导出</el-button> -->
          <el-button type="primary" class="shadow-btn" round @click="switchMap">切换</el-button>
        </div>
        <div class="btn-right">
          <div class="vertical"></div>
          <div class="tableTool" @click="importClick">
            <img src="img/table_tool2.png" alt="">
            <span>报表导入</span>
          </div>
          <div class="vertical"></div>
          <div class="tableTool" @click="reportExport(page,form)">
            <img src="img/table_tool3.png" alt="">
            <span>报表导出</span>
          </div>
          <div class="vertical"></div>
          <div class="tableTool" @click="deletetClick">
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
          <template slot="empty">
            <avue-empty
              image="img/img-zwsj.png"
              desc="暂无数据">
            </avue-empty>
          </template>
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
            v-for="item in columns"
            :key="item.label"
            :prop="item.prop"
            :label="item.label"
            :width="item.width">
                <template slot-scope="scope" >
                <el-button v-if="item.prop == 'resourcesName'" type="text" class="table-text-btn" @click="editClick(scope)">{{scope.row.resourcesName}}</el-button>
                <span v-else-if="item.prop == 'resourcesType'">{{resourcesTypeSelect[scope.row.resourcesType-1].itemName}}</span>
                <span v-else >{{scope.row[item.prop]}}</span> 
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="myPage">
      <myPagination
        :currentPage="page.currentPage"
        :pageSize="page.size"
        :total="page.total" 
        @current-change="currentChange"
        @size-change="sizeChange"
        />
    </div>
    <AddEditDialog ref="edit" :resourcesTypeSelect="resourcesTypeSelect" :dialogType="0" @flashTable="getResourcesList(page,form)"/>
    <AddEditDialog ref="add"  :resourcesTypeSelect="resourcesTypeSelect" :dialogType="1" @flashTable="getResourcesList(page,form)"/>
    <ImportDialog ref="importDialog"/>
  </div>
</template>

<script>
import ImportDialog from '../dialog/ImpotDialog'
import AddEditDialog from '../dialog/AddEditDialog'
import myPagination from '_com/myPagination/index'
import {queryResourcesList,delResourcesInfo,getResourcesInfo,resourcesExcelExport,download} from  "@/api/basic/resources"
import {getMachineDict} from "@/api/basic/machine"
import {getSelectionIds} from "../../../../util/util";

export default {
  name: "contTable",
  components:{
    ImportDialog,
    AddEditDialog,
    myPagination
  },
  data(){
    return{
      currentPage: 1,
      pageSize: 10,
      total: 100,
      page:{
        total:100,
        size:10,
        currentPage:1
      },
      resourcesTypeSelect:[],
      form: {
        resourcesName: '',
        resourcesType: '',
        ownerName: '',
        ownerPhone: ''
      },
      tableData: [],
      columns: [
        {prop: 'resourcesName', label: '资源名称 ', width: '240px'},
        {prop: 'resourcesType', label: '资源类别 ', width: '160px'},
        {prop: 'serverScope', label: '服务范围 ', width: '160px'},
        {prop: 'ownerName', label: '联系姓名 ', width: '160px'},
        {prop: 'ownerPhone', label: '联系电话', width: '160px'},
        {prop: 'lon', label: '资源位置经度', width: '160px'},
        {prop: 'lat', label: '资源位置纬度', width: '160px'},
        {prop: 'address', label: '资源地点', },
      ],
    }
  },
  created(){
    this.getResourcesTypeSelect()
    this.getResourcesList(this.page,this.form)
  },
  methods:{
    async downloadExcel(filepath){
      let res = await download({
        filePath:encodeURI(filepath)
        })
      },
    //处理导出按钮的点击
    async reportExport(page,form){
      let res = await resourcesExcelExport(Object.assign({
        page: page.currentPage,
        limit: page.size,
      }, form))
          this.downloadExcel(res.obj)
    },
    //处理多选事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    //获取资源类别
    async getResourcesTypeSelect(){
      let res = await getMachineDict({
        listType: 'resources_type'
      });
      if(!res.code){
        this.resourcesTypeSelect = res.data;
      }
    },
    //删除
    async delInfo(){
      let ids = getSelectionIds(this.selection,'rowId').slice(0,-1);
      let res = await delResourcesInfo({
        rowIds: ids
      });
      if(!res.code){
        this.$message({
          type: 'success',
          message: res.msg
        });
        this.getResourcesList(this.page,this.form);
      }
    },
    //查询资源列表数据
    async getResourcesList(page,form){
      let res = await queryResourcesList(Object.assign({
        page: page.currentPage,
        limit: page.size,
      }, form))
      if(!res.code){
        this.tableData = res.data.list
        this.page.total = res.data.totalCount
      }
    },
    //翻页事件
    currentChange(current){
      this.page.currentPage = current;
      this.getResourcesList(this.page,this.form);
    },
    sizeChange(size){
      this.page.size = size;
      this.getResourcesList(this.page,this.form);
    },
    addClick(){
      this.$refs.add.dialogVisible = true
    },
    importClick(){
      this.$refs.importDialog.dialogVisible = true
    },
    deletetClick(){
      if(this.selection){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.delInfo()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      }else{
        this.$message({
          type:'error',
          message:"请先选择"
        })
      }
    },
    async getResourcesDetail(rowId){
      let res = await getResourcesInfo(
        rowId
      )
      if(!res.code){
        return res.data
      }
    }
    ,
    //编辑
    async editClick(scope){
      let res = await getResourcesInfo({
        rowId:scope.row.rowId
      })
      if(!res.code){
        res.data.province = res.data.province? res.data.province * 1 : null
        res.data.city = res.data.city? res.data.city * 1 : null
        res.data.country = res.data.country? res.data.country * 1 : null
        res.data.town = res.data.town? res.data.town * 1 : null
        this.$refs.edit.form = res.data 
        if(res.data.province){
          this.$refs.edit.initAddressSelect(res.data)
        }else{
          this.$refs.det
        }
      }
      this.$refs.edit.dialogVisible = true
    },
    switchMap(){
      this.$router.push({path: "basic-product"})
    }
  },
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