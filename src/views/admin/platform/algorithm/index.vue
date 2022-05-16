<template>
  <!-- 分组管理 -->
  <div class="opreationSeason">
    <titleBox :headName="'算法配置管理'" />
    <basic-container class="basic-con">
      <el-row :span="24" style="width: 100%; height: 100%">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="height: 100%">
          <groupBox
            class="self-box"
            :showCheckBox="false"
            :isSelf="true"
            :isAll="true"
            @getData="handleNodeClick"
          />
        </el-col>
        <el-col
          :xs="18"
          :sm="18"
          :md="18"
          :lg="18"
          :xl="18"
          class="opreationSeason__main"
        >
          <el-form
            ref="form"
            class="my-form"
            :model="searchForm"
            :inline="true"
          >
            <!-- <el-form-item label="分组农机:">
                           <el-input v-model="model" placeholder="请选择分组"></el-input>
                         </el-form-item>-->
            <el-form-item label="农机类型:">
              <el-select
                v-model="searchForm.machineType"
                clearable
                @change="clearToolType"
                placeholder="请选择农机类型"
              >
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in machineTypes"
                  :key="item.itemCode"
                  :label="item.itemName"
                  :value="item.itemCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="机具类型:">
              <el-select
                v-model="searchForm.toolType"
                clearable
                placeholder="请选择机具类型"
              >
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in toolTypeSelectByMachine"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="算法类型:">
              <el-select
                v-model="searchForm.computeType"
                placeholder="请选择算法类型"
              >
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in computeTypes"
                  :key="item.itemCode"
                  :label="item.itemName"
                  :value="item.itemCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="过滤标志:">
              <el-select
                v-model="searchForm.rejectFlag"
                placeholder="请选择过滤标志"
              >
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in filterFlags"
                  :key="item.itemCode"
                  :label="item.itemName"
                  :value="item.itemCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-button
              class="shadow-btn"
              type="primary"
              round
              @click="search(1)"
              v-if="manager_btn_view"
              >查询</el-button
            >
          </el-form>
          <div class="my-table">
            <div
              class="avue-crud__menu"
              v-if="manager_btn_add || manager_btn_del"
            >
              <div class="avue-crud__left">
                <el-button
                  v-if="manager_btn_add"
                  class="shadow-btn"
                  plain
                  round
                  size="mini"
                  @click="handleCreate"
                  >新增
                </el-button>
                <el-button
                  v-if="manager_btn_del"
                  class="shadow-btn"
                  plain
                  round
                  size="mini"
                  @click="handleBatchDelete"
                  >批量删除
                </el-button>
              </div>
            </div>
            <el-table
              :data="tableData"
              style="width: 100%"
              height="calc(100% - 50px)"
              @selection-change="handleSelectChange"
            >
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
                :fixed="item.fixed"
                :formatter="item.formatter"
                :show-overflow-tooltip="item.showTooltip"
              >
              </el-table-column>
              <el-table-column label="操作" width="150px" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    v-if="manager_btn_edit"
                    type="text"
                    size="small"
                    icon="el-icon-edit"
                    @click="handleUpdata(scope.row, scope.index)"
                    >编辑
                  </el-button>
                  <el-button
                    v-if="manager_btn_del"
                    type="text"
                    size="small"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row, scope.index)"
                    >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <myPagination
              style="margin-top: 10px"
              :currentPage="page.currentPage"
              :pageSize="page.pageSize"
              :total="page.total"
              @current-change="currentChange"
              @size-change="sizeChange"
            />
          </div>
        </el-col>
      </el-row>
    </basic-container>
    <el-dialog
      class="dialog"
      :title="editTitle"
      :visible.sync="dialogVisible"
      width="30%"
      min-width="400px"
      top="20vh"
      :before-close="cancel"
    >
      <div class="content">
        <el-form
          class="my-form"
          ref="form"
          label-position="right"
          label-width="120px"
          :model="form"
          :rules="rules"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="分组名称：">
                <el-input
                  v-model="form.groupNameFullPath"
                  placeholder="请输入分组名称"
                  readonly
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="农机类型：" prop="machineType">
                <el-select
                  v-model="form.machineType"
                  placeholder="请选择农机类型"
                >
                  <el-option
                    v-for="item in machineTypes"
                    :key="item.itemCode"
                    :label="item.itemName"
                    :value="item.itemCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="机具类型：" prop="toolType">
                <el-select v-model="form.toolType" placeholder="请选择机具类型">
                  <el-option
                    v-for="item in toolTypes"
                    :key="item.itemCode"
                    :label="item.itemName"
                    :value="item.itemCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="面积算法：" prop="computeType">
                <el-select
                  v-model="form.computeType"
                  placeholder="请选择面积算法"
                >
                  <el-option
                    v-for="item in computeTypes"
                    :key="item.itemCode"
                    :label="item.itemName"
                    :value="item.itemCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="是否默认算法：" prop="isDefault">
                <el-select
                  v-model="form.isDefault"
                  placeholder="请选择是否默认算法"
                >
                  <el-option label="是" value="1" key="1"></el-option>
                  <el-option label="否" value="0" key="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="是否过滤：" prop="rejectFlag">
                <el-select
                  v-model="form.rejectFlag"
                  placeholder="请选择是否过滤"
                >
                  <el-option
                    v-for="item in filterFlags"
                    :key="item.itemCode"
                    :label="item.itemName"
                    :value="item.itemCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="shadow-btn" @click="save" round
          >保 存</el-button
        >
        <el-button
          type="primary"
          class="shadow-btn"
          @click="cancel"
          round
          >返 回</el-button
        >
      </div>
    </el-dialog>
    <!-- <EditInfoDialog ref="editInfo" :title="editTitle"></EditInfoDialog>-->
  </div>
</template>

<script>
import groupBox from "_com/groupBox2/index.vue";
import titleBox from "_com/contenBox/titleBox.vue";
import myPagination from "_com/myPagination/index.vue";
import {
  addComputeObj,
  delComputeObj,
  fetchComputeList,
  updateComputeObj,
} from "@/api/admin/setting";
import { getToolType } from "@/api/basic/machine";
import { fetchItemList } from "@/api/admin/dict";
import { mapGetters } from "vuex";

export default {
  name: "task",
  components: {
    titleBox,
    myPagination,
    groupBox,
  },
  data() {
    return {
      searchForm: {},
      listLoading: false,
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        // {prop: 'sesonName', label: '作业季'},
        /*     {prop: 'seasonName', label: '作业季', width: 250, fixed: "left"},
                                 {prop: 'groupNameFullPath', label: '分组名称', width: 300},
                                 {prop: 'jobType', label: '作业类型', width: 200, formatter: this.jobTypeFormatter},
                                 {prop: 'auditFlag', label: '自动审核', width: 200, formatter: this.auditFlagFormatter},
                                 {prop: 'initDeep', label: '审核深度(公分)', width: 200,},
                                 {prop: 'initDeepRate', label: '审核合格率(%) ', width: 200},
                                 {prop: 'cutDeep', label: '截取深度(公分) ', width: 200},
                                 {prop: 'initSubsidy', label: '补贴标准(元/亩) ', width: 200},
                                 {prop: 'originFlag', label: '审核类型', width: 200, formatter: this.auditTypeFormatter},*/
        { prop: "groupNameFullPath", label: "分组名称", width: 300 },
        {
          prop: "machineType",
          label: "农机类型",
          width: 200,
          formatter: this.machineTypeFormatter,
        },
        {
          prop: "toolType",
          label: "机具类型",
          width: 200,
          formatter: this.toolTypeFormatter,
        },
        {
          prop: "computeType",
          label: "算法类型",
          width: 200,
          formatter: this.computeTypeFormatter,
        },
        {
          prop: "isDefault",
          label: "是否默认算法 ",
          width: 200,
          formatter: function (row, ele, val) {
            if (val === "0") return "否";
            if (val === "1") return "是";
          },
        },
        {
          prop: "rejectFlag",
          label: "过滤标志 ",
          width: 200,
          formatter: this.filterFlagFormatter,
        },
        /*                  {prop: 'machineType', label: '农机类型', width: 200, },
                                              {prop: 'toolType', label: '机具类型', width: 200, },
                                              {prop: 'computeType', label: '算法类型', width: 200,},
                                              {prop: 'isDefault', label: '是否默认算法 ', width: 200, },
                                              {prop: 'rejectFlag', label: '过滤标志 ', width: 200, },*/
      ],
      tableData: [],
      toolTypeSelectByMachine: [],
      selection: [], // 选择的数据
      dialogVisible: false,
      dialogTitle: "新增分组",
      form: {},
      model: "",
      showMaps: false,
      editTitle: "",
      jobTypes: [],
      auditTypes: [],
      manager_btn_view: true,
      manager_btn_add: true,
      manager_btn_edit: true,
      manager_btn_del: true,
      seasonYears: [],
      season5Years: [],
      clickdata: {},
      submitType: "add",
      jobSeasons: [],
      rules: {
        jobYear: [
          { required: true, message: "请选择作业年度", trigger: "change" },
        ],
        jobType: [
          { required: true, message: "请选择作业类型", trigger: "change" },
        ],
        seasonId: [
          { required: true, message: "请选择作业季", trigger: "change" },
        ],
        auditFlag: [
          { required: true, message: "请选择是否自动审核", trigger: "change" },
        ],
        initDeep: [
          { required: true, message: "请输入审核深度", trigger: "blur" },
          {
            pattern: /^(?:0|[1-9][0-9]?|100)$/,
            message: "范围在0-100",
            trigger: "blur",
          },
        ],
        initDeepRate: [
          { required: true, message: "请输入深度合格率", trigger: "blur" },
          {
            pattern: /^(?:0|[1-9][0-9]?|100)$/,
            message: "范围在0-100",
            trigger: "blur",
          },
        ],
        cutDeep: [
          { required: true, message: "请输入截取深度", trigger: "blur" },
          {
            pattern: /^(?:0|[1-9][0-9]?|100)$/,
            message: "范围在0-100",
            trigger: "blur",
          },
        ],
        initSubsidy: [
          { required: true, message: "请输入补贴标准", trigger: "blur" },
          {
            pattern: /^(?:\d{1,3}|1000)$/,
            message: "范围在0-1000",
            trigger: "blur",
          },
        ],
        originFlag: [
          { required: true, message: "请选择审核类型", trigger: "change" },
        ],
        machineType: [{ required: true, message: "请选择必填项", trigger: "change" }],
        toolType: [{ required: true, message: "请选择必填项", trigger: "change" }],
        computeType: [{ required: true, message: "请选择必填项", trigger: "change" }],
        // filterFlag: [{ required: true, message: "请选择必填项", trigger: "change" }],
        isDefault: [{ required: true, message: "请选择必填项", trigger: "change" }],
        rejectFlag: [{ required: true, message: "请选择必填项", trigger: "change" }],
      },

      isEdit: false,
    };
  },
  watch: {
    "searchForm.machineType": {
      handler(newName, oldName) {
        if (newName) {
          this.form.toolType = "";
          this.changeToolsType(newName);
          // debugger;
        }
      },
      immediate: false,
    },
  },
  created() {
    this.getBtnPermis(); //按钮权限
    this.init();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    // async getToolsType(value) {
    //   this.initToolTypes();
    //   let res = await getToolType({
    //     machineType: value,
    //   });
    //   if (res.code) {
    //     this.toolTypes.forEach((item, index) => {
    //         debugger;
    //       for (i = 0; i < res.data.length; i++) {
    //         if (item.itemCode != res.data[i].value) {
    //           this.toolTypes[index] = "";
    //         } else {
    //           this.toolTypes[index].itemName = res.data[i].text;
    //         }
    //       }
    //     });
    //     return this.toolTypes;
    //   }
    // },
    clearToolType() {
      // debugger;
      this.form.toolType = "";
      this.toolTypeSelectByMachine = "";
    },
    async changeToolsType(val) {
      let res = await getToolType({
        machineType: val,
      });
      if (!res.code) {
        this.toolTypeSelectByMachine = res.data;
        // debugger;
      }
    },
    getBtnPermis() {
      this.manager_btn_view =
        this.permissions[window.global.buttonPremission.algorithmView];
      this.manager_btn_add =
        this.permissions[window.global.buttonPremission.algorithmAdd];
      this.manager_btn_edit =
        this.permissions[window.global.buttonPremission.algorithmEdit];
      this.manager_btn_del =
        this.permissions[window.global.buttonPremission.algorithmDelete];
      //console.log("this.permissions", this.permissions);
    },
    async init() {
      await this.initMachineTypes("machine_type");
      await this.initToolTypes("tool_type");
      await this.initComputeTypes("compute_type");
      await this.initFilterFlags("filter_flag");
      this.search();
    },

    async initMachineTypes(listType) {
      let that = this;
      await fetchItemList(
        Object.assign(
          {
            current: 1,
            size: 10000,
          },
          { listType: listType }
        )
      ).then((res) => {
        if (res.code === 0) {
          that.machineTypes = res.data.records;
        }
      });
    },
    async initToolTypes(listType) {
      let that = this;
      fetchItemList(
        Object.assign(
          {
            current: 1,
            size: 10000,
          },
          { listType: listType }
        )
      ).then((res) => {
        if (res.code === 0) {
          // debugger;
          that.toolTypes = [...res.data.records];
        }
      });
    },
    async initComputeTypes(listType) {
      let that = this;
      fetchItemList(
        Object.assign(
          {
            current: 1,
            size: 10000,
          },
          { listType: listType }
        )
      ).then((res) => {
        if (res.code === 0) {
          that.computeTypes = [...res.data.records];
        }
      });
    },
    async initFilterFlags(listType) {
      let that = this;
      fetchItemList(
        Object.assign(
          {
            current: 1,
            size: 10000,
          },
          { listType: listType }
        )
      ).then((res) => {
        if (res.code === 0) {
          that.filterFlags = [...res.data.records];
        }
      });
    },
    search(page) {
      if (page > 0) this.page.currentPage = page;
      if (this.clickdata && this.clickdata.id >= 0) {
        this.searchForm.groupId = this.clickdata.id * 1;
      }
      if (this.searchForm.groupId === 0) this.searchForm.groupId = "";

      this.listLoading = true;
      fetchComputeList(
        Object.assign(
          {
            current: this.page.currentPage,
            size: this.page.pageSize,
          },
          this.searchForm
        )
      ).then((res) => {
        if (res) {
          this.tableData = [...res.data.records];
          this.page.total = res.data.total;
          this.listLoading = false;
        }
      });
    },
    handleNodeClick(val) {
      if (val) {
        //获取所有子id
        this.searchForm.groupId = val.id;
        this.clickdata = val;
      }
    },
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    // 新增
    handleCreate() {
      this.isEdit = false;
      if (!this.clickdata) {
        this.$message.info("请先选择分组");
        return;
      }
      this.submitType = "add";
      var date = new Date();
      this.editTitle = "新增面积算法配置";
      this.dialogVisible = true;
      this.form = {};
      this.form.groupNameFullPath =
        this.clickdata.groupNameFullPath || "所有分组";
      this.form.groupId = this.clickdata.id;

      this.form = { ...this.form };
    },
    handleUpdata(row) {
      this.submitType = "update";
      this.isEdit = true;
      this.editTitle = "编辑面积算法配置";
      this.form = row;
      this.form.time = this.form.startTime + " ~~ " + this.form.endTime;
      this.dialogVisible = true;
    },
    // 批量删除
    handleDelete(row) {
      this.$confirm(
        "是否确认删除 " + row.groupNameFullPath + " 的面积算法配置？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        delComputeObj(row.rowId)
          .then((respones) => {
            if (respones.code === 0) {
              this.$notify.success("删除成功");
              this.search();
            } else {
              this.$notify.error("删除失败");
            }
          })
          .catch(() => {
            this.$notify.error("删除失败");
          });
      });
    },
    // 批量删除
    handleBatchDelete() {
      if (this.selection.length <= 0) {
        this.$message.info("请选择需要删除的数据");
        return;
      }
      let that = this;
      this.$confirm("是否确认删除选中的数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let tmpplandatas = [];
        that.selection.forEach((ele, index) => {
          tmpplandatas.push(
            new Promise(function (resolve, reject) {
              // 此处进行异步请求
              delComputeObj(ele.rowId).then((res) => {
                res.groupNameFullPath = ele.groupNameFullPath;
                resolve(res);
              });
            })
          );
        });
        Promise.all(tmpplandatas).then((res) => {
          //console.log("Promise", res);
          var isrefresh = false;
          var suceessGroup = "";
          var errorGroup = "";
          res.forEach((ele, index) => {
            if (ele.code === 0) {
              suceessGroup += "删除" + ele.groupNameFullPath + "的算法配置成功";
              if (index < res.length - 1) {
                suceessGroup += " <br/>";
              }
              isrefresh = true;
            } else {
              errorGroup +=
                "删除" + ele.groupNameFullPath + "的算法配置失败：" + ele.msg;
              if (index < res.length - 1) {
                errorGroup += " <br/>";
              }
            }
          });
          if (suceessGroup.length > 0) {
            that.$notify({
              duration: 3000,
              dangerouslyUseHTMLString: true,
              message: suceessGroup,
              type: "success",
            });
          }
          if (errorGroup.length > 0) {
            that.$notify({
              duration: 3000,
              dangerouslyUseHTMLString: true,
              message: errorGroup,
              type: "error",
            });
          }
          if (isrefresh) this.search();
        });
      });
    },

    // 保存
    save() {
      if (this.submitType == "add") {
        this.create();
      }
      if (this.submitType == "update") {
        this.update();
      }
    },
    // 新增保存用户
    create() {
      let that = this;
      this.$refs.form.validate().then((va) => {
        if (va) {
          addComputeObj(this.form)
            .then((response) => {
              if (response.code === 0) {
                that.$notify.success("新增成功");
                that.dialogVisible = false;
                that.search();
              } else {
                that.$notify.error("新增失败：" + response.msg);
              }
            })
            .catch(() => {});
        }
      });
    },
    // 编辑更新
    update() {
      let that = this;
      this.$refs.form.validate().then((va) => {
        if (va) {
          updateComputeObj(this.form)
            .then((response) => {
              if (response.code === 0) {
                that.$notify.success("修改成功");
                that.dialogVisible = false;
                that.search();
              } else {
                that.$notify.success("修改失败：" + response.msg);
              }
            })
            .catch(() => {});
        }
      });
    },
    // 取消关闭
    cancel() {
      this.$refs.form.resetFields()
      this.form = {};
      this.dialogVisible = false;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.search(this.page, this.searchForm);
      //return false;
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.search(this.page, this.searchForm);
    },
    indexMethod(index) {
      return (this.page.currentPage - 1) * this.page.pageSize + index + 1;
    },
    machineTypeFormatter(row, ele, val) {
      let typename = val;
      if (this.machineTypes) {
        let res = this.machineTypes.find((ele, index) => {
          return ele.itemCode == val;
        });
        if (res) {
          typename = res.itemName;
        }
      }
      return typename;
    },
    toolTypeFormatter(row, ele, val) {
      let typename = val;
      if (this.toolTypes) {
        let res = this.toolTypes.find((ele, index) => {
          return ele.itemCode == val;
        });
        if (res) {
          typename = res.itemName;
        }
      }
      return typename;
    },
    computeTypeFormatter(row, ele, val) {
      let typename = val;
      if (this.computeTypes) {
        let res = this.computeTypes.find((ele, index) => {
          return ele.itemCode == val;
        });
        if (res) {
          typename = res.itemName;
        }
      }
      return typename;
    },
    filterFlagFormatter(row, ele, val) {
      let typename = val;
      if (this.filterFlags) {
        let res = this.filterFlags.find((ele, index) => {
          return ele.itemCode == val;
        });
        if (res) {
          typename = res.itemName;
        }
      }
      return typename;
    },
  },
};
</script>
<style lang="less" scoped>
.opreationSeason {
  &__tree {
    padding-top: 3px;
    padding-right: 20px;
  }

  &__main {
    height: 100%;

    .el-card__body {
      padding-top: 0;
    }

    .my-form {
      border-bottom: #133460 1px solid;
    }

    .my-table {
    }
  }

  .basic-con {
    .self-box {
      position: unset;
      background: transparent;
      height: 100%;
      padding-right: 20px;
      margin-right: 20px;
      border-right: 1px solid #133460;

      .group-box {
        .box-card {
          background: transparent !important;
        }
      }

      div {
        position: unset;
      }
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

      .shadow-btn {
        height: 36px !important;
      }
    }

    @media screen and (max-width: 1830px) {
      .my-table {
        height: calc(100% - 170px) !important;
      }
    }

    .my-table {
      margin-top: 10px;
      height: calc(100% - 120px);
      // overflow: auto !important;

      /deep/ .el-form {
        height: 440px;
        width: 100%;
      }

      /deep/ .el-table {
        // height: auto;
      }
    }
  }

  .content {
    margin-top: 20px;
    margin-left: 10px;

    .el-form-item {
      margin-right: 40px;
    }

    /deep/ .el-form-item__label {
      padding: 0;
    }

    .el-input,
    .el-select {
      width: 100%;
    }

    .datepicker {
      width: 40%;
    }
  }

  .dialog-footer {
    height: 30px;
    padding-right: 25px;
  }
}
</style>