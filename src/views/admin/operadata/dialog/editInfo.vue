<template>
  <el-dialog
    class="dialog"
    :title="title"
    :visible.sync="dialogVisible"
    width="60%"
    top="20vh"
    :before-close="cancel"
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
          <el-col :span="8">
            <el-form-item label="提出人：" prop="proposer">
              <el-input v-model.trim="form.proposer" placeholder="请输入提出人">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="事件类型：" prop="eventType">
              <el-select v-model="form.eventType" placeholder="请选择事件类型">
                <el-option
                  v-for="item in eventTypeSelect"
                  :label="item.itemName"
                  :value="item.itemCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="解决状态：" prop="resolutionStatus">
              <el-input
                :readonly="true"
                v-model.trim="resolutionStatus[form.resolutionStatus]"
                placeholder="请输入事件描述"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备厂商：" prop="manufacturerId">
              <el-select
                v-model="form.manufacturerId"
                placeholder="请选择设备厂商"
              >
                <el-option
                  v-for="item in manufacturerSelect"
                  :label="item.itemName"
                  :value="item.itemCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="提出时间：" prop="proposalTime">
              <el-date-picker
                class="datepicker"
                v-model="form.proposalTime"
                type="datetime"
                :clearable="false"
                prefix-icon="el-icon-date"
                placeholder="选择提出时间"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注：" prop="remark">
              <el-input
                v-model="form.remark"
                placeholder="请输入备注"
                :maxlength="200"
              ></el-input>
            </el-form-item>
            <!-- <el-button type="primary" class="shadow-btn" round>查 看</el-button> -->
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="24">
            <el-form-item label="事件描述：" prop="eventDesc">
              <el-input
                v-model.trim="form.eventDesc"
                type="textarea"
                :rows="2"
                placeholder="请输入事件描述"
                :maxlength="200"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50" v-if="title == '运维资料管理解决状态变更'">
          <el-col :span="24">
            <el-form-item label="解决状态备注：" prop="reviewNotes">
              <el-input
                v-model.trim="form.reviewNotes"
                type="textarea"
                :rows="2"
                placeholder="请输入事件描述"
                :maxlength="100"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="附件：">
              <el-upload
                class="upload-demo"
                :action="URL"
                ref="upload"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                multiple
                :on-change="handleChange"
                :limit="10"
                :headers="header"
                :on-exceed="handleExceed"
                :on-error="handleError"
                :file-list="tableData"
                :auto-upload="false"
                accept="image/*,.word,.doc,.dox,.xls,.xlsx,.zip,.rar,.7z"
                list-type="picture"
                :show-file-list="false"
              >
                <el-button
                  type="primary"
                  class="shadow-btn"
                  round
                  slot="trigger"
                  >选择文件</el-button
                >
                <!-- <el-button type="primary" @click="submitUpload"  round class="shadow-btn">上传</el-button> -->
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="my-table">
          <el-table
            :data="tableData"
            style="width: 100%"
            height="100%"
            @selection-change="handleSelectChange"
          >
            <el-table-column
              type="selection"
              label="全选"
              width="60"
              fixed="left"
            >
            </el-table-column>
            <el-table-column type="index" label="序号" width="60" fixed="left">
            </el-table-column>
            <el-table-column
              v-for="item in columns"
              :key="item.label"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="scope">
                <div v-if="item.prop == 'operation'" type="text">
                  <div class="operations">
                    <div v-for="item in operationImgs">
                      <img
                        :src="item.imgUrl"
                        @click="opreationMethods(item.method, scope.row)"
                      />
                    </div>
                  </div>
                </div>
                <div v-else-if="item.prop == 'name'">
                  <img
                    :src="fileTypeImg[scope.row.type]"
                    class="fileTypeImg"
                  /><span>{{ scope.row[item.prop] }}</span>
                </div>
                <span v-if="item.prop == 'status'">
                  {{
                    scope.row[item.prop] == "ready"
                      ? "准备上传"
                      : scope.row[item.prop] == "uploading"
                      ? "正在上传..."
                      : scope.row[item.prop] == "success"
                      ? "上传成功"
                      : scope.row[item.prop]
                  }}
                </span>
                <span v-else-if="item.prop == 'size'">{{
                  filterSize(scope.row[item.prop])
                }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="shadow-btn" @click="saveClick" round
        >保 存</el-button
      >
      <el-button type="primary" class="shadow-btn" @click="cancel" round
        >返 回</el-button
      >
    </div>
    <el-image
      class="my-img"
      v-if="srcList"
      ref="myImg"
      src="@/assets/images/view.png"
      :preview-src-list="srcList"
    >
    </el-image>
  </el-dialog>
</template>

<script>
import { save, update, download } from "_api/admin/operadata";
import { mapGetters } from "vuex";
import { downloadPost } from "@/util/util";
import { findIndex } from "ol/array";
import { fetchList } from "../../../../api/admin/user";

export default {
  data() {
    let theRules = (rule, value, callback) => {
      if (value) {
        value = "" + value;
        if (value.length <= 0 || value.length > 100) {
          callback(new Error("最多输入100个字符"));
        } else {
          callback();
        }
      }
    };
    return {
      dialogVisible: false,
      arr1: [],
      arr2: [],
      form: {
        attachmentList: [],
      },
      URL: `${window.globalUrl.HOME_API}agri-web/maintenance/uploadFile`,
      fileList: [],
      count: 0,
      selection: [],
      columns: [
        { prop: "name", label: "文件名称", width: 300 },
        { prop: "size", label: "文件大小", width: 160 },
        { prop: "status", label: "上传状态/日期", width: 250 },
        { prop: "operation", label: "操作", width: 250 },
      ],
      tableData: [],
      operationImgs: [
        {
          imgUrl: require("@/assets/images/view.png"),
          title: "查看",
          method: "operationView",
        },
        {
          imgUrl: require("@/assets/images/download.png"),
          title: "下载",
          method: "operationDownload",
        },
        {
          imgUrl: require("@/assets/images/delete.png"),
          title: "删除",
          method: "operationDelete",
        },
      ],
      srcList: [],
      resolutionStatus: {
        0: "未解决",
        1: "已解决",
        undefined: "未解决",
      },
      fileTypeImg: {
        doc: require("@/assets/images/doc.png"),
        docx: require("@/assets/images/doc.png"),
        xls: require("@/assets/images/xls.png"),
        xlsx: require("@/assets/images/xls.png"),
        jpg: require("@/assets/images/img.png"),
        png: require("@/assets/images/img.png"),
        pdf: require("@/assets/images/pdf.png"),
      },
      //校验规则
      rules: {
        proposer: [
          { required: true, message: "请输入提出人", trigger: "blur" },
          { validator: theRules, trigger: "blur" },
        ],
        eventType: [
          { required: true, message: "请选择事件类型", trigger: "change" },
        ],
        // resolutionStatus: [
        //   { required: true, message: "请选择解决状态", trigger: "blur" },
        // ],
        manufacturerId: [
          { required: true, message: "请选择设备厂商", trigger: "change" },
        ],
        proposalTime: [
          { required: true, message: "请选择提出时间", trigger: "blur" },
        ],
        // remark: [
        //   { required: true, message: "请输入备注", trigger: "blur" },
        // ],
        eventDesc: [
          { required: true, message: "请输入事件描述", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    dialogVisible(newVal, oldVal) {
      // debugger;
      if (!newVal) {
        this.count = 0;
        this.form = {
          attachmentList: [],
        };
        this.tableData = [];
      } else {
        let count1 = 0;
        let count2 = 0;
        this.form.attachmentList.forEach((item) => {
          if (item.isReview == 0) {
            this.arr1.push(item);
            count1++;
          } else {
            this.arr2.push(item);
            count2++;
          }
        });
        if (this.title == "运维资料管理编辑") {
          this.count = count1;
        } else if (this.title == "运维资料管理解决状态变更") {
          this.count = count2;
        } else {
          this.count = 0;
        }
        console.log(this.count, "count");
        console.log(this.arr1, "arr1");
        console.log(this.arr2, "arr2");
      }
    },
  },
  props: {
    title: String,
    manufacturerSelect: Array,
    eventTypeSelect: Array,
  },
  computed: {
    ...mapGetters(["access_token"]),
    header() {
      return {
        Authorization: `Bearer ${this.access_token}`,
      };
    },
  },
  methods: {
    //处理操作函数
    opreationMethods(method, param) {
      this[method](param);
    },
    //查看图片
    operationView(param) {
      if (["jpg", "png"].indexOf(param.type) != -1) {
        this.srcList = [];
        this.srcList.push(param.url);
        this.$refs.myImg.showViewer = true;
      } else if (param.type == pdf) {
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        this.$message("暂不支持该类型文件预览");
      }
    },
    async operationDownload(param) {
      let res = await download(param.attachmentName);
      let url = window.URL.createObjectURL(new Blob([res]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.download = param.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    //删除附件
    operationDelete(param) {
      let index = this.tableData.findIndex((item) => {
        return item.rowId == param.rowId;
      });
      this.tableData.splice(index, 1);
      this.count--;
    },
    //新增
    async addOperaData() {
      if (this.form.attachmentList) {
        let arr = [];
        this.form.attachmentList.forEach((item) => {
          arr.push(item.response.data);
        });
        arr.isReview = 0;
        this.form.attachmentList = arr;
      }
      let res = await save(this.form);
      if (res.code == 0) {
        this.$message.success(res.msg);
        this.$refs.form.resetFields();
        this.dialogVisible = false;
        this.count = 0;
        this.$emit("updateTable");
      }
    },
    //修改
    async updateOperaData() {
      let arr = [];
      console.log(this.form, "111");
      console.log(this.tableData, "222");

      this.form.attachmentList.forEach((item) => {
        // debugger;
        if (item.rowId) {
          //编辑
          if (this.title != "运维资料管理解决状态变更") {
            arr.push({
              attachmentName: item.attachmentName,
              originName: item.name,
              attachmentSize: item.size,
              rowId: item.rowId,
              isReview: 0,
            });
          } else {
            //解决
            arr.push({
              attachmentName: item.attachmentName,
              originName: item.name,
              attachmentSize: item.size,
              rowId: item.rowId,
              isReview: 1,
            });
          }
        } else {
          if (this.title != "运维资料管理解决状态变更") {
            if (item.response) {
              item.response.data.isReview = 0;
              arr.push(item.response.data);
            }
          } else {
            if (item.response) {
              item.response.data.isReview = 1;
              arr.push(item.response.data);
            }
          }
        }
      });
      this.form.attachmentList = arr;
      if (this.title == "运维资料管理编辑") {
        this.form.attachmentList = this.form.attachmentList.concat(this.arr2);
      } else if (this.title == "运维资料管理解决状态变更") {
        this.form.attachmentList = this.form.attachmentList.concat(this.arr1);
        this.form.resolutionStatus = 1
      } else {
      }
      this.arr1 = [];
      this.arr2 = [];
      let res = await update(this.form);
      if (!res.code) {
        this.$refs.form.resetFields();
        this.dialogVisible = false;
        this.$message.success(res.msg);
        this.$emit("updateTable");
        this.count = 0;
      }
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleExceed() {
      this.$message.error("最多上传10个附件");
    },
    //保存按钮事件
    saveClick() {
      // debugger;
      // if (this.tableData.length > 0 && this.tableData.length <= 10) {
      if (this.tableData.length <= 10 && this.tableData.length > 0) {
        this.$refs.form
          .validate()
          .then((x) => {
            if (this.count == this.tableData.length) {
              if (this.title == "运维资料管理新增") {
                this.addOperaData();
              } else {
                // debugger;
                this.form.attachmentList = this.tableData;
                this.updateOperaData();
              }
            }
            this.$refs.upload.submit();
          })
          .catch((err) => {
            console.error(err);
          });
      } else if (this.tableData.length <= 0) {
        this.$message.error("附件数量不能为空");
      } else {
        this.$message.error("附件数量不能大于10");
      }
    },
    handleChange(file, fileList) {
      // if (this.tableData.length > 0 ) {
      // this.tableData = this.tableData.concat(
      //   fileList.slice(this.tableData.length).forEach(item=>{
      //     item.type = item.name.slice(item.name.lastIndexOf(".")+1)
      //     }
      //   )
      // );
      // debugger

      // this.tableData = fileList
      // } else {
      fileList.forEach((item) => {
        item.type = item.name.slice(item.name.lastIndexOf(".") + 1);
      });
      this.tableData = fileList;
      // debugger
      // this.tableData = fileList

      // }
    },
    // handleProgress(event, file, fileList) {
    //   //console.log(event, file, fileList);
    //   if(tableData){
    //     this.tableData=null
    //     this.tableData = this.tableData.concat(fileList.slice(this.tableData.length))
    //   }else{
    //     this.tableData = fileList
    //   }
    // },
    handleSuccess(res, file, fileList) {
      this.tableData = fileList.forEach((item) => {
        if (item.attachmentName) {
          item.name = item.name || item.attachmentName;
          item.size = item.attachmentSize;
          item.url = item.attachmentUrl;
          item.status = item.lastUpdDate;
        }
      });
      // debugger;
      this.form.attachmentList = fileList;
      console.log(this.form.attachmentList, "this.form.attachmentList");
      // debugger;
      if (res.code == 0) {
        console.log(this.count);
        ++this.count;
      }
      if (this.count == fileList.length) {
        if (this.title == "运维资料管理新增") {
          this.addOperaData();
        } else if (this.title == "运维资料管理编辑") {
          this.updateOperaData();
        } else if (this.title == "运维资料管理解决状态变更") {
          // debugger;
          this.updateOperaData();
        }
        this.count = 0;
      }
    },
    handleRemove(file, fileList) {
      this.form.attachmentList = fileList;
    },
    handleError(err, file, fileList) {
      //console.log(err, file, fileList);
      this.$message.error(err);
    },
    handleSelectChange() {
      this.selection = selection;
    },
    filterSize(size) {
      let pow1024 = function (num) {
        return Math.pow(1024, num);
      };
      if (!size) return "";
      if (size < pow1024(1)) return size + " B";
      if (size < pow1024(2)) return (size / pow1024(1)).toFixed(2) + " KB";
      if (size < pow1024(3)) return (size / pow1024(2)).toFixed(2) + " MB";
      if (size < pow1024(4)) return (size / pow1024(3)).toFixed(2) + " GB";
      return (size / pow1024(4)).toFixed(2) + " TB";
    },
    cancel() {
      this.$refs.form.resetFields();
      this.arr1 = [];
      this.arr2 = [];
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped lang="less">
.content {
  margin-top: 20px;
  margin-left: 10px;
  .datepicker {
    width: 100% !important;
  }
  .el-form-item {
    margin-right: 40px;
  }
  /deep/.el-textarea__inner {
    background-color: transparent;
    border: 1px solid #356e97;
    color: #fff;
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
  .shadow-btn {
    height: 36px;
  }
  .my-table {
    height: 180px;
    margin-left: 3%;
    margin-right: 3%;
    /deep/.el-table {
      height: 500px;
      .el-table__body-wrapper {
        height: 300px;
      }
    }

    .operations {
      display: flex;
      flex-direction: row;
      div {
        margin-left: 10px;
      }
    }
  }
}
.my-img {
  width: 100px;
  height: 100px;
  display: none;
}
.dialog-footer {
  height: 30px;
  padding-right: 25px;
}

.fileTypeImg {
  height: 20px;
  width: 20px;
  margin-right: 5px;
}

/deep/.el-textarea ::-webkit-input-placeholder {
  color: rgba(128, 197, 255, 0.3) !important;
  font-family: "SourceHanSansCN ReguLar" !important;
}
/deep/.el-textarea__inner {
  font-family: "SourceHanSansCN ReguLar" !important;
}
</style>