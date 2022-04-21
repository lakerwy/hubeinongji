<template>
  <el-dialog
    class="dialog"
    :title="tag == 'add' ? '机具信息新增' : '机具信息编辑'"
    :visible.sync="dialogVisible"
    width="40%"
    top="20vh"
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
          <el-col :span="12">
            <el-form-item label="农机：" prop="machineId">
              <el-select
                v-model="form.machineId"
                placeholder="请选择车牌号"
                @change="handleMachineChange"
              >
                <el-option
                  v-for="item in MachineSelect"
                  :label="item.plateNumber"
                  :value="item.rowId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机具名称：" prop="toolName">
              <el-input
                v-model="form.toolName"
                placeholder="请输入机具名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="机具识别码：" prop="toolIfa">
              <el-input
                v-model.number="form.toolIfa"
                placeholder="请输入机具识别码"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机具类型：" prop="toolType">
              <el-select
                v-model="form.toolType"
                clearable
                placeholder="请选择机具类型"
              >
                <el-option
                  v-for="item in toolTypeSelect"
                  :key="item.id"
                  :label="item.itemName"
                  :value="item.itemCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="作业宽幅(米)：" prop="toolWidth">
              <el-input
                v-model.number="form.toolWidth"
                placeholder="请输入作业宽幅"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机具高度：" prop="toolHeight">
              <el-input
                v-model.number="form.toolHeight"
                placeholder="请输入机具高度"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="终端编号：" prop="terminalCode">
              <el-input
                v-model="form.terminalCode"
                placeholder="请输入终端号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注：" prop="remark">
              <el-input
                v-model="form.remark"
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
      <el-button
        type="primary"
        class="shadow-btn"
        @click="
          dialogVisible = false;
          setGroupBoxStatus(false);
        "
        round
        >返 回</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { addCdTool, updateCdTool } from "@/api/basic/tool";
import {
  getMachineList,
  getMachineInfoById,
  getMachineDict,
} from "@/api/basic/machine";
import { add } from "ol/coordinate";
import { getTerminalBrand } from "../../../../api/agridata";

export default {
  name: "addDialog",
  data() {
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
      groupId: 0,
      rules: {
        machineId: [{ required: true, message: "请选择农机", trigger: "blur" }],
        toolName: [
          { required: true, message: "请输入机具名称", trigger: "blur" },
        ],
        toolIfa: [
          { required: true, message: "请输入机具识别码", trigger: "blur" },
          { type: "number", message: "请输入数字", trigger: "blur" },
        ],
        toolType: [
          { required: true, message: "请选择机具类型", trigger: "change" },
        ],
        toolWidth: [
          { required: true, message: "请输入作业宽幅", trigger: "blur" },
          { type: "number", message: "请输入数字", trigger: "blur" },
        ],
        toolHeight: [
          { required: true, message: "请输入机具高度", trigger: "blur" },
          { type: "number", message: "请输入数字", trigger: "blur" },
        ],
        terminalCode: [
          { required: true, message: "请输入终端编号", trigger: "blur" },
        ],
        remake: [],
      },
    };
  },
  watch: {
    groupId(val, oldVal) {
      this.getMachineSelect();
    },
  },
  created() {
    this.getToolTypeSelect();
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
    },
    //获取机具类型
    async getToolTypeSelect() {
      let res = await getMachineDict({
        listType: "tool_type",
      });
      if (!res.code) {
        this.toolTypeSelect = res.data;
      }
    },
    //获取分组下的农机list
    async getMachineSelect() {
      let res = await getMachineList({
        groupId: this.groupId,
      });
      if (!res.code) {
        this.MachineSelect = res.data;
        this.dialogVisible = false;
        this.$emit("freshTable");
      }
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
    padding: 0;
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