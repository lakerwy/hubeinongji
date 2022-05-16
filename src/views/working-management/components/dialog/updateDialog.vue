<template>
<!-- 批量修改弹窗 -->
  <el-dialog 
    class="my-dialog uploadDialog" 
    title="批量修改" 
    :visible.sync="dialogVisible"
    :before-close="close"
    width="1261px"
    top="8vh">
    <el-form class="add-form" ref="form" :model="form" :rules="formRule" label-width="150px" inline>
      <el-form-item label="修改目标" style="display:block;">
        <el-input style="width:250px;" v-model="groupData.name" readonly placeholder="请选择农机分组"></el-input>
      </el-form-item>
      <el-form-item label="农机类型" prop="machineTypeForChange">
        <el-select v-model="form.machineTypeForChange" placeholder="请选择农机类型">
          <el-option v-for="item in carTypes" :key="item.itemCode" :label="item.itemName" :value="item.itemCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="作业时间">
        <el-row>
          <el-col :span="11">
            <el-form-item prop="jobStartTimeForChange">
              <el-date-picker class="datepicker" type="datetime" placeholder="选择日期" :default-time="'00:00:00'" prefix-icon="el-icon-date" :clearable="false" v-model="form.jobStartTimeForChange" style="width: 100%;" @change="startChange"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">—</el-col>
          <el-col :span="11">
            <el-form-item prop="jobEndTimeForChange">
              <el-date-picker class="datepicker" type="datetime" placeholder="选择日期" :default-time="'23:59:59'" prefix-icon="el-icon-date" :clearable="false" v-model="form.jobEndTimeForChange" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="作业类型" prop="JobTypeForChange">
        <el-select v-model="form.JobTypeForChange" placeholder="请选择作业类型">
          <el-option v-for="item in jobTypes" :key="item.itemCode" :label="item.itemName" :value="item.itemCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="作业深度">
        <el-row>
          <el-col :span="11">
            <el-form-item prop="depMinForChange">
              <el-input type="number" v-model.number="form.depMinForChange" placeholder="请输入作业深度"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">—</el-col>
          <el-col :span="11">
            <el-form-item prop="depMaxForChange">
              <el-input type="number" v-model.number="form.depMaxForChange" placeholder="请输入作业深度"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="是否合格" prop="isAuditflagForChange">
        <el-radio-group v-model="form.isAuditflagForChange">
          <el-radio :label="item.value" v-for="item in status" :key="item.label">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="深度合格率">
        <el-row>
          <el-col :span="11">
            <el-form-item prop="depRateMinForChange">
              <el-input type="number" v-model.number="form.depRateMinForChange" placeholder="请输入深度合格率"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">—</el-col>
          <el-col :span="11">
            <el-form-item prop="depRateMaxForChange">
              <el-input type="number" v-model.number="form.depRateMaxForChange" placeholder="请输入深度合格率"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="区域选择" class="region">
        <el-row>
          <el-col :span="5">
            <el-select style="width:186px;" v-model="form.provinceIdForChange" @change="handleProvinceChange" placeholder="请选择省">
              <el-option v-for="item in province" :key="item.domainName" :label="item.domainName" :value="item.rowId"></el-option>
            </el-select>
          </el-col>
          <el-col class="line" :span="1">—</el-col>
          <el-col :span="5">
            <el-select style="width:186px;" v-model="form.cityIdForChange" @change="handleCityChange" placeholder="请选择市">
              <el-option v-for="item in city" :key="item.domainName" :label="item.domainName" :value="item.rowId"></el-option>
            </el-select>
          </el-col>
          <el-col class="line" :span="1">—</el-col>
          <el-col :span="5">
            <el-select style="width:186px;" v-model="form.countryIdForChange" @change="handleCountryChange" placeholder="请选择县">
              <el-option v-for="item in country" :key="item.domainName" :label="item.domainName" :value="item.rowId"></el-option>
            </el-select>
          </el-col>
          <el-col class="line" :span="1">—</el-col>
          <el-col :span="5">
            <el-select style="width:186px;" v-model="form.townIdForChange" placeholder="请选择街道/镇">
              <el-option v-for="item in street" :key="item.domainName" :label="item.domainName" :value="item.rowId"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>

    <p class="u-title">修改为：</p>
    <el-form class="add-form" ref="form" :model="newForm" label-width="150px" inline>
      <el-form-item label="机具类型" style="display:block;" prop="ToolTypeUpdateChanged">
        <el-select v-model="form.ToolTypeUpdateChanged" placeholder="请选择机具类型" @change="toolChange">
          <el-option v-for="item in toolTypes" :key="item.itemCode" :label="item.itemName" :value="item.itemCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="作业类型" prop="JobTypeChanged1">
        <el-select v-model="form.JobTypeChanged1" disabled placeholder="请选择作业类型">
          <el-option v-for="item in jobTypes" :key="item.itemCode" :label="item.itemName" :value="item.itemName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="平均深度">
        <el-row>
          <el-col :span="11">
            <el-form-item prop="depMinChanged">
              <el-input type="number" v-model.number="form.depMinChanged" placeholder="请输入平均深度"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">—</el-col>
          <el-col :span="11">
            <el-form-item prop="depMaxChanged">
              <el-input type="number" v-model.number="form.depMaxChanged" placeholder="请输入平均深度"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="是否合格" prop="isAuditflagChanged">
        <el-radio-group v-model="form.isAuditflagChanged">
          <el-radio :label="item.value" v-for="item in status" :key="item.label">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="深度合格率">
        <el-row>
          <el-col :span="11">
            <el-form-item prop="depRateMinChanged">
              <el-input type="number" v-model.number="form.depRateMinChanged" placeholder="请输入深度合格率"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">—</el-col>
          <el-col :span="11">
            <el-form-item prop="depRateMaxChanged">
              <el-input type="number" v-model.number="form.depRateMaxChanged" placeholder="请输入深度合格率"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="作业区域" class="region">
        <el-row>
          <el-col :span="5">
            <el-select style="width:186px;" v-model="form.provinceIdChanged" @change="handleProvinceChange2" placeholder="请选择省">
              <el-option v-for="item in province" :key="item.domainName" :label="item.domainName" :value="item.rowId"></el-option>
            </el-select>
          </el-col>
          <el-col class="line" :span="1">—</el-col>
          <el-col :span="5">
            <el-select style="width:186px;" v-model="form.cityIdChanged" @change="handleCityChange2" placeholder="请选择市">
              <el-option v-for="item in city2" :key="item.domainName" :label="item.domainName" :value="item.rowId"></el-option>
            </el-select>
          </el-col>
          <el-col class="line" :span="1">—</el-col>
          <el-col :span="5">
            <el-select style="width:186px;" v-model="form.countryIdChanged" @change="handleCountryChange2" placeholder="请选择县">
              <el-option v-for="item in country2" :key="item.domainName" :label="item.domainName" :value="item.rowId"></el-option>
            </el-select>
          </el-col>
          <el-col class="line" :span="1">—</el-col>
          <el-col :span="5">
            <el-select style="width:186px;" v-model="form.townIdChanged" placeholder="请选择街道/镇">
              <el-option v-for="item in street2" :key="item.domainName" :label="item.domainName" :value="item.rowId"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="作业地址" style="display: block;" prop="addressUpdateChanged">
        <el-input style="width: 400px;" v-model="form.addressUpdateChanged" placeholder="请输入作业地址"></el-input>
      </el-form-item>
      <el-form-item label="验证码" style="display: block;" prop="updateJobCode">
        <el-input style="width: 400px;" v-model="form.updateJobCode" placeholder="请输入验证码"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="shadow-btn" plain round @click="submit">保存</el-button>
      <el-button class="shadow-btn" plain round @click="close">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import{ getDictByListType } from '@/api/basic/index'
import { selectProvince, selectJobTypeChange, updateJobAreaAlot } from '@/api/working/index'
import { filterDict, dateFormat } from '@/util/util.js'
import rule from './updateRule'
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        provinceIdForChange: '',
        cityIdForChange: '',
        countryIdForChange: '',
        townIdForChange: '',
        provinceIdChanged: '',
        cityIdChanged: '',
        countryIdChanged: '',
        townIdChanged: '',
        depMaxForChange: 0,
        depMinForChange: 0,
        jobStartTimeForChange: new Date((new Date()).setHours(0,0,0,0)),
        jobEndTimeForChange: new Date((new Date()).setHours(23,59,59,999)),
      },
      // formRule: rule(this.form),
      formRule: {
        machineTypeForChange: [
          {required: true, message: '请选择农机类型', trigger: 'change'}
        ],
        jobStartTimeForChange: [
          {required: true, message: '请输入作业开始时间', trigger: 'change'}
        ],
        jobEndTimeForChange: [
          {required: true, message: '请输入作业结束时间', trigger: 'change'}
        ],
        JobTypeForChange: [
          {required: true, message: '请选择作业类型', trigger: 'change'}
        ],
        depMinForChange: [
          { trigger: 'blur',
            validator: (rule, value, callback) => {
              if(value) {
                if(Number(this.form.depMaxForChange) && Number(value) >= Number(this.form.depMaxForChange)) {
                  return callback(new Error('作业深度输入有误'))
                } else {
                  callback()
                }
                callback()
              }
            }
          },
          // {
          //   pattern: /^(?:0|[1-9][0-9]?|100)$/,
          //   message: "范围在0-100",
          //   trigger: "blur",
          // },
        ],
        depMaxForChange: [
          { trigger: 'blur',
            validator: (rule, value, callback) => {
              if(value) {
                if(Number(this.form.depMinForChange) && Number(value) <= Number(this.form.depMinForChange)) {
                  return callback(new Error('作业深度输入有误'))
                } else {
                  callback()
                }
                callback()
              }
            }
          },
          // {
          //   pattern: /^(?:0|[1-9][0-9]?|100)$/,
          //   message: "范围在0-100",
          //   trigger: "blur",
          // },
        ],
        depRateMinForChange: [
          { trigger: 'blur',
            validator: (rule, value, callback) => {
              if(value) {
                if(Number(this.form.depRateMaxForChange) && Number(value) <= Number(this.form.depRateMaxForChange)) {
                  return callback(new Error('深度合格率输入有误'))
                } else {
                  callback()
                }
                callback()
              }
            }
          }
        ],
        depRateMaxForChange: [
          { trigger: 'blur',
            validator: (rule, value, callback) => {
              if(value) {
                if(Number(this.form.depRateMinForChange) && Number(value) <= Number(this.form.depRateMinForChange)) {
                  return callback(new Error('深度合格率输入有误'))
                } else {
                  callback()
                }
                callback()
              }
            }
          }
        ]
      },
      status: [
        {label: '是', value: 'Y'},
        {label: '否', value: 'N'},
        {label: '全部', value: ''},
      ],
      newForm: {},
      carTypes: [], //  农机类型
      jobTypes: [],
      toolTypes: [],
      province: [], // 省
      city: [], // 市
      country: [], // 县
      street: [], // 街道
      city2: [], // 市
      country2: [], // 县
      street2: [], // 街道
    }
  },
  computed: {
    ...mapGetters(['groupData'])
  },
  watch: {
    dialogVisible(newV) {
      // 通过监听dialog状态来初始化请求
      if(newV) {
        this.initCarTypes();
        this.initJobTypes();
        this.initToolTypes();
        this.initProvince(0, 'province')
      }
    }
  },
  methods: {
    // 请求农机字典数据
    async initCarTypes() {
      let params = {
        listType: 'machine_type'
      }
      let res = await getDictByListType(params);
      let {code, data} = res;
      if(code == 0) {
        this.carTypes = data;
      }
    },
    async initJobTypes() {
      let params = {
        listType: 'job_type'
      }
      let res = await getDictByListType(params);
      let {code, data} = res;
      if(code == 0) {
        this.jobTypes = data;
      }
    },
    async initToolTypes() {
      let params = {
        listType: 'tool_type'
      }
      let res = await getDictByListType(params);
      let {code, data} = res;
      if(code == 0) {
        this.toolTypes = data;
      }
    },
    async initProvince(id = 0, t = 'province') {
      let params = {
        groupPId: id
      }
      let res = await selectProvince(params);
      const {code, data} = res;
      if(code == 0) {
        this[t] = data;
      }
    },
    // 机具类型改变
    async toolChange(val) {
      let params = {
        toolType: val
      }
      let res = await selectJobTypeChange(params);
      const {code, data, msg} = res;
      if(!code) {
        this.$set(this.form, 'JobTypeChanged1', data.jobTypeName);
        this.$set(this.form, 'updateJobTypeChanged', data.jobType);
      }
    },
    // 省数据选择
    handleProvinceChange(val) {
      this.initProvince(val, 'city');
      this.form.cityIdForChange = '';
      this.form.countryIdForChange = '';
      this.form.townIdForChange = '';
    },
    handleCityChange(val) {
      this.initProvince(val, 'country');
      this.form.countryIdForChange = '';
      this.form.townIdForChange = '';
    },
    handleCountryChange(val) {
      this.initProvince(val, 'street');
      this.form.townIdForChange = '';
    },
    handleProvinceChange2(val) {
      this.initProvince(val, 'city2');
      this.form.cityIdChanged = '';
      this.form.countryIdChanged = '';
      this.form.townIdChanged = '';
    },
    handleCityChange2(val) {
      this.initProvince(val, 'country2');
      this.form.countryIdChanged = '';
      this.form.townIdChanged = '';
    },
    handleCountryChange2(val) {
      this.initProvince(val, 'street2');
      this.form.townIdChanged = '';
    },
    nameFilter(value, list) {
      return filterDict(value, { labelKey: 'domainName', valueKey: 'rowId' }, list)
    },
    // 选择开始时间改变事件
    startChange(val) {
      // 给结束时间默认值
      this.form.jobEndTimeForChange = new Date(val.getTime() + 24*60*60*1000 - 1);
    },
    // 保存
    submit() {
      this.form.jobStartTimeForChange = dateFormat(this.form.jobStartTimeForChange);
      this.form.jobEndTimeForChange = dateFormat(this.form.jobEndTimeForChange);
      let params = {
        changeTarget: this.groupData.name,
        machineIdSforChange: this.groupData.ids.join(','),
        provinceForChange: this.nameFilter(this.form.provinceIdForChange, this.province),
        cityForChange: this.nameFilter(this.form.cityIdForChange, this.city),
        countryForChange: this.nameFilter(this.form.countryIdForChange, this.country),
        townForChange: this.nameFilter(this.form.townIdForChange, this.street),
        provinceChanged: this.nameFilter(this.form.provinceIdChanged, this.province),
        cityChanged: this.nameFilter(this.form.cityIdChanged, this.city2),
        countryChanged: this.nameFilter(this.form.countryIdChanged, this.country2),
        townChanged: this.nameFilter(this.form.townIdChanged, this.street2),
        updateToolTypeChanged: this.form.ToolTypeUpdateChanged,
        machine_type_forchange: this.form.machineTypeForChange,
        ...this.form
      }
      //console.log(params, 'params');
      this.$refs.form.validate(async valid => {
        if(valid) {
          let res = await updateJobAreaAlot(params);
          const {code, msg} = res;
          if(code == 0) {
            this.$message.success('修改成功');
            this.$refs.form.resetFields();
            this.dialogVisible = false;
            this.$emit('refreshData');
          } else {
            this.$message.error(msg || '修改失败')
          }
        }
      })
    }, 
    close() {
      // this.form = {};
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    }
  }
}
</script>

<style lang="less" scoped>
.uploadDialog {
  .add-form {
    .line {
      width: 26px;
      text-align: center;
      color: #356e97;
      font-size: 12px;
    }
    /deep/ .el-input {
      width: 218px;
    }
    .region {
      /deep/ .el-input {
        width: 100%;
      }
    }
    .el-col-5 {
      width: 186px;
    }
    .el-col-8 {
      width: 289px;
    }
    .el-col-11 {
      width: 218px;
    }
    .special {
      /deep/ .el-form-item__label {
        width: 118px !important;
      }
    }
    .el-radio-group {
      width: 218px;
    }
    .upload-bg {
      width: 100%;
      height: 100%;
      background-image: url('../../../../assets/images/upload-bg.png');
      background-size: cover;
      background-repeat: no-repeat;
      display: flex;
      justify-content: space-around;
      align-items: center;
      div {
        height: 56px;
        line-height: 44px;
        p {
          line-height: 0;
          margin: 0;
          color: #4f74ad;
          font-size: 14px;
          span {
            color: #67c8ff;
          }
        }
      }
    }
    /deep/ .el-upload--picture-card {
      width: 269px;
      height: 365px;
      background: transparent;
      border: 0;
    }
  }

  .u-title {
    color: @inputFontColor;
    padding-left: 80px;
    font-size: 16px;
  }

  .el-input,.el-select{
    /deep/ input::-webkit-input-placeholder {
      color: #285583;
    }

    input::-moz-input-placeholder {
      color: #285583;
    }

    input::-ms-input-placeholder {
      color: #285583;
    }
  }

  .datepicker {
    width: 218px !important;
    font-size: 12px;

    .el-input__inner {
      background-color: transparent !important;
      border-radius: 4px;
      border: solid 1px #356e97;
      color: rgba(129, 160, 192, 1);
      height: 40px;
      line-height: 40px;
      padding: 0 0 0 30px !important;
    }

    .el-input__prefix {
      left: 85%;
    }

    .el-input__suffix {
      right: 5px;
    }
  }
}

.hide {
  /deep/ .el-upload--picture-card {
    display: none;
  }
}
</style>