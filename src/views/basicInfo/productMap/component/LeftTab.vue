<template>
  <div class="left_tab_container">
    <div class="title">
      <el-input v-model="searchValue" placeholder="搜索合作社、维修站等"></el-input>
      <div class="search_container">
        <img src="@/assets/images/one-picture-search.png" alt=""  @click="search({currentPage: 1, pageSize: 10})"/>
      </div>
    </div>
    <div class="cont" v-if="showSearchValue" v-loading="loading">
      <!--  -->
      <div class="list">"
        <div v-for="(item,index) in information" class="item_container" :class="selectedIndex == index?'active':''"
             :key="index" @click="chooseItem(item,index)">
          <p>
            {{index+1+page.currentPage*10-10}}. {{item.resourcesName}} {{item.ownerName?"-"+item.ownerName:""}} {{item.ownerPhone?"-"+item.ownerPhone:""}}
            <!-- {{typeList[item.resoucesType].name}}&nbsp; &nbsp; -->
          </p>
          <p style="color: #a3bbce">{{ item.address }}</p>
        </div>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page.sync="page.currentPage"
        :total="page.pageTotal"
        :page-size="page.pageSize"
        :pager-count="5"
        class="pagination"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {searchMapPoint} from "../../../../api/agridata";
import * as mapHanlder from "../../../../util/mapHanlder";
import {viewOnMapPopup} from "../../../../util/mapHanlder";

export default {
  props: {
    iconList:{
      type: Array,
      default: ()=>({})
    },
    dataTypeList: {
      type: Array,
      default: ()=>[]
    },
    map2d: {
      type: Object,
      default: ()=>({})
    }
  },
  data() {
    return {
      information: [
      ],
      searchValue: '',
      selectedIndex: -1,
      showSearchValue: false,
      page: {
        pageTotal: 0,
        pageSize: 10,
        currentPage: 1,
      },
      loading:false,
    };
  },
  methods: {
    chooseItem(item, index) {
      this.selectedIndex = index;
      mapHanlder.viewOnMapPopup({
        component: this.map2d,
        data: item,
        lonKey: "lon",
        latKey: "lat",
        isClick: true,
      });
    },
    //搜索
    async search(page){
      this.loading = true
      this.showSearchValue = true
      let dataTypeList = []
      this.iconList.forEach(item=>{
        if(item.visible){
          dataTypeList.push(item.searchkey)
        }
      })
      let params = {
        currentPage: page.currentPage,
        dataTypeList: dataTypeList,
        pageSize: page.pageSize,
        searchWord: this.searchValue
      }
      let res =  await searchMapPoint(params);
      if(res.data.success){
        this.page.pageTotal=res.data.data.total;
        this.information = res.data.data.records;
        this.showSearchValue = true;
      }else{
        this.showSearchValue = false
      }
        this.loading = false
    },
    handleCurrentChange(val){
      this.page.currentPage = val;
      this.search(this.page);
    }
  }
};
</script>

<style lang="less" scoped>
.left_tab_container {
  width: 410px;
  //height: 680px;
  position: absolute;
  left: 80px;
  top: 80px;
  background-color: rgba(18, 26, 46, 0.9);
  border: 1px solid #64bfff;

  .title {
    color: #ffffff;
    height: 38px;
    font-size: 16px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #64bfff;

    /deep/ .el-input__inner {
      background: transparent;
      border: 0;
      color: #ffffff;
      width: 350px;
    }
    //chrome
    /deep/.el-input__inner::-webkit-input-placeholder {
            color: rgba(128, 197, 255, .3);
            font-size: 16px;
    }
    //firefox
    /deep/.el-input__inner:-moz-placeholder {
            color: rgba(128, 197, 255, .3);
            font-size: 16px;
    }
    .search_container {
      position: absolute;
      width: 50px;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-left: 1px solid #3d4959;
      cursor: pointer;
    }
  }

  .cont {
    width: 410px;
    height: 640px;
    overflow: auto;
    .list {
      height: 560px;
      overflow: auto;
    }
  }

  .item_container {
    //height: 65px;
    padding-left: 20px;
    padding-top: 14px;
    border-bottom: #0f2b46 1px solid;
    color: #80c5ff;
    font-size: 14px;
    cursor: pointer;

    p:nth-child(1) {
      margin: 0;
    }
  }

  .item_container:hover, .active {
    background: #0f3358;
  }

  .pagination {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }

  /deep/ .el-pagination {
    .btn-next, .btn-prev, .el-pager li {
      background-color: transparent;
      border: 1px solid #98afb4;
      color: #98afb4;
    }

    .el-pager li:not(.disabled).active {
      border: none;
    }
  }
}
</style>