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
        <div class="avue-crud__menu" v-if="btnPermis.btnAdd">
          <div class="avue-crud__left">
            <!-- v-if="permissions.sys_menu_add"  -->
            <el-button
              v-if="btnPermis.btnAdd"
              class="shadow-btn"
              plain
              round
              size="mini"
              @click="addOrUpdateHandle(false)"
            >
              添加
            </el-button>
          </div>
        </div>

        <el-table
          border
          v-loading="loading"
          :data="menuList"
          row-key="id"
          height="calc(100% - 50px)"
          :tree-props="{ children: 'children', hasChildren: 'hasChildrens' }"
        >
          <el-table-column
            prop="name"
            label="菜单名称"
            :show-overflow-tooltip="true"
            width="180"
          ></el-table-column>
          <el-table-column prop="icon" label="图标" align="center" width="100">
            <template slot-scope="scope">
              <i class="iconfont" :class="scope.row.icon" />
            </template>
          </el-table-column>
          <el-table-column
            prop="sort"
            label="排序"
            width="60"
          ></el-table-column>
          <el-table-column
            prop="path"
            label="组件路径"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column prop="type" label="类型" width="80" align="center">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.type === '2'"
                >左菜单</el-tag
              >
              <el-tag type="success" v-if="scope.row.type === '0'"
                >顶菜单</el-tag
              >
              <el-tag type="info" v-if="scope.row.type === '1'">按钮</el-tag>
            </template>
          </el-table-column>
          <!--<el-table-column prop="keepAlive" label="缓冲" width="80" align="center">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.keepAlive === '0'">关闭</el-tag>
              <el-tag type="success" v-if="scope.row.keepAlive === '1'">开启</el-tag>
            </template>
          </el-table-column>-->
          <el-table-column
            prop="permission"
            label="权限标识"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                v-show="btnPermis.btnAdd && scope.row.type !== '1'"
                size="small"
                type="text"
                icon="el-icon-plus"
                @click="addOrUpdateHandle(false, scope.row)"
                >新增
                <!--v-if="permissions.sys_menu_add"-->
              </el-button>
              <el-button
                v-if="btnPermis.btnEdit"
                size="small"
                type="text"
                icon="el-icon-edit"
                @click="addOrUpdateHandle(true, scope.row)"
                >修改
                <!--v-if="permissions.sys_menu_edit"-->
              </el-button>
              <el-button
                v-if="btnPermis.btnDelete"
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

        <table-form
          v-if="addOrUpdateVisible"
          ref="addOrUpdate"
          @refreshDataList="getList"
        ></table-form>
      </div>
    </basic-container>
  </div>
</template>

<script>
import { delObj, fetchMenuTree } from "@/api/admin/menu";
import TableForm from "./menu-form";
import titleBox from "_com/contenBox/titleBox.vue";
import { mapGetters } from "vuex";

export default {
  name: "Menu",
  components: { TableForm, titleBox },
  data() {
    return {
      addOrUpdateVisible: false,
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      searchForm: {},
      btnPermis: {
        //按钮权限
        btnAdd: true,
        btnEdit: true,
        btnDelete: true,
      },
    };
  },
  created() {
    this.getBtnPermis(); //按钮权限
    this.getList();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    getBtnPermis() {
      this.btnPermis.btnAdd =
        this.permissions[window.global.buttonPremission.menuAdd];
      this.btnPermis.btnEdit =
        this.permissions[window.global.buttonPremission.menuEdit];
      this.btnPermis.btnDelete =
        this.permissions[window.global.buttonPremission.menuDelete];
      //console.log("this.btnPermis", this.btnPermis);
      //console.log("this.permissions", this.permissions);
    },
    addOrUpdateHandle(isEdit, row) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(isEdit, row);
      });
    },
    getList() {
      this.loading = true;
      fetchMenuTree(false).then((response) => {
        this.menuList = response.data;
        this.loading = false;
      });
    },
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delObj(row.id);
        })
        .then((data) => {
          if (data.code == 0 && data.data) {
            this.getList();
            this.$message.success("删除成功");
          } else {
            this.$message.error(data.msg);
          }
        });
    },
  },
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
    //margin-top: 20px;
  }
}
</style>