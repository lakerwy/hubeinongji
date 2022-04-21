<template>
  <!-- 作业监控 -->
  <div class="working-monitoring">
    <div class="title">
      <TitleBox class="titlebox" :headName="'作业管理'"></TitleBox>
    </div>
    <div class="query-con">
      <el-form class="my-form" label-position="right" label-width="90px" :model="form" :inline="true">
        <el-form-item label="分组名称:">
          <el-input v-model="groupData.name" placeholder="请选择分组名称" @focus="open"></el-input>
        </el-form-item>
        <el-form-item label="作业时间:">
          <el-date-picker
            class="datepicker"
            style="margin-right:8px;"
            v-model="form.jobStartTime"
            type="datetime"
            :clearable="false"
            prefix-icon="el-icon-date"
            placeholder="选择开始时间"
            :picker-options="startTime"
            @focus="showPanel"
            @change="startChange"
          ></el-date-picker>
          <!-- <span style="diaplay:inline-block;width:12px;"> — </span> -->
          <el-date-picker
            class="datepicker"
            v-model="form.jobEndTime"
            type="datetime"
            :clearable="false"
            prefix-icon="el-icon-date"
            placeholder="选择结束时间"
            :picker-options="endTime"
            @focus="showPanel"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态:">
          <el-select v-model="form.auditFlag" placeholder="请选择审核状态">
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字:">
          <el-input  v-model="form.keywordkeyword" placeholder="搜索终端号/机手姓名/机号..."></el-input>
          <!-- /车主手机号/农机车牌 -->
        </el-form-item>
        <el-button type="primary" style="margin-left:6px;" class="primary-btn shadow-btn" round @click="query">查询</el-button>
        <el-button type="primary" class="primary-btn shadow-btn" round @click="showMore">更多</el-button>
      </el-form>
      <div class="btns">
        <div :class="{'active':!isMap,'view1':true}"><img :src="isMap ? view1 : view1Active" alt="" @click="ChangeView1()"></div>
        <div :class="{'active':isMap,'view2':true}"><img :src="isMap ?   view2Active:view2" alt="" @click="ChangeView2()"></div>
        <!-- <img class="view" title="切换视图" src="img/working/icon-view.png" alt="" @click="isMap = !isMap;"> -->
      </div>
    </div>
    <div class="view-con">
      <mapView 
        v-show="isMap"
        :query="queryParams"
        :current="currentData" />
      <listView 
        v-show="!isMap"
        ref="list"
        :query="queryParams"
        @showMap="handleAuditByMap" />
    </div>

  </div>
</template>

<script>
import mapView from '../components/mapView/index'
import listView from '../components/listView/index'
import { mapGetters, mapMutations } from 'vuex'
import TitleBox from "../../../components/contenBox/titleBox";
import { getWorkingDateByMonth } from '@/api/working/index'
import { dateFormat } from "@/util/util";
export default {
  components: {
    mapView,
    listView,
    TitleBox,
  },
  data() {
    return {
      form: {
        auditFlag: 1,
        jobStartTime: new Date((new Date()).setHours(0,0,0,0) - 24*60*60*1000),
        jobEndTime: new Date((new Date()).setHours(0,0,0,0) - 1000),
      },
      status: [
        {label: '全部', value: -1},
        {label: '未审核', value: 0},
        {label: '审核通过', value: 1},
        {label: '审核不通过', value: 2},
      ],
      view1:require("@/assets/images/view1.png"),
      view1Active:require("@/assets/images/view1-active.png"),
      view2:require("@/assets/images/view2.png"),
      view2Active:require("@/assets/images/view2-active.png"),
      isMap: false, // true 地图模式 false 列表模式
      totalData: {}, // 查询到的数据
      startTime:{
        disabledDate: time => {
          let endDateVal = this.form.jobEndTime;
          if(endDateVal) {
            //小于结束时间
            return time > new Date(endDateVal);
          }
        },
        cellClassName: () => {}
      },
      endTime:{
        disabledDate: time => {
          let startDateVal = this.form.jobStartTime;
          if(startDateVal) {
            return time < new Date(startDateVal);
          }
        },
        cellClassName: () => {}
      },
      queryParams: {},
      currentData: {}, // 当前保存的行数据和行序号
      queryMonth: '', // 作为月份查询使用，处理panelCurrentData获取
    }
  },
  computed: {
    ...mapGetters(['groupData'])
  },
  watch: {
    queryMonth: function(newV) {
      console.log('watch', this.queryMonth)
      if(this.groupData.ids && this.groupData.ids.length == 1) {
        // 只有选择单个农机菜加载时间标记
        this.getDateMarker();
      }
    }
  },
  created() {
    // this.query()
  },
  methods: {
    ...mapMutations({
      setGroupBoxStatus: 'setGroupBoxStatus',
      setGroupCheckBox: 'setGroupCheckBox'
    }),
    // 打开农机分组框
    open() {
      this.setGroupCheckBox(true);
      this.setGroupBoxStatus(true);
    },
    ChangeView1(){
      if(this.isMap){
        this.isMap = !this.isMap
      }
    },
    ChangeView2(){
      if(!this.isMap){
        this.isMap = !this.isMap
      }
    },                                                      
    // 选择开始时间改变事件
    startChange(val) {
      // 给结束时间默认值
      this.form.jobEndTime = new Date(val.getTime() + 24*60*60*1000 - 1);
    },
    // 获取时间标记
    async getDateMarker() {
      let params = {
        // machineId: this.data.machineId,
        machineId: '1000000003631',
        month: this.queryMonth
      }
      let res = await getWorkingDateByMonth(params);
      let {code, data} = res;
      if(code == 0) {
        let date = [];
        data.map(d => {
          let item = new Date(d.date.split(',').join('-'));
          date.push(item.getTime());
        });
        if(date.length > 0) {
          let className = time => {
            if(date.includes(time.getTime())) {
              return 'marktime'
            }
          }
          this.startTime.cellClassName = className;
          this.endTime.cellClassName = className;
        };
      }
    },
    // 通过头部label获取当前年月，并监听变化
    handleQueryMonth() {
      this.$nextTick(() => {
        let year = document.getElementsByClassName('el-date-picker__header-label')[0].innerHTML;
        let month = document.getElementsByClassName('el-date-picker__header-label')[1].innerHTML;
        this.queryMonth = year.split(' ')[0] + '-' + month.split(' ')[0];
        console.log('query', new Date(), this.queryMonth)
      })
    },
    // 日期组件获取焦点事件
    showPanel() {
      // 打开调用一次
      console.log('show', new Date())
      this.handleQueryMonth();
      this.$nextTick(() => {
        // 前一月点击事件
        let prevBtn = document.querySelector('.el-date-picker__header .el-icon-arrow-left');
        prevBtn.addEventListener('click', this.handleQueryMonth)

        // 前一年点击事件
        let prevYearBtn = document.querySelector('.el-date-picker__header .el-icon-d-arrow-left');
        prevYearBtn.addEventListener('click', this.handleQueryMonth)

        // 后一月点击事件
        let nextBtn = document.querySelector('.el-date-picker__header .el-icon-arrow-right');
        nextBtn.addEventListener('click', this.handleQueryMonth)

        // 后一年点击事件
        let nextYearBtn = document.querySelector('.el-date-picker__header .el-icon-d-arrow-right');
        nextYearBtn.addEventListener('click', this.handleQueryMonth)

        // 月份点击事件
        let monthBtn = document.querySelector('.el-picker-panel__content .el-month-table');
        monthBtn.addEventListener('click', this.handleQueryMonth)

        // 年份点击事件
        let yearBtn = document.querySelector('.el-picker-panel__content .el-year-table');
        yearBtn.addEventListener('click', this.handleQueryMonth)
      })
    },
    // 根据条件查询数据
    async query() {
      if(this.groupData.ids.length <= 0) {
        this.$message.info('请先选择分组');
        return;
      }
      let params = {
        jobStartTime: dateFormat(this.form.jobStartTime, 'yyyy-MM-dd hh:mm:ss'),
        jobEndTime: dateFormat(this.form.jobEndTime, 'yyyy-MM-dd hh:mm:ss'),
        auditFlag: this.form.auditFlag,
        keywordkeyword: this.form.keywordkeyword,
      }
      if(this.groupData.ids.length === 1) {
        params.machineId = this.groupData.ids[0]
      } else {
        params.machineIdS = this.groupData.ids.join(',')
      }
      let groupIds = [], gAttrs = [], groupId = [], path = []; // groupIds所有的分组id集合 gAttrs所有的groupAttribute集合 groupId最外层的分组 path最外层分组的path集合
      this.groupData.data && this.groupData.data.map(item => {
        // 第一次循环获取所有分组id集合，获取分组groupAttribute集合
        if(item.groupAttribute !== 6) {
          // 所有的分组id集合
          groupIds.push(item.id);
        }
        if(!gAttrs.includes(item.groupAttribute)) {
          // 保存groupAttribute
          gAttrs.push(item.groupAttribute);
        }
      })
      this.groupData.data && this.groupData.data.map(item => {
        // 第二次循环筛选最外层分组id
        if(item.groupAttribute !== 6) {
          // debugger
          // 当前选择的排除农机的数据中，如果该项的pid在id集合中则表示不是最外层，否则时最外层就添加进去
          if(!groupIds.includes(item.pId)) {
            groupId.push(item.id);
            path.push(item.path);
          }
        } else {
          // 当前选择只有农机时添加pId为最外层分组groupId，这里条件是避免重复在groupId添加push（注意：并不是groupIds）
          if(!groupIds.includes(item.pId) && !groupId.includes(item.pId)) {
            groupId.push(item.pId);
            path.push(item.path);
          }
        }
      })
      params.groupId = groupId.join(',');
      params.groupFullPath = this.longestCommonPrefix(path);
      params.groupIds = groupIds.join(',');
      params.belongGroupId = groupId[groupId.length - 1];
      params.groupAttribute = gAttrs.join(',');
      console.log(params, 'params')
      this.queryParams = params;
    },
    // 相同字符串筛选
    longestCommonPrefix(strs) {
      let tempStr = strs[0];
      while (strs.some(item => item.indexOf(tempStr) !== 0)) {
        tempStr = tempStr.substring(0, tempStr.length - 1);
      }
      return tempStr;
    },
    handleAuditByMap(val) {
      this.isMap = true;
      this.currentData = val;
    },
    // 更多 重复作业查询模块
    showMore() {
      this.$router.push({path: '/repeat-working'})
    }
  }
}
</script>

<style lang="less" scoped>
@vw:19.2vw;
.working-monitoring {
  height: calc(100% - 94px) !important;
  position: relative;
  .shadow-btn{
    height: 36px;
  }
  .title{
    margin-top: 15px;
    padding-left: 20px;
    padding-right: 27px;
    width: calc(100% - 47px)
  }
  .query-con {
    padding: 20px 0 14px 20px;
    display: flex;
    justify-content: space-between;
    .el-input {
      width: 210/@vw;
      min-width: 160px;
    }
    .el-select {
      width: 210/@vw;
      min-width: 160px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .btns {
      display: flex;
      flex-direction: row;
      width: 70px;
      height: 32px;
      padding-right: 42/@vw;
      border-radius: 3px;
      .view1,.view2{
        width: 35px;
        line-height: 35px;
        cursor: pointer;
        text-align: center;
      }
      .view1{
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        border: #0c4b85 solid 1px;
        border-right: none;
        
      }
      .view2{ 
        border-top-right-radius: 3px;
        background-color: transparent;        
        border-bottom-right-radius: 3px;
        border: #0c4b85 solid 1px;
        border-left: none;
      }
      .active{
        background:#0c4b85 ;
      }
      // .el-button {
      //   width: 90/@vw;
      //   min-width: 77px;
      //   height: 36px;
      //   padding: 0;
      // }
    }
    .view {
      vertical-align: middle;
      margin-left: 40/@vw;
      cursor: pointer;
    }
  }

  .view-con {
    height: calc(100% - 104px)
  }

  .group {
    position: absolute;
    top: 90px;
    left: 0;
    z-index: 5;
  }

  // /deep/.el-form-item__label {
  //   padding:0;
  // }
}
</style>

<style lang="less">
.marktime {
  background-color: rgba(0, 67, 124, .5);;
}
</style>