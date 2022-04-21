<template>
<!-- 分组农机组件 -->
  <div class="group">
    <!-- <div class="folder" v-if="!isShow">
      <img src="img/btn_left.png" alt="" @click="isShow = !isShow">
    </div> -->
    <div class="group-box">
      <el-card class="box-card">
        <div slot="header" class="clearfix" v-if="!isSelf">
          <div class="search-type">
            <div>
              <img src="img/monitoring/icon-title.png" alt="">
              <span>选择分组</span>
            </div>
          </div>
          <el-button style="float: right; padding-top: 15px;" type="text" @click="initData">
            <!-- <img src="img/monitoring/icon_expand.png" alt=""> -->
            <img src="img/icon_刷新.png" alt="">
          </el-button>
        </div>
        <div class="groups-con">
          <el-form class="my-form tree-form" label-position="right" :model="form">       
            <el-form-item>
              <el-input v-model="keyword" placeholder="输入农机或者分组名查找">
                <template #suffix>
                  <img style="margin-top:8px;margin-right:10px;cursor:pointer;" src="img/monitoring/icon_query.png" alt="" @click="queryByGroup">
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <el-tree
            v-loading="loading"
            element-loading-background="rgba(0, 0, 0, 0.1)"
            :class="{'h-tree': !showCheckBox && !isSelf}"
            ref="tree"
            :data="data"
            :show-checkbox="showCheckBox"
            node-key="id"
            check-strictly
            :default-expanded-keys="defaultExpand"
            :default-checked-keys="defaltCheckedKeys"
            :filter-node-method="filterNode"
            :props="defaultProps"
            @check="handleCheckChange"
            @node-click="handleNodeClick">
          </el-tree>
          <div class="btns" v-if="!showCheckBox && !isSelf">
            <el-button plain round size="medium" class="shadow-btn" @click="submit">确认</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import { getGroupTree, getCdMachine } from '@/api/system'
// import {getGroupTree, getCdMachine, getAllGroupTree} from '@/api/admin/group'
import { toTreeData } from '@/util/util'
export default {
  name: 'searchBox',
  data() {
    return {
      form: {},
      keyword: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      defaultExpand: [],
      defaltCheckedKeys: [],
      isShow: false,
      current: {},
      nodeData: {}, 
      nodeIds: [], // 分组groupIds
      loading: false,
    }
  },
  props: {
    showCheckBox: {
      type: Boolean,
      default: false
    },
    isSelf: { // 是否是私有组件
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['groupData'])
  },
  watch: {
    keyword: function(newV) {
      this.$refs.tree.filter(newV);
    },
    showCheckBox: function() {
      this.initData();
    }
  },
  created() {
    this.initData();
  },
  methods: {
    ...mapMutations({
      setGroupData: 'setGroupData',
      setGroupBoxStatus: 'setGroupBoxStatus'
    }),
    // 初始化数据
    async initData() {
      this.loading = true;
      this.data = [];
      // 有选择框的表示数据到农机，可选农机
      if(this.showCheckBox) {
        let res = await getCdMachine();
        this.data = res;
      } else {
        // 无选择框的数据到合作社，单选
        let res = await getGroupTree();
        this.data = toTreeData(res, 'id', 'pId');
      }
      this.loading = false;
      this.defaultExpand = this.groupData.ids.length > 0 ?  this.groupData.expand : [this.data[0].id];
      this.defaltCheckedKeys = this.groupData.ids.length > 0 ?  this.groupData.data.map(item => {return item.id}) : [];
    },
    // 收起面板
    close() {
      this.setGroupBoxStatus(false);
    },
    // 分组查询
    queryByGroup() {
      
    },
    // 获取被选中的节点的key数组
    handleCheckChange(self, cObj) {
      this.$refs.tree.setChecked(self.pId, false, false)
      let node = this.$refs.tree.getNode(self);
      if(self.children.length > 0) {
        // 这么做的目的是不让子节点全选中时父节点自动选中，必须是点击父节点才是全选（全不选）
        if(node.checked) {
          // 父级选中，子节点全部选中
          if(self.children.length > 0) {
            this.setStatus(self, true)
          }
        } else {
          if(self.children.length > 0) {
            this.setStatus(self, false)
          }
        }
      }
      this.handleData();
    },
    setStatus(list, isChecked) {
      this.$refs.tree.setChecked(list.id, isChecked);
      for(let i = 0; i < list.children.length; i ++) {
        this.setStatus(list.children[i], isChecked)
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 获取选中的数据进行处理保存以便后续使用
    handleData() {
      let checkedNodes = this.$refs.tree.getCheckedNodes();
      let checkedKeys = this.$refs.tree.getCheckedKeys();
      let names = [], ids = [], machine = [], expand = []; // name:显示的label  ids:保存的农机id  machine:保存的农机信息  data:当前选中的所有节点 expand保存当前打开的节点id用于回显
      checkedNodes.map(check => {
        // 只要农机id
        if(check.groupAttribute === 6) {
          ids.push(check.id);
          machine.push(check);
        }
      })
      for(let i = 0; i < checkedNodes.length; i ++) {
        let item = checkedNodes[i];
        if(item.groupAttribute === 6) {
          // 如果是农机则显示上级名称
          // console.log(this.$refs.tree.getNode(item.id), 'node')
          let parent = this.$refs.tree.getNode(item.id).parent;
          // names.push(halfCheckedNodes[halfCheckedNodes.length - 1].name);
          if(!checkedKeys.includes(item.pId)) {
            if(!names.includes(parent.label)) {
              names.push(parent.label);
              expand.push(parent.data.id);
            }
          }
        } else {
          if(!checkedKeys.includes(item.pId)) {
            // 如果当前的父id在选择项中则不保存该项，不在则保存
            names.push(item.name);
            expand.push(item.id);
          }
        }
      }
      console.log(names, expand, 'data')
      // 保存数据                          
      this.setGroupData({name: names.join(','), expand, ids, machine, data: checkedNodes })
      // console.log(checkedNodes, 'checked')
    },
    // 节点被点击的事件
    handleNodeClick(obj, node, self) {
      // 如果当前有复选框就返回，交给复选框事件处理
      if(this.showCheckBox) {
        return;
      }
      this.current = obj;
      this.nodeData = node;
      console.log(obj, node,  'node')
      // 作为页面组件点击传递事件
      if(this.isSelf) {
        this.$emit('getData', obj)
      }
    },
    getIds(obj) {
      if(obj.childNodes.length > 0) {
        obj.childNodes.map(item => {
          this.nodeIds.push(item.data.id);
          item.childNodes.length > 0 && this.getIds(item);
        })
      }
    },
    // 确认操作
    submit() {
      // 保存数据
      this.nodeIds = [];
      this.getIds(this.nodeData);
      this.nodeIds.unshift(this.current.id);
      console.log(this.nodeIds, 'ids')
      this.setGroupData({name: this.current.name, ids: this.nodeIds, expand: [this.current.id], data: this.current});
      this.setGroupBoxStatus(false);
    }
  }
}
</script>

<style lang="less" scoped>

.group {
  width: 350px;
  // height: 82%;
  // max-height: 824px;
  height: 100%;
  position: absolute;
  // top: 160px;
  // left: 26px;
  // background: @base-darkBlue;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDQ4OCwgMjAyMC8wNy8xMC0yMjowNjo1MyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjZmU5ODI2Ny02MTZhLTliNDUtYmQ3MC1mNjJlNDNlODQ2MmMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NENDRTBDNjAwQzgyMTFFQzlCN0I4RTI0M0ZGREIyMjkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NENDRTBDNUYwQzgyMTFFQzlCN0I4RTI0M0ZGREIyMjkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YmZjMWJjZTYtYzVkOS0xNzQ5LTkwZGQtZjhhNWE4Yzk1MzY0IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MWQwNzliZmEtMjg1Mi1lNzQ2LWFmNTktMDY2YWRiZTQxNWI0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+g5vTzgAAAEBJREFUeNpi/P//PwMuwAIiPFoOMQIpJiBmhIr/21Fj948FymGCKYSC/zBB/MZCVf5DMvY/uuRfdGMZ8bkWIMAAi9oSDBnxIm0AAAAASUVORK5CYII=) repeat;
  background-color: #0d2750;
  z-index: 9999;
}

.folder {
  position: absolute;
  left: 0;
  top: 39%;
  cursor: pointer;
}
.group-box {
  width: 100%;
  height: 100%;
  // position: absolute;
  // // left: 26px;
  // left: 0;
  // top: 0;
  .box-card {
    // background: @base-darkBlue;
    background: transparent;
    height: 100%;
    .clearfix:after {
      clear: both
    }
    .search-type {
      display: inline-flex;
      line-height: 48px;
      // color: @base-fontColor;
      color: #67c8ff;
      font-size: 16px;
      div {
        width: 128px;
        cursor: pointer;
        img {
          vertical-align: sub;
          margin-right: 5px;
        }
      }
      .active {
        border-bottom: 2px solid #2d7de9;
        color: #2d7de9;
      }
    }

    .groups-con {
      width: 100%;
      height: 100%;
    }
    .tree-form {
      /deep/ .el-input__inner {
        border: solid 1px #55adff;
      }
    }
    .h-tree {
      height: calc(100% - 87px) !important;
    }
    .el-tree {
      // background: @base-darkBlue;
      background: transparent;
      // color: @base-fontColor;
      color: #c4d8e9;
      margin-bottom: 10px;
      height: calc(100% - 63px);
      overflow: auto;
      /deep/ .el-checkbox__inner {
        background: transparent;
        border: 1px solid @base-fontColor;
      }
      /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #1298f8;
	      border-radius: 2px;
        border-color: #1298f8;
      }
      /deep/ .el-tree-node__content:hover, /deep/ .el-tree-node:focus {
        // color: #00d0fb;
        // background-image: linear-gradient(-90deg, @base-darkBlue,rgb(32, 109, 150));
        background: transparent !important;
      }
      /deep/ .el-tree-node__content {
        background: transparent;
      }
      /deep/ .el-icon-caret-right:before {
        color: #364760;
      }
      /deep/ .el-tree-node__content {
        height: 36px;
      }
      /deep/ .el-tree-node>.el-tree-node__children {
        overflow: unset;
      }
      /deep/ .el-icon-caret-right:before {
        content: url('../../assets/images/arrow-right.png');
      }
      /deep/ .el-tree-node__content>.el-tree-node__expand-icon {
        padding-right: 10px;
      }
    }
    .el-tree::-webkit-scrollbar {
      width: 0;
    }
    .btns {
      text-align: right;
      margin-top: 10px;
      .el-button {
        width: 48px;
	      height: 26px;
        border-radius: 6px;
        color: #80c5ff;
      }
    }
  }
  /deep/ .el-card__body {
    // border-bottom: 1px solid #0d2346;
    padding-bottom: 12px;
    height: calc(100% - 81px);
  }
}
</style>