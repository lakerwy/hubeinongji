<template>
  <div>
    <el-dialog
      class="dialog"
      :title="title"
      :visible.sync="dialogVisible"
      :width="'1080px'"
      destroy-on-close
      top="15vh"
    >
      <div class="machine-edit">
        <el-form ref="form" :model="form" label-width="80px" :inline="true">
          <div class="top-container">
            <el-form-item label="农机分组">
              <el-input v-model="form.groupNameFullPath" placeholder="农机分组" disabled>
              </el-input>
            </el-form-item>
            <el-form-item label="农机状态">
              <el-select v-model="form.activeFlag" placeholder="农机状态">
                <el-option label="有效" value="1"></el-option>
                <el-option label="失效" value="2"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <div class="tab">
          <div v-for="(item,index) in tabs" @click="tabChange(item)" :key="index">
            <div :class="item.id  == currentTabId ? 'tab-item active':'tab-item'">{{ item.name }}</div>
          </div>
        </div>
        <div class="line"></div>
        <div>
          <machine-edit-tab-1 v-show="currentTabId === 1" :form="form" @uploadMachine="uploadMachine" @viewMachine="viewMachine" />
          <machine-edit-tab-2 v-show="currentTabId === 2" :form="form" @uploadMachine="uploadMachine" @viewMachine="viewMachine" />
          <machine-edit-tab-3 v-show="currentTabId === 3" :form="form"/>
          <machine-edit-tab-4 v-show="currentTabId === 4" :form="form"/>
        </div>
        <div class="commit">
          <el-button class="shadow-btn" type="primary">返回</el-button>
          <el-button class="shadow-btn" type="primary" @click="save">保存</el-button>
        </div>
      </div>
    </el-dialog>

    <UploadMachineImg ref="uploadImg" :uploadUrl="uploadUrl"/>
    <ViewMachineImg ref="viewImg" :url="viewUrl" />
  </div>
</template>

<script>
import MachineEditTab1 from './MachineEdit-tab1.vue'
import MachineEditTab2 from './MachineEdit-tab2.vue'
import MachineEditTab3 from './MachineEdit-tab3.vue'
import MachineEditTab4 from './MachineEdit-tab4.vue'
import {updateCdmachine} from "../../../../../api/basic/machine";
import UploadMachineImg from "./UploadMachineImg";
import ViewMachineImg from "./ViewMachineImg";

export default {
  components: {
    MachineEditTab1,
    MachineEditTab2,
    MachineEditTab3,
    MachineEditTab4,
    UploadMachineImg,
    ViewMachineImg
  },
  props: {
    title: String
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        machineImage: '',
      },
      uploadUrl: '',
      viewUrl: '',
      model: '',
      currentTabId: 1,
      tabs: [
        {
          id: 1,
          name: "农机信息",
        }, {
          id: 2,
          name: "机主信息",
        }, {
          id: 3,
          name: "终端信息",
        }, {
          id: 4,
          name: "机具信息",
        },
      ],
    }
  },
  methods: {
    tabChange(target) {
      console.log(target)
      this.currentTabId = target.id;
    },
    async save() {
      let machineId = this.form.machineId ? this.form.machineId : this.form.rowId;
      let res = await updateCdmachine(Object.assign(this.form, {
        machineId: machineId,
        toolType: this.form.defaultToolType,
        toolList: [
          {
            rowId: 0,
            remark: this.form.remark,
            toolHeight: this.form.toolHeight,
            toolIfa: this.form.toolHeight,
            toolName: this.form.toolName,
            toolType: this.form.toolType,
            toolWidth: this.form.toolWidth,
          }
        ]
      }));
      if (!res.code) {
        debugger
        this.$parent.searchMachineList();
      } else {
        this.$message.error(res.msg);
      }
      this.dialogVisible = false;
    },
    uploadMachine(val){
      //上传农机图片或行驶证图片
      this.uploadUrl = val == 1 ? window.globalUrl.HOME_API + 'agri-web/cd/machine/pictureImport' : window.globalUrl.HOME_API + 'agri-web/cd/machine/driverPictureImport';
      this.$refs.uploadImg.url='';
      this.$refs.uploadImg.uploadVisible = true;
    },
    viewMachine(val){
      //查看农机或行驶证图片
      this.viewUrl = val == 1 ? this.form.machineImage : this.form.drivingImage;
      this.$refs.viewImg.viewVisible = true;
    }
  }
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
    background-image: -webkit-linear-gradient(-2deg,
    rgba(0, 138, 255, 0) 0%,
    rgb(0, 138, 255) 50%,
    rgba(0, 138, 255, 0) 100%);
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