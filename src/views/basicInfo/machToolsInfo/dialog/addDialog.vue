<template>
  <el-dialog
    class="dialog"
    :title="tag == 'add' ? '机具信息新增' : '机具信息编辑'"
    :visible.sync="dialogVisible"
    width="40%"
    top="20vh"
    :before-close="cancel"
    :close="handleClose"
  >
    <div class="content">
      <el-form
        class="my-form"
        label-position="right"
        label-width="120px"
        :model="form"
        :rules="rules"
        ref="form"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="农机分组:">
              <el-input v-model="groupFullName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="农机:" prop="machineId">
              <el-select
                v-model="form.machineId"
                placeholder="请选择车牌号"
                filterable
                @change="handleMachineChange"
              >
                <el-option
                  v-for="item in MachineSelect"
                  :label="setPlateNumber()"
                  :value="item.rowId"
                  :key="item.rowId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机具名称:" prop="toolName">
              <el-input
                maxlength="20"
                v-model.trim="form.toolName"
                placeholder="请输入机具名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="机具识别码:" prop="toolIfa">
              <el-input
                v-model="form.toolIfa"
                minlength="1"
                maxlength="16"
                placeholder="请输入机具识别码"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机具类型:" prop="toolType">
              <el-select
                v-model="form.toolType"
                clearable
                placeholder="请选择机具类型"
              >
                <el-option
                  v-for="item in toolTypeSelect"
                  :key="item.id"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="作业宽幅(米):" prop="toolWidth">
              <el-input
                v-model="form.toolWidth"
                placeholder="请输入作业宽幅"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机具高度(厘米):" prop="toolHeight">
              <el-input
                v-model.number="form.toolHeight"
                placeholder="请输入机具高度"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="终端编号:" prop="terminalCode">
              <el-input
                :readonly="true"
                v-model="form.terminalCode"
                placeholder="请输入终端号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注:" prop="remark">
              <el-input
                v-model="form.remark"
                maxlength="50"
                placeholder="请输入备注"
              ></el-input>
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
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { addCdTool, updateCdTool, getGroupFullName } from "@/api/basic/tool";
import {
  getMachineList,
  getMachineInfoById,
  getMachineDict,
  getToolType,
} from "@/api/basic/machine";
import { add } from "ol/coordinate";
import { getTerminalBrand } from "../../../../api/agridata";

export default {
  name: "addDialog",
  data() {
    let theRules = (rule, value, callback) => {
      var patten = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
      if (!patten.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        value = "" + value;
        if (value <= 0 || value > 20) {
          callback(new Error("请输入大于0且小于20的作业宽幅"));
        } else {
          callback();
        }
      }
    };
    let theRules1 = (rule, value, callback) => {
      var patten = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
      if (!patten.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        value = "" + value;
        if (value <= 0 || value > 2000) {
          callback(new Error("请输入大于0且小于2000的机具高度"));
        } else {
          callback();
        }
      }
    };
    let theRules2 = (rule, value, callback) => {
      var patten = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
      if (!patten.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        value = "" + value;
        if (value.length < 0 || value.length > 20) {
          callback(new Error("最多输入20个字符"));
        } else {
          callback();
        }
      }
    };
    return {
      dialogVisible: false,
      tag: "",
      toolTypeSelect: [],
      MachineSelect: [],
      form: {
        machineId: "",
        toolName: "", //机具名称
        terminalCode: "",
        remark: "",
        toolHeight: "",
        toolWidth: "",
        toolType: "",
      },
      groupId: null,
      groupFullName: "",
      rules: {
        machineId: [{ required: true, message: "请选择农机", trigger: "blur" }],
        toolName: [
          { required: true, message: "请输入机具名称", trigger: "blur" },
        ],
        toolIfa: [
          {
            required: true,
            pattern: /^\d{1,}$/,
            message: "请输入非空数字",
            trigger: "blur",
          },
          // { type: "number", message: "请输入数字", trigger: "blur" },
        ],
        toolType: [
          { required: true, message: "请选择机具类型", trigger: "blur" },
        ],
        toolWidth: [
          { required: true, message: "请输入作业宽幅", trigger: "blur" },
          { validator: theRules, trigger: "blur" },
        ],
        toolHeight: [
          { required: true, message: "请输入机具高度", trigger: "blur" },
          { validator: theRules1, trigger: "blur" },
        ],
        // terminalCode: [
        //   { required: true, message: "请输入终端编号", trigger: "blur" },
        // ],
        remake: [],
      },
    };
  },
  watch: {
    dialogVisible(newval, oldVal) {
      if (newval) {
        this.getMachineSelect().then((res) => {
          this.handleMachineChange(this.form.machineId);
          console.log(this.form.machineId)
        });
        //再找FullName（）

        this.getGroupFullNameById(this.groupId);
      } else {
        this.form = {
          machineId: "",
          toolName: "", //机具名称
          terminalCode: "",
          remark: "",
          toolHeight: "",
          toolWidth: "",
          toolType: "",
        };
        this.groupFullName = "";
      }
    },
  },
  created() {
    // this.getToolTypeSelect();
  },

  computed: {
    ...mapGetters(["groupData"]),
  },
  methods: {
    ...mapMutations({
      setGroupBoxStatus: "setGroupBoxStatus",
    }),
    //处理农机下拉框
    handleMachineChange(rowId) {
      this.getTerminalCode(rowId);
      let machine = this.MachineSelect.filter((item) => {
        return item.rowId == rowId;
      });
      // debugger;
      if ((rowId = -1)) {
        this.toolTypeSelect = [{
          value: this.form.toolType,
          text: this.form.toolTypeName,
        }];
      } else {
        this.getToolTypeSelect(machine[0].machineType);
      }

    },
    //获取机具类型
    async getToolTypeSelect(machineType) {
      let res = await getToolType({
        machineType: machineType,
      });
      // debugger;
      if (!res.code) {
        this.toolTypeSelect = res.data;
        console.log(this.toolTypeSelect);
        const flag = this.toolTypeSelect.some((item) => {
          return this.form.toolType == item.value;
        });
        if (!flag) {
          this.form.toolType = undefined;
        }
      }
    },
    //获取分组下的农机list
    async getMachineSelect() {
      let res = await getMachineList({
        groupId: this.groupId,
      });
      // debugger;
      if (!res.code) {
        this.MachineSelect = res.data;
        // this.dialogVisible = false;
        this.$emit("freshTable");
      }
      return res;
    },
    setPlateNumber(){
      this.MachineSelect.forEach(item=>{
        if(this.form.machineId==-1){
          this.form.machineId= null
          item.plateNumber = null
        }else{}
        return item.plateNumber
      })
    },
    //通过农机的主键获取终端号
    async getTerminalCode(rowId) {
      let res = await getMachineInfoById(rowId);
      if (!res.code) {
        this.form.terminalCode = res.data.terminalCode;
      }
    },
    //添加农具
    async AddTool() {
      let res = await addCdTool(
        Object.assign(
          {
            belongGroupId: this.groupId,
          },
          this.form
        )
      );
      if (!res.code) {
        this.$message.success(res.msg);
        this.dialogVisible = false;
        this.$emit("freshTable");
      } else {
        this.$message.error(res.msg);
      }
    },
    //编辑农具
    async Editool() {
      let res = await updateCdTool(
        Object.assign(this.form, {
          belongGroupId: this.groupId,
        })
      );
      if (!res.code) {
        this.$message.success(res.msg);
        this.dialogVisible = false;
        this.$emit("freshTable");
      }
    },
    async getGroupFullNameById(rowId) {
      let res = await getGroupFullName({
        rowId: rowId,
      });
      if (!res.code) {
        this.groupFullName = res.msg;
      } else {
        this.$message.error(res.msg);
      }
    },
    //保存按钮点击事件
    save() {
      this.$refs.form
        .validate()
        .then((x) => {
          if (this.tag == "add") {
            this.AddTool();
          } else if (this.tag == "edit") {
            this.Editool();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    cancel() {
      this.form = {};
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    },
    handleClose() {
      this.form = {};
    },
  },
};
</script>

<style scoped lang="less">
.content {
  margin-top: 20px;
  margin-left: 10px;
  .el-form-item {
    margin-right: 40px;
  }
  /deep/ .el-form-item__label {
    //padding: 0;
  }
  .el-input,
  .el-select {
    width: 100%;
  }
}
.dialog-footer {
  height: 30px;
  padding-right: 25px;
}
</style>