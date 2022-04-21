<template>
  <div>
    <el-dialog
      class="dialog"
      :title="dialogType ? '生产资源信息新增' : '生产资源信息编辑'"
      :visible.sync="dialogVisible"
      width="1100px"
      top="30vh"
    >
      <div class="content">
        <el-form
          ref="form"
          :model="form"
          label-width="150px"
          :inline="true"
          :rules="rules"
        >
          <el-form-item label="资源名称：" prop="resourcesName">
            <el-input
              v-model="form.resourcesName"
              placeholder="请输入资源名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="资源类别：" prop="resourcesType">
            <el-select v-model="form.resourcesType" placeholder="请选择">
              <el-option
                v-for="(item, index) in resourcesTypeSelect"
                :label="item.itemName"
                :value="item.itemCode"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系姓名：" prop="ownerName">
            <el-input
              v-model="form.ownerName"
              placeholder="请输入联系姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="ownerPhone">
            <el-input
              v-model="form.ownerPhone"
              placeholder="请输入联系电话"
            ></el-input>
          </el-form-item>
          <el-form-item label="资源位置经度：" prop="lon">
            <el-input
              v-model="form.lon"
              placeholder="请输入资源位置深度"
            ></el-input>
          </el-form-item>
          <el-form-item label="资源位置纬度：" prop="lat">
            <el-input
              v-model="form.lat"
              placeholder="请输入资源位置纬度"
            ></el-input>
          </el-form-item>
          <el-form-item label="资源地点：" prop="province">
            <el-row :gutter="45">
              <el-col :span="6">
                <el-form-itme prop="province">
                  <el-select
                    v-model="form.province"
                    placeholder="选择省"
                    @change="provinceChange"
                  >
                    <el-option
                      v-for="(item, index) in provinceSelect"
                      :key="index"
                      :label="item.areaname"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-itme>
              </el-col>
              <el-col :span="6">
                <el-form-itme prop="city">
                  <el-select
                    v-model="form.city"
                    placeholder="选择市"
                    @change="cityChange"
                  >
                    <el-option
                      v-for="(item, index) in citySelect"
                      :key="index"
                      :label="item.areaname"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-itme>
              </el-col>
              <el-col :span="6">
                <el-form-itme prop="country">
                  <el-select
                    v-model="form.country"
                    placeholder="选择区/县"
                    @change="countryChange"
                  >
                    <el-option
                      v-for="(item, index) in countrySelect"
                      :key="index"
                      :label="item.areaname"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-itme>
              </el-col>
              <el-col :span="6">
                <el-form-itme prop="town">
                  <el-select v-model="form.town" placeholder="选择街道/乡镇">
                    <el-option
                      v-for="item in townSelect"
                      :key="item.id"
                      :label="item.areaname"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-itme>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="详细地址：" prop="address">
            <el-input
              v-model="form.address"
              placeholder="请输入详细地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="服务范围：" prop="serverScope">
            <el-input
              v-model="form.serverScope"
              placeholder="请输入服务范围"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="shadow-btn"
          @click="dialogVisible = false"
          round
          >返回</el-button
        >
        <el-button type="primary" class="shadow-btn" @click="save" round
          >保存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRegionInfoByLevel,
  addResourcesInfo,
  updateResources,
} from "@/api/basic/resources";
import { rule } from "@/util/rule";
import { number } from "echarts";

export default {
  data() {
    return {
      dialogVisible: false,
      provinceSelect: [],
      citySelect: [],
      countrySelect: [],
      townSelect: [],
      form: {
        province: null,
        city: null,
        country: null,
        town: null,
      },
      rules: {
        resourcesName: [
          { required: true, message: "请输入资源名称", trigger: "blur" },
        ],
        resourcesType: [
          { required: true, message: "请选择资源类型", trigger: "change" },
        ],
        ownerName: [
          { required: true, message: "请输入联系姓名", trigger: "blur" },
          { validator: rule.validatorNameCn, trigger: "blur" },
        ],
        ownerPhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { validator: rule.isPhoneTwo, trigger: "blur" },
        ],
        lon: [
          { required: true, message: "请输入经度", trigger: "blur" },
          { validator: rule.isLon, trigger: "blur" },
        ],
        lat: [
          { required: true, message: "请输入纬度", trigger: "blur" },
          { validator: rule.isLat, trigger: "blur" },
        ],
        province: [{ required: true, message: "请选择省", trigger: "change" }],
        city: [{ required: true, message: "请选择市", trigger: "change" }],
        country: [{ required: true, message: "请选择区/县", trigger: "change" }],
        town: [{ required: true, message: "请选择乡镇/街道", trigger: "change" }],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
          { validator: rule.validatorNameCn, trigger: "blur" },
        ],
        serverScope: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
          { validator: rule.validatorNameCn, trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    dialogVisible(newVal, oldVal) {
      if (!newVal) {
        this.citySelect = [];
        this.countrySelect = [];
        this.townSelect = [];
      }
    },
  },
  props: {
    resourcesTypeSelect: Array,
    dialogType: Number,
  },
  created() {
    this.getProvince();
  },
  methods: {
    //编辑时初始化地区选择列表/组组件调用
    initAddressSelect(form) {
      this.getCitySelect(form.province);
      this.getCountrySelect(form.city);
      this.getTownSelect(form.country);
    },
    //省份选择
    provinceChange(val) {
      this.getCitySelect(val);
      this.form.city = "";
      this.form.country = "";
      this.form.town = "";
    },
    cityChange(val) {
      this.getCountrySelect(val);
      this.form.country = "";
      this.form.town = "";
    },
    countryChange(val) {
      this.getTownSelect(val);
      this.form.town = "";
    },
    //获取省份
    async getProvince() {
      let res = await getRegionInfoByLevel({
        isAll: true,
        level: 1,
      });
      if (!res.code) {
        res.data.shift();
        this.provinceSelect = res.data;
      }
    },
    // 改变省份查询对应的市
    async getCitySelect(val) {
      let res = await getRegionInfoByLevel({
        id: val,
        isAll: true,
        level: 2,
      });
      if (!res.code) {
        res.data.shift();
        this.citySelect = res.data;
      }
    },
    //改变市后查询对应的区、县
    async getCountrySelect(val) {
      let res = await getRegionInfoByLevel({
        id: val,
        isAll: true,
        level: 3,
      });
      if (!res.code) {
        res.data.shift();
        this.countrySelect = res.data;
      }
    },
    //改变区县后查询对应的街道
    async getTownSelect(val) {
      let res = await getRegionInfoByLevel({
        id: val,
        isAll: true,
        level: 4,
      });
      if (!res.code) {
        res.data.shift();
        this.townSelect = res.data;
      }
    },
    async addResources(form) {
      let res = await addResourcesInfo(form);
      if (!res.code) {
        this.$message.success("新增成功");
        this.dialogVisible = false;
        this.$emit("flashTable");
      }
    },
    async editResourcesInfo(form) {
      let res = await updateResources(form);
      if (!res.code) {
        this.$message.success("编辑成功");
        this.dialogVisible = false;
        this.$emit("flashTable");
      }
    },
    //保存设置
    save() {
      this.$refs.form
        .validate()
        .then((x) => {
          if (this.dialogType) {
            this.addResources(this.form);
          } else {
            this.editResourcesInfo(this.form);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  padding-top: 40px;
}

/deep/ .el-input__inner {
  width: 185px;
}

/deep/ .el-button {
  width: 72px;
}

/deep/ .shadow-btn {
  border-radius: 20px;
  height: 35px;
  margin-left: 6px;
}
</style>