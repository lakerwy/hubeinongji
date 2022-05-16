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
                            <img src="img/monitoring/icon-title.png" alt=""/>
                            <span>选择分组</span>
                        </div>
                    </div>
                    <el-button
                            style="float: right; padding-top: 15px"
                            type="text"
                            @click="initData(true)"
                    >
                        <!-- <img src="img/monitoring/icon_expand.png" alt=""> -->
                        <img src="img/icon_refresh.png" alt=""/>
                    </el-button>
                </div>
                <div class="groups-con">
                    <el-form
                            class="my-form tree-form"
                            label-position="right"
                            :model="form"
                    >
                        <el-form-item>
                            <el-input v-model="form.keyword" placeholder="输入分组查找" @input="searchChange" :class="isSelf?'isSelf':''">
                                <template #suffix>
                                    <img
                                            style="margin-top: 8px; margin-right: 10px; cursor: pointer"
                                            src="img/monitoring/icon_query.png"
                                            alt=""
                                            @click="queryByGroup"
                                    />
                                </template>
                            </el-input>
                            <el-button v-if="isSelf"
                              style="float: right"
                              type="text"
                              @click="initData(true)"
                            >
                              <img style="margin-top: -5px" src="img/icon_refresh.png" alt="" />
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-tree
                            v-loading="loading"
                            element-loading-background="rgba(0, 0, 0, 0.1)"
                            :class="{ 'h-tree': !showCheckBox && !isSelf }"
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
                            @node-click="handleNodeClick"
                    >
                    </el-tree>
                    <div class="btns" v-if="!showCheckBox && !isSelf">
                        <el-button
                                plain
                                round
                                size="medium"
                                class="shadow-btn"
                                @click="submit"
                        >确认
                        </el-button
                        >
                    </div>
                </div>
            </el-card>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
// import { getGroupTree, getCdMachine } from '@/api/system'
import { getGroupTree, getCdMachine, getAllGroupTree } from "@/api/admin/group";
import { toTreeData } from "@/util/util";

export default {
  name: "searchBox",
  data() {
    return {
      form: {},
      // keyword: "",
      data: [],
      defaultProps: {
        children: "children",
        label: "name",
        value: "id",
      },
      defaultExpand: [],
      defaltCheckedKeys: [],
      isShow: false,
      current: {},
      nodeData: {},
      nodeIds: [], // 分组groupIds
      loading: false,
      search: {},
      pbwelementarr: [],
    };
  },
  props: {
    showCheckBox: {
      type: Boolean,
      default: false,
    },
    isSelf: {
      // 是否是私有组件
      type: Boolean,
      default: false,
    },
    isAll: {
      // 是否加载所有
      type: Boolean,
      default: false,
    },
    treeType: {
      // 是分组树，还是农机树
      type: Number,
      default: 1,
    },
  },
  computed: {
    ...mapGetters([
      "groupData",
      "groupTreeType",
      "groupTreeIsArea",
      "groupTreeIsAll",
      "globalSetting",
    ]),
  },
  watch: {
    // keyword: function (newV) {
    //   this.$refs.tree.filter(newV);
    // },
    showCheckBox: function () {
      this.initData();
    },
    groupTreeType: function () {
      this.initData();
    },
    groupTreeIsArea: function () {
      this.initData(true);
    },
    globalSetting: {
      handler: function (newval) {
        this.initData(false);
      },
      deep: true,
    },
  },
  created() {
    //console.log("groupbox is created");
    this.initData();
  },
  // updated(){
  //     //console.log("groupbox is updated");
  // },
  // destroyed(){
  //     //console.log("groupbox is destroyed")
  // },
  methods: {
    ...mapMutations({
      setGroupData: "setGroupData",
      setGroupBoxStatus: "setGroupBoxStatus",
    }),
    //删除某一个attribute以下的节点
    filterTree(tree, groupAttribute) {
      var newtree = [];
      for (var i = 0; i < tree.length; i++) {
        this.filterTreenode(tree[i], groupAttribute, newtree);
      }
      if (newtree.length) {
        newtree = toTreeData(newtree, "id", "pId");
      }
      return newtree;
    },
    filterTreenode(node, groupAttribute, newtree) {
      if (!node.groupAttribute || node.groupAttribute * 1 <= 2) {
        var newnode = { ...node };
        newnode.children = [];
        newtree.push(newnode);
        if (node.children) {
          for (var i = 0; i < node.children.length; i++) {
            this.filterTreenode(node.children[i], groupAttribute, newtree);
          }
        }
      }

      //newTree.forEach(item => item.children && (item.children = this.filterTree(item.children)))
      //return newTree
    },
    // 初始化数据
    async initData(fouce) {
      //console.log("groupbox is initData");
      if (this.form.keyword) {
        this.$delete(this.form, "keyword");
      }
      if (fouce) {
        //都强制刷新了，缓存的选择数据自然要清空
        this.setGroupData({});
      }
      this.loading = true;
      this.data = [];
      //到合作社
      if (this.groupTreeType === 1) {
        // 无选择框的数据到合作社，单选
        if (this.groupTreeIsAll) {
          let sessionTree = sessionStorage.getItem("allGroupTreeData");
          if (typeof sessionTree == "string" && !fouce) {
            this.data = JSON.parse(sessionTree);
          } else {
            let res = await getAllGroupTree();
            let temp = toTreeData(res.data, "id", "pId");
            sessionStorage.setItem("allGroupTreeData", JSON.stringify(temp));

            if (this.groupTreeIsArea) {
              temp = this.filterTree(temp, 2);
            }
            this.data = temp;
          }
          this.getExpandValue();
        } else {
          let sessionTree = sessionStorage.getItem("groupTreeData");
          if (typeof sessionTree == "string" && !fouce) {
            this.data = JSON.parse(sessionTree);
          } else {
            //按用户获取groupTree
            let res = await getGroupTree();
            if (!res.code) {
              let treeArray = res.data;
              let temp = toTreeData(treeArray, "id", "pId");
              sessionStorage.setItem("groupTreeData", JSON.stringify(temp));
              if (this.groupTreeIsArea) {
                temp = this.filterTree(temp, 2);
              }
              this.data = temp;
            }
          }
          this.getExpandValue();
        }
      } else if (this.groupTreeType === 2) {
        let that = this;
        this.$localForage.getItem("machineTreeData").then(async function (val) {
          if (typeof val == "string" && !fouce) {
            that.data = JSON.parse(val);
          } else {
            let res = await getCdMachine();
            that.$localForage.setItem("machineTreeData", JSON.stringify(res));
            that.data = res;
          }
          // el-tree的显示数据
          //console.log("that.data", that.data)
          that.getExpandValue();
        });
      }
    },

    //获取初始值
    getExpandValue() {
      this.loading = false;
      if (this.groupData && this.groupData.ids) {
        this.defaultExpand =
          this.groupData.ids.length > 0
            ? this.groupData.expand
            : [this.data[0].id];
        this.defaltCheckedKeys =
          this.groupData.ids.length > 0
            ? this.groupData.data.map((item) => {
                return item.id;
              })
            : [];
      }
      // if(this.groupData && this.groupData.data){
      //     this.defaultExpand = this.groupData.data.length > 0 ? this.groupData.expand : [this.data[0].id]
      //     // this.defaultCheckKeys = this.groupData.data.length > 0 ? this.groupData.
      //     // this.$refs.tree.setCheckedNode(this.groupData.children.concat(this.groupData.expand))
      //     this.$refs.tree.setCheckedNode(this.groupData.data)
      // }
    },

    // 收起面板
    close() {
      //console.log("groupBox is close");
      this.initData();
      this.setGroupBoxStatus(false);
    },

    searchChange() {
      this.search.change = true;
    },

    // pbw修改
    gotoshow() {
      //console.log("gotoshow:",this.pbwelementarr[this.search.index]);
      setTimeout(() => {
        // //console.log(11111111);
        this.pbwelementarr[this.search.index].scrollIntoView();
        // this.$nextTick(()=>{
        //     //console.log(222222222);
        //     this.pbwelementarr[this.search.index].scrollIntoView();
        // })
      }, 1000);
    },
    // 分组查询
    queryByGroup() {
      if (this.search.change || !this.form.keyword) {
        //console.log("groupBox form.keyword:",this.form.keyword);
        if (!this.form.keyword) return;
        var nodes = this.$refs.tree.store.nodesMap;
        // //console.log(this.$refs.tree);
        // //console.log(nodes);
        this.defaultExpand = [];
        this.search.nodes = [];
        for (var i in nodes) {
          if (nodes[i].label.indexOf(this.form.keyword) >= 0) {
            // //console.log(1111);
            nodes[i].isCurrent = true;
            this.defaultExpand.push(nodes[i].data.id);
            this.search.nodes.push(nodes[i]);
          } else {
            nodes[i].isCurrent = false;
          }
        }
        //console.log("groupBox this.search.node:",this.search.nodes);
        if (this.search.nodes.length > 0) {
          //高亮查询到的第一个节点
          this.$refs.tree.setCurrentKey(this.search.nodes[0].data.id);
          //获取当前节点数据
          //todo:让搜索到的节点显示出来
          // let currentNode = this.$refs.tree.getCurrentNode();
          // let pbwa = this.$refs.tree.getNode(currentNode);
          // //console.log("currentNode", currentNode);
          // //console.log("pbwa", pbwa);
          this.search.index = 0;
          this.$nextTick(() => {
            this.pbwelementarr =
              this.$refs.tree.$el.querySelectorAll(".is-current");
            //console.log("pbwelementarr:", this.pbwelementarr);
            this.gotoshow();
            // this.pbwelementarr = document.querySelectorAll(".is-current");
            // this.pbwelementarr[this.search.index].scrollIntoView();
            // setTimeout(()=>{
            //     this.pbwelementarr[this.search.index].scrollIntoView();
            // },100);
          });
          this.search.change = false;
        }else{

        }
      } else {
        //定位到下一个
        this.search.index++;
        // if (this.search.index >= this.search.nodes.length) {
        if (this.search.index >= this.pbwelementarr.length) {
          this.search.index = 0;
        }
        this.$refs.tree.setCurrentKey(this.search.nodes[this.search.index].id);
        //todo:让搜索到的节点显示出来
        // let currentNode = this.$refs.tree.getCurrentNode();
        // //console.log("currentNode", currentNode);
        this.pbwelementarr[this.search.index].scrollIntoView();
      }
    },

    // 获取被选中的节点的key数组
    handleCheckChange(self, cObj) {
      // this.$refs.tree.setChecked(self.pId, false, false);
      let node = this.$refs.tree.getNode(self);
      if (self.children.length > 0) {
        // 这么做的目的是不让子节点全选中时父节点自动选中，必须是点击父节点才是全选（全不选）
        if (node.checked) {
          // 父级选中，子节点全部选中
          if (self.children.length > 0) {
            this.setStatus(self, true);
          }
        } else {
          if (self.children.length > 0) {
            this.setStatus(self, false);
          }
        }
      }
      this.handleData();
    },
    setStatus(list, isChecked) {
      this.$refs.tree.setChecked(list.id, isChecked);
      for (let i = 0; list.children && i < list.children.length; i++) {
        this.setStatus(list.children[i], isChecked);
      }
    },
    filterNode(value, data) {
      //console.log("filterNode:",value,data);
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 获取选中的数据进行处理保存以便后续使用
    handleData() {
      let checkedNodes = this.$refs.tree.getCheckedNodes();
      let checkedKeys = this.$refs.tree.getCheckedKeys();
      let ids = [], //所有选择的农机ID
        machine = [], //所有选择的农机
        names = [], //所有选择分组名称
        expand = [], //所有选择分组ID
        leaf = []; //所有选择叶子节点
      //回显所有的

      // name:显示的label  ids:保存的农机id  machine:保存的农机信息  data:当前选中的所有节点 expand保存当前打开的节点id用于回显
      checkedNodes.map((check) => {
        // 只要农机id
        if (check.groupAttribute === 6) {
          ids.push(check.id);
          machine.push(check);
        }
        //叶子节点，在选择农机分组时，可能造成部分不在叶子节点的农机分组没有选择上
        if (!check.children || check.children.length === 0) {
          leaf.push(check.id);
        }
      });
      //判断只选择了一台农机
      if (checkedNodes.length === ids.length && ids.length === 1) {
        //console.log("machine", machine)
        names.push(machine[0].name);
        expand.push(machine[0].id);
      } else {
        for (let i = 0; i < checkedNodes.length; i++) {
          let item = checkedNodes[i];
          if (item.groupAttribute === 6) {
            // 如果是农机则显示上级名称
            // //console.log(this.$refs.tree.getNode(item.id), 'node')
            let parent = this.$refs.tree.getNode(item.id).parent;
            // names.push(halfCheckedNodes[halfCheckedNodes.length - 1].name);
            if (!checkedKeys.includes(item.pId)) {
              if (!names.includes(parent.label)) {
                names.push(parent.label);
                expand.push(parent.data.id);
              }
            }
          } else {
            if (!checkedKeys.includes(item.pId)) {
              // 如果当前的父id在选择项中则不保存该项，不在则保存
              names.push(item.name);
              expand.push(item.id);
            }
          }
        }
      }
      //console.log("names, expand, this.data");

      //console.log(names, expand, this.data);
      //console.log(leaf,"leaf")
      // 保存数据
      this.setGroupData({
        name: names.join(","),
        expand: expand,
        ids: ids,
        data: checkedNodes,
        machine: machine,
        children: leaf,
      });
      // //console.log(checkedNodes, 'checked')
    },
    // 节点被点击的事件
    handleNodeClick(obj, node, self) {
      // 如果当前有复选框就返回，交给复选框事件处理
      /*if (this.showCheckBox) {
                    return;
                }*/
      this.current = obj;
      this.nodeData = node;
      //console.log(obj, node, "node");
      // 作为页面组件点击传递事件
      if (this.isSelf) {
        this.$emit("getData", obj);
      }
    },
    getIds(obj) {
      if (obj.childNodes.length > 0) {
        obj.childNodes.map((item) => {
          // item.isLeaf &&
          this.nodeIds.push(item.data.id);
          item.childNodes.length > 0 && this.getIds(item);
        });
      }
    },
    // 确认操作
    submit() {
      // 保存数据
      this.nodeIds = [];
      this.getIds(this.nodeData);
      this.nodeIds.unshift(this.current.id);
      //console.log(this.nodeIds, "ids");
      this.setGroupData({
        name: this.current.name,
        ids: this.nodeIds,
        expand: [this.current.id],
        data: this.current,
      });
      this.setGroupBoxStatus(false);
    },
  },
};
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
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDQ4OCwgMjAyMC8wNy8xMC0yMjowNjo1MyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjZmU5ODI2Ny02MTZhLTliNDUtYmQ3MC1mNjJlNDNlODQ2MmMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NENDRTBDNjAwQzgyMTFFQzlCN0I4RTI0M0ZGREIyMjkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NENDRTBDNUYwQzgyMTFFQzlCN0I4RTI0M0ZGREIyMjkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YmZjMWJjZTYtYzVkOS0xNzQ5LTkwZGQtZjhhNWE4Yzk1MzY0IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MWQwNzliZmEtMjg1Mi1lNzQ2LWFmNTktMDY2YWRiZTQxNWI0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+g5vTzgAAAEBJREFUeNpi/P//PwMuwAIiPFoOMQIpJiBmhIr/21Fj948FymGCKYSC/zBB/MZCVf5DMvY/uuRfdGMZ8bkWIMAAi9oSDBnxIm0AAAAASUVORK5CYII=)
    repeat;
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
      clear: both;
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

      .isSelf {
        width: 90%;
      }
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

      /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
      .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #1298f8;
        border-radius: 2px;
        border-color: #1298f8;
      }

      /deep/ .el-tree-node__content:hover,
      /deep/ .el-tree-node:focus {
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

      /deep/ .el-tree-node > .el-tree-node__children {
        overflow: unset;
      }

      /deep/ .el-icon-caret-right:before {
        content: url("../../assets/images/arrow-right.png");
      }

      /deep/ .el-tree-node__content > .el-tree-node__expand-icon {
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