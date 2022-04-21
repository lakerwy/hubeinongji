<template>
<!-- 列表模式 -->
  <div class="list-view">
    <div class="list-view-statics">
      <div class="statics-box"> 
        <!-- <div 
          v-for="(item,index) in staTypes" 
          :key="item.value">
          <p 
            class="sta" 
            :style="[{'color': item.color},{'textShadow': '0 0 36px ' + item.color}]">
            <span class="num">{{item.value}}</span> {{item.unit}}</p>
          <p class="type">{{item.type}}</p> -->
        <!-- </div> -->
        <div v-for="(item,index) in staTypes" :key="index" class="box" :style="{'color':item.color}">
          <div class="point">{{"●"}}</div>
          <div class="type"  :style="{'color':'#FFFFFF'}">{{item.type}}</div>
          <div class="value">{{item.value}}</div>
          <div class="unit">{{item.unit}}</div>
          </div>
      </div>
    </div>
    <div class="list-view-table">
      <div class="btns">
        <div class="btn-left">
          <el-button round type="primary" class="shadow-btn" plain @click="audit(1)">审核通过</el-button>
          <el-button round type="primary" class="shadow-btn" plain @click="audit(0)">审核不通过</el-button>
          <el-button round type="primary" class="shadow-btn" plain @click="add">补报</el-button>
          <el-button round type="primary" class="shadow-btn" plain :disabled="flag" @click="report(0)">{{flag ?  `作业上报(${current})` : '作业上报'}}</el-button>
          <el-button round type="primary" class="shadow-btn" plain :disabled="flag2" @click="report(1)">{{flag2 ?  `深度上报(${current2})` : '深度上报'}}</el-button>
        </div>
        <div class="btn-right">
          <div class="tableTool" @click="updateBantch">
            <img src="img/table_tool5.png" alt="">
            <span>批量修改</span>
          </div>
          <div class="vertical"></div>
          <div class="tableTool" @click="handleExport">
            <img src="img/table_tool2.png" alt="">
            <span>报表导出</span>
          </div>
          <div class="vertical"></div>
          <div class="tableTool" @click="handleDelete">
            <img src="img/table_tool4.png" alt="">
            <span>删除</span>
          </div>
          <!-- <div class="vertical"></div>
          <el-dropdown @command="handleCommand">
            <div class="tableTool">
              <img src="img/table_tool1.png" alt="">
              <span>更多操作 <i class="el-icon-arrow-down el-icon--right"></i></span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="a">激活</el-dropdown-item>
                <el-dropdown-item command="b">失效</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown> -->
        </div>
      </div>
      <div class="my-table">
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          border
          height="100%"
          @selection-change="handleSelectChange">
          <el-table-column
            type="selection"
            label="全选"
            width="55"
            fixed="left">
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            width="60"
            fixed="left">
          </el-table-column>
          <el-table-column
            label="操作"
            width="80"
            fixed="left">
            <template slot-scope="scope">
              <el-button class="table-btn" @click="handleAudit(scope.$index, scope.row)">审核</el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in columns"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :formatter="item.formatter"
            :show-overflow-tooltip="item.showTooltip">
            <template slot-scope="scope">
              <template v-if="item.slot">
                <span v-if="item.prop === 'auditFlag'">
                  <img 
                    style="vertical-align:middle;margin-right:9px;"
                    :src="scope.row[item.prop] == 1 ? 'img/working/success-point.png' : scope.row[item.prop] == 2 ? 'img/working/falid-point2.png' : 'img/working/default-point.png'" 
                    alt="">
                  {{scope.row[item.prop] == 1 ? '通过' : scope.row[item.prop] == 2 ? '不通过' : '未审核'}}
                </span>
              </template>
              <template v-else>
                <span>{{item.formatter ? (item.formatter)(scope.row) : scope.row[item.prop]}}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <pagination 
          style="margin-top:13px;margin-left:29px;" 
          :currentPage.sync="page.currentPage"
          :pageSize="page.pageSize"
          :pageSizes="page.pageSizes"
          :total="page.total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange" />
      </div>
    </div>

    <addDialog ref="addDialog" />
    <reportDialog :type="reportType" ref="report" />
    <updateDialog ref="update" @refreshData="initData" />
    <auditDialog 
      ref="audit" 
      :ids="selectedIds"
      @refreshData="initData" />

    <myFooter style="width:calc(100% - 45px)" />
  </div>
</template>

<script>
import pagination from '_com/myPagination/index'
import myFooter from '_com/footer/index'
import addDialog from '../dialog/addDialog'
import reportDialog from '../dialog/reportDialog'
import updateDialog from '../dialog/updateDialog'
import auditDialog from '../dialog/auditDialog'
import { mapGetters } from 'vuex'
import { updateAuditFlagStatus, queryByCondition,  getSummaryData, deleteJobArea } from '@/api/working/index'
import{ getDictByListType } from '@/api/basic/index'
import { filterDict } from '@/util/util.js'
export default {
  name: 'listView',
  components: {
    pagination,
    myFooter,
    addDialog,
    reportDialog,
    updateDialog,
    auditDialog
  },
  props: {
    query: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    query: {
      handler: function(newV) {
        if(newV) {
          this.page.currentPage = 1;
          this.initSummary();
          this.initData();
        }
      },
      // immediate: true,
      deep: true
    }
  },
  data() {
    return {
      staTypes: [
        {type: '作业面积', unit: '亩', value: '0', color: '#00deff', class: 'box1'},
        {type: '作业合格率', unit: '%', value: '0', color: '#3cfad3', class: 'box2'},
        {type: '审核通过面积', unit: '亩', value: '0', color: '#b7afff', class: 'box3'},
        {type: '审核未通过面积', unit: '亩', value: '0', color: '#f4b350', class: 'box4'},
        {type: '深度合格标准', unit: 'cm', value: '5', color: '#009cff', class: 'box5'},
      ],
      currentIndex: 0,
      page: {
        currentPage: 1,
        pageSize: 12,
        pageSizes: [12,20,30,40,50,100],
        total: 0
      },
      columns: [
        {prop: 'jobStartTime', label: '开始时间', width: '160px'},
        {prop: 'jobEndTime', label: '结束时间', width: '160px'},
        {prop: 'computeArea', label: '作业面积（亩）', width: '120px'},
        {prop: 'avgDepth', label: '平均深度'},
        {prop: 'depthRate', label: '深度合格率', width: '120px'},
        {prop: 'groupNameFullPath', label: '农机分组', width: '300px', showTooltip: true},
        {prop: 'ownerName', label: '机手姓名'},
        {prop: 'ownerPhone', label: '联系电话', width: '120px'},
        {prop: 'plateNumber', label: '农机车牌', width: '120px'},
        {prop: 'terminalCode', label: '终端编号', width: '130px'},
        {prop: 'machineType', label: '作业类型', formatter: this.typeFilter},
        {prop: 'toolType', label: '机具类型', formatter: this.toolTypeFilter},
        {prop: 'auditFlag', label: '审核状态', slot: true, width: '100px'},
        {prop: 'checkedWay', label: '审核方式', formatter: this.checkedWayFilter},
        {prop: 'auditReason', label: '审核原因', width: '150px'},
        {prop: 'address', label: '作业地址', width: '300px', showTooltip: true},
      ],
      tableData: [],
      selectedData: [], // 选择的数据
      selectedIds: '', // 选择的数据的ids
      reportType: 0, // 上报类型 0-作业上报 1-深度上报
      loading: false,
      carTypes: [], //  作业类型
      toolTypes: [],
      flag: false,
      flag2: false,
      max: 30,
      current: 30,
      decreseInterval: null,
      current2: 30,
      decreseInterval2: null
    }
  },
  computed: {
    ...mapGetters(['groupData'])
  },
  created() {
    this.initCarTypes();
    this.initToolTypes();
  },
  methods: {
    // 获取查询结果
    async initData() {
      this.tableData = [];
      this.loading = true;
      let params = Object.assign(this.query, {pageNum: this.page.currentPage, pageSize: this.page.pageSize})
      let res = await queryByCondition(params);
      const  {code, data} = res;
      if(code == 0) {
        this.loading = false;
        this.tableData = data.list;
        this.page.total = data.total;
      } else {
        this.loading = false;
      }
    },
    // 获取统计数据
    async initSummary() {
      let params = Object.assign(this.query, {pageNum: this.page.currentPage, pageSize: this.page.pageSize})
      let res = await getSummaryData(params);
      const  {code, data} = res;
      if(code == 0) {
        this.staTypes[0].value = data.done;
        this.staTypes[1].value = data.qualifiedRate;
        this.staTypes[2].value = data.approved;
        this.staTypes[3].value = data.notApproved;
      }
    },
    // 请求作业字典数据
    async initCarTypes() {
      let params = {
        listType: 'job_type'
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
    // 作业类型字典回显
    typeFilter(row) {
      return filterDict(row.machineType, { labelKey: 'itemName', valueKey: 'itemCode' }, this.carTypes)
    },
    toolTypeFilter(row) {
      return filterDict(row.toolType, { labelKey: 'itemName', valueKey: 'itemCode' }, this.toolTypes)
    },
    checkedWayFilter(row) {
      return row.checkedWay == '1' ? '手动审核' : '自动审核'
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.initData();
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.initData();
    },
    // 表格选择改变触发事件
    handleSelectChange(selection) {
      this.selectedData = selection;
      this.selectedIds = this.selectedData.map(item => {
        return item.rowId; // 行id
      }).join(',');
    },
    // 判断当前是否有选择数据
    checkData() {
      if(this.selectedData.length > 0) {
        return true;
      } else {
        this.$message({
          type: 'info',
          message: '请勾选数据'
        }); 
      }
      return false;
    },
    // 补报
    add() {
      // this.$refs.addDialog.dialogVisible = true;
      let ids = this.groupData.ids || [];
      if(ids.length == 1) {
        // 6为农机
        this.$refs.addDialog.dialogVisible = true;
      } else {
        this.$message.info('请选择具体车辆！')
      }
    },
    // 删除
    handleDelete() {
      if(this.checkData()) {
        this.$confirm('确认要删除选中的数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let params = {
            rowIdsArry: this.selectedIds
          }
          let res = await deleteJobArea(params);
          const {code, msg} = res;
          if(code == 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.initData();
          } else {
            this.$message.error(msg || '删除失败')
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    },
    // 作业上报
    report(type) {
      this.reportType = type;
      let ids = this.groupData.ids || [];
      let names = this.groupData.name && this.groupData.name.split(',') || [];
      // 根据情况选择赋值
      if(ids.length == 1) {
        this.$refs.report.form = {
          apperType: '农机上报',
        };
        this.$refs.report.dialogVisible = true;
      } else if(names.length == 1) {
        this.$refs.report.form = {
          apperType: '分组上报',
          name: this.groupData.name
        };
        this.$refs.report.dialogVisible = true;
      } else {
        this.$message.info('请选择单个分组或具体农机执行上报！')
      }
      if(this.$refs.report.dialogVisible) {
        if(type == '0') {
          this.decreseTime('current', 'flag', 'decreseInterval')
        } else {
          this.decreseTime('current2', 'flag2', 'decreseInterval2')
        }
      }
    },
    decreseTime(current, flag, interval) {
      this[current] = this.max;
      this[interval] = setInterval(() => {
        if(this[current] <= this.max && this[current] > 0) {
          this[current] --;
          this[flag] = true;
        } else if(this.current <= 0) {
          this[current] = 0
          this[flag] = false;
          clearInterval(this[interval]);
        }
      }, 1000)
    },
    // 导出
    handleExport() {

    },
    // 批量修改
    updateBantch() {
      let ids = this.groupData.ids || []; // 农机id
      let data = this.groupData.data || [];
      console.log(data, 'data')
      let attribute = [5,6,9]; // groupAttribute合作社 个人终端 农机 
      let result = data.every(item => {
        return attribute.includes(item.groupAttribute)
      })
      // 根据情况选择赋值
      if(result) {
        this.$refs.update.dialogVisible = true;
      } else {
        this.$message.info('只能选择合作社或者个人终端分组或者农机！')
      }
    },
    handleCommand() {

    },
    // 审核通过审核不通过
    audit(type) {
      if(this.checkData()) {
        this.$confirm('确认要更改这些作业信息审核状态吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          if(type === 1) {
            // 审核通过
            let params = {
              auditFlag: 1,
              ids: this.selectedIds
            }
            let res = await updateAuditFlagStatus(params);
            const {code, msg} = res;
            if(code == 0) {
              this.$message.success('审核成功')
              this.initData();
            } else {
              this.$message.error(msg);
            }
          } else if(type === 0) {
            // 不通过
            this.$refs.audit.dialogVisible = true;
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      }
    },
    // 作业审核
    handleAudit(index, row) {
      this.$emit('showMap', {index, row})
    }
  }
}
</script>

<style lang="less" scoped>
.list-view {
  padding: 0 18px 0 27px;
  height: calc(100% - 14px);
  position: relative;
  .title {
    color: #2d7de9;
    position: absolute;
    left: 0;
    top: -13px;
    font-size: 16px;
    img {
      vertical-align: sub;
      margin-right: 5px;
    }
  }
  &-statics {
    // position: relative;
    // height: 126px;
    border:1px solid #123b72 ;
    border-bottom: none;
    // background-image: url('../../../../assets/images/rect1.png');
    // background-size: 100% 100%;
    background-position: 0 0;
    background-repeat: no-repeat;
    .statics-box {
      width: 80%;
      display: flex;
      align-items: center;
      line-height: 70px;
      justify-content: space-around;
      .box {
        display: flex;
        flex-direction: row;
        align-items: baseline;
        .point{
          font-size:20px;
          margin-right: 5px;
        }
        .type{
          color:#FFF;
          font-size: 16px;
          margin-right: 16px;
        }
        .value{
          font-size: 30px;
          font-style: italic;
          margin-right: 5px;
        }
        .unit{
          font-size: 16px;
        }
      }
      

      .active {
        background-color: #04122c;
        box-shadow: inset 0px 0px 50px 0px 
          rgba(0, 134, 255, 0.7);
      }
    }
  }
  &-table {
    height: calc(100% - 133px);
    // padding: 0 15px 0 20px;
    // background-image: url('../../../../assets/images/rect2.png');
    border:1px solid #123b72;
    background-size: 100% 100%;
    background-position: 0 0;
    background-repeat: no-repeat;
    position: relative;
    .btns {
      padding: 19px 27px 18px 29px;
      display: flex;
      justify-content: space-between;
      .el-button {
        // min-width: 70px;
        padding: 0 20px;
        height: 32px;
        // border: solid 1px #194260 !important;
        // color: #80c5ff !important;
      }
      .btn-right {
        display: flex;
        align-items: center;
        color: @base-fontColor;
        .tableTool {
          display: flex;
          align-items: center;
          font-size: 14px;
          cursor: pointer;
          color: @base-fontColor;
        }
        img {
          margin-right: 5px;
          vertical-align: bottom;
        }
      }
      .vertical {
        height: 16px;
        width: 1px;
        border-right: 1px solid #294166;
        margin-left: 14px;
        margin-right: 14px;
        vertical-align: middle;
      }
    }

    .my-table {
      padding: 0 27px 10px 29px;
      height: calc(100% - 133px);
    }
    .page {
      border-top: solid 1px #123b72;
    }
  }
  
}
</style>