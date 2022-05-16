<template>
  <div class="machtool">
    <TitleBox class="title" :headName="'生产资源管理'"/>
    <div class="content">
      <ContTable v-if="!isMap" @changView="changView" :isMap="isMap" />
      <ProductMap v-if="isMap" @changView="changView" :isMap="isMap" />
    </div>
  </div>
</template>

<script>
import TitleBox from "../../../components/contenBox/titleBox";
import ContTable from "./component/contTable"
import ProductMap from '../productMap'

export default {
  name: "index",
  components: {
    TitleBox,
    ContTable,
    ProductMap
  },
  data(){
    return{
      isMap:false
    }
  },
  methods:{
    changView(payload){
      this.isMap = payload
    }
  }
}
</script>

<style scoped lang="less">
@vw: 19.2vw;
@vh: 10.8vh;
.machtool {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;

  .title {
    //width: 1631px;
    width: calc(100% - 62px);
    margin-left: 40px;
    margin-top: 10px;
  }

  .content {
    margin-top: 20px;
    margin-left: 40px;
    //width: 1631px;
    width: calc(100% - 62px);
    height: calc(100% - 160px);
    border: 1px solid #133460;
  }

}

</style>