<template>
  <div>
    <el-dialog
      class="dialog"
      :title="title"
      :visible.sync="dialogVisible"
      :width="'1080px'"
      top="15vh"
      :before-close="beforeColse"
    >
      <div class="machine-edit">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="90px"
          :inline="true"
        >
          <div class="top-container">
            <el-form-item
              label="农机分组:"
              id="machineGroup"
              prop="groupNameFullPath"
            >
              <el-input
                v-model.trim="form.groupNameFullPath"
                placeholder="请选择农机分组"
                @focus="showGroup = true"
                style="position: relative"
              >
              </el-input>
              <MachineGroup
                v-show="showGroup"
                @getData="getData"
                :defaultGroup="form.belongGroupId"
              ></MachineGroup>
            </el-form-item>
            <el-form-item label="农机状态:">
              <el-select v-model="form.activeFlag" placeholder="请选择农机状态">
                <el-option label="有效" value="1"></el-option>
                <el-option label="失效" value="2"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <div class="tab">
          <div
            v-for="(item, index) in tabs"
            @click="tabChange(item)"
            :key="index"
          >
            <div
              :class="item.id == currentTabId ? 'tab-item active' : 'tab-item'"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="line"></div>
        <div>
          <machine-edit-tab-1
            v-show="currentTabId === 1"
            ref="editTab1"
            :form="form"
            @uploadMachine="uploadMachine"
            :machineDict="machineDict"
            :getByMachineDict="getByMachineDict"
            @viewMachine="viewMachine"
            @Brand="Brand"
          />
          <machine-edit-tab-2
            v-show="currentTabId === 2"
            ref="editTab2"
            :form="form"
            @uploadMachine="uploadMachine"
            :machineDict="machineDict"
            @viewMachine="viewMachine"
          />
          <machine-edit-tab-3
            v-show="currentTabId === 3"
            ref="editTab3"
            :machineDict="machineDict"
            :form="form"
          />
          <machine-edit-tab-4
            v-show="currentTabId === 4"
            ref="editTab4"
            :form="form"
            :machineDict="machineDict"
            @addToolTabs="addToolTabs"
          />
        </div>
        <div class="commit">
          <el-button class="shadow-btn" type="primary" @click="beforeColse"
            >返回</el-button
          >
          <el-button class="shadow-btn" type="primary" @click="save"
            >保存</el-button
          >
        </div>
      </div>
    </el-dialog>

    <UploadMachineImg ref="uploadImg" :uploadTag="uploadTag" />
    <ViewMachineImg ref="viewImg" :url="viewUrl" />
    <!--    <AddTools ref="addTool"></AddTools>-->
  </div>
</template>

<script>
import MachineEditTab1 from "./MachineEdit-tab1.vue";
import MachineEditTab2 from "./MachineEdit-tab2.vue";
import MachineEditTab3 from "./MachineEdit-tab3.vue";
import MachineEditTab4 from "./MachineEdit-tab4.vue";
import {
  updateCdmachine,
  addCdmachine,
  getMachineInfoById,
  getToolType,
  getJobType,
} from "../../../../../api/basic/machine";
import UploadMachineImg from "./UploadMachineImg";
import ViewMachineImg from "./ViewMachineImg";
import MachineGroup from "./machineGroup";
import { editMachineForm, addMachineForm, tempTools } from "../../js/index";
import { filterForm } from "../../../../../util/util";
import AddTools from "./addTools";

export default {
  components: {
    MachineEditTab1,
    MachineEditTab2,
    MachineEditTab3,
    MachineEditTab4,
    UploadMachineImg,
    ViewMachineImg,
    MachineGroup,
    AddTools,
  },
  props: ["title", "editMachineRowId", "machineDict"],
  data() {
    return {
      dialogVisible: false,
      showGroup: false,
      rules: {
        groupNameFullPath: [
          {
            required: true,
            message: "选择农机分组需为合作社或个人终端",
            trigger: "change",
          },
        ],
      },
      form: {
        groupNameFullPath: "",
        machineImage: "",
        drivingImage: "",
        optionalTypeArray: [],
        optionalJobTypeArray: [],
        originAppArray: [],
        tools: [],
        brand: "",
      },
      uploadTag: 1,
      viewUrl: "",
      model: "",
      currentTabId: 1,
      tabs: [
        {
          id: 1,
          name: "农机信息",
        },
        {
          id: 2,
          name: "机主信息",
        },
        {
          id: 3,
          name: "终端信息",
        },
        {
          id: 4,
          name: "机具信息",
        },
      ],
      isCalled: false,
      getByMachineDict: {
        toolTypeList: [],
        machineJobList: [],
      },
    };
  },
  watch: {
    editMachineRowId: {
      handler(newName, oldName) {
        if (newName) {
          this.getMachineInfoById(newName);
        }
      },
      immediate: true,
    },
    "form.machineType": {
      handler(newName, oldName) {
        if (newName) {
          this.changeMachineType(newName);
          if (oldName) {
            this.form.defaultToolType = "";
            this.form.optionalJobTypeArray = "";
          }
        } else {
          this.form.defaultToolType = "";
          this.getByMachineDict.toolTypeList = [];
          this.form.optionalJobTypeArray = [];
          this.getByMachineDict.machineJobList = [];
        }
      },
      // immediate: true
    },
  },
  mounted() {
    document.addEventListener("click", this.groupCLick);
  },
  destroyed() {
    document.removeEventListener("click", this.groupCLick);
  },
  created() {
    this.dialogVisible = true;
  },
  methods: {
    Brand(value) {
      this.form.brand = value;
      console.log(value, "value");
    },
    beforeColse() {
      this.$parent.machineVisible = false;
    },
    //获取详情
    async getMachineInfoById(id) {
      let res = await getMachineInfoById(id);
      if (!res.code) {
        this.form = Object.assign({}, res.data);
        this.form.protocolId = this.form.protocolId + "";
        this.form.optionalTypeArray = this.form.optionalType
          ? this.form.optionalType.split(",")
          : [];
        this.form.optionalJobTypeArray = this.form.optionalJobType
          ? this.form.optionalJobType.split(",")
          : [];
        this.form.originAppArray = this.form.originApp
          ? this.form.originApp.split(",")
          : [];
        if (res.data.tools.length) {
          this.form.tools.forEach((item, index) => {
            item.title = "机具信息" + ++index;
            item.name = index + "";
          });
          this.$refs.editTab4.tabIndex = res.data.tools.length;
        }
      }
    },
    groupCLick(e) {
      if (document.querySelector("#machineGroup")) {
        if (!document.querySelector("#machineGroup").contains(e.target)) {
          this.showGroup = false;
        }
      }
    },
    tabChange(target) {
      this.currentTabId = target.id;
    },
    async save() {
      let editRefs = ["editTab1", "editTab2", "editTab3"];
      var through = true;
      for (let i = 0; i < editRefs.length; i++) {
        this.$refs[editRefs[i]].$refs["form"].validate((valid, obj) => {
          // console.log(valid,obj);
          // console.log(this.$refs[editRefs[i]].form.optionalTypeArray.length);
          // console.log(obj.optionalTypeArray);
          if(this.$refs[editRefs[i]].form.optionalTypeArray.length == 0){
            through = false;
            this.$message({
              type: "error",
              message: "请至少选择一个选装件",
            });
            return false;
          }
          if(obj.optionalTypeArray){
            if(this.$refs[editRefs[i]].form.optionalTypeArray.length > 0){
              console.log("optionalTypeArray长度为0进入");
              this.$refs[editRefs[i]].$refs["form"].clearValidate("optionalTypeArray");
              valid = true;
            }
          }
          if (valid) {
            through = true;
            //console.log(obj);
          } else {
            through = false;
            for (let i in obj) {
              this.$message({
                type: "error",
                message: obj[i][0].message,
              });
              break;
            }
            return false;
          }
        });
        if (this.form.terminalType == "H" && i == 2 && through) {
          this.$refs[editRefs[i]].$refs["form2"].validate((val, obj) => {
            if (val) {
              //console.log(obj);
            } else {
              through = false;
              for (let i in obj) {
                this.$message({
                  type: "error",
                  message: obj[i][0].message,
                });
                break;
              }
              return false;
            }
          });
        }
        if (!through) {
          break;
        }
      }
      if (through) {
        if (this.title == "农机信息新增") {
          this.addMachineInfo();
        } else if (this.title == "农机信息编辑") {
          this.editMachineInfo();
        }
      }
    },
    //新增
    async addMachineInfo() {
      //超声波传感器和角度传感器不能同时选
      if (
        this.form.optionalTypeArray.includes("2") &&
        this.form.optionalTypeArray.includes("3")
      ) {
        this.$message({
          type: "error",
          message: "超声波传感器和角度传感器不能同时选",
        });
        return;
      }
      let params = {};
      params = filterForm(addMachineForm, this.form);
      params.tools = [];
      if (this.form.tools.length) {
        this.form.tools.forEach((item) => {
          params.tools.push(filterForm(tempTools, item));
        });
      }
      // params.tools = this.form.tools;
      console.log("新增：",this.form.optionalTypeArray);
      this.form.optionalTypeArray.sort();
      params.optionalType = this.form.optionalTypeArray.length
        ? this.form.optionalTypeArray.join()
        : "";
      params.optionalJobType = this.form.optionalJobTypeArray.length
        ? this.form.optionalJobTypeArray.join()
        : "";
      params.originApp = this.form.originAppArray.length
        ? this.form.originAppArray.join()
        : "";
      let res = await addCdmachine(params);
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: res.msg,
        });
        this.beforeColse();
        this.$parent.searchMachineList();
      } else {
        this.$message({
          type: "error",
          message: res.msg,
        });
      }
    },
    async editMachineInfo() {
      //超声波传感器和角度传感器不能同时选
      if (
        this.form.optionalTypeArray.includes("2") &&
        this.form.optionalTypeArray.includes("3")
      ) {
        this.$message({
          type: "error",
          message: "超声波传感器和角度传感器不能同时选",
        });
        return;
      }
      let params = {};
      params = filterForm(editMachineForm, this.form);
      console.log(this.form, "this.form");
      params.tools = [];
      if (this.form.tools.length) {
        this.form.tools.forEach((item) => {
          params.tools.push(filterForm(tempTools, item));
        });
      }
      // params.tools = this.form.tools;
      console.log("编辑：",this.form.optionalTypeArray);
      this.form.optionalTypeArray.sort();
      params.optionalType = this.form.optionalTypeArray.length
        ? this.form.optionalTypeArray.join()
        : "";
      params.optionalJobType = this.form.optionalJobTypeArray.length
        ? this.form.optionalJobTypeArray.join()
        : "";
      params.originApp = this.form.originAppArray.length
        ? this.form.originAppArray.join()
        : "";
      let res = await updateCdmachine(params);
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: res.msg,
        });
        this.beforeColse();
        this.$parent.searchMachineList();
      } else {
        this.$message.error(res.msg);
      }
      //  else {
      //   this.$message.error(res.msg);
      // }
    },
    uploadMachine(val) {
      //上传农机图片或行驶证图片
      this.uploadTag = val;
      // this.$refs.uploadImg.url='';
      this.$refs.uploadImg.localViewUrl = "";
      this.$refs.uploadImg.uploadVisible = true;
    },
    viewMachine(val) {
      //查看农机或行驶证图片
      this.viewUrl = val == 1 ? this.form.machineImage : this.form.drivingImage;
      this.$refs.viewImg.viewVisible = true;
    },
    getData(obj) {
      this.form.groupNameFullPath = obj.name;
      this.form.belongGroupId = obj.id;
    },
    //新增机具
    addToolTabs() {
      this.$refs.addTool.form = {};
      this.$refs.addTool.toolsVisible = true;
    },
    //根据农机信息获取机具信息和作业类型字典
    async changeMachineType(val) {
      let res = await getToolType({
        machineType: val,
      });
      if (!res.code) {
        this.getByMachineDict.toolTypeList = res.data;
      }
      let jobRes = await getJobType({
        machineType: val,
      });
      if (!res.code) {
        this.getByMachineDict.machineJobList = jobRes.data;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.machine-edit {
  .top-container {
    height: 115px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 40px;
  }

  .tab {
    height: 48px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 40px;

    .tab-item {
      width: 101px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      margin-right: 40px;
      color: #aac2d6;
      font-size: 14px;
      cursor: pointer;
    }

    .active {
      background-image: url("../../../../../assets/images/tab-background.png");
    }
  }

  .line {
    width: 100%;
    height: 1px;
    margin-bottom: 20px;
    background-image: -webkit-linear-gradient(
      -2deg,
      rgba(0, 138, 255, 0) 0%,
      rgb(0, 138, 255) 50%,
      rgba(0, 138, 255, 0) 100%
    );
    opacity: 0.7;
  }
}

/deep/ .el-input__inner {
  width: 180px;
}

/deep/ .el-button {
  width: 72px;
}

/deep/ .shadow-btn {
  border-radius: 20px;
  height: 35px;
  margin-left: 6px;
}

.commit {
  display: flex;
  flex-direction: row-reverse;
  padding-right: 50px;
  margin-bottom: 20px;
}

/deep/ .el-input__prefix {
  left: 152px;
}
</style>