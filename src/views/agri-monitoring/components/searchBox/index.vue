<template>
    <!-- 查询组件 -->
    <div class="pbw_animationBox">
        <div :class="show? 'hideicon' : 'showicon'" @click="close">
            <button class="pbw_button"> 点击查询</button>
        </div>

        <div class="search-box" :class="show ? 'show':'hide'">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <div class="search-type">
                        <div
                                :class="{'active': currentType.value === item.value}"
                                v-for="(item) in searchTypes"
                                :key="item.value"
                                @click="changeType(item)">
                            <img src="img/monitoring/icon-title.png" alt="">
                            <span>{{item.label}}</span>
                        </div>
                    </div>
                    <el-button style="float: right; padding-top: 15px;" type="text" @click="close">
                        <img src="img/monitoring/icon_expand.png" :class="{'rightimg':!show}" alt="">
                    </el-button>
                </div>
                <div class="form-con" v-show="currentType.value === 2">
                    <el-form class="my-form" label-position="right" label-width="80px" :model="form">
                        <el-form-item label="农机分组:">
                            <el-input v-model="groupData.name" placeholder="农机分组" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="农机类型:">
                            <el-select v-model="form.machineType" style="width:100%;" placeholder="请选择农机类型">
                                <el-option v-for="item in carTypes" :key="item.itemName" :label="item.itemName"
                                           :value="item.itemCode"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="农机车牌:">
                            <el-input v-model="form.plateNumber" placeholder="请输入农机车牌"></el-input>
                        </el-form-item>
                        <el-form-item label="终端编号:">
                            <el-input v-model="form.terminalCode" placeholder="请输入终端编号"></el-input>
                        </el-form-item>
                        <el-form-item label="机手姓名:">
                            <el-input v-model="form.ownerName" placeholder="请输入机手姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="机主电话:">
                            <el-input v-model="form.ownerPhone" placeholder="请输入机主电话"></el-input>
                        </el-form-item>
                        <el-form-item class="btns">
                            <el-button round type="primary" class="primary-btn-plain" plain @click="clear">清空
                            </el-button>
                            <el-button type="primary" class="primary-btn" round
                                       @click="searchMachines()" v-if="btnPermis.btnView">查询
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <div class="list-con">
                        <div style="height:100%;" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.1)">
                            <div
                                    :class="['list', {'active' : currentIndex == index}]"
                                    v-for="(item,index) in list"
                                    :key="index"
                                    @click="handleItemClick(item, index)">
                                <div class="index">{{(page.currentPage - 1) * page.pageSize + index + 1}}</div>
                                <div class="time">{{item.plateNumber}}</div>
                                <div class="type">{{typeFilter(item.machineType)}}</div>
                                <div class="area">
                                    <span :title="item.ownerName+ '-' + item.ownerPhone">{{item.ownerName || '暂无'}}-{{item.ownerPhone || '暂无'}}</span>
                                    <span>{{item.terminalCode ? 'NO.' + item.terminalCode : '暂无终端编号'}}</span>
                                </div>
                            </div>
                            <span class="nodata" v-if="nodata">暂无数据</span>
                        </div>
                    </div>
                    <pagination
                            v-if="list.length > 0"
                            style="margin-top:16px;"
                            :currentPage="page.currentPage"
                            :pageSize="page.pageSize"
                            :total="page.total"
                            Layout="sizes, prev, slot, next, ->, total"
                            @current-change="handleCurrentChange"
                            @size-change="handleSizeChange"/>
                    <span class="nodata" v-if="nodata">暂无数据</span>
                </div>
                <div class="groups-con" v-show="currentType.value === 1">
                    <groupBox
                            class="self-box"
                            :showCheckBox="true"
                            :treeType="2"
                            :isSelf="true"
                            @getData="locateMachine"/>
                    <el-button type="primary" class="shadow-btn" round @click="searchMachines()">查询
                    </el-button>
                    <!-- <el-form class="my-form" label-position="right" :model="form">
                      <el-form-item>
                        <el-input v-model="form.keyword" placeholder="请输入关键字查询">
                          <template #suffix>
                            <img style="margin-top:8px;margin-right:10px;cursor:pointer;" src="img/monitoring/icon_query.png" alt="" @click="queryByGroup">
                          </template>
                        </el-input>
                      </el-form-item>
                    </el-form>
                    <el-tree
                      :data="data"
                      show-checkbox
                      node-key="id"
                      :default-expanded-keys="[2, 3]"
                      :default-checked-keys="[5]"
                      :props="defaultProps"
                      @getCheckedKeys="getCheckedKeys">
                    </el-tree> -->
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    import {getMachineTypeDict, getMachineOverview, queryLocation, pageQueryLocation} from '@/api/monitoring/index'
    import {getDictByListType} from '@/api/basic/index'
    import pagination from '_com/myPagination/index'
    import {filterDict} from '@/util/util.js'
    import groupBox from '_com/groupBox/index'
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: 'searchBox',
        components: {
            pagination,
            groupBox
        },
        props: {
            refreshFlag: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                searchTypes: [
                    {label: '分组查询', value: 1},
                    {label: '条件查询', value: 2},
                ],
                carTypes: [],
                currentType: {},
                //form: {plateNumber:'鄂0163007'},
                form: {plateNumber: ''},
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                checkedKeys: [],
                list: [],
                nodata: false,
                currentIndex: -1,
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                loading: false, // 加载中状态
                btnPermis: {  //按钮权限
                    btnView: true,
                },
                show: true,
                parameters: {},
                refreshInterval: null
            }
        },
        computed: {
            ...mapGetters(['groupData', 'permissions', "globalSetting"])
        },

        watch: {
            'globalSetting.jobType': {
                handler: function (newval) {
                    //延时一秒，等待清空groupData
                    // setTimeout(() => this.searchMachines(1), 1000)
                    setTimeout(() => this.searchMachines(1), 500)
                },
                deep: true
            }
        },
        created() {
            this.setGroupBoxType(2);
            this.getBtnPermis();
            this.initCarTypes();
            this.changeType(this.searchTypes[0]);
            this.searchMachines(true, true, false)
            //
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
            }
            //默认一分钟刷新一次
            this.refreshInterval = setInterval(() => {
                if (this.refreshFlag) this.searchMachines(true, true, false)
            }, (this.globalSetting.refreshSpan || 120 * 1000) > 120 * 1000 ? this.globalSetting.refreshSpan : 120 * 1000)
        },
        methods: {
            ...mapMutations({
                setGroupBoxType: 'setGroupBoxType',
            }),
            getBtnPermis() {
                this.btnPermis.btnView = this.permissions[window.global.buttonPremission.monitorView];
                //console.log('this.permissions', this.permissions)
            },
            // 请求农机字典数据
            async initCarTypes() {
                let params = {
                    listType: 'machine_type'
                }
                let res = await getDictByListType(params);
                let {code, data} = res;
                if (code == 0) {
                    this.carTypes = data;
                }
            },
            // 农机类型字典回显
            typeFilter(value) {
                return filterDict(value, {labelKey: 'itemName', valueKey: 'itemCode'}, this.carTypes)
            },
            // 切换查询模式
            changeType(item) {
                this.currentType = item;
            },
            // 收起面板
            close() {
                this.show = !this.show;
            },
            clear() {
                this.form = {}
            },

            // 查询结果点击某一项
            handleItemClick(item, index) {
                this.currentIndex = index;
                this.$emit('select', item)
            },

            locateMachine(data) {
                // //console.log("searchBox:1111111111111");
                if (data.groupAttribute * 1 === 6) {
                    let machine = Object.assign({}, data, {machineId: data.id});
                    this.$emit('select', machine);
                    //console.log("searchBox:", machine);
                }
            },
            // 分页当前页改变
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.queryPage(this.parameters, this.page, true)
            },
            // 分页页数改变
            handleSizeChange(val) {
                // this.page.currentPage = 1;
                this.page.pageSize = val;
                this.queryPage(this.parameters, this.page, true)
            },
            //分组查询按钮
            async searchMachines(statictis = true, loacation = true, page = true) {
                // 保存数据 提交事件交给地图操作
                this.page.currentPage = 1;
                this.list = [];
                this.$emit('changeLoading', true);
                //console.log("searchBox this.groupData.ids:", this.groupData.ids);
                let ids = this.groupData.ids;
                if (ids && ids.length > 0) {
                    ids = ids.join(',');
                } else {
                    ids = '';
                }
                //try{
                this.parameters = Object.assign({}, this.form, {machineIdS: ids}, {jobType: this.globalSetting.jobType})

                if (statictis) {
                    this.$emit('getOverview', this.parameters);
                }
                if (loacation) {
                    await this.queryLocation(this.parameters);
                }
                if (page) {
                    await this.queryPage(this.page, this.parameters)
                }
                if (page) {
                    this.currentType = Object.assign({}, this.searchTypes[1])
                }
                /*  }catch (e) {
                        //console.log(e)
                  }*/

                this.$emit('changeLoading', false);
            },
            // 条件查询 参数为了每次查询时保证当前页是第一页
            async queryPage(page, param, isShowLoad = false) {
                //console.log("searchBox 条件查询 formdata:", param);
                let params = Object.assign({}, page, param)
                if (isShowLoad) {
                    this.loading = true
                }
                let res = await pageQueryLocation(params);
                this.loading = false
                let {code, data} = res;
                if (code === 0) {
                    /* data.list.forEach(element => {
                         element.geometryType = "Point"
                         element.coordinates = [element.lon, element.lat];
                     });*/
                    this.list = data.list;
                    this.nodata = this.list.length <= 0;
                    this.page.total = data.total;
                } else {
                    this.$message.error(msg || '分页查询失败')
                }
                // this.$emit('getResult', this.form);
            },
            // 分组查询
            async queryLocation(params) {
                //console.log("searchBox 分组查询 formdata:", params);
                let res = await queryLocation(params);
                //console.log("queryLocation", res)
                const {code, data} = res;
                if (code == 0) {
                    // 传递数据上图
                    Array.isArray(data) ? data.forEach(element => {
                        element.geometryType = "Point"
                        element.coordinates = [element.lon, element.lat];
                    }) : [];
                    this.$emit('getData', data);
                }
            },
            // 获取被选中的节点的key数组
            getCheckedKeys(keys) {
                this.checkedKeys = keys;
            },
        },
        beforeDestroy() {
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
            }
        }
    }
</script>

<style lang="less" scoped>
    .pbw_animationBox {
        height: calc(100% - 10px);
        position: relative;
    }

    .pbw_button {
        background-color: #07223c;
        color: white;
    }

    .hideicon {
        display: none;
    }

    .showicon {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
    }

    .hide {
        animation: hideanimation 1s linear forwards;
    }

    .show {
        animation: showanimation 1s linear forwards;
    }

    .rightimg {
        animation: imganimation 0.5s linear forwards;
    }

    @keyframes hideanimation {
        from {
            margin-left: 0;
        }
        to {
            margin-left: -400px;
        }
    }

    @keyframes showanimation {
        from {
            margin-left: -400px;
        }
        to {
            margin-left: 0;
        }
    }

    @keyframes imganimation {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(180deg);
        }
    }

    .search-box {
        width: 400px;
        height: 100%;
        position: relative;
        z-index: 1;
        background: @base-darkBlue;

        .box-card {
            height: 100%;
            background: @base-darkBlue;

            /deep/ .el-card__body {
                height: calc(100% - 75px);
                padding: 20px 20px 0 20px;
            }

            .clearfix:after {
                clear: both
            }

            .search-type {
                display: inline-flex;
                line-height: 48px;
                text-align: center;
                color: @base-fontColor;

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

            .form-con {
                height: 100%;

                .my-form {
                    border-bottom: 1px solid #0d2346;
                }

                .el-form-item {
                    margin-bottom: 10px;
                }

                .list-con {
                    margin-top: 20px;
                    padding: 0 10px;
                    height: calc(100% - 405px);
                    overflow-y: auto;
                    text-align: center;

                    .list {
                        width: 100%;
                        display: grid;
                        grid-template-columns: 25px 218px 94px;
                        grid-template-rows: 36px 36px;
                        grid-template-areas: 'a b c' 'a d d';
                        background: #07223c;
                        margin-bottom: 10px;
                        color: @base-fontColor;
                        text-align: center;
                        cursor: pointer;

                        .index {
                            grid-area: a;
                            background-color: #194260;
                            line-height: 72px;
                        }

                        .time {
                            grid-area: b;
                            border-right: 1px solid #2e7fa5;
                            line-height: 36px;
                            padding-left: 13px;
                            text-align: left;
                        }

                        .type {
                            line-height: 36px;
                            color: #80c5ff;
                            grid-area: c;
                        }

                        .area {
                            display: flex;
                            align-items: center;
                            line-height: 36px;
                            grid-area: d;
                            text-align: left;
                            border-top: 1px solid #2e7fa5;

                            span:first-child {
                                display: inline-block;
                                width: 155px;
                                margin-left: 13px;
                                margin-right: 5px;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden;
                            }

                            span:last-child {
                                vertical-align: top;
                            }

                            .clearfix:after {
                                clear: both
                            }

                            .search-type {
                                display: inline-flex;
                                line-height: 48px;
                                text-align: center;
                                color: @base-fontColor;

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


                        }

                    }

                    .active {
                        background-image: linear-gradient(90deg,
                        #061d28 0%,
                        #1a92cb 100%),
                        linear-gradient(#1f5278,
                        #1f5278);

                        .index {
                            background-color: #0a374c;
                        }
                    }

                    .nodata {
                        text-align: center;
                        color: @base-fontColor;
                        line-height: 100px;
                    }

                }
            }

            .el-tree {
                background: @base-darkBlue;
                color: @base-fontColor;

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
            }

            .groups-con {
                height: 100%;

                .shadow-btn {
                    height: 35px;
                    float: right;
                }
            }

            .self-box {
                position: unset;
                background: transparent;
                width: 100%;
                height: 95%;

                /deep/ .el-card__body {
                    height: 100%;
                    padding: 0;
                }

                .group-box {
                    .box-card {
                        background: transparent !important;
                    }
                }

                div {
                    position: unset;
                }
            }
        }
    }
</style>