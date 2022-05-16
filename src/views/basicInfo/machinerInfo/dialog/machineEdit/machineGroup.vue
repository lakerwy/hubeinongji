<template>
  <div class="groups">
    <el-tree
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.1)"
      ref="tree"
      :data="data"
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
  </div>
</template>

<script>
import { getGroupTree } from "@/api/admin/group";
import { toTreeData } from "@/util/util";

export default {
  name: "machineGroup",
  props: ["defaultGroup"],
  data() {
    return {
      showGroup: false,
      loading: false,
      data: [],
      defaultExpand: [],
      defaltCheckedKeys: [],
      defaultProps: {
        children: "children",
        label: "name",
        value: "id",
      },
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      this.data = [];
      let sessionTree = sessionStorage.getItem("groupTreeData");
      if (typeof sessionTree == "string") {
        this.data = JSON.parse(sessionTree);
      } else {
        //按用户获取groupTree
        this.loading = true;
        let res = await getGroupTree();
        if (!res.code) {
          let temp = toTreeData(res.data, "id", "pId");
          sessionStorage.setItem("groupTreeData", JSON.stringify(temp));
          this.data = temp;
          this.loading = false;
        }
      }
      this.defaultExpand = this.defaultGroup;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 获取被选中的节点的key数组
    handleCheckChange(self, cObj) {
      this.$refs.tree.setChecked(self.pId, false, false);
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
      for (let i = 0; i < list.children.length; i++) {
        this.setStatus(list.children[i], isChecked);
      }
    },
    //
    handleData() {},
    // 节点被点击的事件
    handleNodeClick(obj, node, self) {
      //console.log(obj.groupAttribute)
      // debugger;
      if ((obj.groupAttribute == 5 || obj.groupAttribute == 9)) {
        this.current = obj;
        this.nodeData = node;
        //console.log(obj, node, "node");
        // 作为页面组件点击传递事件
        this.$emit("getData", obj);
      } else {
        this.$message({
                type: 'error',
                message: "分组必须是合作社或个人终端",
              });
      }
    },
  },
};
</script>

<style scoped lang="less">
.groups {
  position: absolute;
  width: 100%;
  height: 200px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDQ4OCwgMjAyMC8wNy8xMC0yMjowNjo1MyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjZmU5ODI2Ny02MTZhLTliNDUtYmQ3MC1mNjJlNDNlODQ2MmMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NENDRTBDNjAwQzgyMTFFQzlCN0I4RTI0M0ZGREIyMjkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NENDRTBDNUYwQzgyMTFFQzlCN0I4RTI0M0ZGREIyMjkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YmZjMWJjZTYtYzVkOS0xNzQ5LTkwZGQtZjhhNWE4Yzk1MzY0IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MWQwNzliZmEtMjg1Mi1lNzQ2LWFmNTktMDY2YWRiZTQxNWI0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+g5vTzgAAAEBJREFUeNpi/P//PwMuwAIiPFoOMQIpJiBmhIr/21Fj948FymGCKYSC/zBB/MZCVf5DMvY/uuRfdGMZ8bkWIMAAi9oSDBnxIm0AAAAASUVORK5CYII=)
    repeat;
  background-color: #0d2750;
  z-index: 9999;
  overflow: hidden;
}
.el-tree {
  // background: @base-darkBlue;
  background: transparent;
  // color: @base-fontColor;
  color: #c4d8e9;
  //margin-bottom: 10px;
  height: calc(100% - 10px);
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
    content: url("../../../../../assets/images/arrow-right.png");
  }
  /deep/ .el-tree-node__content > .el-tree-node__expand-icon {
    padding-right: 10px;
  }
}
</style>