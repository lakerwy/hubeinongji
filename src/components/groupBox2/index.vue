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
                            <span>分组农机</span>
                        </div>
                    </div>
                </div>
                <div class="groups-con">
                    <el-form
                            class="my-form tree-form"
                            label-position="right"
                            :model="form"
                    >
                        <el-form-item>
                            <el-input
                                    v-model="form.keyword"
                                    placeholder="输入分组查找"
                                    @input="searchChange"
                                    style="width: 90%"
                            >
                                <template #suffix>
                                    <img
                                            style="margin-top: 8px; margin-right: 10px; cursor: pointer"
                                            src="img/monitoring/icon_query.png"
                                            alt=""
                                            @click="queryByGroup"
                                    />
                                </template>
                            </el-input>
                            <el-button
                                    style="float: right"
                                    type="text"
                                    @click="initData(true)"
                            >
                                <img style="margin-top: -5px" src="img/icon_refresh.png" alt=""/>
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
                            :default-expanded-keys="defaultExpand"
                            :default-checked-keys="defaltCheckedKeys"
                            :props="defaultProps"
                            @check="handleCheckChange"
                            @node-click="handleNodeClick"
                    >
                    </el-tree>

                    <div class="btns" v-show="!showCheckBox && !isSelf">
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
    </div>
</template>

<script>
    import {mapMutations, mapGetters} from "vuex";
    import {getGroupTree, getCdMachine, getAllGroupTree} from "@/api/admin/group";
    import {toTreeData} from "@/util/util";

    export default {
        name: "searchBox",
        data() {
            return {
                form: {},
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
                loading: false,
                search: {},
                pbwelementarr: []
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
            checkedKeys: {
                type: Array,
                default: () => [],
            },
        },
        computed: {
            ...mapGetters(["groupData"]),
        },
        created() {
            //console.log("groupbox is created");
            this.initData();
        },
        // updated(){
        //   //console.log("groupbox is updated");
        // },
        watch: {
            checkedKeys(newVal, oldVal) {
                //console.log("值进来了");
                if (newVal) {
                    this.setCheckKeys(newVal);
                }
            },
        },
        methods: {
            ...mapMutations({
                setGroupData: "setGroupData",
                setGroupBoxStatus: "setGroupBoxStatus",
            }),
            // 初始化数据
            async initData(force) {
                //console.log("groupbox is initData");
                if (this.form.keyword) {
                    this.$delete(this.form, "keyword");
                }
                this.loading = true;
                this.data = [];
                // 有选择框的表示数据到农机，可选农机
                if (this.treeType === 1) {
                    // 无选择框的数据到合作社，单选/需要做缓存
                    if (this.isAll) {
                        let sessionTree = sessionStorage.getItem("allGroupTreeData");
                        if (typeof sessionTree == "string" && !force) {
                            this.data = JSON.parse(sessionTree);
                        } else {
                            let res = await getAllGroupTree();
                            let temp = toTreeData(res.data, "id", "pId");
                            sessionStorage.setItem("allGroupTreeData", JSON.stringify(temp));
                            this.data = temp;
                        }
                    } else {
                        let sessionTree = sessionStorage.getItem("groupTreeData");
                        if (typeof sessionTree == "string" && !force) {
                            this.data = JSON.parse(sessionTree);
                        } else {
                            //按用户获取groupTree
                            let res = await getGroupTree();
                            if (!res.code) {
                                let temp = toTreeData(res.data, "id", "pId");
                                sessionStorage.setItem("groupTreeData", JSON.stringify(temp));
                                this.data = temp;
                            }
                        }
                    }
                    this.getExpandValue2();
                } else if (this.treeType === 2) {
                    let that = this;
                    this.$localForage.getItem("machineTreeData").then(async function (val) {
                        if (typeof val == "string" && !force) {
                            that.data = JSON.parse(val);
                        } else {
                            let res = await getCdMachine();
                            that.$localForage.setItem("machineTreeData", JSON.stringify(res));
                            that.data = res;
                        }
                        that.getExpandValue();
                    });
                }
            },
            getExpandValue2() {
                this.loading = false;
                this.defaultExpand = [this.data[0].id];
                if (this.checkedKeys && this.checkedKeys.length > 0) {
                    this.defaltCheckedKeys = Object.assign([], this.checkedKeys);
                    this.defaultExpand = [this.checkedKeys[0]];
                } else {
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
            },
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

            },
            // 收起面板
            close() {
                this.initData();
                this.setGroupBoxStatus(false);
            },
            searchChange() {
                this.search.change = true;
            },

            // pbw修改
            gotoshow() {
                //console.log("gotoshow:", this.pbwelementarr[this.search.index]);
                setTimeout(() => {
                    this.pbwelementarr[this.search.index].scrollIntoView();
                }, 1000);
            },
            // 分组查询
            queryByGroup() {
                if (this.search.change) {
                    if (!this.form.keyword) return;
                    var nodes = this.$refs.tree.store.nodesMap;
                    this.defaultExpand = [];
                    this.search.nodes = [];
                    for (var i in nodes) {
                        if (nodes[i].label.indexOf(this.form.keyword) >= 0) {
                            nodes[i].isCurrent = true;
                            this.defaultExpand.push(nodes[i].data.id);
                            this.search.nodes.push(nodes[i]);
                        } else {
                            nodes[i].isCurrent = false;
                        }
                    }
                    //console.log("groupBox this.search.node:", this.search.nodes);
                    if (this.search.nodes.length > 0) {
                        //高亮查询到的第一个节点
                        this.$refs.tree.setCurrentKey(this.search.nodes[0].data.id);
                        //获取当前节点数据
                        //todo:让搜索到的节点显示出来
                        this.search.index = 0;
                        this.$nextTick(() => {
                            this.pbwelementarr = this.$refs.tree.$el.querySelectorAll(".is-current");
                            //console.log("pbwelementarr:", this.pbwelementarr);
                            this.gotoshow();
                        });
                        this.search.change = false;
                    }
                } else {
                    //定位到下一个
                    this.search.index++;
                    if (this.search.index >= this.pbwelementarr.length) {
                        this.search.index = 0;
                    }
                    this.$refs.tree.setCurrentKey(this.search.nodes[this.search.index].id);
                    //todo:让搜索到的节点显示出来
                    this.pbwelementarr[this.search.index].scrollIntoView();
                }
            },
            // 获取被选中的节点的key数组
            handleCheckChange(self, cObj) {
                /*this.$refs.tree.setChecked(self.pId, false, false)
                          let node = this.$refs.tree.getNode(self);
                          if (self.children.length > 0) {
                              // 这么做的目的是不让子节点全选中时父节点自动选中，必须是点击父节点才是全选（全不选）
                              if (node.checked) {
                                  // 父级选中，子节点全部选中
                                  if (self.children.length > 0) {
                                      this.setStatus(self, true)
                                  }
                              } else {
                                  if (self.children.length > 0) {
                                      this.setStatus(self, false)
                                  }
                              }
                          }*/
                this.handleData();
            },
            setStatus(list, isChecked) {
                this.$refs.tree.setChecked(list.id, isChecked);
                for (let i = 0; i < list.children.length; i++) {
                    this.setStatus(list.children[i], isChecked);
                }
            },
            // 获取选中的数据进行处理保存以便后续使用
            handleData() {
                let checkedNodes = this.$refs.tree.getCheckedNodes();
                let checkedKeys = this.$refs.tree.getCheckedKeys();
                this.$emit("getCheckData", checkedNodes);
            },
            // 节点被点击的事件
            handleNodeClick(obj, node, self) {
                // 如果当前有复选框就返回，交给复选框事件处理
                //console.log(obj, node, self);
                if (this.showCheckBox) {
                    return;
                }
                this.current = obj;
                // 作为页面组件点击传递事件
                if (this.isSelf) {
                    this.$emit("getData", node.data);
                }
            },
            // 确认操作
            submit() {
                // 保存数据
                this.setGroupData({
                    name: this.current.name,
                    ids: [this.current.id],
                    data: this.current,
                });
                this.setGroupBoxStatus(false);
            },
            setCheckKeys(val) {
                this.$refs.tree.setCheckedKeys(val);
                if (val.length > 0) {
                    this.$refs.tree.setCurrentKey(val[0]);
                    this.defaultExpand = Object.assign([], val);
                }
            },
        },
    };
</script>

<style lang="less" scoped>
    .group {
        // pbw修改样式一致
        width: 90%;

        // width: 350px;
        // height: 82%;
        // max-height: 824px;
        height: 100%;
        position: absolute;
        // top: 160px;
        // left: 26px;
        // background: @base-darkBlue;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDQ4OCwgMjAyMC8wNy8xMC0yMjowNjo1MyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjZmU5ODI2Ny02MTZhLTliNDUtYmQ3MC1mNjJlNDNlODQ2MmMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NENDRTBDNjAwQzgyMTFFQzlCN0I4RTI0M0ZGREIyMjkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NENDRTBDNUYwQzgyMTFFQzlCN0I4RTI0M0ZGREIyMjkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YmZjMWJjZTYtYzVkOS0xNzQ5LTkwZGQtZjhhNWE4Yzk1MzY0IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MWQwNzliZmEtMjg1Mi1lNzQ2LWFmNTktMDY2YWRiZTQxNWI0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+g5vTzgAAAEBJREFUeNpi/P//PwMuwAIiPFoOMQIpJiBmhIr/21Fj948FymGCKYSC/zBB/MZCVf5DMvY/uuRfdGMZ8bkWIMAAi9oSDBnxIm0AAAAASUVORK5CYII=) repeat;
        background-color: #0d2750;
        z-index: 1000;
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
                height: calc(100% - 107px);
                overflow: auto;

                /deep/ .el-checkbox__inner {
                    background: transparent;
                    border: 1px solid @base-fontColor;
                }

                /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
                .el-checkbox__input.is-indeterminate .el-checkbox__inner {
                    background-color: #1298f8 !important;
                    border-radius: 2px !important;
                    border-color: #1298f8 !important;
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
            // padding-bottom: 12px;
            height: 100%;
        }
    }
</style>