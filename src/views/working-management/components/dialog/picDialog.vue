<template>
  <el-dialog
    class="my-dialog pic-dialog"
    title="查看图片"
    :visible.sync="dialogVisible"
    width="45%"
    top="20vh">
    <!-- <el-image
      style="width:100%;height:100%;"
      :src="url"
      fit="cover"
      :preview-src-list="photourlList"
    ></el-image> -->
    <el-carousel
      ref="carousel"
      trigger="click"
      :autoplay="false"
      indicator-position="none"
      style="width:100%;height:100%;"
    >
      <el-carousel-item v-for="(item,index) in urlList" :key="index" name="i">
        <img style="width:100%;height:100%" :src="item">
      </el-carousel-item>
    </el-carousel>
  </el-dialog>
</template>

<script>
export default {
  name: 'picDialog',
  data() {
    return {
      dialogVisible: false,
      currentIndex: -1,
    }
  },
  // created(){
  //   //console.log("picDialong is created");
  // },
  // mounted(){
  //   //console.log("picDialong is mounted");
  // },
  updated(){
    //console.log("picDialong is update");
    this.currentIndex = this.urlList.indexOf(this.url);
    //console.log("picDialong currentIndex:",this.currentIndex);
    this.setActiveItem(this.currentIndex);
  },
  methods:{
    setActiveItem(i) {
      if (this.$refs.carousel) {
        // 手动切换幻灯片 setActiveItem(i)(Carousel Methods)
        // 需要切换的幻灯片的索引，从 0 开始；或相应 el-carousel-item 的 name 属性值
        // i 与 name 里面的值绑定 ，i 决定显示那个 name值的 el-carousel-item
        this.$refs.carousel.setActiveItem(i)
        // //console.log(i)
      }
    }
  },
  props: {
    url: {
      type: String,
      // default: "http://223.75.53.178:8817/machinephotos/ComServerHB/202109/1000000032064/1000000032064.1632539989005.91963.jpg"
      default: ""
    },
    urlList:{
      typeof: Array,
      default:function(){
        return []
      }
    },
  }
}
</script>

<style lang="less" scoped>
.pic-dialog {
  /deep/ .el-carousel__container{
    height: 100%;
  }
  /deep/ .el-dialog__body {
    padding: 0;
    height: 600px;
    text-align: center;
  }
  /deep/ .el-image__error, /deep/ .el-image__placeholder {
    background: transparent;
  }
}
</style>