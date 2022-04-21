<template>
  <div>
    <div class="right_tab_container" v-if="data && data.dialogType == 'poi'">
      <div class="title">
        <strong>农机详情</strong>
        <div class="close-container"><img src="@/assets/images/one-picture-close.png" @click="close"></div>
      </div>
      <div v-for="(value,key) in info" class="info" :key="key">
        <div class="key-container">{{ `${key}:` }}</div>
        <div class="value-container">{{ value }}</div>
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
      info: {
        "农机详情": "湖北省/武汉市/武穴市/龙坪镇/武穴市绿丰农业合作社",
        "车牌号": "exxxxxxx",
        "终端编号": "xxxxxxx",
        "手机姓名": "张昊-1551370195",
        "位置": "afoijioaegiage",
        "awfag": "faefaegesgagea",
        "aoiehgoig": "oiajgiojg",
        "oaifj": "oiahfgjg",
        "aoiwjfoia": "oiawjfioh"
      }
    }
  },
  methods: {
    close(){
      this.$emit('close')
    }
  }
}
</script>

<style lang="less">
.right_tab_container {
  position: absolute;
  height: 395px;
  width: 410px;
  left: 0px;
  top: 0px;
  background-color: rgba(18, 26, 46, 0.9);
  border: 1px solid #64bfff;

  .title {
    height: 37px;
    background-image: linear-gradient(to right, rgba(9, 100, 181, 1), rgba(0, 0, 0, 0));
    font-size: 16px;
    color: #FFFFFF;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 20px;
    justify-content: space-between;
    margin-bottom: 20px;

    .close-container {
      width: 30px;
      cursor: pointer;
    }
  }

  .info {
    font-size: 16px;
    display: flex;
    margin-top: 12px;

    .key-container {
      color: #a3bbce;
      width: 90px;
      text-align: right;
      margin-right: 10px;
    }

    .value-container {
      color: #64bfff;
      width: 300px;
    }
  }
}
</style>