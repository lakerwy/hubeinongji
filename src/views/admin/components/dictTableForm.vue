<template>
  <div class="dict-table-form">
    <!--<div class="dict-title">
            <div>
                <span>{{forms.listType || '无'}}</span>
                <img src="img/admin/icon_update.png" alt="">
            </div>
            <el-button type="text">
                <img src="img/admin/icon-back.png" alt="">
                撤销
            </el-button>
        </div>-->
    <el-form
      :model="forms"
      class="my-table my-form"
      ref="forms"
      inline
      :rules="rules"
    >
      <el-form-item label="字典代码:" prop="listType" >
        <el-input v-model.trim="forms.listType" ></el-input>
      </el-form-item>
      <el-form-item label="字典名称:" prop="listTypeDesc">
        <el-input v-model.trim="forms.listTypeDesc"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="btns">
          <el-button class="shadow-btn" plain round @click="save"
            >保存</el-button
          >
          <el-button class="shadow-btn" plain round @click="cancle"
            >取消</el-button
          >
        </div>
      </el-form-item>

      <el-table :data="forms.data.records" class="form-table">
        <el-table-column label="排序码" width="100px">
          <template slot-scope="scope">
            <!--  :inline-message="true" -->
            <el-form-item
              v-if="scope.row.isEdit"
              :prop="'data.records.' + scope.$index + '.taxisNo'"
              :rules="rules.taxisNo"
              :inline-message="true"
            >
              <el-input v-model="scope.row.taxisNo" maxlength="10" oninput="value=value.replace('-', '')"></el-input>
            </el-form-item>
            <span v-else>{{ scope.row.taxisNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据项值" width="100px">
          <template slot-scope="scope">
            <el-form-item
              v-if="scope.row.isEdit"
              :prop="'data.records.' + scope.$index + '.itemCode'"
              :rules="rules.itemCode"
              :inline-message="true"
            >
              <el-input v-model.trim="scope.row.itemCode"></el-input>
            </el-form-item>
            <span v-else>{{ scope.row.itemCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据项描述" width="450px">
          <template slot-scope="scope">
            <el-form-item
              v-if="scope.row.isEdit"
              :prop="'data.records.' + scope.$index + '.itemName'"
              :rules="rules.itemName"
              :inline-message="true"
            >
              <el-input v-model.trim="scope.row.itemName"></el-input>
            </el-form-item>
            <span v-else>{{ scope.row.itemName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button  type="text" @click="edit(scope.row, scope.$index)" v-if="btnPermis.btnEdit"
              ><img
                :src="[
                  scope.row.isEdit
                    ? 'img/admin/icon_update_active.png'
                    : 'img/admin/icon_update.png',
                ]"
                alt=""
              />
            </el-button>
            <el-button type="text" @click="del(scope.row, scope.$index)" v-if="btnPermis.btnDelete"
              ><img src="img/admin/icon_delete.png" alt=""
            /></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="add-btn" @click="add" v-if="btnPermis.btnAdd">
        <img src="img/admin/icon_add.png" alt="" />添加行
      </div>
    </el-form>
  </div>
</template>


<script>
import {
  addItemObj,
  addObj,
  delItemObj,
  delObj,
  fetchItemList,
  updateItemList,
  fetchList,
  putItemObj,
  putObj,
} from "@/api/admin/dict";
import {mapGetters} from 'vuex'

export default {
  name: "dictTableForm",
  props: {
    listdata: {
      type: Object,
      default: {},
    },
    editstatus: {
      type: Boolean,
      default: false,    
    }
  },
  data() {
    return {
      a: [],
      i: 1,
      forms: {
        data: {
          records: [],
        },
        listType: "",
        listTypeDesc: "",
      },
      rules: {
        listType: [
          { required: true, message: "列表代码不能为空", trigger: "blur" },
          { min: 1, max: 32, message: "最多32位字符", trigger: "blur" },
        ],
        listTypeDesc: [
          { required: true, message: "列表描述不能为空", trigger: "blur" },
          { min: 1, max: 32, message: "最多32位字符", trigger: "blur" },
        ],
        taxisNo: [
          { required: true, message: "排序码不能为空", trigger: "blur" },
          { type:"number",
            message:"排序码必须为数字且为整数",
            trigger:"blur",
            transform (value) {
              console.log(value,typeof(value))
              if(parseInt(value) == value){
                return parseInt(value)
              }else{
                return ""+value
              }
            }
          }
        ],
        itemCode: [
          { required: true, message: "数据项值不能为空", trigger: "blur" },
          { min: 1, max: 10, message: "最多10位字符", trigger: "blur" },
        ],
        itemName: [
          { required: true, message: "数据项描述不能为空", trigger: "blur" },
          { min: 1, max: 50, message: "最多50位字符", trigger: "blur" },
        ],

      },
      btnPermis: {  //按钮权限
        btnView: false,
        btnAdd: false,
        btnEdit: false,
        btnDelete: false,
      }

    };
  },
  created(){
    this.getBtnPermis();
  },
  watch: {
    listdata: {
      handler: function (newV) {
        this.$set(this.forms, "listType", newV.listType);
        this.$set(this.forms, "listTypeDesc", newV.listTypeDesc);
        this.$set(this.forms, "data", newV.data);
        this.i = 1;
        this.a = [];
      },
      immediate: true,
    },
    editstatus(newValue,oldValue){
      //console.log(newValue,"new");
      if(newValue){
        this.editstatus = newValue;
        // debugger;
      }
    }
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  methods: {
    getBtnPermis() {
      this.btnPermis.btnView = this.permissions[window.global.buttonPremission.dictView];
      this.btnPermis.btnAdd = this.permissions[window.global.buttonPremission.dictAdd];
      this.btnPermis.btnEdit = this.permissions[window.global.buttonPremission.dictEdit];
      this.btnPermis.btnDelete = this.permissions[window.global.buttonPremission.dictDelete];
    },
    // 添加行
    add() {
      this.$refs.forms.validate((valid) => {
        if(valid){
          this.settaxisNo();
          this.forms.data.records.push({
            itemCode: "",
            itemName: "",
            taxisNo: this.i,
            listType: this.forms.listType,
            isEdit: true,
            listTypeDesc: this.forms.listTypeDesc,
          });
        }
      })
    },
    // 编辑
    edit(row, index) {
      this.forms.data.records[index].isEdit = true;
      this.forms.data.records = this.forms.data.records.concat([]);
    },
    // 删除
    del(row, index) {
      let that = this;
      if (!row.rowId) {
        that.forms.data.records.splice(index, 1);
        return;
      }
      this.$confirm(
        "是否确认删除当前数据项[" + row.listType + ":" + row.itemName + "]?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(function () {
        //console.log("确认删除");
        delItemObj(row.rowId).then((response) => {
          if (response.code === 0) {
            that.forms.data.records.splice(index, 1);
          } else {
            that.$message.info("删除失败");
          }
        });
      });
    },

    settaxisNo() {
      // console.log(this.i)
      // console.log(this.a)
      // console.log(this.listdata.data.records);
      this.listdata.data.records.forEach((item, index) => {
        // console.log(this.a)
        this.a.splice(index,index, item.taxisNo);
        this.i = Math.max(...this.a)+1
      });
    },

    // 保存
    save() {
      let that = this;
      this.$refs.forms.validate((valid) => {
        if (valid) {
          /*let result=that.forms.data.records.filter((value,index,number)=>{
                            return value.rowEdit;
                        })*/
          if (!that.forms.data.records || that.forms.data.records.length == 0) {
            that.$message.info("请至少增加一个字典项");
            return;
          }
          //字典代码合名称一起更新
          that.forms.data.records.forEach((ele, index) => {
            if(this.editstatus==false){
              ele.isEdit = false
              //console.log(ele.isEdit)
              // debugger;
            }else{
              ele.isEdit = true
            }
            
            ele.listType = that.forms.listType;
            ele.listTypeDesc = that.forms.listTypeDesc;
          });
          //console.log("result", that.forms.data);
          updateItemList(that.forms.data.records).then((response) => {
            if (response.code === 0) {
              that.$message.success("保存成功");
              that.forms.data.records.forEach((ele, index) => {
                ele.isEdit = false;
                that.$set(that.forms.data.records, index, ele);
              });
              this.$parent.getList();
            } else {
              that.$message.error(response.msg);
            }
          });
        } else {
          that.$message.info("信息填写有误，请检查");
        }
      });
      //console.log(this.forms, "forms");
      this.i = 1;
    },
    // 取消
    cancle() {
      this.$emit("close", false);
    },
  },
};
</script>

<style lang="less" scoped>
.dict-table-form {
  width: 740px;
  margin-left: 47px;
  margin-top: 16px;
  height: 100%;

  .dict-title {
    height: 60px;
    line-height: 60px;
    color: #c4d8e9;
    border-bottom: 1px solid #3a8cd9;
    display: flex;
    justify-content: space-between;
    font-size: 14px;

    img {
      margin-left: 8px;
    }
  }

  .my-form {
    margin-top: 12px;
    height: 100%;
    // overflow-y: auto;

    .el-form-item {
      margin-bottom: 12px;
    }

    .el-table {
      height: calc(100% - 120px);
    }

    .form-table {
      .el-form-item {
        margin-bottom: 0;
      }

      /deep/ .el-input__inner {
        height: 30px;
      }

      /deep/ .el-table__body-wrapper {
        height: calc(100% - 46px);
        overflow: scroll;
      }
    }
  }

  .add-btn {
    height: 33px;
    line-height: 33px;
    border-radius: 4px;
    border: dashed 1px #10519e;
    margin: 22px 0;
    color: #388ef2;
    text-align: center;
    cursor: pointer;

    img {
      vertical-align: sub;
      margin-right: 6px;
    }
  }

  .btns {
    text-align: left;
  }
}
</style>