<template>
  <!-- 农机作业类型统计报表 -->
  <div class="app-container opreationSeason">
    <titleBox :headName="'农机作业类型统计报表'" />
    <basic-container class="basic-con">
      <div class="searchline">
      <el-form class="my-form" label-position="right" label-width="85px" :model="form">
        <div class="formItem">
          <el-form-item label="农机分组: ">
            <el-select v-model="model" placeholder="">
              <el-option>全部</el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="item-data" label="起止时间: ">
            <el-date-picker
              class="datepicker"
              v-model="form.queryStartTime"
              type="datetime"
              :clearable="false"
              prefix-icon="el-icon-date"
              placeholder="开始时间"
            ></el-date-picker>
            <span style="diaplay:inline-block;width:12px; color: #448dd5"> — </span>
            <el-date-picker
              class="datepicker"
              v-model="form.queryEndTime"
              type="datetime"
              :clearable="false"
              prefix-icon="el-icon-date"
              placeholder="结束时间"
            ></el-date-picker>
          </el-form-item>
                  <el-button type="primary" class="shadow-btn" plain round
            >查询</el-button>               
          <div class="tableTool" @click="handleClick('export')">
            <img src="img/table_tool3.png" alt="" />
            <span>报表导出</span>
          </div>
        </div>   
        </el-form>
      </div>
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
            width="55"
            fixed="left"
          >
          </el-table-column>
          <el-table-column type="index" label="序号" width="120" fixed="left">
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
    <myPagination
      style="margin-top: 32px"
      :currentPage="page.currentPage"
      :pageSize="page.pageSize"
      :total="page.total"
      @current-change="currentChange"
    />
  </div>
</template>

<script>
import titleBox from "_com/contenBox/titleBox.vue";
import myPagination from "_com/myPagination/index";

export default {
  name: "department",

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
        total: 100,
      },
      columns: [
        { prop: "sesonName", label: "村(组)名称" },
        { prop: "groupName", label: "车主姓名" },
        { prop: "type", label: "车主电话" },
        { prop: "startTime", label: "作业车辆" },
        { prop: "sesonName", label: "作业面积(亩)" },
        { prop: "sesonName", label: "合格面积(亩)" },
        { prop: "sesonName", label: "作业类型" },
        { prop: "sesonName", label: "机具类型" },
        { prop: "sesonName", label: "作业深度(公分) " },
      ],
      tableData: [
        {
          sesonName: "2021油菜直播",
          groupName: "荆州市",
          type: 11,
          startTime: 123,
          endTime: 33,
        },
        {
          sesonName: "2021油菜直播",
          groupName: "荆州市",
          type: 11,
          startTime: 123,
          endTime: 33,
        },
        {
          sesonName: "2021油菜直播",
          groupName: "荆州市",
          type: 11,
          startTime: 123,
          endTime: 33,
        },
        {
          sesonName: "2021油菜直播",
          groupName: "荆州市",
          type: 11,
          startTime: 123,
          endTime: 33,
        },
      ],
      selection: [], // 选择的数据
      dialogVisible: false,
      dialogTitle: "新增分组",
      form: {},
      model: "",
      showMaps: false,
      editTitle: "",
      echartType:true,

    };
  },
  methods: {
    initData() {},
    // 查询
    searchChange() {},
    // 选择事件
    handleSelectChange(selection) {
      this.selection = selection;
    },
    currentChange() {},
  },
  mounted() {
  },
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
        /deep/ .el-form-item__label {
          padding: 0;
        }
        .el-input, .el-select {
          width: 215px;
        }
      }
      .item-data {
        width: 560px;
      }
    }
  }

    .my-table {
      margin-top: 20px;
      height: calc(100% - 81px);

      /deep/ .el-table {
        height: calc(100% - 54px);
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
      position: absolute;
      right: 45px;
      height: 36px;
      img {
        margin-right: 5px;
      }
    }
  }

}
</style>