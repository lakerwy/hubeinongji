<template>
  <div class="footer2">
    <div class="info">
      <div>技术支持：湖北地信科技集团股份有限公司 &nbsp;&nbsp;&nbsp;&nbsp;服务电话：4001680927-9</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@vh: 10.8vh;
.footer2 {
  position: fixed;
  background: transparent;
  bottom: 0;
  width: 100%;
  // min-width: 1500px;
  text-align: center;
  color: #aac2d6;
	opacity: 0.8;
  font-size:12px;
  .info {
    float: left;
    position: absolute;
    left: 50%;
    bottom: 10px;
    transform: translate(-50%,0);
  }
}
</style>
