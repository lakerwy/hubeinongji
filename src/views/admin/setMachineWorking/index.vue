<template>
<!-- 机具作业设置 -->
  <div class="app-container machine">
    <titleBox :headName="'农机机具作业配置'" />
    <basic-container class="basic-con">
      <el-form class="my-form" :model="searchForm" :inline="true">
        <el-form-item label="农机类型:">
          <el-input v-model="searchForm.deptName" placeholder="请输入农机类型"></el-input>
        </el-form-item>
        <el-form-item label="机具类型:">
          <el-input v-model="searchForm.pname" placeholder="请输入机具类型"></el-input>
        </el-form-item>
        <el-form-item label="作业类型:">
          <el-input v-model="searchForm.pname" placeholder="请输入作业类型"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button style="width: 90px;" class="shadow-btn" plain size="medium" round @click="searchChange">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="my-table">
        <div class="avue-crud__menu">
          <div class="avue-crud__left">
            <el-button
              class="shadow-btn"
              plain
              round
              size="mini"
              @click="handleCreate">新增</el-button>
            <el-button
              class="shadow-btn"
              plain
              round
              size="mini"
              @click="handleExport">导出</el-button>
          </div>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          height="100%"
          @selection-change="handleSelectChange">
          <el-table-column
            type="selection"
            label="全选"
            width="55"
            fixed="left">
          </el-table-column>
          <el-table-column
            v-for="item in columns"
            :key="item.label"
            :prop="item.prop"
            :label="item.label"
            :width="item.width">
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button type="text" @click="handleUpdate(scope.row, scope.$index)"><img :src="[scope.row.isEdit ? 'img/admin/icon_修改_高亮.png' : 'img/admin/icon_修改.png']" alt=""></el-button>
              <el-button type="text" @click="handleDelete(scope.row, scope.$index)" style="margin-left:14px;"><img src="img/admin/icon_删除.png" alt=""></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </basic-container>
    <myPagination
      style="margin-top:32px;"
      :currentPage="page.currentPage"
      :pageSize="page.pageSize"
      :total="page.total"
      @current-change="currentChange" />

      <setMachineDialog ref="machine" />
  </div>
</template>

<script>
import titleBox from '_com/contenBox/titleBox.vue'
import myPagination from '_com/myPagination/index.vue'
import setMachineDialog from '../components/setMachineDialog'
export default {
  name: 'department',
  components: {
    titleBox,
    myPagination,
    setMachineDialog
  },
  data() {
    return {
      searchForm: {},
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {prop: 'type', label: '农机类型'},
        {prop: 'mType', label: '机具类型'},
        {prop: 'wType', label: '作业类型'},
      ],
      tableData: [],
      selection: [], // 选择的数据
      listData: {}, // 操作的数据
    }
  },
  created() {
    this.initData();
  },
  methods: {
    // 树节点点击事件
    handleNodeClick(val) {
      this.initData();
    },
    initData() {
      this.tableData = [
        {type: '拖拉机'},
        {type: '旋耕机'},
        {type: '植草机'},
      ]
    },
    // 查询
    searchChange() {
      
    },
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    // 新增
    handleCreate() {
      this.$refs.machine.dialogVisible = true;
      this.submitType = 'add';
    },
    // 修改
    handleUpdate(row) {
      // this.$set(row, 'isEdit', true)
      this.listData = Object.assign({}, row);
      this.$refs.machine.dialogVisible = true;
    },
    // 删除
    handleDelete(row) {
      this.$confirm('是否确认删除该条数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.getList(this.page)
        this.$notify.success('删除成功')
      })
    },
    // 导出
    handleExport() {
      
    },
    // 切换页
    currentChange(val) {

    }
  }
}
</script>

<style lang="less" scoped>
.machine {
  .basic-con {
    /deep/ .el-card__body {
      width: 100%;
    }
    .my-form {
      border-bottom: #133460 1px solid;
      .el-form-item {
        margin-bottom: 18px;
        margin-right: 20px;
      }
      /deep/ .el-form-item__label {
        line-height: 36px;
      }
    }
    .my-table {
      margin-top: 19px;
      height: calc(100% - 84px);
      /deep/ .el-table {
        height: calc(100% - 54px);
      }
    }
  }
}
</style>