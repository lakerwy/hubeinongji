<template>
  <div class="pagination">
    <!-- :hide-on-single-page="true" -->
    <el-pagination
      :background="true"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :page-sizes="pageSizes"
      :pager-count="pagerCount"
      :layout="Layout"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <template>
        <div class="pager">
          <el-input-number
            style="width: 40px; height: 26px; background: transparent"
            :controls="false"
            :min="1"
            v-model="currentPage"
            @blur="handleCurrentChange(currentPage)"
            @keyup.enter.native="handleCurrentChange(currentPage)"
          ></el-input-number>
        </div>
      </template>
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 1,
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100, 200],
    },
    total: {
      type: Number,
      default: 0,
    },
    pagerCount: {
      type: Number,
      default: 5,
    },
    Layout: {
      type: String,
      default: "sizes, prev, pager, next, jumper, ->, total",
    },
  },
  data() {
    return {
      page_current: this.currentPage,
      page_size: this.pageSize,
      page_sizes: this.pageSizes,
      page_total: this.total,
      pager_count:this.pagerCount,
      page_layout:this.Layout
    };
  },
  watch: {
    currentPage(){
      this.page_current =  this.currentPage
    },
    pageSize(){
      this.page_size =  this.pageSize
    },
    pageSizes(){
      this.page_sizes =  this.pageSizes
    },
    total(){
      this.page_total =  this.total
    },
    Layout(){
      this.page_layout =  this.Layout
    },
    pagerCount(){
      this.pager_count =  this.pagerCount
    },

  },
  methods: {
    handleCurrentChange(val) {
      this.$emit("current-change", val);
    },
    handleSizeChange(val) {
      this.$emit("size-change", val);
    },
  },
};
</script>

<style lang="less" scoped>
.pagination {
  font-size: 15px;

  /deep/ .el-pagination .btn-next,
  /deep/ .el-pagination .btn-prev {
    background: transparent;
    padding-right: 0;
    padding-left: 0;
  }
  /deep/ .el-pagination button {
    width: 30px;
    height: 26px;
    min-width: 30px;
    border: solid 1px #356e97;
  }
  /deep/ .el-pagination button:disabled {
    background: transparent;
    color: #303133;
    border: solid 1px rgba(53, 110, 151, 0.4);
  }
  /deep/ .el-input__inner {
    background: transparent;
    border: solid 1px #356e97;
    border-radius: 0;
    color: @base-fontColor;
  }
  /deep/ .el-input-number {
    line-height: 26px;
    /deep/ .el-input {
      height: 100%;
    }
  }
  /deep/ .el-pagination__total {
    color: @base-fontColor;
    // margin-right: 12px;
    margin-right: 40px;
    margin-left: 12px;
    font-size: 15px;
  }
  /deep/ .el-pagination {
    padding: 2px 0;
  }
  /deep/ .el-pagination .el-select .el-input {
    margin-left: 0;
  }
  /deep/ .el-pagination .el-select .el-input .el-input__inner {
    padding-right: 16px;
    padding-left: 0;
  }
  /deep/ .el-input__icon {
    width: 20px;
  }
  /deep/ .el-select .el-input {
    width: 70px;
    height: 26px;
    line-height: 26px;
    /deep/ .el-input__inner {
      height: 26px;
      min-height: 26px;
    }
  }
  /deep/ .el-input--mini .el-input__inner {
    height: 26px;
    min-height: 26px;
  }
  /deep/ .el-pagination .btn-next,
  /deep/ .el-pagination .btn-prev {
    color: #c0c4cc;
  }

  // pbw修改按钮样式
  /deep/ .el-pager li {
    background-color: rgba(0, 0, 0, 0);
    color: #c0c4cc;
  }
  /deep/ .el-pager li:not(.disabled).active {
    background-color: #0a9091;
    color: #fff;
  }
  /deep/ .el-pagination__jump {
    color: #c0c4cc;
  }

  .pager {
    color: @base-fontColor;
    font-weight: normal;
    font-size: 15px;
    margin: 0 6px;
    display: inline-block;
    /deep/ .el-input__inner {
      height: 26px;
      padding: 0;
    }
  }
}
</style>