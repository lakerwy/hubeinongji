<template>
  <!-- 分组管理 -->
  <div class="app-container department">
    <titleBox :headName="'分组管理'" />
    <basic-container class="basic-con">
      <!-- pbw修改页面样式一致 -->
      <el-row :span="24" style="width: 100%; height: 100%">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="height: 100%">
          <groupBox
            ref="groupBox"
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
          class="department__main"
        >
          <el-form class="my-form" :model="searchForm" :inline="true">
            <el-form-item label="分组名称:">
              <el-input
                v-model="searchForm.selectName"
                placeholder="请输入分组名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="上级分组名称:">
              <el-input
                v-model="searchForm.groupParName"
                placeholder="请输入上级分组名称"
              ></el-input>
            </el-form-item>
            <el-form-item class="btn">
              <el-button
                style="width: 90px"
                class="shadow-btn"
                plain
                size="medium"
                round
                v-if="btnPermis.btnView"
                @click="handleSearch"
                >查询
              </el-button>
            </el-form-item>
          </el-form>

          <div class="my-table">
            <div class="avue-crud__menu">
              <div class="avue-crud__left">
                <el-button
                  v-if="btnPermis.btnBack"
                  class="shadow-btn"
                  plain
                  round
                  size="mini"
                  @click="handleBack()"
                  >上一级
                </el-button>
                <el-button
                  v-if="btnPermis.btnAdd"
                  class="shadow-btn"
                  plain
                  round
                  size="mini"
                  @click="handleCreate()"
                  >新增
                </el-button>
                <!--   <el-button
                                                                        class="shadow-btn"
                                                                        plain
                                                                        round
                                                                        size="mini"
                                                                        @click="handleUpdate">修改
                                                                </el-button>-->
                <el-button
                  v-if="btnPermis.btnBatchDelete"
                  class="shadow-btn"
                  plain
                  round
                  size="mini"
                  @click="handleDeleteBacth"
                  >批量删除
                </el-button>
                <el-button
                  v-if="btnPermis.btnTranser"
                  class="shadow-btn"
                  plain
                  round
                  size="mini"
                  @click="handleTransform"
                  >迁移
                </el-button>
                <!--<el-button
                                                                        v-if="btnPermis.btnImport"
                                                                        class="shadow-btn"
                                                                        plain
                                                                        round
                                                                        size="mini"
                                                                        @click="handleImport">导入
                                                                </el-button>-->
                <!--<el-button
                                                                        class="shadow-btn"
                                                                        plain
                                                                        round
                                                                        size="mini"
                                                                        @click="handleUpLevel">上一级
                                                                </el-button>-->
              </div>
            </div>

            <el-table
              :data="tableData"
              :table-loading="tableLoading"
              style="width: 100%"
              height="calc(100% - 50px)"
              @selection-change="handleSelectChange"
            >
              <el-table-column
                type="selection"
                label="全选"
                width="50"
                fixed="left"
              >
              </el-table-column>
              <!-- <el-table-column
                                                                type="index"
                                                                label="序号"
                                                                width="50"
                                                                fixed="left">
                                                        </el-table-column>-->
              <el-table-column
                prop="groupName"
                label="分组名称"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    class="table-text-btn"
                    @click="handleTableClick(scope.row)"
                    >{{ scope.row.groupName }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                v-for="item in columns"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
              >
              </el-table-column>
              <el-table-column prop="group_type" label="分组类型" width="120px">
                <template slot-scope="scope">
                  {{ handleTableType(scope.row) }}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    v-if="
                      btnPermis.btnAddChildren && scope.row.groupAttribute < 7
                    "
                    size="small"
                    type="text"
                    icon="el-icon-plus"
                    @click="handleCreate(scope.row)"
                    >新增子项
                    <!--v-if="permissions.sys_menu_add"-->
                  </el-button>
                  <el-button
                    v-if="btnPermis.btnEdit"
                    size="small"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row)"
                    >修改
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
            <myPagination
              ref="pagination"
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
      class="my-dialog"
      :visible.sync="groupDialogVisible"
      :close-on-click-modal="false"
      title="选择迁移的分组"
      :modal-append-to-body="false"
      top="10%"
      width="400px"
    >
      <div class="app-container department" style="height: 400px">
        <groupBox
          class="self-box"
          :showCheckBox="false"
          :isSelf="true"
          :isAll="true"
          @getData="handleNodeClick2"
        />
        <!--  <basic-container class="basic-con" style="height: 90%">

                                  </basic-container>-->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="transGroup"
          >确定
        </el-button>
        <el-button type="default" size="small" @click="cancal2()"
          >取消
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      class="my-dialog"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :title="dialogTitle"
      :modal-append-to-body="false"
      top="13%"
      width="500px"
      :before-close="cancel"
    >
      <el-form :model="form" label-width="100px" :rules="rules" ref="form">
        <el-form-item label="上级分组id:" hidden prop="groupPid">
          <el-input
            v-model="form.groupPid"
            placeholder="请选择上级分组"
          ></el-input>
        </el-form-item>
        <el-form-item label="分组路径:">
          <el-input
            v-model="form.groupNameFullPath"
            placeholder=""
            readOnly
          ></el-input>
        </el-form-item>
        <el-form-item label="分组名称:" prop="groupName">
          <el-input
            v-model.trim="form.groupName"
            placeholder="请输入分组名称,最多50个字符"
            @input="groupNameChange"
          ></el-input>
        </el-form-item>
        <el-form-item label="分组类型:" prop="groupAttribute">
          <el-select
            style="width: 100%"
            v-model="form.groupAttribute"
            placeholder="请选择分组类型"
          >
            <el-option
              v-for="item in subtypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经度:">
          <el-input
            v-model="form.longtude"
            placeholder="请输入经度"
            type="number"
            oninput="value=value.replace(/[^\d]/g,'')"
            @input="numberChange(arguments[0], 0, 180, 'longtude')"
          ></el-input>
        </el-form-item>
        <el-form-item label="纬度:">
          <el-input
            v-model="form.latitude"
            placeholder="请输入纬度"
            type="number"
            oninput="value=value.replace(/[^\d]/g,'')"
            @input="numberChange(arguments[0], 0, 90, 'latitude')"
          ></el-input>
        </el-form-item>
        <el-form-item label="区域编码:">
          <el-input
            v-model="form.groupCode"
            maxlength="6"
            oninput="value=value.replace(/[^\d]/g,'')"
            placeholder="请输入区域编码"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="save()">确定</el-button>
        <el-button type="default" size="small" @click="cancel()"
          >取消
        </el-button>
      </div>
    </el-dialog>

    <importDialog ref="import" />
  </div>
</template>

<script>
import titleBox from "_com/contenBox/titleBox.vue";
import myPagination from "_com/myPagination/index.vue";
import groupBox from "_com/groupBox2/index.vue";
import importDialog from "../components/importDialog";
import {
  getGroupsByGroupPid,
  listGroup,
  addGroup,
  updateGroup,
  deleteGroup,
  transerGroup,
  getAllGroupTree
} from "@/api/admin/group";
import { fetchItemList } from "@/api/admin/dict";
import {toTreeData} from "@/util/util";
import { mapGetters } from "vuex";

export default {
  name: "department",
  components: {
    titleBox,
    myPagination,
    groupBox,
    importDialog,
  },
  data() {
    const validateGroupName = (rule, value, callback) => {
      if (value.indexOf("/") >= 0) {
        callback(new Error("分组名称不能包含 /"));
      }
      if (value && value.length > 50) {
        callback(new Error("分组名称最多50个字符"));
      }

      callback();
    };
    return {
      // searchShow:"请输入分组名称",
      arr: [],
      tableLoading: false,
      searchForm: {
        groupPid: 0,
      },
      backCurrentArr: [],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        { prop: "groupNameFullPath", label: "分组全路径", width: "200" },
        // { prop: "group_type", label: "分组类型", width: "300" },
        { prop: "groupCode", label: "行政区编码", width: "120" },
      ],
      tableData: [],
      selection: [], // 选择的数据
      dialogVisible: false,
      groupDialogVisible: false,
      dialogTitle: "新增分组",
      form: {},
      showMaps: false,
      types: [],
      subtypes: [],
      clickdata: {
        id: 0,
        name: "全部分组",
      },
      transform: {},
      rules: {
        groupName: [
          { required: true, message: "分组名称必须填写", trigger: "blur" },
          { required: true, trigger: "blur", validator: validateGroupName },
        ],
        groupPid: [
          { required: true, message: "分组父级节点必须选择", trigger: "blur" },
        ],
        groupAttribute: [
          { required: true, message: "请选择分组类型", trigger: "change" },
        ],
      },
      btnPermis: {
        //按钮权限
        btnView: true,
        btnAdd: true,
        btnBack: true,
        btnBatchDelete: true,
        btnTranser: true,
        btnImport: true,
        btnAddChildren: true,
        btnEdit: true,
        btnDelete: true,
      },
    };
  },
  created() {
    this.getBtnPermis(); //按钮权限
    this.initData();
    this.initTypes();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    getBtnPermis() {
      this.btnPermis.btnView =
        this.permissions[window.global.buttonPremission.groupView];
      this.btnPermis.btnAdd =
        this.permissions[window.global.buttonPremission.groupAdd];
      this.btnPermis.btnBatchDelete =
        this.permissions[window.global.buttonPremission.groupDelete];
      this.btnPermis.btnTranser =
        this.permissions[window.global.buttonPremission.groupTranser];
      this.btnPermis.btnImport =
        this.permissions[window.global.buttonPremission.groupImport];
      this.btnPermis.btnAddChildren =
        this.permissions[window.global.buttonPremission.groupAddChildren];
      this.btnPermis.btnEdit =
        this.permissions[window.global.buttonPremission.groupEdit];
      this.btnPermis.btnDelete =
        this.permissions[window.global.buttonPremission.groupDelete];
      //console.log("this.btnPermis", this.btnPermis);
      //console.log("this.permissions", this.permissions);
    },
    handleTableType(val) {
      // //console.log(val.groupAttribute);
      // //console.log(this.types);
      // val.groupAttribute=item.value
      let group_type = "";
      this.types.forEach((item) => {
        if (val.groupAttribute == item.value) {
          group_type = item.label;
        }
      });
      return group_type;
    },
    // 树节点点击事件
    initTypes() {
      this.types = [];
      let that = this;
      fetchItemList(
        Object.assign(
          {
            current: 1,
            size: 100,
          },
          { listType: "group_type" }
        )
      ).then((response) => {
        if (response.code === 0) {
          response.data.records.forEach((ele, index) => {
            that.types.push({
              value: ele.itemCode,
              label: ele.itemName,
            });
            that.subtypes.push({
              value: ele.itemCode,
              label: ele.itemName,
            });
          });
        }
      });
    },
    handleBack() {
      let val = this.arr[this.arr.length - 2];
      if (this.arr.length > 1) {
        this.arr.pop();
      } else {
        val = this.arr;
        // this.backcurrent = this.page.currentPage;
        this.arr.pop();
      }
      this.form = Object.assign({}, val);
      //console.log(this.arr);
      this.searchForm.groupPid = val.rowId;
      this.searchForm.selectName = val.groupName;
      this.clickdata.id = val.rowId;
      this.clickdata.groupNameFullPath = val.groupNameFullPath;
      this.clickdata.groupAttribute = val.groupAttribute;
      let params = {
        groupPid: val.rowId,
        selectName: val.groupName,
        current: this.backCurrentArr[this.backCurrentArr.length - 1],
        size: this.page.pageSize,
      };
      this.initData2(params);
    },
    handleTableClick(val) {
      this.backCurrentArr.push(this.page.currentPage);
      console.log(this.backCurrentArr);
      this.form = Object.assign({}, val);
      this.arr.push(this.form);
      //console.log(this.arr);
      this.searchForm.groupPid = val.rowId;
      this.searchForm.selectName = val.groupName;
      this.clickdata.id = val.rowId;
      this.clickdata.groupNameFullPath = val.groupNameFullPath;
      this.clickdata.groupAttribute = val.groupAttribute;
      this.page.currentPage = 1;
      this.initData();
    },
    handleNodeClick(val) {
      this.clickdata = Object.assign({}, val);
      // this.form.groupPid = val.pId
      this.form = Object.assign(this.page, { groupPid: val.id });
      this.arr.push(this.form);
      this.searchForm.groupPid = val.id;
      this.searchForm.selectName = val.groupName;
      this.page.currentPage = 1;
      this.initData();
    },
    handleNodeClick2(val) {
      console.log(val);
      this.transform = Object.assign({}, val);
    },
    change(e) {
      this.$forceUpdate();
    },
    initData2(params) {
      listGroup(params)
        .then((res) => {
          this.tableData = res.data.records;
          this.page.total = res.data.total;
          this.tableLoading = false;
          // debugger;
          this.page.currentPage =
            this.backCurrentArr[this.backCurrentArr.length - 1];
          this.backCurrentArr.splice(this.backCurrentArr.length - 1, 1);
          return res;
        })
        .catch((res) => {
          // debugger;
        });
    },
    initData() {
      //获取下一级的分组
      this.tableLoading = true;
      let parameters = Object.assign({}, this.searchForm);
      if (parameters.groupParName && parameters.groupParName.length > 0) {
        parameters.groupPid = -1;
      }
      let that = this;
      listGroup(
        Object.assign(
          {
            current: this.page.currentPage,
            size: this.page.pageSize,
          },
          parameters
        )
      )
        .then((res) => {
          this.tableData = res.data.records;
          this.page.total = res.data.total;
          //如果返回上一级有可能出问题，这两行代码解决
          this.tableLoading = false;
          return res;
        })
        .catch((res) => {
          // debugger;
          // that.$refs.pagination.page_current= 418
          // console.log(that.$refs.pagination)page_current
          // this.$set(that.page,"currentPage",res.data.current)
          // this.$set(that.page,"pageSize",res.data.size)
          // that.page.currentPage = res.data.current
          // that.page.pageSize = res.data.size
        });
    },

    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.initData();
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.initData();
    },
    groupNameChange() {
      if (this.submitType == "add") {
        this.form.groupNameFullPath = this.form.groupNameFullPathOld
          ? this.form.groupNameFullPathOld + "/" + this.form.groupName
          : this.form.groupName;
      } else if (this.submitType == "update") {
        var index = this.form.groupNameFullPath.lastIndexOf("/");
        if (index > -1) {
          this.form.groupNameFullPath =
            this.form.groupNameFullPath.substring(0, index) +
            "/" +
            this.form.groupName;
        } else {
          this.form.groupNameFullPath = this.form.groupName;
        }
      }
    },
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    // 新增
    handleCreate(row) {
      this.form = {};
      this.dialogTitle = "新增分组";
      this.submitType = "add";
      var groupAttribute = 0;
      if (row) {
        this.form.groupPid = row.rowId;
        this.form.groupNameFullPathOld = row.groupNameFullPath;
        groupAttribute = row.groupAttribute;
      } else {
        this.form.groupPid = this.clickdata.id;
        this.form.groupNameFullPathOld = this.clickdata.groupNameFullPath;
        groupAttribute = this.clickdata.groupAttribute;
      }
      if (groupAttribute > 5) {
        this.$message.warning("子合作社或个人终端分组下不允许在添加分组");
        return;
      }
      if (this.clickdata.children) {
        console.log(this.clickdata);
        // debugger;
        this.dialogVisible = true;
      } else {
        this.dialogVisible = false;
        this.$message.warning("请先选择分组");
      }
      this.form.groupNameFullPath = this.form.groupNameFullPathOld;
      /* if (!this.form.groupPid) {
                                         this.$message.info('请选择父级分组');
                                         return;
                                     }*/
      this.subtypes = this.types.filter((value, index) => {
        return value.value * 1 > groupAttribute * 1;
      });
      this.subtypes.sort();
    },
    // 修改
    handleUpdate(row) {
      /*if (this.selection.length <= 0) {
                                        this.$message.info('请选择需要修改的分组');
                                        return;
                                    } else if (this.selection.length > 1) {
                                        this.$message.info('只能选择一个分组进行修改！');
                                        return;
                                    }*/
      this.form = Object.assign({}, row);
      this.dialogTitle = "编辑分组";
      this.submitType = "update";
      this.dialogVisible = true;
      if (this.form.groupAttribute) {
        this.subtypes = this.types.filter((value, index) => {
          return value.value * 1 >= this.form.groupAttribute * 1;
        });
        this.subtypes.sort();
      }
    },
    handleSearch() {
      this.page.currentPage = 1;
      this.initData();
    },
    // 删除
    handleDeleteBacth() {
      if (this.selection.length <= 0) {
        this.$message.info("请选择需要删除的分组");
        return;
      }
      let that = this;
      this.$confirm("是否确认删除选中的数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let tmpplandatas = [];
        this.selection.forEach((ele, index) => {
          tmpplandatas.push(
            new Promise(function (resolve, reject) {
              // 此处进行异步请求
              deleteGroup({ rowId: ele.rowId }).then((res) => {
                res.groupName = ele.groupName;
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
              suceessGroup += "删除" + ele.groupName + "成功";
              if (index < res.length - 1) {
                suceessGroup += " <br/>";
              }
              isrefresh = true;
            } else {
              errorGroup += "删除" + ele.groupName + "失败：" + ele.msg;
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
          if (isrefresh) this.initData();
        });
      });
    },
    // 删除
    handleDelete(row) {
      if (!row) {
        this.$message.info("请选择需要删除的分组");
        return;
      }
      this.$confirm("是否确认删除分组[ " + row.groupName + " ]?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteGroup({ rowId: row.rowId }).then((respone) => {
          if (respone.code === 0) {
            this.$notify.success("删除成功");
            this.initData();
          } else {
            this.$notify.warning(respone.msg);
          }
        });
      });
    },
    handleUpLevel() {
      /* if (this.form.groupPid) {
                                         this.searchForm.groupPid = this.form.groupPid;
                                         this.initData();
                                     }*/
    },
    handleTransform() {
      if (this.selection.length <= 0) {
        this.$message.info("请至少选择一个需要迁移的分组");
        return;
      }
      this.groupDialogVisible = true;
    },

    // 导入
    handleImport() {
      this.$refs.import.dialogVisible = true;
    },
    // 经纬度选择回调事件
    parentFn(val) {
      this.form.lon = val[0];
      this.form.lat = val[1];
    },
    // 保存
    save() {
      this.$refs.form.validate((valid) => {
        if (!valid) return false;
        if (this.submitType == "add") {
          addGroup(this.form).then((respone) => {
            if (respone.code === 0) {
              this.$notify.success("新增成功");
              this.initData();
              this.dialogVisible = false;
            } else {
              this.$notify.error(respone.msg);
            }
          });
        } else if (this.submitType == "update") {
          updateGroup(this.form).then((respone) => {
            if (respone.code === 0) {
              this.$notify.success("修改成功");
              this.initData();
              this.dialogVisible = false;
            } else {
              this.$notify.error(respone.msg);
            }
          });
        }
      });
    },
    transGroup() {
      console.log(this.transform)
      if (!this.transform.id && this.transform.id !== 0) {
        this.$message.info("请选择迁移的目标分组");
        return;
      }
      let that = this;
      var groupName = "";
      this.selection.forEach((ele, index) => {
        groupName += ele.groupName + ",";
      });
      if (groupName.length > 0) {
        groupName = groupName.substring(0, groupName.length - 1);
      }
      this.$confirm(
        "是否确认将选择的【" +
          groupName +
          "】迁移到【" +
          this.transform.name +
          "】下面？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        let tmpplandatas = [];
        this.selection.forEach((ele, index) => {
          tmpplandatas.push(
            new Promise(function (resolve, reject) {
              // 此处进行异步请求
              transerGroup({
                rowId: ele.rowId,
                groupPid: that.transform.id,
              }).then((res) => {
                console.log("854",res)
                res.groupName = ele.groupName;
                resolve(res);
              });
            })
          );
        });
        Promise.all(tmpplandatas).then((res) => {
          console.log("Promise", res);
          var isrefresh = false;
          var suceessGroup = "";
          var errorGroup = "";
          res.forEach((ele, index) => {
            if (ele.code === 0) {
              suceessGroup += "迁移" + ele.groupName + "成功";
              if (index < res.length - 1) {
                suceessGroup += " <br/>";
              }
              isrefresh = true;
            } else {
              errorGroup += "迁移" + ele.groupName + "失败：" + ele.msg;
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
          if (isrefresh) {
            this.initData();
            getAllGroupTree().then(res=>{
              let temp = toTreeData(res.data, "id", "pId");
              sessionStorage.setItem("allGroupTreeData", JSON.stringify(temp));
              this.$refs.groupBox.initData();
            }).catch(err=>{
              console.log(err)
            })
            this.groupDialogVisible = false;
          }
        });
      });
    },
    // 取消关闭
    cancel() {
      this.form = {};
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    },
    cancal2() {
      this.groupDialogVisible = false;
    },
    numberChange(val, minVal, maxVal, ele) {
      //转换数字类型
      this.form[ele] = Number(val);
      //重新渲染
      this.$nextTick(() => {
        //比较输入的值和最大值，返回小的
        let num = Math.min(Number(val), maxVal);
        num = Math.max(num, minVal);
        //输入负值的情况下， = 0（可根据实际需求更该）
        this.form[ele] = num;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.department {
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
}

.self-box {
  position: unset;
  background: transparent;
  height: 100%;
  padding-right: 20px;
  margin-right: 20px;
  border-right: 1px solid #133460;

  .group-box {
    height: 100%;

    .box-card {
      background: transparent !important;
    }
  }

  div {
    position: unset;
  }
}
</style>