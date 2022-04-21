<template>
  <div>
    <div class="right_tab_container" v-if="data && data.dialogType == 'poi'">
      <div class="title">
        <strong>机手详情</strong>
        <div class="close-container"><img src="@/assets/images/one-picture-close.png" @click="close"></div>
      </div>
      <div class="content">
        <div v-for="(item,index) in infoList" class="info" :key="index">
          <div class="key-container">{{ item.name }}</div>
          <div class="value-container" :class="item.class">{{ item.value }}</div>
        </div>
        <div class="btn">
          <el-button type="primary" class="primary-btn" round  @click="schedul">调度</el-button>
          <el-button type="primary" class="primary-btn-plain" round @click="close">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ["data"],
  components: {
  },
  data() {
    return {
      infoList: [
        {id:1, name: '机手姓名：',value: '湖北省/武汉市/武穴市/龙坪镇', class: ''},
        {id:2, name: '手机号码：',value: 'exxxxxxx', class: ''},
        {id:3, name: '服务范围：',value: 'xxxxxxx', class: ''},
        {id:4, name: '农机类型：',value: '张昊', class: ''},
        {id:5, name: '机手位置：',value: '9852429', class: 'online'},
      ],
    }
  },
  methods: {
    //调度
    schedul(){

    },
    close(){
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.right_tab_container {
  position: absolute;
  width: 410px;
  //height: 412px;
  left: 0px;
  top: 0px;
  background-color: rgba(18, 26, 46, 0.9);
  border: 1px solid #64bfff;
  padding-bottom: 10px;

  .title {
    height: 37px;
    background-image: linear-gradient(to right, rgba(9, 100, 181, 1), rgba(0, 0, 0, 0));
    font-size: 15px;
    color: #FFFFFF;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 20px;
    justify-content: space-between;

    .close-container {
      width: 30px;
      cursor: pointer;
    }
  }
  .content {
    //height: 354px;

    padding-bottom: 10px;
    overflow-y: auto;
  }
  .info {
    font-size: 16px;
    display: flex;
    margin-top: 12px;

    .key-container {
      font-size: 14px;
      color: #a3bbce;
      width: 90px;
      text-align: right;

    }
    .value-container {
      font-size: 14px;
      color: #64bfff;
      width: 300px;
    }
    .online {
      color: #0ba790;
    }
  }

  .btn {
    margin: 10px 0 0 20px;
    button {
      height: 30px;
      padding: 8px 23px;
    }
  }
}
</style>