<template> 
  <!-- 分组管理 -->
  <div class="app-container aboutus">
    <titleBox :headName="'关于我们'"/>
    <basic-container class="basic-con">
        <little-title>平台简介</little-title>
        <div class="detail">&emsp;&emsp;湖北省北斗农机信息化智能管理系统集北斗定位、指挥控制、后台管理等功能于一体，通过北斗定位导航系统、北斗农机终端实时获取每台农机的位置
          信息、作业轨迹、传感器状态等数据信息，通过移动网络将数据远程传输到后台运算分析，最终在平台上实现统一管理、集中调度，方便农业管理部门、合作社、农场、农机手、
          农机厂家实时监控农机现场作业情况，调度农机作业，通过平台审核农机作业面积和作业质量，对作业数据进行统计分析，提高农机工作效率，节约工作成本，真正做到“轻松管
          、自动算、方便查”
        </div>
        <little-title>用户对象</little-title>
        <div class="userObject">
            <img src="@/assets/images/userObject.png" ></img>
        </div>
        <little-title>使用说明</little-title>
        <div class="instructions">
          <div class="download" @click="download">
              <img src="@/assets/images/about_download.png" class="img1" alt="">
              <img src="@/assets/images/about_circle.png" class="img2" alt="">
              <span style="width:340px;text-align:center">点击下载农机平台使用说明书</span>
          </div>
          <div class="about-item" v-for="item in aboutItems">
           <img :src="item.imgUrl" class="img1" alt="">
           <img src="@/assets/images/about_circle.png" class="img2" alt="">
           <span style="width:340px;text-align:center">{{item.text}}</span>
          </div>
          <div class="QRcodes"> 
            <div class="QRcode">
            <img src="@/assets/images/QRcode1.png" alt="">
            <div>湖北地信微信公众号</div>
            </div>
            <div class="QRcode">
            <img src="@/assets/images/QRcode2.png" alt="">
            <div>荆楚农机微信公众号</div>
            </div>

          </div>
        </div>
    </basic-container>
  </div>
</template>

<script>
import titleBox from "_com/contenBox/titleBox.vue";
import LittleTitle from "@/views/admin/about/components/LittleTitle";
import {handTemplateDown} from "@/util/util";
export default {
  name: "department",
  components: {
    titleBox,
    LittleTitle,
  },
  data() {
    return {
      templateUrl: `${window.globalUrl.HOME_API}agri-web/cd/machine/importTemplate?templateType=toolFile`,
      aboutItems: [
        // {
        //   id: 1,
        //   imgUrl: require("@/assets/images/about_download.png"),
        //   text: "点击下载农机平台使用说明书",
        // },
        {
          id: 2,
          imgUrl: require("@/assets/images/about_tel.png"),
          text: "4001680927-9",
        },
        {
          id: 3,
          imgUrl: require("@/assets/images/about_location.png"),
          text: "武汉市东湖新技术开发区高新大道980号北斗大厦七楼",
        },
      ],
    };
  },
  methods:{
    download(){
      let url = this.templateUrl
      let title = "机具管理导入模板"
      handTemplateDown(url,title)
    }
  }
};
</script>

<style lang="less" scoped>
.aboutus {
  height: calc(100% - 10px) !important;
  .basic-con {
    height: calc(100% - 56px);
    padding-top: 15px;
    padding-bottom: 0px;
    .detail {
      color: #c4d8e9;
      padding-left: 72px;
      padding-right: 72px;
      font-size: 14px;
      line-height: 26px;
      margin-top: 15px;
      margin-bottom: 15px;
    }
    .userObject {
      display: flex;
      justify-content: center;
      flex-direction: row;
      img {
        // width: 510px;
      }
    }
    .instructions {
      display: flex;
      margin-top: auto;
      flex-direction: row;
      justify-content: space-around;
      // align-items: baseline;
      .about-item {
        color: #c4d8e9;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 200px;
        // z-index: 999;
        // width: 345px;
        cursor: pointer;
        padding-bottom: 146px;
        .img1 {
          margin-bottom: -15px;
          height: 56px;
        }
        .img2 {
          bottom: 20px;
          margin-bottom: 15px;
        }
      }
      .download {
        color: #c4d8e9;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 200px;
        // z-index: 999;
        // width: 345px;
        cursor: pointer;
        padding-bottom: 146px;
        .img1 {
          margin-bottom: -15px;
          height: 56px;
        }
        .img2 {
          bottom: 20px;
          margin-bottom: 15px;
        }
      }
      .QRcodes {
        margin-top: -20px;
        display: flex;
        color: #c4d8e9;
        flex-direction: row;
        // align-items: baseline;
        .QRcode {
          margin-left: 18px;
          flex-direction: column;
          align-items: baseline;
        }
      }
    }
  }
}
</style>