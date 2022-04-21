<template>
<!-- 补报弹窗 -->
  <el-dialog 
    class="my-dialog addDialog" 
    title="补报" 
    :visible.sync="dialogVisible"
    width="1261px"
    top="6vh"
    @close="close">
    <el-form class="add-form" ref="form" :model="form" :rules="formRule" label-width="150px" inline>
      <el-form-item label="农机分组：" class="is-required">
        <el-input style="width: 250px;" v-model="groupData.name" readonly placeholder="请选择农机分组"></el-input>
      </el-form-item>
      <el-form-item label="农机车牌：" class="special" prop="plateNumber">
        <el-input v-model="form.plateNumber" readonly placeholder="请输入农机车牌"></el-input>
      </el-form-item>
      <el-form-item label="农机类型：" prop="machineType">
        <el-input v-model="form.machineTypeLabel" readonly placeholder="请输入农机类型"></el-input>
        <!-- <el-select v-model="form.machineType" placeholder="请选择农机类型">
          <el-option v-for="item in carTypes" :key="item.itemCode" :label="item.itemName" :value="item.itemCode"></el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="机具类型：" prop="toolType">
        <el-select v-model="form.toolType" placeholder="请选择机具类型">
          <el-option v-for="item in toolTypes" :key="item.itemCode" :label="item.itemName" :value="item.itemCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机具宽度：" prop="toolWidth">
        <el-input type="number" v-model.number="form.toolWidth" placeholder="请输入机具宽度">
          <template slot="suffix">
            <el-divider direction="vertical"></el-divider>
            <span class="unit">米</span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="补报面积：" prop="reportArea">
        <el-input type="number" v-model.number="form.reportArea" placeholder="请输入补报面积">
          <template slot="suffix">
            <el-divider direction="vertical"></el-divider>
            <span class="unit">亩</span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="作业质量：" prop="avgDepth">
        <el-input type="number" v-model.number="form.avgDepth" placeholder="请输入作业质量">
          <template slot="suffix">
            <el-divider direction="vertical"></el-divider>
            <span class="unit">厘米</span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="作业时间：" class="is-required">
        <el-row>
          <el-col :span="11">
            <el-form-item prop="reportStartTime">
              <el-date-picker class="datepicker" type="datetime" placeholder="选择日期" prefix-icon="el-icon-date" :default-time="'00:00:00'" :clearable="false" v-model="form.reportStartTime" style="width: 100%;" @change="startChange"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">—</el-col>
          <el-col :span="11">
            <el-form-item prop="reportEndTime">
              <el-date-picker class="datepicker" type="datetime" placeholder="选择日期" prefix-icon="el-icon-date" :default-time="'23:59:59'" :clearable="false" v-model="form.reportEndTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="作业合格率：" prop="depthRate">
        <el-input type="number" v-model.number="form.depthRate" placeholder="请输入作业合格率"></el-input>
      </el-form-item>
      <el-form-item label="作业区域：" class="region is-required">
        <el-row>
          <el-col :span="5">
            <el-form-item prop="provinceId">
              <el-select style="width:186px;" v-model="form.provinceId" @change="handleProvinceChange" placeholder="请选择省">
                <el-option v-for="item in province" :key="item.domainName" :label="item.domainName" :value="item.rowId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">—</el-col>
          <el-col :span="5">
            <el-form-item prop="cityId">
              <el-select style="width:186px;" v-model="form.cityId" @change="handleCityChange" placeholder="请选择市">
                <el-option v-for="item in city" :key="item.domainName" :label="item.domainName" :value="item.rowId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">—</el-col>
          <el-col :span="5">
            <el-form-item prop="countryId">
              <el-select style="width:186px;" v-model="form.countryId" @change="handleCountryChange" placeholder="请选择县">
                <el-option v-for="item in country" :key="item.domainName" :label="item.domainName" :value="item.rowId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">—</el-col>
          <el-col :span="5">
            <el-form-item prop="townId">
              <el-select style="width:186px;" v-model="form.townId" placeholder="请选择街道/镇">
                <el-option v-for="item in street" :key="item.domainName" :label="item.domainName" :value="item.rowId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="作业地址：" style="display: block;" prop="address">
        <el-input style="width: 400px;" v-model="form.address" placeholder="请输入作业地址"></el-input>
      </el-form-item>
      <el-form-item label="作业地块：" style="display: block;">
        <el-input style="width: 400px;" v-model="form.geometryStr" placeholder="请输入作业地块"></el-input>
      </el-form-item>
      <el-form-item label="上传附件：" style="line-height: 365px;">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-upload
              ref="uploadD"
              :action="uploadUrl"
              :headers="headers"
              list-type="picture-card"
              :limit="1"
              :data="uploadData"
              :on-change="handleChange"
              :on-success="handleSuccess"
              :on-error="handleError"
              :file-list="chooseFilelist"
              :class="{hide:hideUpload}">
              <div slot="default" class="upload-bg">
                <div>
                  <img src="img/working/icon_上传.png" alt="">
                  <p>农经局证明 <span>(必传)</span></p>
                </div>
              </div>
              <div slot="file" slot-scope="{file}">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-delete" @click="handleRemove(file, 'hideUpload', 'chooseFilelist')">
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
          </el-col>
          <el-col :span="8">
            <el-upload
              ref="uploadC"
              :action="uploadUrl"
              :headers="headers"
              list-type="picture-card"
              :limit="1"
              :data="uploadData"
              :on-change="handleChange2"
              :on-success="handleSuccess2"
              :on-error="handleError"
              :file-list="chooseFilelist2"
              :class="{hide:hideUpload2}">
              <div slot="default" class="upload-bg">
                <div>
                  <img src="img/working/icon_上传.png" alt="">
                  <p>村委会证明 <span>(必传)</span></p>
                </div>
              </div>
              <div slot="file" slot-scope="{file}">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-delete" @click="handleRemove(file, 'hideUpload2', 'chooseFilelist2')">
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
          </el-col>
          <el-col :span="8">
            <el-upload
              ref="uploadF"
              :action="uploadUrl"
              :headers="headers"
              list-type="picture-card"
              :limit="1"
              :data="uploadData"
              :on-change="handleChange3"
              :on-success="handleSuccess3"
              :on-error="handleError"
              :file-list="chooseFilelist3"
              :class="{hide:hideUpload3}">
              <div slot="default" class="upload-bg">
                <div>
                  <img src="img/working/icon_上传.png" alt="">
                  <p>中标作业合同书 <span>(选传)</span></p>
                </div>
              </div>
              <div slot="file" slot-scope="{file}">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-delete" @click="handleRemove(file, 'hideUpload3', 'chooseFilelist3')">
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="shadow-btn" plain round @click="submit">保存</el-button>
      <el-button class="shadow-btn" plain round @click="close">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDetailByMachinId, selectProvince, selectAreaByTimePlateNumber, additionalReport } from '@/api/working/index'
import{ getDictByListType } from '@/api/basic/index'
import { mapGetters } from 'vuex'
import { dateFormat, filterDict } from '../../../../util/util'
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        provinceId: '',
        cityId: '',
        countryId: '',
        townId: '',
        toolWidth: '',
        toolType: '',
        reportStartTime: new Date((new Date()).setHours(0,0,0,0) - 24*60*60*1000),
        reportEndTime: new Date((new Date()).setHours(0,0,0,0) - 1000),
      },
      formRule: {
        plateNumber: [
          {required: true, message: '请输入农机车牌', trigger: 'blur'}
        ],
        machineType: [
          {required: true, message: '请输入农机车牌', trigger: 'blur'}
        ],
        toolType: [
          {required: true, message: '请选择机具类型', trigger: 'change'}
        ],
        toolWidth: [
          {required: true, message: '请选择机具宽度', trigger: 'blur'}
        ],
        avgDepth: [
          {required: true, message: '请输入作业质量', trigger: 'blur'}
        ],
        reportArea: [
          {required: true, message: '请输入补报面积', trigger: 'blur'}
        ],
        depthRate: [
          {required: true, message: '请输入作业合格率', trigger: 'blur'}
        ],
        reportStartTime: [
          {required: true, message: '请选择作业开始时间', trigger: 'change'}
        ],
        reportEndTime: [
          {required: true, message: '请选择作业结束时间', trigger: 'change'}
        ],
        provinceId: [
          {required: true, message: '请选择省', trigger: 'change'}
        ],
        cityId: [
          {required: true, message: '请选择市', trigger: 'change'}
        ],
        countryId: [
          {required: true, message: '请选择县', trigger: 'change'}
        ],
        address: [
          {required: true, message: '请输入作业地址', trigger: 'blur'}
        ],
      },
      headers: {
        Authorization: 'Bearer ' + this.$store.getters.access_token
      },
      hideUpload: false,
      hideUpload2: false,
      hideUpload3: false,
      uploadUrl: window.globalUrl.HOME_API + 'agri-web/jobManagement/uploadImg',
      fileList: [],
      chooseFilelist: [],
      chooseFilelist2: [],
      chooseFilelist3: [],
      uploadData: {}, // 上传携带的额外参数
      carTypes: [], //  农机类型
      toolTypes: [],
      province: [], // 省
      city: [], // 市
      country: [], // 县
      street: [], // 街道
      areaTimeCheck: false
    }
  },
  computed: {
    ...mapGetters(['groupData'])
  },
  watch: {
    dialogVisible(newV) {
      // 通过监听dialog状态来初始化请求
      if(newV) {
        console.log('dialogVisible')
        this.initCarTypes();
        this.initToolTypes();
        this.initProvince();
        this.initData();
      }
    }
  },
  created() {
    
  },
  methods: {
    // 页面部分数据回显
    async initData() {
      let params = {
        machinId: this.groupData.ids[0]
      }
      let res = await getDetailByMachinId(params);
      const {code, data} = res;
      if(code == 0) {
        this.form.plateNumber = data.plateNumber;
        this.form.machineTypeLabel = data.machineType;
        this.form.machineType = filterDict(this.form.machineTypeLabel, { labelKey: 'itemCode', valueKey: 'itemName' }, this.carTypes)
        console.log(this.form.machineTypeLabel, this.form.machineType);
        this.form.toolWidth = data.toolWidth;
        this.form.groupNameFullPath = data.groupNameFullPath;
      }
    },
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
    // 选择开始时间改变事件
    startChange(val) {
      // 给结束时间默认值
      this.form.reportEndTime = new Date(val.getTime() + 24*60*60*1000 - 1);
    },
    // 省数据选择
    handleProvinceChange(val) {
      this.initProvince(val, 'city');
      this.form.cityId = '';
      this.form.countryId = '';
      this.form.townId = '';
    },
    handleCityChange(val) {
      this.initProvince(val, 'country');
      this.form.countryId = '';
      this.form.townId = '';
    },
    handleCountryChange(val) {
      this.initProvince(val, 'street');
      this.form.townId = '';
    },
    handleChange(file, fileList) {
      // 	文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      return this.handleFileCheck(file, fileList, 'hideUpload', 'uploadD', 'chooseFilelist')
    },
    handleSuccess(res) {
      const {success, obj} = res;
      if(success) {
        this.form.agriBureauPath = obj.imgPath;
        this.form.agriBureauUrl = obj.imgUrl;
      }
    },
    handleChange2(file, fileList) {
      // 	文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      return this.handleFileCheck(file, fileList, 'hideUpload2', 'uploadC', 'chooseFilelist2')
    },
    handleSuccess2(res) {
      const {success, obj} = res;
      if(success) {
        this.form.agriVillagePath = obj.imgPath;
        this.form.agriVillageUrl = obj.imgUrl;
      }
    },
    handleChange3(file, fileList) {
      // 	文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      return this.handleFileCheck(file, fileList, 'hideUpload3', 'uploadF', 'chooseFilelist3')
    },
    handleSuccess3(res) {
      const {success, obj, msg} = res;
      if(success) {
        this.form.agriContractPath = obj.imgPath;
        this.form.agriContractUrl = obj.imgUrl;
      } else {
        this.$message.error(msg || '上传失败')
      }
    },
    handleError(err) {
      let res = JSON.parse(err.message);
      this.$message.error(res.msg || '上传失败')
      // if(res.msg === '用户凭证已过期') {
      //   this.$store.dispatch("LogOut").then(res => {
      //     let { code, msg } = res;
      //     if(code == '0') {
      //       sessionStorage.clear();
      //       this.$router.push({name: 'login'})
      //     }
      //   })
      // }
    },
    handleRemove(file, upload, list) {
      this[list] = [];
      this[upload] = false;
    },
    handleFileCheck(file, fileList, hide, ref, list) {
      this[hide] = fileList.length >= 1;
      this.fileList.push(file);
      const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png';
      const isLt2M = file.raw.size / 1024 / 1024 < 5;
      this.uploadData.size = file.raw.size;
      if (!isJPG) {
          this.$message.error('上传文件为 JPG 或 PNG 格式!');
          this[list] = [];
          this[hide] = false;
          this.$refs[ref].abort();
      } else if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5MB!');
        this[list] = [];
        this[hide] = false;
        this.$refs[ref].abort();
      }
      return isJPG && isLt2M;
    },
    // 补报提交前查询 作业时间是否有重复
    async selectAreaCheck() {
      let params = {
        beginTimeVar: this.form.reportStartTime,
        engTimeVar: this.form.reportEndTime,
        machineId: this.groupData.ids[0]
      }
      let res = await selectAreaByTimePlateNumber(params);
      if(res === 'success') {
        this.areaTimeCheck = true;
        return true;
      } else {
        this.$message.info('补报面积中，时间与现有数据时间记录有重叠。。。为使记录工作面积与实际相符，建议更改补报时间后提交');
        this.areaTimeCheck = false;
        return false;
      }
    },
    checkFile() {
      if(!this.form.agriBureauPath) {
        this.$message.info('请上传农经局证明');
        return false;
      }
      if(!this.form.agriVillagePath) {
        this.$message.info('请上传村委会证明');
        return false;
      }
      return true;
    },
    nameFilter(value, list) {
      return filterDict(value, { labelKey: 'domainName', valueKey: 'rowId' }, list)
    },
    // 提交
    submit() {
      this.$refs.form.validate(valid => {
        if(valid) {
          if(this.checkFile()) {
            this.selectAreaCheck().then(async () => {
              console.log(this.areaTimeCheck, 'check')
              if(this.areaTimeCheck) {
                // this.form.jobStartTime = dateFormat(this.form.jobStartTime);
                // this.form.jobEndTime = dateFormat(this.form.jobEndTime);
                let params = Object.assign(this.form, {
                  // 补报只能是具体车辆
                  machineId: this.groupData.ids[0],
                  groupId: this.groupData.machine[0].pId,
                  groupName: this.groupData.name,
                  groupFullPath: this.groupData.machine[0].path,
                  belongGroupId: this.groupData.machine[0].pId,
                  reportStartTime: dateFormat(this.form.reportStartTime),
                  reportEndTime: dateFormat(this.form.reportEndTime),
                  jobStartTime: dateFormat(this.form.reportStartTime),
                  jobEndTime: dateFormat(this.form.reportEndTime),
                  province: this.nameFilter(this.form.provinceId, this.province),
                  city: this.nameFilter(this.form.cityId, this.city),
                  country: this.nameFilter(this.form.countryId, this.country),
                  town: this.nameFilter(this.form.townId, this.street),
                })
                console.log(params, 'params')
                let res = await additionalReport(params);
                const {code, msg} = res;
                if(code == 0) {
                  this.$message.success('提交补报成功');
                  this.dialogVisible = false;
                } else {
                  this.$message.error(msg || '提交补报失败')
                }
              }
            })
          }
        }
      })
    },
    close() {
      this.hideUpload = false;
      this.hideUpload2 = false;
      this.hideUpload3 = false;
      this.$refs.uploadD.clearFiles();
      this.$refs.uploadC.clearFiles();
      this.$refs.uploadF.clearFiles();
      this.$refs.form.resetFields();
      this.dialogVisible = false;
    }
  }
}
</script>

<style lang="less" scoped>
.addDialog {
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
    /deep/ .el-input__suffix {
      color: #80c5ff;
      opacity: 0.6;
      font-family: SourceHanSansCN-Regular;
      font-size: 14px;
      .unit {
        margin-right: 5px;
      }
    }
    .el-divider {
      background-color: #55adff;
      height: 20px;
      opacity: 0.17;
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
    /deep/ .el-upload--picture-card, /deep/ .el-upload-list__item {
      width: 269px;
      height: 365px;
      background: transparent;
      border: 0;
    }
    /deep/ .el-upload-list__item {
      border: solid 1px #133460;
    }
    /deep/ .el-form-item__error {
      padding-top: 1px;
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
    input::-webkit-input-placeholder {
      color: #3a5571;
    }

    input::-moz-input-placeholder {
      color: #3a5571;
    }

    input::-ms-input-placeholder {
      color: #3a5571;
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