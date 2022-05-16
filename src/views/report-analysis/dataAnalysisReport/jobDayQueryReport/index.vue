<template>
  <!-- 作业日查询报表 -->
  <div class="app-container opreationSeason">
    <titleBox :headName="'作业日查询报表'" />
    <basic-container class="basic-con">
      <div class="searchline">
        <el-form
          ref="form"
          class="my-form"
          :model="form"
          label-width="85px"
          :inline="true"
        >
          <el-form-item label="选择农机: ">
            <el-input
              v-model="groupData.name"
              placeholder="请选择农机"
              @focus="open"
            ></el-input>
          </el-form-item>
          <el-form-item label="选择时间:	">
            <el-date-picker
              class="datepicker"
              v-model="form.jobTime"
              type="date"
              value-format="yyyy-MM-dd"
              :clearable="false"
              prefix-icon="el-icon-date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              @focus="showPanel"
            ></el-date-picker>
          </el-form-item>
          <el-button
            type="primary"
            class="shadow-btn"
            plain
            round
            @click="handleClick('search')"
            v-if="btnPermis.btnView"
            >查询</el-button
          >
          <el-button
            type="primary"
            class="shadow-btn"
            plain
            round
            @click="handleClick('print')"
            v-if="btnPermis.btnView"
            >打印</el-button
          >
          <div
            class="tableTool"
            @click="handleClick('export')"
            v-if="btnPermis.btnExport"
          >
            <img src="img/table_tool3.png" alt="" />
            <span>报表导出</span>
          </div>
        </el-form>
      </div>

      <div ref="total" class="descip-container">
        <div class="content">
            <div class="header" :class="{'no-print':isPrintDay}">
              <h2 class="title">{{ "农机作业日报表" + form.jobTime }}</h2>
              <div class="subtitle">
                <div>机主：{{ discripData.machineInfo.driverName }}</div>
                <div>报表产生时间：{{ discripData.machineInfo.nowTime }}</div>
              </div>
            </div>
            <el-descriptions
              class="my-descrip"
              title="作业农机信息"
              :column="3"
              border
              :class="{'no-print':isPrintDay}"
            >
              <el-descriptions-item label="车牌号码">{{
                discripData.machineInfo.plateNumber
              }}</el-descriptions-item>
              <el-descriptions-item label="农机型号">{{
                discripData.machineInfo.machineTypeName
              }}</el-descriptions-item>
              <el-descriptions-item label="农机具型号">{{
                discripData.machineInfo.toolTypeName
              }}</el-descriptions-item>
              <el-descriptions-item label="车主电话">{{
                discripData.machineInfo.driverPhone
              }}</el-descriptions-item>
              <el-descriptions-item label="终端型号" :span="2">{{
                discripData.machineInfo.terminalModel
              }}</el-descriptions-item>
              <el-descriptions-item label="生产厂商">{{
                discripData.machineInfo.manufacturer
              }}</el-descriptions-item>
              <el-descriptions-item label="所属单位">{{
                discripData.machineInfo.driverAddress
              }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions
              class="my-descrip"
              title="作业信息"
              code
              :column="3"
              border
              :class="{'no-print':isPrintDay}"
            >
              <el-descriptions-item label="今日作业面积(亩)">{{
                discripData.jobInfo.computeAreaSum
              }}</el-descriptions-item>
              <el-descriptions-item label="今日合格面积(亩)">{{
                discripData.jobInfo.computeAreaCheckedSum
              }}</el-descriptions-item>
              <el-descriptions-item label="今日面积达标比">{{
                discripData.jobInfo.rate
              }}</el-descriptions-item>
              <el-descriptions-item label="今日平均深度(厘米)">{{
                discripData.jobInfo.avgAll
              }}</el-descriptions-item>
              <el-descriptions-item label="最小平均深度(厘米)">{{
                discripData.jobInfo.minAvg
              }}</el-descriptions-item>
              <el-descriptions-item label="最大平均深度(厘米)">{{
                discripData.jobInfo.maxAvg
              }}</el-descriptions-item>
              <el-descriptions-item label="总作业面积(亩)">{{
                discripData.jobInfo.allAreaSum
              }}</el-descriptions-item>
              <el-descriptions-item label="总合格面积(亩)" :span="2">{{
                discripData.jobInfo.allAreaCheckedSum
              }}</el-descriptions-item>
              <el-descriptions-item label="作业类型	">{{
                discripData.jobInfo.jobTypeName
              }}</el-descriptions-item>
              <el-descriptions-item label="今日起始地址	">{{
                discripData.jobInfo.beginAddress
              }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions
              class="my-descrip"
              title="作业地块"
              :column="2"
              border
              :class="{'no-print':isPrintDay}"
            >
            </el-descriptions>
            <div class="map-container">
              <my-map
                ref="mapCom"
                class="mapCom"
                style="width: 100%; height: 100%"
                id="map-container"
              >
                <MyMapVectorJson
                  ref="geo"
                  :dataSource="dataSource"
                  :styles="styles"
                  :hoverStyles="hoverStyles"
                  @click="mapItemClick"
                >
                  <!-- :styles="trackStyle" -->
                </MyMapVectorJson>
                <MyMapPopup ref="popup">
                  <Pop :popValue="popValue"></Pop>
                </MyMapPopup>
              </my-map>
            </div>
            <div class="img-container" :class="{'no-print':isPrintDay}">
              <img src="" alt="" id="mapCutImg" />
            </div>

          <div class="header" :class="{'no-print':isPrintDetail}"> 
            <h2 class="title">{{ "农机作业详细信息" + form.jobTime }}</h2>
            <div class="subtitle">
              <div>机主：{{ discripData.machineInfo.driverName }}</div>
              <div>报表产生时间：{{ discripData.machineInfo.nowTime }}</div>
            </div>
          </div>
          <el-descriptions
            class="my-descrip"
            title="作业信息"
            :column="3"
            border
            :class="{'no-print':isPrintDetail}"
          >
            <el-descriptions-item label="作业面积(亩)">{{
              discripData.jobInfo.computeAreaSum
            }}</el-descriptions-item>
            <el-descriptions-item label="面积达标比">{{
              discripData.jobInfo.rate
            }}</el-descriptions-item
            >my
            <el-descriptions-item label="平均深度(厘米)">{{
              discripData.jobInfo.avgAll
            }}</el-descriptions-item>
          </el-descriptions>
          <div class="my-table show-table" id="my-table" >
            <el-table
              :data="tableData"
              v-loading="loading"
              element-loading-background="rgba(0, 0, 0, 0.1)"
              @selection-change="handleSelectChange"
              @row-click="handleRowClick"
            >
              <!-- <el-table-column
                type="selection"
                label="全选"
                width="55"
                fixed="left"
              >
              </el-table-column> -->
              <el-table-column
                type="index"
                label="序号"
                width="120"
                fixed="left"
              >
              </el-table-column>
              <el-table-column
                v-for="item in columns"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
              >
              </el-table-column>
            </el-table>
          </div>
          <!-- 打印节点 隐藏 -->
          <div class="hidden-table my-table" :class="{'no-print':isPrintDetail}">
            <el-table
              :data="tableData"
              v-loading="loading"
              element-loading-background="rgba(0, 0, 0, 0.1)"
              @selection-change="handleSelectChange"
            >
              <!-- <el-table-column
                type="selection"
                label="全选"
                width="55"
                fixed="left"
              >
              </el-table-column> -->
              <el-table-column
                type="index"
                label="序号"
                width="120"
              >
              </el-table-column>
              <el-table-column
                v-for="item in columns"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
              >
              </el-table-column>
            </el-table>
          </div>
          <div id="hiddenPrintTable"></div>
          <div class="imgs" :class="{'no-print':isPrintImgs}">
            <el-checkbox-group v-model="photoSelect">
              <el-checkbox
                v-for="item in photoList"
                :key="item.name"
                :label="item.name"
              >
                <div>
                  <img :src="item.src" alt="" />
                  <div>{{ item.name }}</div>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </basic-container>
    <printAreaSelect ref="printSelect" @print="print" />
  </div>

</template>

<script>
import titleBox from "_com/contenBox/titleBox.vue";
import myPagination from "_com/myPagination/index";
import { mapGetters, mapMutations } from "vuex";
import { dateFormat, handBlobDown } from "../../../../util/util";
import MyMap from "@map/components/my-map/Map";
import Track from "@map/js/animation/track";
import {
  queryjobDate,
  exportjobDate,
  selectAreaDate,
} from "_api/report/dataAnalysis";
import MyMapVectorJson from "@map/components/my-map-vector/Json";
import MyMapPopup from "@map/components/my-map-overlay/Popup";
import Pop from "./Pop";
import center from "@turf/center";
import html2canvas from "html2canvas";
import printAreaSelect from '@/views/report-analysis/dataAnalysisReport/jobDayQueryReport/printAreaSelect'

export default {
  components: {
    titleBox,
    myPagination,
    MyMapVectorJson,
    MyMap,
    MyMapPopup,
    Pop,
    printAreaSelect,
  },
  data() {
    return {
      selection: [], // 选择的数据
      valuableDate: [],
      queryMonth: "", // 作为月份查询使用，处理panelCurrentData获取
      form: {
        jobTime: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()}`,
      },
      // printParam :5,
      isPrintDay:true,
      isPrintDetail:true,
      isPrintImgs:true,
      discripData: {
        machineInfo: {},
        jobInfo: {},
      },
      isIndeterminate: true,
      checkAll:true,
      pickerOptions: {
        cellClassName: (time) => {
          // //console.log(
          //   `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
          // );
          if (
            this.valuableDate.indexOf(
              `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
            ) != -1
          ) {
            return "valuable";
          }
        },
      },
      columns: [
        { prop: "computeArea", label: "作业面积(亩)",  },
        { prop: "jobTypeName", label: "作业类型",  },
        { prop: "depthRate", label: "深度达标比",  },
        { prop: "avgDepth", label: "平均深度(厘米)",  },
        { prop: "jobStartTime", label: "开始时间",  },
        { prop: "jobEndTime", label: "结束时间",  },
        { prop: "lon", label: "经度",  },
        { prop: "lat", label: "纬度",  },
        { prop: "address", label: "位置",  },
      ],
      tableData: [],
      btnPermis: {
        //按钮权限
        btnView: true,
        btnExport: true,
      },
      photoList: [],
      photoSelect: [],
      loading: false,
      popValue: {},
      dataSource: {
        type: "1", // List
        data: [],
        geometryKey: "geometryType",
      },
      styles: (feature, resolution) => {
        let id = feature.get("id").toString();
        return {
          fill: { color: "rgba(255,0,0,0.8)" },
          stroke: {
            width: 2,
            color: "rgba(240,240,240,0.8)",
          },
          text: {
            text: id,
            font: "24px Calibri,sans-serif",
            fill: {
              color: "#FFF",
            },
            stroke: {
              color: "red",
              width: 3,
            },
          },
        };
      },
      hoverStyles: (feature, resolution) => {
        let id = feature.get("id").toString();
        return {
          fill: { color: "rgba(255,0,0,0.8)" },
          stroke: {
            width: 2,
            color: "rgba(20,240,240,0.8)",
          },
          text: {
            text: id,
            font: "24px Calibri,sans-serif",
            fill: {
              color: "#FFF",
            },
            stroke: {
              color: "red",
              width: 3,
            },
          },
        };
      },
    };
  },
  computed: {
    ...mapGetters(["groupData", "permissions", "globalSetting"]),
  },
  watch: {
    queryMonth: function (newV) {
      //console.log(newV, "date");
      this.queryValuableDate();
    },
  },
  created() {
    // this.$refs.mapCom.map.addZoom()
    this.setGroupBoxType(2);
    this.getBtnPermis();
  },
  mounted() {
    //添加放大缩小控件
    this.$refs.mapCom.map.addZoom();
  },
  methods: {
    ...mapMutations({
      setGroupBoxStatus: "setGroupBoxStatus",
      setGroupBoxType: "setGroupBoxType",
      // setGroupCheckBox: 'setGroupCheckBox',
    }),
    // 打开农机分组框
    open() {
      // this.setGroupCheckBox(true);
      this.setGroupBoxStatus(true);
    },
    getBtnPermis() {
      this.btnPermis.btnView =
        this.permissions[window.global.buttonPremission.jobDayQueryReportView];
      this.btnPermis.btnExport =
        this.permissions[
          window.global.buttonPremission.jobDayQueryReportExport
        ];
      //console.log("this.btnPermis", this.btnPermis);
    },
    handleSelectChange(selection) {
      this.selection = selection;
    },
    //请求数据
    async initData() {
      this.loading = true;
      let res = await queryjobDate({
        machineId: this.groupData.ids[0],
        jobTime: this.form.jobTime,
        jobType:this.globalSetting.jobType,
        bTimeEx: this.globalSetting.bTime,
        eTimeEx: this.globalSetting.eTime,
      });
      this.loading = false;
      if (!res.code) {
        this.discripData = res.data;
        this.tableData = res.data.jobInfoDetail;
        if (res.data.photoList) {
          res.data.photoList.forEach((item) => {
            item.src = `${res.data.ftpUrlPre}${item.address}`;
            item.name = `车牌:${this.discripData.machineInfo.plateNumber},时间：${item.time},经度：${item.lon},纬度：${item.lat}`;
          });
          this.photoList = res.data.photoList;
        }
        if (res.data.jobInfoDetail.length != 0) {
          //模拟取到数据之后的操作
          // let res = this.testData
          let arr = []
          res.data.jobInfoDetail.forEach((item, index) => {
            let obj = {
              id: index + 1,
              geometryType: "LineString",
              coordinates: JSON.parse(item.machineTrace).paths[0],
              prop: item,
            };
            arr.push(obj)
          });
          this.dataSource = {
              type: "1", // List
              data: arr,
              geometryKey: "geometryType",
            },
          this.$refs.mapCom.map.home({
            zoom: 17,
            center: [res.data.jobInfoDetail[0].lon, res.data.jobInfoDetail[0].lat],
          });
        }
      }
    },
    //导出
    async exportExcel() {
      this.loading = true
      let res = await exportjobDate({
        machineId: this.groupData.ids[0],
        jobTime: this.form.jobTime,
        jobType:this.globalSetting.jobType,
        bTimeEx: this.globalSetting.bTime,
        eTimeEx: this.globalSetting.eTime,
      });
      if (res.data.success) {
        let obj = res.data.obj;
        let title = "作业日查询报表.xls";
        let url =
          window.globalUrl.HOME_API + "agri-web/rp/statistics/downloadExcel";
        handBlobDown(url, obj, title);
      } else {
        this.$message.error(res.data.msg || "导出失败");
      }
      this.loading = false
    },
    print(val) {
      switch(val){
        case 1:
          this.isPrintDay = false
          break
        case 2:
          this.isPrintDetail = false
          break
        case 3:
          this.isPrintDetail = false
          this.isPrintDay = false
          break
        case 4 :  
          this.isPrintImgs = false
          break
        case 5 :
          this.isPrintImgs = false
          this.isPrintDetail = false
          this.isPrintDay = false
      }
      //打印地图
        let map = this.$refs.mapCom.map;
        map.once("rendercomplete", function () {
        const mapCanvas = document.createElement("canvas");
        const size = map.getSize();
        mapCanvas.width = 1095;
        mapCanvas.height = size[1];
        const mapContext = mapCanvas.getContext("2d");
        Array.prototype.forEach.call(
          document.querySelectorAll(".ol-layer canvas"),
          function (canvas) {
            if (canvas.width > 0) {
              const opacity = canvas.parentNode.style.opacity;
              mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
              const transform = canvas.style.transform;
              // Get the transform parameters from the style's transform matrix
              const matrix = transform
                .match(/^matrix\(([^\(]*)\)$/)[1]
                .split(",")
                .map(Number);
              // Apply the transform to the export map context
              CanvasRenderingContext2D.prototype.setTransform.apply(
                mapContext,
                matrix
              );
              mapContext.drawImage(canvas, 0, 0);
            }
          }
        );
        let url = mapCanvas.toDataURL();
        this.mapCutImg = url;
        document.getElementById("mapCutImg").src = url;
      });
      map.renderSync();
      let that = this;
      setTimeout(() => {
        that.$print(this.$refs.total);
        that.isPrintDetail = true
        that.isPrintDay = true
        that.isPrintImgs = true
      }, 1);
      
    },
    //检查请求参数是否合法
    check() {
      if (this.groupData.ids.length === 1) {
        return true;
      } else {
        this.$message("请选择农机");
        return false;
      }
    },
    //处理点击事件
    handleClick(param) {
      if (this.check()) {
        if (param == "search") {
          this.initData();
        } else if (param == "export") {
          this.exportExcel();
        } else if (param == "print") {
          this.$refs.printSelect.dialogVisible = true
        }
      }
    },
    //根据月份请求日历上有值得日期
    async queryValuableDate() {
      let res = await selectAreaDate({
        month: this.queryMonth,
        machineId: this.groupData.ids[0],
        jobType: this.globalSetting.jobType,
      });
      if (!res.code) {
        let arr = [];
        res.data.forEach((item) => {
          arr.push(item.date.split(",").join("-"));
        });
        this.valuableDate = arr;
      }
    },
    // 通过头部label获取当前年月，并监听变化
    handleQueryMonth() {
      this.$nextTick(() => {
        let year = document.getElementsByClassName(
          "el-date-picker__header-label"
        )[0].innerHTML;
        let month = document.getElementsByClassName(
          "el-date-picker__header-label"
        )[1].innerHTML;
        this.queryMonth = year.split(" ")[0] + "-" + month.split(" ")[0];
      });
    },
    // 日期组件获取焦点事件
    showPanel() {
      // 打开调用一次
      this.handleQueryMonth();
      this.$nextTick(() => {
        // 前一月点击事件
        let prevBtn = document.querySelector(
          ".el-date-picker__header .el-icon-arrow-left"
        );
        prevBtn.addEventListener("click", this.handleQueryMonth);

        // 前一年点击事件
        let prevYearBtn = document.querySelector(
          ".el-date-picker__header .el-icon-d-arrow-left"
        );
        prevYearBtn.addEventListener("click", this.handleQueryMonth);

        // 后一月点击事件
        let nextBtn = document.querySelector(
          ".el-date-picker__header .el-icon-arrow-right"
        );
        nextBtn.addEventListener("click", this.handleQueryMonth);

        // 后一年点击事件
        let nextYearBtn = document.querySelector(
          ".el-date-picker__header .el-icon-d-arrow-right"
        );
        nextYearBtn.addEventListener("click", this.handleQueryMonth);

        // 月份点击事件
        let monthBtn = document.querySelector(
          ".el-picker-panel__content .el-month-table"
        );
        monthBtn.addEventListener("click", this.handleQueryMonth);

        // 年份点击事件
        let yearBtn = document.querySelector(
          ".el-picker-panel__content .el-year-table"
        );
        yearBtn.addEventListener("click", this.handleQueryMonth);
      });
    },
    mapItemClick(e, feature) {
      if (feature) {
        //console.log(feature);
        // 要素属性
        //console.log(feature.getProperties());
        // 要素输出坐标
        //console.log(feature.outGeometry.getCoordinates());
        // 传值给pop
        this.popValue = Object.assign(feature.getProperties().prop, {
          plateNumber: this.discripData.machineInfo.plateNumber,
          driveName: this.discripData.machineInfo.driverName,
        });
        this.$refs.popup.show(e.coordinate);
      }
    },  
    handleRowClick(val){
          this.$refs.mapCom.map.home({
            zoom: 17,
            center: [val.lon, val.lat],
          });
    }
  },
};
</script>

<style lang="less" scoped >
.opreationSeason {
  .basic-con {
    .my-form {
      .el-form-item {
        margin-bottom: 0;
        margin-right: 20px;
        /deep/.el-input {
          width: 215px;
        }
      }
      /deep/ .el-form-item__label {
        line-height: 36px;
      }
      .shadow-btn {
        height: 36px !important;
      }
    }
    .descip-container {
      height: calc(100% - 65px);
      overflow: scroll;
      .header {
        display: flex;
        align-items: center;
        flex-direction: column;
        color: white;
        padding-left: 2px;
        padding-right: 2px;
        .subtitle {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
      }
    }
    .content {
      height: 100%;
      padding-left: 20px;
      padding-right: 20px;
      margin-bottom: 50px;
      // border-bottom: 1px #0d4f90 solid;
      .map-container {
        // width: calc(100% - 2px);
        height: 600px;
        border: 1px solid #0d4f90;
        border-top: none;
      }
      .img-container {
        display: none;
        height: 600px;
        border: 1px solid #0d4f90;
        border-top: none;
      }
      .my-descrip:nth-child(n + 2) {
        /deep/ .el-descriptions__header {
          border-top: 1px solid #0d4f90;
        }
      }
      .my-descrip {
        // margin-bottom: 20px;
        border-left: none;
        border-right: 1px solid #0d4f90;
        /deep/ .el-descriptions__header {
          margin: 0;
          padding: 10px;
          border-left: 1px solid #0d4f90;
          background-color: rgba(4, 100, 189, 0.35);
          .el-descriptions__title {
            font-size: 14px;
            color: #1494f7;
            font-weight: normal;
            // border: none;
          }
        }
        /deep/.el-descriptions__body {
          background: transparent;
          border-bottom: 1px solid #0d4f90;
          .el-descriptions-item__label,
          .el-descriptions-item__content {
            background: transparent;
            font-size: 14px;
            color: #aac2d6;
            font-weight: normal;
            border: none;
            // border-bottom: 1px #0d4f90 solid;
            border-top: 1px #0d4f90 solid;
          }
          .el-descriptions-item__label {
            border-left: 1px solid #0d4f90;
            padding-left: 30px;
          }
          .el-descriptions-item__content {
            color: #ffffff;
          }
          .el-descriptions-item__content::before {
            height: 20px;
            width: 1px;
            content: "";
            display: inline-block;
            margin-bottom: -6px;
            align-items: center;
            background-color: #0d4f90;
            margin-right: 15px;
          }
        }
      }
      .my-table {
        border: none;
        margin-top: 20px;
        // height: calc(100% - 81px);
        /deep/ .el-table {
          height: calc(100% - 54px);
        }
      }
      .hidden-table {
        width: 1055px;
        position: absolute;
        top: -9999px;
        left: -9999px;
      }
       .show-table{
        width: 100%;
       }
      
      .imgs {
        width: 100%;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 20px;
        div {
          width: 50%;
          flex: 1;
          img {
            display: block;
            margin-left: -25px;
            margin-bottom: 5px;
          }
          margin-bottom: 10px;
        }
      }
    }
  }

  .searchline {
    padding-bottom: 18px;
    border-bottom: 1px solid #133460;
    margin-bottom: 5px;
    .tableTool {
      display: flex;
      align-items: center;
      color: #aac2d6;
      font-size: 14px;
      cursor: pointer;
      height: 36px;
      float: right;
      img {
        margin-right: 5px;
      }
    }
  }
}
@media print {
  .no-print{
    display: none !important;
  }
  .descip-container {
    // height: calc(100% - 65px);
    width: 1096px !important;
    // overflow: scroll;
    .header {
      display: flex;
      align-items: center;
      flex-direction: column;
      color: #000;
      padding-left: 2px;
      padding-right: 2px;
      .subtitle {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
    }
  }
  .content {
    height: 100%;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 50px;
    // border-bottom: 1px #0d4f90 solid;
    .map-container {
      width: calc(100% - 2px);
      height: 300px;
      border: 1px solid #0d4f90;
      // border-top: none;
      display: none;
    }
    .img-container {
      // // width: calc(100% - 2px);
      height: 300px;
      border: 1px solid #0d4f90;
      border-top: none;
      display: block;
    }
    .my-descrip:nth-child(n + 2) {
      /deep/ .el-descriptions__header {
        border-top: 1px solid #000;
      }
    }
    .my-descrip {
      // margin-bottom: 20px;
      border-left: none;
      border-right: 1px solid #000;
      /deep/ .el-descriptions__header {
        margin: 0;
        padding: 10px;
        border-left: 1px solid #000;
        background-color: rgba(4, 100, 189, 0.2);
        .el-descriptions__title {
          font-size: 14px;
          color: #000;
          font-weight: normal;
          border: none;
        }
      }
      /deep/.el-descriptions__body {
        background: transparent;
        border-bottom: 1px solid #000;
        .el-descriptions-item__label,
        .el-descriptions-item__content {
          background: transparent;
          font-size: 14px;
          color: #000;
          font-weight: normal;
          border: none;
          // border-bottom: 1px #0d4f90 solid;
          border-top: 1px #000 solid;
        }
        .el-descriptions-item__label {
          border-left: 1px solid #000;
          padding-left: 30px;
        }
        .el-descriptions-item__content {
          color: #000;
        }
        .el-descriptions-item__content::before {
          height: 20px;
          width: 1px;
          content: "";
          display: inline-block;
          margin-bottom: -6px;
          align-items: center;
          background-color: #000;
          margin-right: 15px;
        }
      }
    }
    .show-table {
      display: none;
      border: none;
    }
    .hidden-table {
      position: static;
      margin-top: 20px;
      border: none;
    }
    .my-table{
      border: 1px solid #000;
      /deep/.el-table,
      /deep/.el-table__expanded-cell {
        background-color: #fff !important;
        color: #000;
      }
      /deep/.el-table th,
      /deep/.el-table tr,
      /deep/.el-table td {
        background-color: #fff !important;
        width: 50px;
        color: #000;
        border: 1px solid #000;
        border-left: none;
      }
    }
    .hi {
      // display: none;
      width: 1095px !important;
      margin-top: 20px;
      // height: calc(100% - 81px);
      /deep/.el-table,
      /deep/.el-table__expanded-cell {
        background-color: #fff !important;
        color: #000;
      }
      /deep/.el-table th,
      /deep/.el-table tr,
      /deep/.el-table td {
        background-color: #fff !important;
        width: 50px;
        color: #000;
        
      }
    }
    /deep/.el-table__fixed {
      background: none;
    }
    .imgs {
      width: 1095px;
      // flex-direction: column;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 20px;
      div {
        width: 40%;
        flex: 1;
        img {
          display: block;
          margin-left: -25px;
          margin-bottom: 5px;
        }
        margin-bottom: 10px;
      }
      /deep/.el-checkbox-group{
        .el-checkbox{
          display: none;
        }
        .is-checked{
          display: inline !important;
          // display: none !important;
        }
      }
    }
  }
}
</style>

<style>
.valuable {
  background: rgba(12, 120, 250, 0.3) !important;
  /* color: red !important; */
  border-radius: 80%;
}
</style>  