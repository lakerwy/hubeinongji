<template>
  <div class="contTable">
    <div class="searchBox">
      <el-form
        class="my-form"
        label-position="right"
        label-width="80px"
        :model="form"
        :inline="true"
      >
        <el-form-item label="资源类别:">
          <el-select
            v-model="form.resourcesType"
            placeholder="请选择资源类别"
            :clearable="true"
          >
            <el-option
              v-for="(item, index) in resourcesTypeSelect"
              :key="index"
              :label="item.itemName"
              :value="item.itemCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称:" label-width="85px">
          <el-input
            v-model="form.resourcesName"
            placeholder="请输入资源名称"
          ></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="联系人姓名:">
          <el-input
            v-model="form.ownerName"
            placeholder="请输入联系人姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话:">
          <el-input
            v-model="form.ownerPhone"
            placeholder="请输入联系电话"
          ></el-input>
        </el-form-item>
        <div class="btn">
          <el-button
            type="primary"
            class="shadow-btn"
            @click="query"
            round
            v-if="btnPermis.btnView"
            >查询</el-button
          >
        </div>
      </el-form>

      <div class="btns" style="float: right; margin-top: -44px">
        <div :class="{ active: !isMap, view1: true }">
          <img :src="isMap ? view1 : view1Active" alt="" />
        </div>
        <div :class="{ active: isMap, view2: true }" @click="ChangeView2()">
          <img :src="isMap ? view2Active : view2" alt="" />
        </div>
        <!-- <img class="view" title="切换视图" src="img/working/icon-view.png" alt="" @click="isMap = !isMap;"> -->
      </div>
    </div>
    <div class="table">
      <div class="table_btns">
        <div class="btn-left">
          <el-button
            type="primary"
            class="shadow-btn"
            round
            @click="addClick"
            v-if="btnPermis.btnAdd"
            >新增</el-button
          >
        </div>
        <div class="btn-right">
          <div
            class="tableTool"
            @click="importClick"
            v-if="btnPermis.btnImport"
          >
            <img src="img/table_tool2.png" alt="" />
            <span>报表导入</span>
          </div>
          <div class="vertical" v-if="btnPermis.btnImport"></div>
          <div
            class="tableTool"
            @click="reportExport(page, form)"
            v-if="btnPermis.btnExport"
          >
            <img src="img/table_tool3.png" alt="" />
            <span>报表导出</span>
          </div>
          <div class="vertical" v-if="btnPermis.btnExport"></div>
          <div
            class="tableTool"
            @click="deletetClick"
            v-if="btnPermis.btnDelete"
          >
            <img src="img/table_tool4.png" alt="" />
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
            <avue-empty image="img/img-zwsj.png" desc="暂无数据"> </avue-empty>
          </template>
          <el-table-column
            type="selection"
            label="全选"
            width="55"
            fixed="left"
          >
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="80"
            fixed="left"
            :index="indexMethod"
          >
          </el-table-column>
          <el-table-column
            v-for="item in columns"
            :key="item.label"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="scope">
              <el-button
                v-if="item.prop == 'resourcesName' && btnPermis.btnEdit"
                type="text"
                class="table-text-btn"
                @click="editClick(scope)"
              >
                {{ scope.row.resourcesName }}
              </el-button>
              <span v-else-if="item.prop == 'resourcesType'">{{
                resouceTypeFormatter(scope.row.resourcesType)
              }}</span>
              <span v-else>{{ scope.row[item.prop] }}</span>
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
    <AddEditDialog
      ref="edit"
      :resourcesTypeSelect="resourcesTypeSelect"
      :dialogType="0"
      @flashTable="getResourcesList(page, form)"
    />
    <AddEditDialog
      ref="add"
      :resourcesTypeSelect="resourcesTypeSelect"
      :dialogType="1"
      @flashTable="getResourcesList(page, form)"
    />
    <ImportDialog ref="importDialog" />
  </div>
</template>

<script>
import ImportDialog from "../dialog/ImpotDialog";
import AddEditDialog from "../dialog/AddEditDialog";
import myPagination from "_com/myPagination/index";
import {
  queryResourcesList,
  delResourcesInfo,
  getResourcesInfo,
  resourcesExcelExport,
} from "@/api/basic/resources";
import { getMachineDict } from "@/api/basic/machine";
import {
  handBlobDown,
  getSelectionIds,
  filterDict,
} from "../../../../util/util";
import { mapGetters } from "vuex";

export default {
  name: "contTable",
  components: {
    ImportDialog,
    AddEditDialog,
    myPagination,
  },
  props: {
    isMap: Boolean,
  },
  data() {
    return {
      view1: require("@/assets/images/view1.png"),
      view1Active: require("@/assets/images/view1-active.png"),
      view2: require("@/assets/images/view2.png"),
      view2Active: require("@/assets/images/view2-active.png"),
      // currentPage: 1,
      // pageSize: 10,
      // total: 0,
      page: {
        total: 0,
        size: 10,
        currentPage: 1,
      },
      resourcesTypeSelect: [
        {
          itemCode: "",
          itemName: "全部",
        },
      ],
      form: {
        resourcesName: "",
        resourcesType: "",
        ownerName: "",
        ownerPhone: "",
      },
      tableData: [],
      columns: [
        { prop: "resourcesName", label: "资源名称 ", width: "240px" },
        { prop: "resourcesType", label: "资源类别 ", width: "160px" },
        { prop: "serverScope", label: "服务范围 ", width: "160px" },
        { prop: "ownerName", label: "联系人姓名 ", width: "160px" },
        { prop: "ownerPhone", label: "联系电话", width: "360px" },
        { prop: "lon", label: "资源位置经度", width: "160px" },
        { prop: "lat", label: "资源位置纬度", width: "160px" },
        { prop: "detailAddress", label: "资源地点", width: "300px" },
      ],
      btnPermis: {
        //按钮权限
        btnMap: true,
        btnView: true,
        btnAdd: true,
        btnEdit: true,
        btnImport: true,
        btnExport: true,
        btnDelete: true,
      },
    };
  },
  created() {
    this.getResourcesTypeSelect();
    this.getResourcesList(this.page, this.form);
    this.getBtnPermis();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    getBtnPermis() {
      this.btnPermis.btnMap =
        this.permissions[window.global.buttonPremission.productResourceMap];
      this.btnPermis.btnView =
        this.permissions[window.global.buttonPremission.productResourcesView];
      this.btnPermis.btnAdd =
        this.permissions[window.global.buttonPremission.productResourcesAdd];
      this.btnPermis.btnEdit =
        this.permissions[window.global.buttonPremission.productResourcesEdit];
      this.btnPermis.btnImport =
        this.permissions[window.global.buttonPremission.productResourcesImport];
      this.btnPermis.btnExport =
        this.permissions[window.global.buttonPremission.productResourcesExport];
      this.btnPermis.btnDelete =
        this.permissions[window.global.buttonPremission.productResourcesDelete];
      //console.log("this.permissions", this.permissions);
      //console.log("this.btnPermis", this.btnPermis);
    },
    ChangeView2() {
      if (!this.isMap) {
        this.isMap = !this.isMap;
        // this.$router.push({path: "/basicInfo/productMap/index"})
        this.$emit("changView", true);
      }
    },

    resouceTypeFormatter(itemCode) {
      return filterDict(
        itemCode,
        { labelKey: "itemName", valueKey: "itemCode" },
        this.resourcesTypeSelect
      );
    },
    //处理导出按钮的点击
    async reportExport(page, form) {
      let res = await resourcesExcelExport(
        Object.assign(
          {
            page: page.currentPage,
            limit: page.size,
          },
          form
        )
      );
      if (res.success) {
        let obj = res.obj;
        let title = "生产资源信息报表.xls";
        let url =
          window.globalUrl.HOME_API + "agri-web/rp/statistics/downloadExcel";
        handBlobDown(url, obj, title);
      } else {
        this.$message.error(res.msg || "导出失败");
      }
    },
    //处理多选事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    //获取资源类别
    async getResourcesTypeSelect() {
      let res = await getMachineDict({
        listType: "resources_type",
      });
      if (!res.code) {
        this.resourcesTypeSelect = this.resourcesTypeSelect.concat(res.data);
      }
    },
    //删除
    async delInfo() {
      let ids = getSelectionIds(this.selection, "rowId");
      let res = await delResourcesInfo({
        rowIds: ids,
      });
      if (!res.code) {
        this.$message({
          type: "success",
          message: res.msg,
        });
        this.getResourcesList(this.page, this.form);
      }
    },
    query() {
      // 查询重置
      this.page.currentPage = 1;
      this.getResourcesList(this.page, this.form);
    },
    //查询资源列表数据
    async getResourcesList(page, form) {
      let res = await queryResourcesList(
        Object.assign(
          {
            page: page.currentPage,
            limit: page.size,
          },
          form
        )
      );
      if (!res.code) {
        this.tableData = res.data.list;
        this.page.total = res.data.totalCount;
      }
    },
    //翻页事件
    currentChange(current) {
      this.page.currentPage = current;
      this.getResourcesList(this.page, this.form);
    },
    sizeChange(size) {
      this.page.size = size;
      this.getResourcesList(this.page, this.form);
    },
    addClick() {
      this.$refs.add.dialogVisible = true;
    },
    importClick() {
      this.$refs.importDialog.dialogVisible = true;
    },
    deletetClick() {
      if (this.selection) {
        this.$confirm("是否确定删除选择的数据？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.delInfo();
          })
          .catch(() => {
            /*this.$message({
          type: 'info',
          message: '已取消删除'
        });*/
          });
      } else {
        this.$message({
          type: "error",
          message: "请先选择",
        });
      }
    },
    async getResourcesDetail(rowId) {
      let res = await getResourcesInfo(rowId);
      if (!res.code) {
        return res.data;
      }
    },
    //编辑
    async editClick(scope) {
      let res = await getResourcesInfo({
        rowId: scope.row.rowId,
      });
      if (!res.code) {
        res.data.province = res.data.province ? res.data.province * 1 : null;
        res.data.city = res.data.city ? res.data.city * 1 : null;
        res.data.country = res.data.country ? res.data.country * 1 : null;
        res.data.town = res.data.town ? res.data.town * 1 : null;
        this.$refs.edit.form = res.data;
        if (res.data.province) {
          this.$refs.edit.initAddressSelect(res.data);
        } else {
          this.$refs.det;
        }
      }
      this.$refs.edit.dialogVisible = true;
    },
    switchMap() {
      this.$router.push({ path: "/basicInfo/productMap/index" });
    },
    indexMethod(index) {
      return (this.page.currentPage - 1) * this.page.size + index + 1;
    },
  },
};
</script>

<style scoped lang="less">
@vw: 19.2vw;
.contTable {
  margin-top: 20px;
  //margin-left: 27px;
  height: 100%;
  .searchBox {
    //width: 1583px;
    padding-left: 27px;
    width: calc(100% - 27px);
    padding-bottom: 5px;
    position: relative;
    border-bottom: 1px solid #133460;

    /deep/ .el-form-item__label {
      //padding: 0;
    }
    .el-form--inline .el-form-item {
      margin-right: 15px;
      margin-bottom: 10px;
    }
    .el-input {
      width: 150px;
    }
    // .datepicker {
    //   width: 170px !important;
    // }
    .btn {
      display: inline-block;
      height: 36px;
      // position: absolute;
      // right: 20px;
      // bottom: 15px;
    }
  }
  .table {
    padding-left: 27px;
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
    margin-left: -2px;
    margin-top: 5px;
  }

  .btns {
    display: flex;
    flex-direction: row;
    width: 70px;
    height: 32px;
    padding-right: 42 / @vw;
    border-radius: 3px;
    .view1,
    .view2 {
      width: 35px;
      line-height: 35px;
      cursor: pointer;
      text-align: center;
    }
    .view1 {
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
      border: #0c4b85 solid 1px;
      border-right: none;
    }
    .view2 {
      border-top-right-radius: 3px;
      background-color: transparent;
      border-bottom-right-radius: 3px;
      border: #0c4b85 solid 1px;
      border-left: none;
    }
    .active {
      background: #0c4b85;
    }
    // .el-button {
    //   width: 90/@vw;
    //   min-width: 77px;
    //   height: 36px;
    //   padding: 0;
    // }
  }
}
</style>