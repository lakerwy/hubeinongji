<template>
<!-- 分组管理 -->
  <div class="app-container opreationSeason">
    <titleBox :headName="'通信协议管理'" />
    <basic-container class="basic-con">
      <el-form ref="form" class="my-form" :model="form" :inline="true">
        <el-form-item label="协议名称:">
          <el-input v-model="model" placeholder="请输入正确的协议名称" ></el-input>
        </el-form-item>
        <el-form-item label="服务器IP:">
          <el-input v-model="model" placeholder="请输入正确的IP地址" ></el-input>
        </el-form-item>
        <el-form-item label="通信端口号:">
          <el-input v-model="model" placeholder="请选择通信端口号" ></el-input>
        </el-form-item>
        <el-button class="shadow-btn"  round  v-if="btnPermis.btnView">查询</el-button>
      </el-form>
      <div class="my-table">
        <div class="avue-crud__menu" v-if="btnPermis.btnAdd || btnPermis.btnDelete">
          <div class="avue-crud__left">
            <el-button
              v-if="btnPermis.btnAdd"
              class="shadow-btn"
              plain
              round
              size="mini"
              @click="handleCreate">新增</el-button>
            <el-button
              v-if="btnPermis.btnDelete"
              class="shadow-btn"
              plain
              round
              size="mini"
              @click="handleDelete">删除</el-button>
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
          <el-table-column prop="terminalCode" label="协议名称">
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
      @current-change="currentChange" />

    <EditInfoDialog ref="editInfo" :title="editTitle"></EditInfoDialog>
  </div>
</template>

<script>
import titleBox from '_com/contenBox/titleBox.vue'
import myPagination from '_com/myPagination/index.vue'
import EditInfoDialog from "./dialog/editInfo"
import {mapGetters} from "vuex";

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
        total: 4
      },
      
      columns: [
        // {prop: 'sesonName', label: '协议名称'},
        {prop: 'groupName', label: '服务器IP'},
        {prop: 'type', label: '通信端口'},
        {prop: 'startTime', label: '备用服务器IP'},
        {prop: 'endTime', label: '备用通信端口'},
        {prop: 'endTime', label: '协议描述 '},
      ],
      tableData: [
        {groupName: '荆州市公安县合作社'},
        {sesonName: '2021油菜直播'},
        {sesonName: '2021油菜直播'},
        {sesonName: '2021油菜直播'},
      ],
      selection: [], // 选择的数据
      dialogVisible: false,
      dialogTitle: '新增分组',
      form: {},
      showMaps: false,
      model: '',
      editTitle: '',
      btnPermis: {  //按钮权限
        btnView: true,
        btnAdd: true,
        btnEdit: true,
        btnDelete: true,
      }
    }
  },
  created() {
    this.getBtnPermis();
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  methods: {
    getBtnPermis() {
      this.btnPermis.btnView = this.permissions[window.global.buttonPremission.protocolView];
      this.btnPermis.btnAdd = this.permissions[window.global.buttonPremission.protocolAdd];
      this.btnPermis.btnEdit = this.permissions[window.global.buttonPremission.protocolEdit];
      this.btnPermis.btnDelete = this.permissions[window.global.buttonPremission.protocolDelete];
      //console.log('this.btnPermis',this.btnPermis)
      //console.log('this.permissions',this.permissions)
    },
    initData() {

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
      this.editTitle = "通信协议管理新增";
      this.$refs.editInfo.dialogVisible = true;
    },
    // 编辑
    editToolsInfo() {
      this.editTitle = "通信协议管理编辑";
      this.$refs.editInfo.dialogVisible = true;
    },
    // 删除
    handleDelete() {
      if(this.selection.length <= 0) {
        this.$message.info('请选择需要删除的分组');
        return;
      }
      this.$confirm('是否确认删除选中的数据?', '提示', {
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