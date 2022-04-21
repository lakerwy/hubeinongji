<template>
<!-- 设置农机机具作业配置 -->
  <el-dialog
    class="dialog"
    title="新增"
    :visible.sync="dialogVisible"
    width="1100px"
    top="20vh"
  >
    <div class="content">
      <span class="type-title">农机类型选择</span>
      <div class="agri">
        <div class="image-item" v-for="i in agriList" :key="i.id" @click="choose(i)">
          <div class="img" :class="{'checked': i.id === form.agri}">
            <img :src="i.img" alt="">
            <p class="name">{{i.name}}</p>
          </div>
          <div class="masker" v-if="i.id === form.agri">
            <img src="img/admin/icon_check.png" alt="">
          </div>
        </div>
      </div>
      <span class="type-title">机具类型选择</span>
      <div class="machine">
        <el-checkbox-group v-model="form.machine" max="1">
          <el-checkbox-button v-for="item in mTypes" :label="item.value" :key="item.value">{{item.label}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
      <span class="type-title">作业类型选择</span>
      <div class="working">
        <el-radio-group v-model="form.working">
          <el-radio v-for="item in wTypes" :key="item.value" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="shadow-btn" @click="dialogVisible = false" size="medium" round>保存</el-button>
      <el-button type="primary" class="shadow-btn" @click="dialogVisible = false" size="medium" round>返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'setMachineDialog',
  data() {
    return {
      form: {
        agri: '',
        machine: [],
        working: ''
      },
      dialogVisible: false,
      agriList: [
        {name: '拖拉机', id: '1', img: 'img/admin/car1.png'}, 
        {name: '插秧机', id: '2', img: 'img/admin/car2.png'}, 
        {name: '稻麦收割机', id: '3', img: 'img/admin/car3.png'},
        {name: '无人机', id: '4', img: 'img/admin/car4.png'}, 
        {name: '玉米收割机', id: '5', img: 'img/admin/car5.png'}, 
        {name: '烘干机', id: '6', img: 'img/admin/car6.png'},
        {name: '喷秆喷雾机', id: '7', img: 'img/admin/car7.png'}, 
        {name: '其他收割机', id: '8', img: 'img/admin/car8.png'}
      ],
      mTypes: [
        {label: '拖拉机机具', value: '1'}, {label: '深松机', value: '2'},
        {label: '旋耕机', value: '3'}, {label: '灭茬机', value: '4'},
        {label: '播种机', value: '5'}, {label: '打捆机', value: '6'},
        {label: '秸秆粉碎还田机', value: '7'}, {label: '开沟机', value: '8'},
        {label: '大豆精量播种机', value: '9'}, {label: '玉米免耕播种机', value: '10'},
        {label: '大豆气量式播种机', value: '23'},
        {label: '油菜直播机', value: '11'}, {label: '插秧机', value: '12'},
        {label: '稻麦收割机', value: '13'}, {label: '油菜收割机', value: '14'},
        {label: '植保无人机', value: '15'}, {label: '飞播无人机', value: '16'},
        {label: '烘干机', value: '17'}, {label: '玉米收割机', value: '18'},
        {label: '耕地犁', value: '19'}, {label: '深翻犁', value: '20'},
        {label: '喷秆喷雾机', value: '21'}, {label: '其他收割机', value: '22'},
      ],
      wTypes: [
        {label: '拖拉机作业', value: '1'}, {label: '深松整地', value: '2'},
        {label: '旋耕作业', value: '3'}, {label: '旋耕灭茬作业', value: '4'},
        {label: '播种作业', value: '5'}, {label: '翻耕作业', value: '6'},
        {label: '打捆作业', value: '7'}, {label: '开沟作业', value: '8'},
        {label: '大豆旋耕施肥播种作业', value: '9'}, {label: '玉米免耕播种作业', value: '10'},
        {label: '油菜直播', value: '11'}, {label: '插秧作业', value: '12'},
        {label: '稻麦收割作业', value: '13'}, {label: '油菜收割作业', value: '14'},
        {label: '无人机植保', value: '15'}, {label: '无人机飞播', value: '16'},
        {label: '玉米收割作业', value: '17'}, {label: '烘干作业', value: '18'},
        {label: '喷秆喷雾作业', value: '19'}, {label: '深翻作业', value: '20'},
        {label: '秸秆粉碎还田', value: '21'}, {label: '其他收割作业', value: '22'},
      ]
    }
  },
  methods: {
    choose(item) {
      this.form.agri = item.id;
    },
    close() {
      this.dialogVisible = false;
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.dialog {
  .content {
    padding-left: 44px;
    .type-title {
      font-family: SourceHanSansCN-Regular;
      font-size: 14px;
      line-height: 52px;
      display: block;
      margin-top: 15px;
      color: #67c8ff;
    }
    .type-title:last-child {
      margin-top: 3px;
    }
    .agri {
      display: flex;
      width: 100%;
      .image-item {
        margin-right: 12px;
        position: relative;
        cursor: pointer;
        color: #c4d8e9;
        .img {
          width: 114px;
          height: 82px;
          background-color: rgba(34, 65, 105, .3);
          border: solid 1px #388ef2;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
          img {
            vertical-align: middle;
          }
        }
        .checked {
          width: 116px;
          height: 84px;
          border: 0;
          background-image: url('../../../assets/images/type-checked.png');
          background-repeat: no-repeat;
          background-position: 0 0;
          background-size: 100% 100%;
          color: #549bf3;
        }
        .name {
          text-align: center;
          margin: 0;
          margin-top: -7px;
          font-family: SourceHanSansCN-Regular;
          font-size: 14px;
        }
        .masker {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          cursor: pointer;
          text-align: right;
        }
      }
    }
    .machine {
      /deep/ .el-checkbox-button .el-checkbox-button__inner{
        width: 138px;
	      height: 30px;
        margin-right: 10px;
        margin-bottom: 10px;
        border-radius: 4px;
        font-size: 14px;
        padding: 0;
        line-height: 30px;
        border: solid 1px rgba(56, 142, 242,.3);
        background: transparent;
        color: #c4d8e9;
      }
      /deep/ .el-checkbox-button__inner:nth-child(7n) {
        margin-right: 0;
      }
      /deep/ .el-checkbox-button.is-checked .el-checkbox-button__inner {
        background: url('../../../assets/images/m-checked.png');
        background-size: 100% 100%;
        color: #549bf3;
        box-shadow: none;
        border: 0;
      }
    }
    .working {
      .el-radio {
        width: 107px;
        color: #c4d8e9;
        font-family: SourceHanSansCN-Regular;
	      font-size: 14px;
        margin-bottom: 18px;
      }
      .el-radio:nth-child(7n+2) {
        width: 164px;
      }
      .el-radio:nth-child(7n+3) {
        width: 136px;
      }
      /deep/ .el-radio__inner {
        width: 16px;
	      height: 16px;
        border: solid 1px rgba(56, 142, 242, .3);
        background: transparent;
      }
      /deep/ .el-radio__input.is-checked .el-radio__inner {
        width: 16px;
	      height: 16px;
        border: solid 1px #0d83df;
        background-color: transparent;
      }
      /deep/ .el-radio__inner::after {
        width: 8px;
        height: 8px;
        background-color: #388ef2;
      }
      /deep/ .el-radio__input.is-checked+.el-radio__label {
        color: #388ef2;
      }
    }
  }
  .dialog-footer {
    .el-button {
      width: 90px;
    }
  }
}
</style>