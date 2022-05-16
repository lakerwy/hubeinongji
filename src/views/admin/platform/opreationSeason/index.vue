<template>
  <!-- 分组管理 -->
  <div class="opreationSeason">
    <titleBox :headName="'作业季管理'" />
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
          <el-form ref="form" class="my-form" :model="form" :inline="true">
            <!-- <el-form-item label="分组名称:">
                             <el-input v-model="model" placeholder="请选择分组"></el-input>
                         </el-form-item>-->
            <el-form-item label="年份时间:">
              <el-select v-model="searchForm.jobYear" placeholder="请选择年份">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in seasonYears"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="作业类型:">
              <el-select
                v-model="searchForm.jobType"
                placeholder="请选择作业类型"
              >
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in jobTypes"
                  :key="item.itemCode"
                  :label="item.itemName"
                  :value="item.itemCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="作业时间:">
              <el-date-picker
                class="datepicker"
                style="margin-right: 8px"
                v-model="searchForm.startTime"
                type="datetime"
                :clearable="true"
                prefix-icon="el-icon-date"
                placeholder="开始时间"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptionsStart"
              ></el-date-picker>
              <!-- <span style="diaplay: inline-block; width: 12px"> — </span> -->
              <el-date-picker
                class="datepicker"
                v-model="searchForm.endTime"
                type="datetime"
                :clearable="true"
                prefix-icon="el-icon-date"
                placeholder="结束时间"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptionsEnd"
              ></el-date-picker>
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
              v-if="manager_btn_add || manager_btn_batchdel"
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
                  v-if="manager_btn_batchdel"
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
                prop="seasonName"
                label="作业季名称"
                width="250"
                fixed="left"
              >
              </el-table-column>
              <el-table-column
                prop="groupNameFullPath"
                label="所属分组"
                width="400"
              >
              </el-table-column>
              <el-table-column
                prop="jobType"
                label="作业类型"
                width="120"
                :formatter="jobTypeFormatter"
              >
              </el-table-column>
              <el-table-column prop="startTime" label="开始时间" width="200">
              </el-table-column>
              <el-table-column prop="endTime" label="结束时间" width="200">
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
          ref="form"
          class="my-form"
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
              <el-form-item label="年份时间：" prop="jobYear">
                <el-select
                  v-model="form.jobYear"
                  placeholder="请选择年份时间"
                  @change="jobYearChange"
                >
                  <el-option
                    v-for="item in seasonYears"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="作业类型：" prop="jobType">
                <el-select
                  v-model="form.jobType"
                  placeholder="请选择作业类型"
                  @change="jobTypeChange"
                >
                  <el-option
                    v-for="item in jobTypes"
                    :key="item.itemCode"
                    :label="item.itemName"
                    :value="item.itemCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="作业季名称：" prop="seasonName">
                <el-input
                  maxlength="20"
                  v-model.trim="form.seasonName"
                  placeholder="请输入作业季名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="作业时间：" prop="startTime">
                <el-date-picker
                  class="datepicker"
                  v-model="form.startTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :clearable="false"
                  prefix-icon="el-icon-date"
                  placeholder="开始时间"
                  :picker-options="pickerOptionsStart1"
                ></el-date-picker>
                <span style="diaplay: inline-block; width: 12px"> — </span>
                <el-date-picker
                  class="datepicker"
                  v-model="form.endTime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  :clearable="false"
                  prefix-icon="el-icon-date"
                  placeholder="结束时间"
                  :picker-options="pickerOptionsEnd1"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="shadow-btn" @click="save" round
          >保 存</el-button
        >
        <el-button type="primary" class="shadow-btn" @click="cancel" round
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
import EditInfoDialog from "./dialog/editInfo";
import {
  addJobSeasonObj,
  delJobSeasonObj,
  fetchJobseasonList,
  updateJobSeasonObj,
} from "@/api/admin/setting";
import { fetchItemList } from "@/api/admin/dict";
import { mapGetters } from "vuex";

export default {
  name: "opreationSeason",
  components: {
    titleBox,
    myPagination,
    EditInfoDialog,
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
        // {prop: 'sesonName', label: '作业季名称'},
        { prop: "groupNameFullPath", label: "所属分组" },
        { prop: "startTime", label: "开始时间" },
        { prop: "endTime", label: "结束时间" },
      ],
      tableData: [],
      selection: [], // 选择的数据
      dialogVisible: false,
      dialogTitle: "新增分组",
      form: {
        seasonName:''
      },
      model: "",
      showMaps: false,
      editTitle: "",
      jobTypes: [],
      manager_btn_view: true,
      manager_btn_add: true,
      manager_btn_batchdel: true,
      manager_btn_edit: true,
      manager_btn_del: true,
      seasonYears: [],
      season5Years: [],
      clickdata: {},
      submitType: "add",
      rules: {
        jobYear: [
          { required: true, message: "请选择作业年度", trigger: "change" },
        ],
        jobType: [
          { required: true, message: "请选择作业类型", trigger: "change" },
        ],
        seasonName: [
          { required: true, message: "请输入作业季名称", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "请选择作业时间", trigger: "change" },
          { validator: this.checkTime, trigger: "change" },
        ],
      },

      // 开始日期限制
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (this.searchForm.endTime) {
            return (
              time.getTime() >= new Date(this.searchForm.endTime).getTime()
            );
          }
        },
      },
      // 结束日期限制
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (this.searchForm.startTime) {
            return (
              time.getTime() <= new Date(this.searchForm.startTime).getTime()
            );
          }
        },
      },
      // 开始日期限制
      pickerOptionsStart1: {
        disabledDate: (time) => {
          if (this.form.endTime) {
            return time.getTime() >= new Date(this.form.endTime).getTime();
          }
        },
      },
      // 结束日期限制
      pickerOptionsEnd1: {
        disabledDate: (time) => {
          if (this.form.startTime) {
            return time.getTime() <= new Date(this.form.startTime).getTime();
          }
        },
      },
    };
  },
  created() {
    this.getBtnPermis(); //按钮权限
    this.init();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    getBtnPermis() {
      this.manager_btn_view =
        this.permissions[window.global.buttonPremission.jobseasonView];
      this.manager_btn_add =
        this.permissions[window.global.buttonPremission.jobseasonAdd];
      this.manager_btn_batchdel =
        this.permissions[window.global.buttonPremission.jobseasonDelete];
      this.manager_btn_edit =
        this.permissions[window.global.buttonPremission.jobseasonEdit];
      this.manager_btn_del =
        this.permissions[window.global.buttonPremission.jobseasonDelete];
      //console.log("this.permissions", this.permissions);
    },
    checkTime(rule, value, callback) {
      if (!this.form.startTime || !this.form.endTime) {
        callback(new Error("请再次输入密码"));
      } else {
        callback();
      }
    },
    init() {
      this.initseasonYears();
      this.initJobTypes("job_type");
      this.search();
    },
    initseasonYears() {
      var date = new Date();
      for (var i = 2016; i <= date.getFullYear() * 1; i++) {
        this.seasonYears.push({ label: i, value: i });
      }
    },
    initJobTypes(listType) {
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
          that.jobTypes = [...res.data.records];
        }
      });
    },
    search(page) {
      if (page > 0) this.page.currentPage = page;
      if (this.clickdata && this.clickdata.id) {
        this.searchForm.groupId = this.clickdata.id * 1;
      }
      this.listLoading = true;
      fetchJobseasonList(
        Object.assign(
          {
            current: this.page.currentPage,
            size: this.page.pageSize,
          },
          this.searchForm
        )
      ).then((res) => {
        if (res) {
          this.tableData = res.data.rows;
          this.page.total = res.data.total;
          this.listLoading = false;
        }
      });
    },
    handleNodeClick(val) {
      if (val && val.id) {
        //获取所有子id
        this.searchForm.groupid = val.id;
        this.clickdata = val;
      }
    },
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    // 新增
    handleCreate() {
      this.sub;
      if (!this.clickdata || !this.clickdata.id) {
        this.$message.info("请先选择分组");
        return;
      }
      this.submitType = "add";
      var date = new Date();
      this.editTitle = "新增作业季";
      this.dialogVisible = true;
      this.form = {
        seasonName:''
      };
      this.form.jobYear = date.getFullYear();
      this.form.startTime =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " 00:00:00";
      this.form.endTime = date.getFullYear() + "-12-31 23:59:59";
      this.form = { ...this.form };
      this.form.groupNameFullPath = this.clickdata.groupNameFullPath;
      this.form.groupId = this.clickdata.id;
    },
    handleUpdata(row) {
      this.submitType = "update";
      this.editTitle = "编辑作业季";
      this.form = row;
      this.dialogVisible = true;
    },
    // 批量删除
    handleDelete(row) {
      this.$confirm(
        "是否确认删除 " +
          row.groupNameFullPath +
          " 的作业季：" +
          row.seasonName,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        delJobSeasonObj(row.rowId)
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
              delJobSeasonObj(ele.rowId).then((res) => {
                res.seasonName = ele.seasonName;
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
              suceessGroup += "删除" + ele.seasonName + " 成功";
              if (index < res.length - 1) {
                suceessGroup += " <br/>";
              }
              isrefresh = true;
            } else {
              errorGroup += "删除" + ele.seasonName + "失败：" + ele.msg;
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
          addJobSeasonObj(this.form)
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
      this.$refs.form.validate((va) => {
        if (va) {
          updateJobSeasonObj(this.form)
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
      this.$refs.form.resetFields();
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
    jobTypeFormatter(val) {
      let jobtypename = val.jobType;
      if (this.jobTypes) {
        this.jobTypes.forEach((ele, index) => {
          if (ele.itemCode == val.jobType) {
            jobtypename = ele.itemName;
            return;
          }
        });
      }
      return jobtypename;
    },
    jobTypeChange(val) {
      // debugger
      let obj = this.jobTypes.find(function (item) {
        return item.itemCode === val;
      });
      this.form.jobTypeName = obj.itemName;
      this.form.seasonName = (this.form.jobYear ? this.form.jobYear : "") + obj.itemName;
    },
    jobYearChange(val) {
      //this.form.seasonName = val + (this.form.jobTypeName ? "" : this.form.jobTypeName)
      this.form.startTime = this.form.jobYear + "-01-01 00:00:00";
      this.form.endTime = this.form.jobYear + "-12-31 23:59:59";
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
      width: 46%;
    }
  }

  .dialog-footer {
    height: 30px;
    padding-right: 25px;
  }
}
</style>