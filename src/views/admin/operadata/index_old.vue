<template>
  <!-- 分组管理 -->
  <div class="app-container opreationSeason">
    <titleBox :headName="'运维资料管理'"/>
    <basic-container class="basic-con">
      <el-form ref="form" class="my-form" :model="form" label-width="95px">
        <div class="formItem">
          <el-form-item label="农机分组:">
            <el-input v-model="groupData.name" @focus="setGroupBoxStatus(true)" placeholder="请选择农机分组"></el-input>
          </el-form-item>
          <el-form-item label="事件类型:">
            <el-select v-model="model" placeholder="请选择事件类型">
              <el-option label="label" value="value"></el-option>
              <el-option label="label" value="value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备厂商:">
            <el-select v-model="model" placeholder="请选择设备厂商">
              <el-option label="label" value="value"></el-option>
              <el-option label="label" value="value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="事件描述:">
            <el-input v-model="model" placeholder="请输入事件描述"></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="model" placeholder="请输入备注"></el-input>
          </el-form-item>
        </div>
        <div class="formItem">
          <el-form-item label="提出人:">
            <el-input v-model="model" placeholder="请输入提出人"></el-input>
          </el-form-item>
          <el-form-item label="解决状态:">
            <el-select v-model="model" placeholder="请选择解决状态">
              <el-option label="label" value="value"></el-option>
              <el-option label="label" value="value"></el-option>
            </el-select>
          </el-form-item>
          <el-button class="shadow-btn" round v-if="btnPermis.btnView">查询</el-button>
        </div>
      </el-form>
      <div class="my-table">
        <div class="avue-crud__menu">
          <div class="avue-crud__left">
            <el-button class="shadow-btn" round size="mini" @click="handleCreate" v-if="btnPermis.btnAdd">新增</el-button>
            <el-button class="shadow-btn" round size="mini" @click="editToolsInfo" v-if="btnPermis.btnEdit">修改</el-button>
            <el-button class="shadow-btn" round size="mini" @click="handleDelete" v-if="btnPermis.btnDelete">删除</el-button>
<!--            <el-button class="shadow-btn" round size="mini" @click="handleDelete">下载</el-button>-->
            <el-button class="shadow-btn" round size="mini" @click="handleDelete" v-if="btnPermis.btnExport">导出</el-button>
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
            width="60"
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
import {mapGetters, mapMutations} from "vuex";

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
        total: 12
      },
      columns: [
        {prop: 'sesonName', label: '提出人'},
        {prop: 'groupName', label: '事件类型'},
        {prop: 'type', label: '事件描述'},
        {prop: 'startTime', label: '设备厂商'},
        {prop: 'endTime', label: '附件'},
        {prop: 'endTime', label: '提出时间'},
        {prop: 'endTime', label: '解决状态'},
        {prop: 'endTime', label: '解决时间'},
        {prop: 'endTime', label: '解决人'},
        {prop: 'endTime', label: '备注'},
      ],
      tableData: [
        {sesonName: '2021油菜直播', groupName: '荆州市公安县',type: 'type',startTime: 'xxx厂',endTime: '无'},
        {sesonName: '2021油菜直播', groupName: '荆州市公安县',type: 'type',startTime: 'xxx厂',endTime: '无'},
        {sesonName: '2021油菜直播', groupName: '荆州市公安县',type: 'type',startTime: 'xxx厂',endTime: '无'},
        {sesonName: '2021油菜直播', groupName: '荆州市公安县',type: 'type',startTime: 'xxx厂',endTime: '无'},
        {sesonName: '2021油菜直播', groupName: '荆州市公安县',type: 'type',startTime: 'xxx厂',endTime: '无'},
        {sesonName: '2021油菜直播', groupName: '荆州市公安县',type: 'type',startTime: 'xxx厂',endTime: '无'},
        {sesonName: '2021油菜直播', groupName: '荆州市公安县',type: 'type',startTime: 'xxx厂',endTime: '无'},
        {sesonName: '2021油菜直播', groupName: '荆州市公安县',type: 'type',startTime: 'xxx厂',endTime: '无'},
        {sesonName: '2021油菜直播', groupName: '荆州市公安县',type: 'type',startTime: 'xxx厂',endTime: '无'},
        {sesonName: '2021油菜直播', groupName: '荆州市公安县',type: 'type',startTime: 'xxx厂',endTime: '无'},
        {sesonName: '2021油菜直播', groupName: '荆州市公安县',type: 'type',startTime: 'xxx厂',endTime: '无'},
        {sesonName: '2021油菜直播', groupName: '荆州市公安县',type: 'type',startTime: 'xxx厂',endTime: '无'},
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
        btnExport: true,
      }
    }
  },
  computed: {
    ...mapGetters(['groupData','permissions'])
  },
  created(){
    this.getBtnPermis();
  },
  methods: {
    ...mapMutations({
      setGroupBoxStatus: 'setGroupBoxStatus',
    }),
    getBtnPermis() {
      this.btnPermis.btnView = this.permissions[window.global.buttonPremission.operationdataView];
      this.btnPermis.btnAdd = this.permissions[window.global.buttonPremission.operationdataAdd];
      this.btnPermis.btnEdit = this.permissions[window.global.buttonPremission.operationdataEdit];
      this.btnPermis.btnDelete = this.permissions[window.global.buttonPremission.operationdataDelete];
      this.btnPermis.btnExport = this.permissions[window.global.buttonPremission.operationdataExport];
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
      this.editTitle = "运维资料管理新增";
      this.$refs.editInfo.dialogVisible = true;
    },
    // 编辑
    editToolsInfo() {
      this.editTitle = "运维资料管理编辑";
      this.$refs.editInfo.dialogVisible = true;
    },
    // 删除
    handleDelete() {
      if (this.selection.length <= 0) {
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
    currentChange() {

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

      .formItem {
        width: 100%;
        display: flex;
      }

      .el-form-item {
        margin-right: 15px;
        margin-bottom: 10px;
        width: 19%;
      }

      .el-input, .el-select {
        width: 100%;
      }

      .shadow-btn {
        height: 36px !important;
        margin-left: 20px;
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