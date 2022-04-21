<template>
  <div class="pagination">   
      <!-- :hide-on-single-page="true" -->
    <el-pagination
      :current-page.sync="currentPage"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      layout="sizes, prev, slot, next, total"
      :total="total"
      @size-change="handleSizeChange"
      @prev-click="handleCurrentChange"
      @next-click="handleCurrentChange">
      <template>
        <div class="pager">
          <el-input-number
            style="width:40px;height:26px;background:transparent;" 
            :controls="false"
            :min="1"
            v-model="currentPage" 
            @blur="handleCurrentChange(currentPage)"
            @keyup.enter="handleCurrentChange(currentPage)"></el-input-number>
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
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default: () => [10,20,50,100,200]
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      current: 1
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit('current-change', val)
    },
    handleSizeChange(val) {
      this.$emit('size-change', val)
    }
  }
}
</script>

<style lang="less" scoped>
.pagination {
  /deep/ .el-pagination .btn-next, /deep/ .el-pagination .btn-prev {
    // background: @base-darkBlue;
    background: transparent;
    padding-right: 0;
    padding-left: 0;
  }
  /deep/ .el-pagination button{
    width: 30px;
    height: 26px;
    min-width: 30px;
    border: solid 1px #356e97;
  }
  /deep/ .el-pagination button:disabled{
    // background: @base-darkBlue;
    background: transparent;
    color: #303133;
    border: solid 1px rgba(53, 110, 151,.4);
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
    margin-right: 0;
    margin-left: 12px;
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
  /deep/ .el-pagination .btn-next, /deep/ .el-pagination .btn-prev {
    color: #C0C4CC;
  }
  .pager {
    color: @base-fontColor;
    font-weight: normal;
    font-size: 14px;
    margin: 0 6px;
    display: inline-block;
     /deep/ .el-input__inner {
      height: 26px;
      padding: 0;
    }
  }

}
</style>