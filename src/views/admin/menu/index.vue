<template>
  <div>
    <titleBox :headName="'菜单管理'" />
    <basic-container class="basic-con">
      <div class="avue-crud my-table my-dialog">
        <!--<el-form class="my-form" :model="searchForm" :inline="true">
          <el-form-item label="菜单名称:">
            <el-input v-model="searchForm.deptName" placeholder="请输入分组名称"></el-input>
          </el-form-item>
          &lt;!&ndash; <el-form-item label="上级分组名称:">
            <el-input v-model="searchForm.pname" placeholder="请输入上级分组名称"></el-input>
          </el-form-item> &ndash;&gt;
          <el-form-item label="菜单链接:">
            <el-input v-model="searchForm.pname" placeholder="请输入菜单链接"></el-input>
          </el-form-item>
          <el-form-item label="按钮权限:">
            <el-input v-model="searchForm.pname" placeholder="请输入按钮权限"></el-input>
          </el-form-item>
          <el-form-item class="btn">
            <el-button style="width: 90px;" class="shadow-btn" plain size="medium" @click="getList">查询</el-button>
          </el-form-item>
        </el-form>-->
        <div class="avue-crud__menu">
          <div class="avue-crud__left">
              <!-- v-if="permissions.sys_menu_add"  -->
            <el-button 
              class="shadow-btn"
              plain
              round
              size="mini"
              @click="addOrUpdateHandle(false)">
              添加
            </el-button>
          </div>
        </div>

        <el-table
          border
          v-loading="loading"
          :data="menuList"
          row-key="id"
          height="100%"
          :tree-props="{children: 'children', hasChildren: 'hasChildrens'}">
          <el-table-column prop="name" label="菜单名称" :show-overflow-tooltip="true" width="180"></el-table-column>
          <el-table-column prop="icon" label="图标" align="center" width="100">
            <template slot-scope="scope">
              <i :class="scope.row.icon"/>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="60"></el-table-column>
          <el-table-column prop="path" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="type" label="类型" width="80" align="center">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.type === '0'">左菜单</el-tag>
              <el-tag type="success" v-if="scope.row.type === '2'">顶菜单</el-tag>
              <el-tag type="info" v-if="scope.row.type === '1'">按钮</el-tag>
            </template>
          </el-table-column>
          <!--<el-table-column prop="keepAlive" label="缓冲" width="80" align="center">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.keepAlive === '0'">关闭</el-tag>
              <el-tag type="success" v-if="scope.row.keepAlive === '1'">开启</el-tag>
            </template>
          </el-table-column>-->
          <el-table-column prop="permission" label="权限标识" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="text"
                icon="el-icon-plus"
                @click="addOrUpdateHandle(false,scope.row.id)"
                >新增
                <!--v-if="permissions.sys_menu_add"-->
              </el-button>
              <el-button size="small"
                        type="text"
                        icon="el-icon-edit"
                        @click="addOrUpdateHandle(true,scope.row.id)">修改
                        <!--v-if="permissions.sys_menu_edit"-->

              </el-button>
              <el-button
                size="small"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                >删除
                <!--v-if="permissions.sys_menu_del"-->
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <table-form v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList"></table-form>
      </div>
    </basic-container>
  </div>
</template>

<script>
  import {delObj, fetchMenuTree} from '@/api/admin/menu'
  import TableForm from './menu-form'
  import titleBox from '_com/contenBox/titleBox.vue'
  import {mapGetters} from 'vuex'

  export default {
    name: "Menu",
    components: {TableForm, titleBox},
    data() {
      return {
        addOrUpdateVisible: false,
        // 遮罩层
        loading: true,
        // 菜单表格树数据
        menuList: [],
        // 菜单树选项
        menuOptions: [],
        searchForm: {}
      };
    },
    created() {
      this.getList();
    },
    computed: {
      ...mapGetters(['permissions']),
    },
    methods: {
      addOrUpdateHandle(isEdit, id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(isEdit, id)
        })
      },
      getList() {
        this.loading = true;
        fetchMenuTree(false).then(response => {
            this.menuList = response.data
          this.loading = false;
        });
      },
      handleDelete(row) {
        this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delObj(row.id);
        }).then(() => {
          this.getList();
          this.$message.success('删除成功')
        })
      }
    }
  };
</script>


<style lang="less" scoped>
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
    // height: calc(100% - 81px);
    height: 100%;
    /deep/ .el-table {
      height: calc(100% - 54px);
    }
  }
  .avue-crud__menu {
    margin-top: 20px;
  }
}
</style>