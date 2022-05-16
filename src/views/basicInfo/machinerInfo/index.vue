<template>
  <div class="machiner">
    <TitleBox class="title" :headName="'农机信息'" />
    <div class="content">
      <div class="contTable">
        <div class="searchBox">
          <el-form
            class="my-form"
            label-position="right"
            label-width="80px"
            :model="form"
          >
            <div class="formItem">
              <el-form-item label="农机分组:">
                <el-input
                  v-model="groupData.name"
                  placeholder="请选择农机分组"
                  @focus="open"
                ></el-input>
              </el-form-item>
              <el-form-item label="农机车牌:">
                <el-input
                  v-model="form.plateNumber"
                  placeholder="请输入农机车牌"
                ></el-input>
              </el-form-item>
              <el-form-item label="终端型号:">
                <el-select
                  v-model="form.terminalModel"
                  clearable
                  placeholder="请选择终端型号"
                >
                  <el-option
                    v-for="item in machineDict.terminalModelSelect"
                    :key="item.id"
                    :label="item.itemName"
                    :value="item.itemName"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="农机类型:">
                <el-select
                  v-model="form.machineType"
                  clearable
                  @change="clearToolType"
                  placeholder="请选择农机类型"
                >
                  <el-option
                    v-for="item in machineDict.machineTypeSelect"
                    :key="item.id"
                    :label="item.itemName"
                    :value="item.itemCode"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="机具类型:" label-width="90px">
                <el-select
                  v-model="form.toolType"
                  clearable
                  placeholder="请选择机具类型"
                >
                  <el-option
                    v-for="item in toolTypeSelectByMachine"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="formItem">
              <el-form-item label="机主姓名:">
                <el-input
                  v-model="form.ownerName"
                  placeholder="请输入机主姓名"
                ></el-input>
              </el-form-item>
              <el-form-item label="机主电话:">
                <el-input
                  v-model="form.ownerPhone"
                  placeholder="请输入机主电话"
                ></el-input>
              </el-form-item>
              <el-form-item label="终端编号:">
                <el-input
                  v-model="form.terminalCode"
                  placeholder="请输入终端编号"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="面积状态:">
                <el-select
                  v-model="form.autoCalFalg"
                  clearable
                  placeholder="请选择面积状态"
                >
                  <el-option label="开启" value="Y"></el-option>
                  <el-option label="关闭" value="N"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="机具识别码:" label-width="90px">
                <el-input
                  v-model="form.toolIfa"
                  placeholder="请输入机具识别码"
                ></el-input>
              </el-form-item>
            </div>
            <div class="formItem">
              <el-form-item label="农机状态:">
                <el-select
                  v-model="form.activeFlag"
                  clearable
                  placeholder="请选择农机状态"
                >
                  <el-option label="有效" value="1"></el-option>
                  <el-option label="失效" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="补贴状态:">
                <el-select
                  v-model="form.allowanceStatus"
                  clearable
                  placeholder="请选择补贴状态"
                >
                  <el-option label="已发放" value="1"></el-option>
                  <el-option label="未发放" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="item-data" label="安装日期:">
                <el-date-picker
                  class="datepicker"
                  v-model="form.installStartTime"
                  type="date"
                  :clearable="true"
                  prefix-icon="el-icon-date"
                  placeholder="开始时间"
                  :picker-options="startTime"
                ></el-date-picker>
                <span style="diaplay: inline-block; width: 12px"> — </span>
                <el-date-picker
                  class="datepicker"
                  v-model="form.installEndTime"
                  type="date"
                  :clearable="true"
                  prefix-icon="el-icon-date"
                  placeholder="结束时间"
                  :picker-options="endTime"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="安装账号:">
                <el-select
                  v-model="form.installerId"
                  clearable
                  placeholder="请选择安装账号"
                >
                  <el-option
                    v-for="(item, index) in machineDict.installerSelect"
                    :key="index"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <div class="btn">
                <el-button
                  type="primary"
                  class="shadow-btn"
                  round
                  @click="search"
                  v-if="btnPermis.btnView"
                  >查询
                </el-button>
              </div>
            </div>
          </el-form>
        </div>
        <div class="table" v-loading="searchLoad">
          <div class="table_btns">
            <div class="btn-left">
              <el-button
                type="primary"
                class="shadow-btn"
                round
                @click="addMachine"
                v-if="btnPermis.btnAdd"
                >新增
              </el-button>
              <el-button
                type="primary"
                class="shadow-btn"
                round
                @click="changeTerminalClick"
                v-if="btnPermis.btnChangeTemial"
                >更换终端
              </el-button>
              <el-button
                type="primary"
                class="shadow-btn"
                round
                @click="ChangeClick"
                v-if="btnPermis.btnHistory"
                >历史查询
              </el-button>
              <el-button
                type="primary"
                class="shadow-btn"
                round
                @click="EditClick"
                v-if="btnPermis.btnInstallsheet"
              >
                电子安装单
              </el-button>
              <el-button
                type="primary"
                class="shadow-btn"
                round
                @click="toggleArea(true)"
                v-if="btnPermis.btnOpenCompute"
                >开启面积计算
              </el-button>
              <el-button
                type="primary"
                class="shadow-btn"
                round
                @click="toggleArea(false)"
                v-if="btnPermis.btnCloseCompute"
                >关闭面积计算
              </el-button>
              <el-button
                type="primary"
                class="shadow-btn"
                round
                @click="toggleNotepush(true)"
                v-if="btnPermis.btnOpenpush"
                >开启短信发送
              </el-button>
              <el-button
                type="primary"
                class="shadow-btn"
                round
                @click="toggleNotepush(false)"
                v-if="btnPermis.btnClosepush"
                >关闭短信发送
              </el-button>
            </div>
            <div class="btn-right">
              <el-dropdown
                @command="handleCommand"
                v-if="btnPermis.btnActivate || btnPermis.btnUneffect"
              >
                <div class="tableTool">
                  <img src="img/table_tool1.png" alt="" />
                  <span
                    >批量操作 <i class="el-icon-arrow-down el-icon--right"></i
                  ></span>
                </div>
                <template #dropdown>
                  <el-dropdown-menu class="dropdown">
                    <el-dropdown-item
                      command="a"
                      class="dropdown-item"
                      v-if="btnPermis.btnActivate"
                      >激活
                    </el-dropdown-item>
                    <el-dropdown-item
                      command="b"
                      class="dropdown-item"
                      v-if="btnPermis.btnUneffect"
                      >失效
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <div class="vertical" v-if="btnPermis.btnImport"></div>
              <div
                class="tableTool"
                @click="handleClick('import')"
                v-if="btnPermis.btnImport"
              >
                <img src="img/table_tool2.png" alt="" />
                <span>报表导入</span>
              </div>
              <div class="vertical" v-if="btnPermis.btnExport"></div>
              <div
                class="tableTool"
                @click="handleClick('export')"
                v-if="btnPermis.btnExport"
              >
                <img src="img/table_tool3.png" alt="" />
                <span>报表导出</span>
              </div>
              <div class="vertical" v-if="btnPermis.btnDelete"></div>
              <div
                class="tableTool"
                @click="handleClick('del')"
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
              border
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
              <el-table-column prop="plateNumber" label="农机车牌">
                <template slot-scope="scope">
                  <el-button
                    v-if="btnPermis.btnEdit"
                    type="text"
                    class="table-text-btn"
                    @click="changeMachine(scope.row)"
                    >{{ scope.row.plateNumber }}
                  </el-button>
                  <span v-else>{{ scope.row.plateNumber }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-for="item in columns"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :formatter="item.formatter"
                :show-overflow-tooltip="item.showOverflow"
              >
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="myPage">
          <myPagination
            :currentPage="page.currentPage"
            :pageSize="page.pageSize"
            :total="page.total"
            @current-change="currentChange"
            @size-change="handleSizeChange"
          />
        </div>

        <ChangeQuery ref="machineChange" :selectId="historyId" />
        <MachineEdit
          ref="machineEdit"
          v-if="machineVisible"
          :machineDict="machineDict"
          :editMachineRowId="editMachineRowId"
          :title="title"
        />
        <MountList
          ref="mountList"
          :mountQueryId="mountQueryId"
          :toolTypeSelect="machineDict.toolTypeSelect"
        ></MountList>
        <ImportDialog ref="importDiaolog"></ImportDialog>
        <ChangeTerminal ref="changeTerminal" :machineDict="machineDict" />
      </div>
    </div>
  </div>
</template>


<script>
import TitleBox from "../../../components/contenBox/titleBox";
import ChangeQuery from "./dialog/ChangeQuery";
import MachineEdit from "./dialog/machineEdit/MachineEdit";
import MountList from "./dialog/mountListDialog";
import ImportDialog from "./dialog/importDialog";
import ChangeTerminal from "./dialog/ChangeTerminal";
import myPagination from "_com/myPagination/index";
import { mapGetters, mapMutations } from "vuex";
import {
  activeMachine,
  closeComputeArea,
  closePushMessage,
  delMachineById,
  exportMachinbeInfo,
  getAllBrand,
  getInstallsheet,
  getMachineDict,
  getMachineInfo,
  getToolType,
  openComputeArea,
  openPushMessage,
  unEffectCdMachine,
} from "../../../api/basic/machine";
import { machineForm } from "./js/index";
import { filterDict , dateFormat} from "@/util/util.js";
import {
  downloadPost,
  getSelectionIds,
  handBlobDown,
} from "../../../util/util";
import { getDictByListType } from "@/api/basic/index";

export default {
  name: "index",
  components: {
    TitleBox,
    ChangeQuery,
    MachineEdit,
    MountList,
    ImportDialog,
    ChangeTerminal,
    myPagination,
  },
  data() {
    return {
      form: Object.assign({}, machineForm),
      startTime: {
        disabledDate: (time) => {
          let endDateVal = this.form.installEndTime;
          if (endDateVal) {
            //小于结束时间
            return time > new Date(endDateVal);
          }
        },
        cellClassName: () => {},
      },
      endTime: {
        disabledDate: (time) => {
          let startDateVal = this.form.installStartTime;
          if (startDateVal) {
            return time < new Date(startDateVal);
          }
        },
        cellClassName: () => {},
      },
      tableData: [],
      columns: [
        {
          prop: "groupNameFullPath",
          label: "农机分组",
          width: "300px",
          showOverflow: true,
        },
        {
          prop: "machineType",
          label: "农机类型",
          width: "160px",
          formatter: (row) => {
            return filterDict(
              row.machineType,
              {
                labelKey: "itemName",
                valueKey: "itemCode",
              },
              this.machineDict.machineTypeSelect
            );
          },
        },
        { prop: "machineModel", label: "农机型号", width: "160px" },
        { prop: "terminalCode", label: "终端编号", width: "160px" },
        { prop: "terminalModel", label: "终端型号", width: "160px" },
        {
          prop: "toolIfa",
          label: "机具识别码",
          width: "160px",
          showOverflow: true,
        },
        { prop: "ownerName", label: "机主姓名", width: "160px" },
        { prop: "simNumber", label: "SIM卡号码", width: "160px" },
        { prop: "defaultToolWidth", label: "作业宽幅(米)", width: "160px" },
        // {prop: 'optionalType', label: '选装件', width: '160px'},
        {
          prop: "activeFlag",
          label: "农机状态",
          width: "160px",
          formatter: (row) => {
            return row.activeFlag == "1" ? "有效" : "失效";
          },
        },
        { prop: "allowance", label: "补贴额度(元)", width: "160px" },
        {
          prop: "allowanceStatus",
          label: "补贴状态",
          width: "160px",
          formatter: (row) => {
            if (row.allowanceStatus === "1") {
              return "已发放";
            } else if (row.allowanceStatus === "0") {
              return "未发放";
            } else {
              return "";
            }
          },
        },
        {
          prop: "autoCalFalg",
          label: "面积计算状态",
          width: "160px",
          formatter: (row) => {
            return row.autoCalFalg == "Y" ? "开启" : "关闭";
          },
        },
        {
          prop: "smsNotify",
          label: "短信发送状态",
          width: "160px",
          formatter: (row) => {
            return row.smsNotify == "Y" ? "开启" : "关闭";
          },
        },
        {
          prop: "installer",
          label: "安装账号",
          width: "160px",
        },
        {
          prop: "installTime",
          label: "安装时间",
          width: "160px",
          formatter: (row) => {
            return row.installTime ? row.installTime.slice(0, 10):""
          },
        },
      ],
      value1: true,
      value2: false,
      title: "",
      selection: [],
      historyId: "",
      mountQueryId: "",
      editMachineRowId: "",
      machineDict: {
        terminalModelSelect: [], //终端型号
        machineTypeSelect: [], //农机类型
        toolTypeSelect: [], //机具类型
        installerSelect: [], //安装账号
        protocolSelect: [], //通信协议
        allBrand: [], //农机品牌
        machineWorkType: [], // 农机作业类型
        manufacturerData: [], // 生产厂商
        terminalAgent: [], //终端代理商
      },
      toolTypeSelectByMachine: [],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      machineVisible: false,
      btnPermis: {
        //按钮权限
        btnAdd: true,
        btnView: true,
        btnEdit: true,
        btnChangeTemial: true,
        btnDelete: true,
        btnImport: true,
        btnExport: true,
        btnHistory: true,
        btnOpenCompute: true,
        btnCloseCompute: true,
        btnActivate: true,
        btnUneffect: true,
        btnOpenpush: true,
        btnClosepush: true,
        btnInstallsheet: true,
      },
      searchLoad: false,
    };
  },
  computed: {
    ...mapGetters(["groupData", "permissions"]),
  },
  watch: {
    "form.machineType": {
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
    this.getBtnPermis();
    this.init();
  },
  methods: {
    ...mapMutations({
      setGroupBoxStatus: "setGroupBoxStatus",
      setGroupCheckBox: "setGroupCheckBox",
      setGroupBoxType: "setGroupBoxType",
    }),
    // 打开农机分组框
    open() {
      this.setGroupCheckBox(true);
      this.setGroupBoxStatus(true);
      this.setGroupBoxType(1);
    },
    //获取按钮权限
    getBtnPermis() {
      this.btnPermis.btnAdd =
        this.permissions[window.global.buttonPremission.machineAdd];
      this.btnPermis.btnView =
        this.permissions[window.global.buttonPremission.machineView];
      this.btnPermis.btnEdit =
        this.permissions[window.global.buttonPremission.machineEdit];
      this.btnPermis.btnChangeTemial =
        this.permissions[window.global.buttonPremission.machineChangetemial];
      this.btnPermis.btnDelete =
        this.permissions[window.global.buttonPremission.machineDelete];
      this.btnPermis.btnImport =
        this.permissions[window.global.buttonPremission.machineImport];
      this.btnPermis.btnExport =
        this.permissions[window.global.buttonPremission.machineExport];
      this.btnPermis.btnHistory =
        this.permissions[window.global.buttonPremission.machineHistory];
      this.btnPermis.btnOpenCompute =
        this.permissions[window.global.buttonPremission.machineOpencompute];
      this.btnPermis.btnCloseCompute =
        this.permissions[window.global.buttonPremission.machineClosecompute];
      this.btnPermis.btnActivate =
        this.permissions[window.global.buttonPremission.machineActivate];
      this.btnPermis.btnUneffect =
        this.permissions[window.global.buttonPremission.machineUneffect];
      this.btnPermis.btnOpenpush =
        this.permissions[window.global.buttonPremission.machineOpenpush];
      this.btnPermis.btnClosepush =
        this.permissions[window.global.buttonPremission.machineClosepush];
      this.btnPermis.btnInstallsheet =
        this.permissions[window.global.buttonPremission.machineInstallsheet];
      console.log("this.btnPermis", this.btnPermis);
    },
    init() {
      this.getTerminalSelect();
      this.getMachineTypeSelect();
      this.getToolTypeSelect();
      this.getInstallsheet();
      this.getProtocolSelect();
      this.getAllBrand();
      this.getMachineWorkType();
      this.getTerminalAgent();
      this.getManufacturer();
      this.searchMachineList();
    },
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
    //终端代理商
    async getTerminalAgent() {
      let params = {
        listType: "terminal_agent",
      };
      let res = await getDictByListType(params);
      const { code, data } = res;
      if (code == 0) {
        this.machineDict.terminalAgent = data;
      }
    },
    //终端型号
    async getTerminalSelect() {
      let res = await getMachineDict({
        listType: "terminal_model",
      });
      if (!res.code) {
        this.machineDict.terminalModelSelect = res.data;
      }
    },
    // 生产厂商字典数据
    async getManufacturer() {
      let params = {
        listType: "ternimal_manufacturer",
      };
      let res = await getDictByListType(params);
      const { code, data } = res;
      if (code == 0) {
        this.machineDict.manufacturerData = data;
      }
    },
    //农机类型
    async getMachineTypeSelect() {
      let res = await getMachineDict({
        listType: "machine_type",
      });
      if (!res.code) {
        this.machineDict.machineTypeSelect = res.data;
      }
    },
    //机具类型
    async getToolTypeSelect() {
      let res = await getMachineDict({
        listType: "tool_type",
      });
      if (!res.code) {
        this.machineDict.toolTypeSelect = res.data;
      }
    },
    //通信协议
    async getProtocolSelect() {
      let res = await getMachineDict({
        listType: "protocol_type",
      });
      if (!res.code) {
        this.machineDict.protocolSelect = res.data;
      }
    },
    //农机作业类型
    async getMachineWorkType() {
      let res = await getMachineDict({
        listType: "job_type",
      });
      if (!res.code) {
        this.machineDict.machineWorkType = res.data;
      }
    },
    //安装账号
    async getInstallsheet() {
      let res = await getInstallsheet();
      if (!res.code) {
        this.machineDict.installerSelect = res.data;
      }
    },
    //农机品牌
    async getAllBrand() {
      let res = await getAllBrand();
      if (res.length) {
        // debugger;
        this.machineDict.allBrand = res;
      }
    },
    //查询按钮每次查询currentPage=1
    search() {
      this.page.currentPage = 1;
      this.searchMachineList();
    },
    //列表查询
    async searchMachineList() {
      this.searchLoad = true;
      //console.log("this.groupData", this.groupData);
      let groupId = this.groupData.children || [];
      let res = await getMachineInfo(
        Object.assign(
          {
            groupId: groupId.join(","),
            page: this.page.currentPage,
            limit: this.page.pageSize,
          },
          this.form,
          {
            installStartTime: dateFormat(this.form.installStartTime),
            installEndTime: dateFormat(this.form.installEndTime),
          }
        )
      );
      this.searchLoad = false;
      if (!res.code) {
        this.tableData = res.data.list;
        this.page.total = res.data.totalCount;
      } else {
        this.$message.error("查询失败");
      }
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.searchMachineList();
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.searchMachineList();
    },
    //历史查询
    ChangeClick() {
      if (this.selection.length <= 0) {
        this.$message.info("请选择需要查询的历史记录");
        return;
      } else if (this.selection.length > 1) {
        this.$message.info("请选择一个进行查询");
        return;
      }
      this.historyId = this.selection[0].rowId;
      this.$refs.machineChange.dialogVisible = true;
    },
    //电子安装单详情
    EditClick() {
      if (this.selection.length <= 0) {
        this.$message.info("请选择需要查询的电子安装单");
        return;
      } else if (this.selection.length > 1) {
        this.$message.info("只能勾选一个电子安装单!");
        return;
      }
      this.mountQueryId = this.selection[0].terminalCode;
      this.$refs.mountList.dialogVisible = true;
    },
    //新增
    addMachine() {
      this.machineVisible = true;
      this.title = "农机信息新增";
      this.editMachineRowId = "";
    },
    //编辑
    changeMachine(val) {
      this.machineVisible = true;
      this.title = "农机信息编辑";
      this.editMachineRowId = val.rowId;
    },
    changeTerminalClick() {
      if (this.selection.length <= 0) {
        this.$message.info("请选择需要更换的农机终端");
        return;
      } else if (this.selection.length > 1) {
        this.$message.info("只能勾选一个农机终端!");
        return;
      }
      this.$refs.changeTerminal.dialogVisible = true;
      this.$refs.changeTerminal.form = this.selection[0];
      this.$refs.changeTerminal.reFreshNewForm();
    },
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    handleClick(type) {
      switch (type) {
        case "import":
          delMachineById;
          this.$refs.importDiaolog.dialogVisible = true;
          break;
        case "export":
          this.exportMachineInfo();
          break;
        case "del":
          if (this.selection.length <= 0) {
            this.$message.info("请选择需要删除的农机");
            return;
          }
          this.$confirm("是否确定删除选择的数据？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.delMachineById();
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除",
              });
            });
          break;
        default:
          break;
      }
    },
    //导出农机信息
    async exportMachineInfo() {
      let groupId = this.groupData.ids || [];
      let params = {
        plateNumberEx: this.form.plateNumber,
        machineTypeEx: this.form.machineType,
        ownerNameEx: this.form.ownerName,
        ownerPhoneEx: this.form.ownerPhone,
        activeFlagEx: this.form.activeFlag,
        terminalCodeEx: this.form.terminalCode,
        toolTypeEx: this.form.toolType,
        groupIdEx: groupId.join(","),
        groupNameEx: this.groupData.name,
        terminalModelEx: this.form.terminalModel,
        autoCalFalgEx: this.form.autoCalFalg,
        allowanceStatusEx: this.form.allowanceStatus,
        installStartTimeEx: dateFormat(this.form.installStartTime),
        installEndTimeEx: dateFormat(this.form.installEndTime),
      };
      let res = await exportMachinbeInfo(params);
      if (res.data.success) {
        let obj = res.data.obj;
        let title = "农机基础信息报表.xls";
        let url =
          window.globalUrl.HOME_API + "agri-web/rp/statistics/downloadExcel";
        handBlobDown(url, obj, title);
      }
    },
    //删除农机信息
    async delMachineById() {
      let ids = getSelectionIds(this.selection, "rowId");
      let res = await delMachineById({
        rowIds: ids,
      });
      if (!res.code) {
        this.$message({
          type: "success",
          message: res.msg,
        });
        this.searchMachineList();
      } else {
        this.$message.error(res.msg);
      }
    },
    //开启关闭面积计算
    async toggleArea(val) {
      if (this.selection.length <= 0) {
        this.$message.info("请选择需要查询的分组");
        return;
      }
      let ids = getSelectionIds(this.selection, "rowId");
      let params = { rowIds: ids };
      if (val) {
        let res = await openComputeArea(params);
        if (!res.code) {
          this.$message.success(res.msg);
          this.searchMachineList();
        }
      } else {
        let res = await closeComputeArea(params);
        if (!res.code) {
          this.$message.success(res.msg);
          this.searchMachineList();
        }
      }
    },
    //开启关闭短信发送
    async toggleNotepush(val) {
      if (this.selection.length <= 0) {
        this.$message.info("请选择需要查询的分组");
        return;
      }
      let ids = getSelectionIds(this.selection, "rowId");
      let params = { rowIds: ids };
      if (val) {
        let res = await openPushMessage(params);
        if (!res.code) {
          this.$message.success(res.msg);
          this.searchMachineList();
        }
      } else {
        let res = await closePushMessage(params);
        if (!res.code) {
          this.$message.success(res.msg);
          this.searchMachineList();
        }
      }
    },
    //激活失效农机
    async handleCommand(command) {
      if (this.selection.length <= 0) {
        this.$message.info("请选择需要激活的分组");
        return;
      }
      let ids = getSelectionIds(this.selection, "rowId");
      let params = { rowIds: ids };
      if (command == "a") {
        let res = await activeMachine(params);
        if (!res.code) {
          this.$message.success(res.msg);
          this.searchMachineList();
        }
      } else {
        let res = await unEffectCdMachine(params);
        if (!res.code) {
          this.$message.success(res.msg);
          this.searchMachineList();
        }
      }
    },
    indexMethod(index) {
      return (this.page.currentPage - 1) * this.page.pageSize + index + 1;
    },
  },
};
</script>

<style scoped lang="less">
.machiner {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;

  .title {
    //width: 1631px;
    width: calc(100% - 62px);
    margin-left: 40px;
    margin-top: 10px;
  }

  .content {
    margin-top: 20px;
    margin-left: 40px;
    width: calc(100% - 62px);
    height: calc(100% - 180px);
    border: 1px solid #133460;

    .contTable {
      margin-top: 20px;
      //margin-left: 27px;
      height: 100%;

      .searchBox {
        //width: 1583px;
        padding-left: 27px;
        width: calc(100% - 27px);
        //width: 100%;
        height: 154px;
        position: relative;
        border-bottom: 1px solid #133460;

        .formItem {
          width: 100%;
          display: flex;

          .el-form-item {
            margin-right: 15px;
            margin-bottom: 10px;
            width: 19%;

            /deep/ .el-form-item__label {
              padding-right: 12px;
            }

            .el-input,
            .el-select {
              width: 100%;
            }
          }

          .item-data {
            width: 29%;

            .datepicker {
              width: 45% !important;
            }
          }
        }

        .btn {
          height: 36px;
        }
      }

      .table {
        height: calc(100% - 175px);
        padding-right: 24px;
        padding-left: 27px;

        .table_btns {
          margin: 15px 0;
          height: 31px;
          position: relative;

          .btn-left {
            height: 31px;
            display: flex;
          }

          @media screen and (min-width: 1800px) {
            .btn-right {
              position: absolute;
              top: 0px;
              right: 20px;
              margin: 0 !important;
            }
          }

          .btn-right {
            float: right;
            height: 31px;
            margin: 5px 20px 5px 0;
            display: flex;
            align-items: center;

            /deep/ .el-switch.is-checked .el-switch__core {
              background-color: #2265a4;
              border-color: #2265a4;
            }

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

      /deep/ .el-switch__label {
        color: #aac2d6;
      }
    }
  }

  .myPage {
    margin-left: 30px;
    margin-top: 15px;
  }
}
</style>