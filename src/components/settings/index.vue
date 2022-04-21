<template>
<!-- 全局设置 -->
  <div class="settings">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="search-type">
          <div 
            :class="{'active': currentType.value === item.value}" 
            v-for="(item) in searchTypes" 
            :key="item.value"
            @click="changeType(item)">
            <span>{{item.label}}</span>
          </div>
        </div>
        <el-button style="float: right; padding-top: 15px;" type="text" @click="close">
          <img src="img/monitoring/icon-close.png" alt="">
        </el-button>
      </div>

      <div class="form-con" v-show="currentType.value === 1">
        <el-form class="my-form" label-position="left" label-width="110px" :model="form">
          <el-form-item :label="item.label" v-for="item in formItems" :key="item.key">
            <el-radio-group v-model="type" size="medium" :max="1">
              <el-radio-button v-for="t in item.types" :label="t.value" :key="t.label">{{t.label}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" class="shadow-btn" round>确定</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="form-con" v-show="currentType.value === 2">
        <el-form class="my-form" label-position="left" :model="form">
          <el-form-item>
            <el-checkbox-group v-model="season" :max="1" style="padding-left:35px">
              <el-checkbox v-for="t in seasonTypes" :label="t.value" :key="t.label">{{t.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>

      <div class="form-con" v-show="currentType.value === 3">
        <div class="btns">
          <el-button type="primary" class="primary-btn" round @click="saving">保存</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'searchBox',
  data() {
    return {
      searchTypes: [
        {label: '作业类型', value: 1},
        {label: '作业季', value: 2},
        {label: '其他设置', value: 3}
      ],
      formItems: [
        {
          label: '耕整作业',
          key: 'tillage',
          types: [
            {label: '深松整地', value: '1'},
            {label: '深翻作业', value: '2'},
            {label: '旋耕作业', value: '3'},
            // {label: '其他耕种作业', value: '4'},
            {label: '翻耕作业', value: '4'},
            {label: '拖拉机作业', value: '10'},
            {label: '开沟作业', value: '5'},
          ]
        },
        {
          label: '种植作业',
          key: 'plant',
          types: [
            // {label: '播种', value: '6'},
            {label: '播种作业', value: '6'},
            {label: '无人机飞播', value: '9'},
            {label: '插秧作业', value: '7'},
            {label: '油菜直播', value: '8'},
            {label: '玉米免耕播种', value: '9'},
            {label: '大豆旋耕施肥', value: '10'},
            {label: '无人机直播', value: '10'},
            {label: '小麦直播作业', value: '10'},
          ]
        },
        {
          label: '植保作业',
          key: 'plantProtection',
          types: [
            {label: '无人机植保', value: '11'},
            {label: '喷杆喷雾作业', value: '12'},
          ]
        },
        {
          label: '收获作业',
          key: 'harvest',
          types: [
            {label: '稻麦收割作业', value: '13'},
            {label: '玉米收割作业', value: '14'},
            // {label: '油菜收割作业', value: '15'},
            {label: '其他收割作业', value: '16'},
          ]
        },
        {
          label: '收获后作业',
          key: 'afterHarvest',
          types: [
            {label: '烘干作业', value: '17'},
          ]
        },
        {
          label: '秸秆处理',
          key: 'straw',
          types: [
            {label: '旋耕灭茬作业', value: '18'},
            {label: '秸秆粉碎还田', value: '19'},
            {label: '打捆作业', value: '20'},
          ]
        },
        {
          label: '精准作业',
          key: 'precision',
          types: [
            {label: '农用无人机', value: '21'},
            {label: '自动驾驶', value: '22'},
          ]
        },
      ],
      seasonTypes: [
        {label: '2018 深松整地', value: '1'},
        {label: '2019 深松整地', value: '2'},
        {label: '2020 深松整地', value: '3'},
        {label: '2021 深松整地', value: '4'},
      ],
      currentType: {},
      type: '',
      form: {
        tillage: '',
        plant: '',
        plantProtection: '',
        harvest: '',
        afterHarvest: '',
        straw: '',
        precision: ''
      },
      season: []
    }
  },
  created() {
    this.changeType(this.searchTypes[0]);
  },
  methods: {
    ...mapMutations({
      setSettings: 'setSettings'
    }),
    // 切换查询模式
    changeType(item) {
      this.currentType = item;
    },
    // 收起面板
    close() {
      this.$emit('close', false);
    },
    // 保存设置
    saving() {
      this.setSettings({type: this.type, season: this.season.join('')})
    }
  }
}
</script>

<style lang="less" scoped>
.settings {
  width: 850px;
	height: 625px;
  position: absolute;
  top: 138px;
  right: 185px;
  z-index: 9999;
  
  .box-card {
    background-color: rgba(13, 39, 80, .95);
    box-shadow: inset 2px 0px 16px 0px 
      rgba(50, 111, 166, 0.8);
    border: solid 1px #1c91ff;
    height: 100%;
    border-radius: 0;
    .clearfix:after {
      clear: both
    }
    .search-type {
      display: inline-flex;
      // line-height: 30px;
      // height: 48px;
      margin-left: 40px;
      font-size: 15px;
      text-align: center;
      color: @base-fontColor;
      div {
        width: 60px;
        cursor: pointer;
        height: 48px;
        margin-right: 40px;
        // align-items: center;
        span{
          margin-top: 20px;
        }
        img {
          vertical-align: sub;
          margin-right: 50px;
        }
      }
      .active {
        border-bottom: 2px solid #1c92ff;
        color: #009af2;
        // margin-left: 30px;
      }
    }
    .form-con {
      font-family: SourceHanSansCN-Regular;
      .el-form-item {
        // margin-bottom: 50px;
      }
      .btns {
        margin-bottom: 0;
        text-align: right;
      }
      /deep/ .el-form-item__label {
        color: #00a8ff;
        font-weight: 900;
        // align-items: right;
        white-space:nowrap; 
        // width: ;
        text-align: right;
        padding-right: 20px;
        color: #c4d8e9;
      }
      // /deep/ .el-form-item__label::before {
        // content: url('../../assets/images/deco.png');
        // margin-right: 5px;
        // vertical-align: sub;
      // }
      .el-radio-group {
        padding-left: 15px;
        // text-align: right;

      }
      .el-radio-button, .el-radio-button__inner {
        margin-right: 12px;
      }
      /deep/ .el-radio-button .el-radio-button__inner {
        border-radius: 4px;
        height: 30px;
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-bottom: 12px;
        // padding-bottom: 5px;
        align-items: center;
        color: #549bf3;
        border: solid 1px rgba(84, 155, 243, .30);
        background: transparent;
        color:#009af2;
      }
      /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
        background-color: rgba(42, 86, 154, .30);
	      border: solid 1px #388ef2;
        color: #fff;
      }

      /deep/ .el-checkbox__inner {
        background: transparent;
        border: solid 1px #1a92cb;
      }
      /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
        background: #00a8ff;
      }
      /deep/ .el-checkbox__label {
        color: #009af4;
        font-family: SourceHanSansCN-Regular;
      }
    }
    .shadow-btn{
      height: 36px;
      margin-right: 20px;
    }
  }
  /deep/ .el-card__body {
    padding-left: 25px;
    padding-top: 30px;
  }
  /deep/ .el-card__header{
    border-bottom-color: #1b4b80;
  }
}

</style>