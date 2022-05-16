<template>
  <!-- 补助资金明细报表 -->
  <div class="app-container opreationSeason">
    <titleBox :headName="'区域大数据报表'" />
    <basic-container class="basic-con">
      <div class="searchline">
        <el-form
          class="my-form"
          label-position="right"
          label-width="85px"
          :model="form"
          :inline="true"
        >
          <div class="formItem">
            <el-row :gutter="5">
              <el-form-item class="item-data" label="起止时间:  ">
                <el-col :span="24">
                  <el-date-picker
                    class="datepicker"
                    v-model="form.bTime"
                    type="date"
                    :clearable="false"
                    prefix-icon="el-icon-date"
                    placeholder="开始时间"
                    :picker-options="startTime"
                  ></el-date-picker>
                  <span
                    style="diaplay: inline-block; width: 12px; color: #448dd5"
                    >—</span
                  >
                  <el-date-picker
                    class="datepicker"
                    v-model="form.eTime"
                    type="date"
                    :clearable="false"
                    prefix-icon="el-icon-date"
                    placeholder="结束时间"
                    :picker-options="endTime"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
            </el-row>
          </div>
          <el-row :gutter="5">
            <el-form-item label="区域选择:">
              <el-col :span="3">
                <el-form-item prop="provinceId">
                  <el-select
                    style=""
                    v-model="form.provinceId"
                    @change="handleProvinceChange"
                    placeholder="请选择省"
                  >
                    <el-option
                      v-for="item in province"
                      :key="item.domainName"
                      :label="item.domainName"
                      :value="item.rowId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item prop="cityId">
                  <el-select
                    v-model="form.cityId"
                    @change="handleCityChange"
                    placeholder="请选择市"
                  >
                    <el-option
                      v-for="item in city"
                      :key="item.domainName"
                      :label="item.domainName"
                      :value="item.rowId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item prop="countryId">
                  <el-select
                    style=""
                    v-model="form.countryId"
                    @change="handleCountryChange"
                    placeholder="请选择县"
                  >
                    <el-option
                      v-for="item in country"
                      :key="item.domainName"
                      :label="item.domainName"
                      :value="item.rowId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item prop="townId">
                  <el-select
                    style=""
                    v-model="form.townId"
                    placeholder="请选择街道/镇"
                  >
                    <el-option
                      v-for="item in street"
                      :key="item.domainName"
                      :label="item.domainName"
                      :value="item.rowId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="跨区属性:">
                  <el-radio-group v-model="form.crossSta">
                    <el-radio label="1">省</el-radio>
                    <el-radio label="2">市</el-radio>
                    <el-radio label="3">区县</el-radio>
                    <el-radio label="4">乡镇</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-button
                  v-if="btnPermis.btnView"
                  type="primary"
                  class="shadow-btn"
                  plain
                  round
                  @click="handleClick('search')"
                  >查询
                </el-button>
              </el-col>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div class="my-table">
        <div
          class="tableTool"
          @click="handleClick('export')"
          v-if="btnPermis.btnExport"
        >
          <img src="img/table_tool3.png" alt="" />
          <span>报表导出</span>
        </div>
        <el-table
          :data="tableData"
          v-loading="loading"
          element-loading-background="rgba(0, 0, 0, 0.1)"
          style="width: 100%"
          height="100%"
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
            width="120"
            fixed="left"
            :index="indexMethod"
          >
          </el-table-column>
          <el-table-column
            v-for="item in columns"
            :key="item.label"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
          >
          </el-table-column>
        </el-table>
      </div>
    </basic-container>
    <!-- <myPagination
          style="margin-top: 32px"
          :currentPage="page.currentPage"
          :pageSize="page.pageSize"
          :total="page.total"
        /> -->
  </div>
</template>

<script>
import { selectProvince } from "@/api/working/index";
import titleBox from "_com/contenBox/titleBox.vue";
import myPagination from "_com/myPagination/index";
import {
  queryRegionBigData,
  exportRegionBigData,
} from "_api/report/dataAnalysis";
import { dateFormat, handBlobDown, filterDict } from "@/util/util";
import { getRegionInfoByLevel } from "@/api/basic/resources";
import { mapGetters } from "vuex";

export default {
  components: {
    titleBox,
    myPagination,
  },
  data() {
    return {
      searchForm: {},
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        { prop: "province", label: "省" },
        { prop: "city", label: "市" },
        { prop: "country", label: "区县" },
        { prop: "town", label: "乡镇" },
        { prop: "checkedpass", label: "本区域作业面积信息" },
        { prop: "groupArea", label: "本地农机总体作业面积信息" },
        { prop: "groupRegionArea", label: "本地农机在本地作业面积信息" },
        { prop: "groupOutRegionArea", label: "本地农机跨区作业面积信息" },
        { prop: "nonlocalHereArea", label: "外地农机在本区域作业面积信息" },
      ],
      province: [], // 省
      city: [], // 市
      country: [], // 县
      street: [], // 街道
      tableData: [],
      selection: [], // 选择的数据
      dialogTitle: "新增分组",
      form: {
        bTime: new Date(
          new Date(new Date().setMonth(0, 1)).setHours(0, 0, 0, 0)
        ),
        eTime: new Date(
          new Date(new Date().setMonth(11, 31)).setHours(23, 59, 59, 999)
        ),
        provinceId: "全部",
        cityId: "全部",
        countryId: "全部",
        townId: "全部",
        province: 0,
        city: "",
        country: "",
        town: "",
        crossSta: "1",
      },
      startTime: {
        disabledDate: (time) => {
          let endDateVal = this.form.eTime;
          if (endDateVal) {
            //小于结束时间
            return time > new Date(endDateVal);
          }
        },
        cellClassName: () => {},
      },
      endTime: {
        disabledDate: (time) => {
          let startDateVal = this.form.bTime;
          if (startDateVal) {
            return time < new Date(startDateVal);
          }
        },
        cellClassName: () => {},
      },
      btnPermis: {
        //按钮权限
        btnView: true,
        btnExport: true,
      },
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["permissions",'globalSetting']),
    provinceName() {
      return filterDict(
        this.form.provinceId,
        { labelKey: "domainName", valueKey: "rowId" },
        this.province
      );
    },
    cityName() {
      return filterDict(
        this.form.cityId,
        { labelKey: "domainName", valueKey: "rowId" },
        this.city
      );
    },
    countryName() {
      return filterDict(
        this.form.countryId,
        { labelKey: "domainName", valueKey: "rowId" },
        this.country
      );
    },
    townName() {
      return filterDict(
        this.form.townId,
        { labelKey: "domainName", valueKey: "rowId" },
        this.street
      );
    },
  },
  watch: {
    "globalSetting.bTime": {
      handler(newVal, oldVal) {
        this.form.bTime = newVal;
      },
      immediate: true,
    },
    "globalSetting.eTime": {
      handler(newVal, oldVal) {
        this.form.eTime = newVal;
      },
      immediate: true,
    },
    
  },
  created() {
    this.initAreaSelect()
    this.getBtnPermis();
  },
  methods: {
    open() {
      this.setGroupBoxStatus(true);
    },
    getBtnPermis() {
      this.btnPermis.btnView =
        this.permissions[window.global.buttonPremission.regionBigDateView];
      this.btnPermis.btnExport =
        this.permissions[window.global.buttonPremission.regionBigDateExport];
      //console.log("this.btnPermis", this.btnPermis);
    },
    //初始化默认选项
    initAreaSelect(){
      this.initProvince()
      this.initProvince(-1, "city")
      this.initProvince(-1, "country")
      this.initProvince(-1, "street")
    },
    // 省数据选择
    handleProvinceChange(val) {
      this.initProvince(val, "city");
      this.form.cityId = "";
      this.form.countryId = "";
      this.form.townId = "";
      this.country =[]
      this.street =[]
    },
    handleCityChange(val) {
      this.initProvince(val, "country");
      this.form.countryId = "";
      this.form.townId = "";
      this.street =[]
    },
    handleCountryChange(val) {
      this.initProvince(val, "street");
      this.form.townId = "";
    },
    async initProvince(id = 0, t = "province") {
      let params = {
        groupPId: id,
      };
      let res = await selectProvince(params);
      const { code, data } = res;
      if (code == 0) {
        this[t] = data;
      } else {
        this.$message.error(res.msg);
      }
    },
    //查询数据
    async initData() {
      this.loading = true;
      let res = await queryRegionBigData({
        provinceId: this.form.provinceId,
        cityId: this.form.cityId,
        countryId: this.form.countryId,
        townId: this.form.townId,
        provinceName: this.provinceName,
        cityName: this.cityName,
        countryName: this.countryName,
        townName: this.townName,
        crossSta: this.form.crossSta,
        bTime: dateFormat(this.form.bTime),
        eTime: dateFormat(this.form.eTime),
        jobType:this.globalSetting.jobType
      });
      this.loading = false;
      if (!res.code) {
        this.tableData = res.data;
      }
    },
    async exportReport() {
      this.loading = true
      let res = await exportRegionBigData({
        provinceId: this.form.provinceId,
        cityId: this.form.cityId,
        countryId: this.form.countryId,
        townId: this.form.townId,
        provinceName: this.provinceName,
        cityName: this.cityName,
        countryName: this.countryName,
        townName: this.townName,
        crossSta: this.form.crossSta,
        bTime: dateFormat(this.form.bTime),
        eTime: dateFormat(this.form.eTime),
        jobType:this.globalSetting.jobType
      });
      if (res.data.success) {
        let obj = res.data.obj;
        let title = "区域大数据报表.xls";
        let url =
          window.globalUrl.HOME_API + "agri-web/rp/statistics/downloadExcel";
        handBlobDown(url, obj, title);
      } else {
        this.$message.error(res.data.msg || "导出失败");
      }
      this.loading = false
    },
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    //点击事件
    handleClick(param) {
      if (param == "search") {
        this.page.currentPage = 1;
        this.initData();
      } else if (param == "export") {
        this.exportReport();
      }
    },
    //处理序号问题
    indexMethod(index) {
      return (this.page.currentPage - 1) * this.page.pageSize + index + 1;
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.opreationSeason {
  .basic-con {
    .my-form {
      .formItem {
        width: 100%;
        display: flex;

        .el-form-item {
          margin-right: 15px;
          margin-bottom: 10px;
          width: 305px;
          // /deep/ .el-form-item__label {
          //   padding: 0;
          // }
          .el-input,
          .el-select {
            width: 215px;
          }
        }

        .item-data {
          width: 560px;
        }
      }
    }

    .my-table {
      .tableTool {
        display: flex;
        align-items: center;
        color: #aac2d6;
        font-size: 14px;
        cursor: pointer;
        float: right;
        margin-bottom: 10px;
        // margin-top: 5px;
        // position: absolute;
        img {
          margin-right: 5px;
        }
      }

      margin-top: 20px;
      height: calc(100% - 195px);

      /deep/ .el-table {
        height: calc(100% - 54px);
      }
    }
  }

  .searchline {
    border-bottom: 1px solid #133460;
    margin-bottom: 5px;
  }
}
</style>