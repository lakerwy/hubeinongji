<template>
  <div class="pop">
    <div class="title">
      <div>农机终端轨迹信息</div>
    </div>
    <div class="content">
      <div>{{`车牌号码: ${popValue.plateNumber}`}}</div>
      <div>{{`机手姓名: ${popValue.driveName}`}}</div>
      <div>{{`计算面积: ${popValue.computeArea}(亩)`}}</div>
      <div>{{`作业地点: ${popValue.address}`}}</div>
      <div>{{`开始时间: ${popValue.jobStartTime}`}}</div>
      <div>{{`结束时间: ${popValue.jobEndTime}`}}</div>
      <div>{{`深度:  ${popValue.avgDepth}  (厘米)`}}</div>
    </div>
  </div>
</template>

<script>

export default {
  props:{
    popValue:Object
  }
}
</script>

<style lang="less" scoped>

.pop{
  width: 360px;
  // height: 180px;
  background-color: rgba(0,170,170,0.8);
  border-radius: 10px;
  border:1px solid #0d4f90;
  .title{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #0d4f90;
    margin-bottom: 10px;
    font-weight: 900;
  }
  .content{
    padding-left: 15px;
    padding-bottom: 15px;
  }

}


</style>