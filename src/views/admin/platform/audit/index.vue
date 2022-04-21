<template>
  <!-- 分组管理 -->
  <div class="app-container opreationSeason">
    <titleBox :headName="'审核标准'"/>
    <basic-container class="basic-con">
      <el-form ref="form" class="my-form" :model="form" :inline="true">
        <el-form-item label="分组名称:">
          <el-input v-model="model" placeholder="请选择分组"></el-input>
        </el-form-item>
        <el-form-item label="作业类型:">
          <el-select v-model="model" placeholder="请选择作业类型">
            <el-option label="label" value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年份时间:">
          <el-select v-model="model" placeholder="请选择年份">
            <el-option label="label" value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-button class="shadow-btn" plain round>查询</el-button>
      </el-form>
      <div class="my-table">
        <div class="avue-crud__menu">
          <div class="avue-crud__left">
            <el-button
              class="shadow-btn"
              plain
              round
              size="mini"
              @click="handleCreate">新增
            </el-button>
            <el-button
              class="shadow-btn"
              plain
              round
              size="mini"
              @click="handleDelete">删除
            </el-button>

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
            type="index"
            label="序号"
            width="120"
            fixed="left">
          </el-table-column>
          <el-table-column prop="terminalCode" label="作业季">
            <template slot-scope="scope">
              <el-button type="text" class="table-text-btn"  @click="editToolsInfo">{{ scope.row.sesonName }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in columns"
            :key="item.label"
            :prop="item.prop"
            :label="item.label"
            :width="item.width">
          </el-table-column>
        </el-table>
      </div>
    </basic-container>
    <myPagination
      style="margin-top:32px;"
      :currentPage="page.currentPage"
      :pageSize="page.pageSize"
      :total="page.total"
      @current-change="currentChange"/>

    <EditInfoDialog ref="editInfo" :title="editTitle"></EditInfoDialog>
  </div>
</template>

<script>
import titleBox from '_com/contenBox/titleBox.vue'
import myPagination from '_com/myPagination/index.vue'
import EditInfoDialog from "./dialog/editInfo"

export default {
  name: 'department',
  components: {
    titleBox,
    myPagination,
    EditInfoDialog
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
        // {prop: 'sesonName', label: '作业季'},
        {prop: 'groupName', label: '分组名称'},
        {prop: 'type', label: '作业类型'},
        {prop: 'startTime', label: '自动审核'},
        {prop: 'endTime', label: '审核深度(公分)'},
        {prop: 'endTime', label: '审核合格率(%) '},
        {prop: 'endTime', label: '截取深度(公分) '},
        {prop: 'endTime', label: '补贴标准(元/亩) '},
        {prop: 'endTime', label: '审核类型'},
      ],
      tableData: [
        {sesonName: '2021油菜直播', groupName: '荆州市公安县合作社',type: 11,startTime:11,endTime:1234},
        {sesonName: '2021油菜直播', groupName: '荆州市公安县合作社',type: 11,startTime:11,endTime:1234},
        {sesonName: '2021油菜直播', groupName: '荆州市公安县合作社',type: 11,startTime:11,endTime:1234},
        {sesonName: '2021油菜直播', groupName: '荆州市公安县合作社',type: 11,startTime:11,endTime:1234},
        {sesonName: '2021油菜直播', groupName: '荆州市公安县合作社',type: 11,startTime:11,endTime:1234},
      ],
      selection: [], // 选择的数据
      dialogVisible: false,
      dialogTitle: '新增分组',
      form: {},
      showMaps: false,
      model: '',
      editTitle: '',
    }
  },
  methods: {
    initData() {

    },
    // 查询
    searchChange() {

    },
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    // 新增 编辑
    handleCreate() {
      this.editTitle = "审核管理新增";
      this.$refs.editInfo.dialogVisible = true;
    },
    editToolsInfo() {
      this.editTitle = "审核管理编辑";
      this.$refs.editInfo.dialogVisible = true;
    },
    // 删除
    handleDelete() {
      if (this.selection.length <= 0) {
        this.$message.info('请选择需要删除的分组');
        return;
      }
      this.$confirm('是否确认删除选中的数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.getList(this.page)
        this.$notify.success('删除成功')
      })
    },

    // 保存
    save() {

    },
    currentChange(){

    }
  }
}
</script>

<style lang="less" scoped>
.opreationSeason {
  .basic-con {
    .my-form {
      border-bottom: #133460 1px solid;

      .el-form-item {
        margin-bottom: 18px;
        margin-right: 20px;
      }

      /deep/ .el-form-item__label {
        line-height: 36px;
      }

      .shadow-btn {
        height: 36px !important;
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