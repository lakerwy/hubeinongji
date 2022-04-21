<template>
  <div class="right_tab_container">
    <div class="title">
      <strong>农机耕作地块信息</strong>
      <div class="close-container"><img src="@/assets/images/one-picture-close.png" alt="" @click="close"></div>
    </div>
    <div class="content">
      <div v-for="(item,index) in infoList" class="info" :key="index">
        <div class="key-container">{{ item.name }}</div>
        <div class="value-container" :class="item.class">{{ item.value }}</div>
      </div>
    </div>
  </div>

</template>

<script>

export default {
  props: ["data"],
  data() {
    return {
      infoList: [
        {id:1, name: '地块ID：',value: '9852429', class: '', field: 'row_id'},
        {id:2, name: '作业类型：',value: '9852429', class: '', field: 'job_type'},
        {id:3, name: '农机分组：',value: '9852429', class: '', field: 'group_name_full_path'},
        {id:4, name: '车牌号码：',value: '9852429', class: '', field: 'plate_number'},
        {id:5, name: '机手姓名：',value: '9852429', class: '' , field: 'owner_name'},
        {id:6, name: '作业地点：',value: '9852429', class: '', field: 'address'},
        {id:7, name: '开始时间：',value: '9852429', class: '', field: 'job_start_time'},
        {id:8, name: '结束时间：',value: '9852429', class: '', field: 'job_end_time'},
        {id:9, name: '计算面积：',value: '9852429', class: '', field: 'compute_area_text'},
        {id:10, name: '平均深度：',value: '9852429', class: '', field: 'avg_depth'},
        {id:11, name: '审核状态：',value: '审核通过', class: 'pass', field: ''},
      ],
    }
  },
  watch: {
    "data": {
      handler(newName, oldName) {
        this.infoList.forEach(item=>{
          item.value = newName[item.field];
        })
      },
      immediate: true
    }
  },
  methods: {
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
  left: 10px;
  top: -190px;
  background-color: rgba(18, 26, 46, 0.9);
  border: 1px solid #64bfff;
  padding-bottom: 10px;

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

    .close-container {
      width: 30px;
      cursor: pointer;
    }
  }
  .content {
    max-height: 364px;
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
}
</style>