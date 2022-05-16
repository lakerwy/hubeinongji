<template v-if="show">
    <!-- 全局设置 -->

    <div class="settings">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <div class="search-type">
                    <div
                            :class="{ active: currentType.value === item.value }"
                            v-for="item in searchTypes"
                            :key="item.value"
                            @click="changeType(item)"
                    >
                        <span>{{ item.label }}</span>
                    </div>
                </div>
                <el-button
                        style="float: right; padding-top: 15px"
                        type="text"
                        @click="close"
                >
                    <img src="img/monitoring/icon-close.png" alt=""/>
                </el-button>
            </div>
            <div class="form-con" v-show="currentType.value === 1">
                <el-form
                        class="my-form"
                        label-position="left"
                        label-width="110px"
                        :model="form"
                >
                    <el-radio-group v-model="form.jobType" size="medium" :max="1">
                        <el-form-item label="全部作业">
                            <el-radio-button label=""> 全部作业类型</el-radio-button>
                        </el-form-item>
                        <el-form-item :label="item.jobTypeName" v-for="item in formItems">
                            <el-radio-button v-for="t in item.children" :label="t.jobType">
                                {{ t.jobTypeName }}
                            </el-radio-button>
                        </el-form-item>
                    </el-radio-group>
                </el-form>
            </div>
            <div class="form-con" v-show="currentType.value === 2">
                <el-form class="my-form" label-position="left" :model="form">
                    <el-form-item>
                        <el-radio-group
                                v-model="form.season"
                                size="medium"
                                :max="1"
                                @change="changeSeason"
                        >
                            <el-radio-button
                                    v-for="t in seasonTypes"
                                    :label="t.rowId"
                                    :title="t.seasonName"
                            >
                                <p>{{ t.seasonName }}</p>
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <div v-title :data-title="form.userTitle"></div>
            <div class="form-con" v-show="currentType.value === 3">
                <el-form class="my-form" label-position="left" :model="form">
                    <el-form-item
                            label="系统标题设置(请输入不超过15字的系统标题，以达到最佳的显示效果)"
                    >
                        <el-input
                                v-model="form.userTitle"
                                :disabled="true"
                                placeholder="请输入首页标题"
                        />
                    </el-form-item>

                    <el-form-item label="首页地图显示配置">
                        <el-select
                                v-model="form.provinceValue"
                                placeholder="请选择省"
                                @change="selectProvimce"
                                clearable
                        >
                            <el-option
                                    v-for="(item, index) of provincearr"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.id"
                            ></el-option>
                        </el-select>
                        <el-select
                                v-model="form.cityValue"
                                placeholder="请选择市"
                                @change="selectcity"
                                clearable
                                style="margin-left: 10px"
                        >
                            <el-option
                                    v-for="(item, index) of cityarr"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.id"
                            ></el-option>
                        </el-select>
                        <el-select
                                placeholder="请选择县"
                                v-model="form.regionValue"
                                style="margin-left: 10px"
                                clearable
                        >
                            <el-option
                                    v-for="(item, index) of regionarr"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="农机监控刷新频率">
                        <el-select
                                v-model="form.refreshSpan"
                                placeholder="农机监控刷新频率"
                        >
                            <el-option
                                    v-for="(item, index) of refreshSpans"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div class="footer">
                <el-button type="primary" class="shadow-btn" round @click="save"
                >设为默认
                </el-button
                >
                <el-button type="primary" class="shadow-btn" round @click="ok"
                >确 定
                </el-button
                >
                <el-button type="primary" class="shadow-btn" round @click="close"
                >退 出
                </el-button
                >
            </div>
        </el-card>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from "vuex";
    import {
        fetchJobTypeTree,
        fetchSeasons,
        fetchGlobalSetting,
        saveGlobalSetting,
    } from "@/api/admin/setting";
    import {isArray} from "@/util/util";
    import {province} from "@/util/map";

    export default {
        name: "searchBox",
        data() {
            return {
                searchTypes: [
                    {label: "作业类型", value: 1},
                    {label: "作业季", value: 2},
                    {label: "其他设置", value: 3},
                ],
                refreshSpans: [
                    {label: "120秒", value: "120000"},
                    {label: "5分钟", value: "300000"},
                    {label: "10分钟", value: "600000"},
                ],
                formItems: [],
                seasonTypes: [],
                currentType: 1,
                type: "",
                jobType: "1",
                form: {
                    jobType: "",
                    mapCode: "",
                    season: "",
                    refreshSpan: 5,
                    provinceValue: "",
                    cityValue: "",
                    regionValue: "",
                },
                season: [],
                province: [],
                cityarr: [],
                regionarr: [],
                provincearr: [],
            };
        },
        computed: {
            ...mapGetters(["globalSetting"]),
        },
        created() {
            this.provincearr = province;
            this.initJobType();
            this.changeType(this.searchTypes[0]);
            this.initGlobalSetting();
            // debugger
        },
        methods: {
            ...mapMutations({
                setSettings: "setGlobalSetting",
            }),
            async initGlobalSetting() {
                if (this.globalSetting) {
                    //console.log("this.globalSetting", this.globalSetting);
                    this.form = Object.assign({}, this.globalSetting);
                } else {
                    let res = await fetchGlobalSetting();
                    if (res.data && res.code === 0) {
                        this.form = {};
                        if (isArray(res.data)) {
                            res.data.forEach((item) => {
                                this.form[item.itemCode] = item.itemValue;
                            });
                        }
                    }
                    if (!this.form.jobType) this.form.jobType = "";
                    if (!this.form.refreshSpan) this.form.refreshSpan = 15;
                    this.setSettings(Object.assign({}, this.form));
                }
                if (this.form.provinceValue) {
                    this.selectProvimce(this.form.provinceValue);
                }
                if (this.form.cityValue) {
                    this.selectcity(this.form.cityValue);
                }
                this.form.userTitle = this.form.userTitle || "湖北省北斗农机信息化智能管理系统";
            },
            initJobType() {
                fetchJobTypeTree().then((res) => {
                    if (res.data) {
                        this.formItems = [...this.toJobTree(res.data)];
                    }
                });
            },
            // 切换查询模式
            changeType(item) {
                this.currentType = item;
                if (this.currentType.value === 2) {
                    //获取作业季
                    fetchSeasons({jobType: this.form.jobType}).then((res) => {
                        if (res.data) {
                            this.seasonTypes = [...res.data];
                            if (!this.form.season && this.seasonTypes.length > 0) {
                                this.form.season = this.seasonTypes[0].rowId;
                                this.form.bTime = this.seasonTypes[0].startTime;
                                this.form.eTime = this.seasonTypes[0].endTime;
                            }
                        }
                    });
                }
            },
            changeSeason(val) {
                let res = this.seasonTypes.find((item) => {
                    return item.rowId === val;
                });
                if (res) {
                    this.form.bTime = res.startTime;
                    this.form.eTime = res.endTime;
                }
            },
            toJobTree(obj) {
                if (!obj || obj.length == 0 || !isArray(obj)) {
                    return;
                }
                //只做两层
                let res = obj.filter((item) => {
                    return item.parentId === 0;
                });
                if (res.length > 0) {
                    res.forEach((item) => {
                        obj.forEach((item1) => {
                            if (item1.parentId === item.rowId) {
                                if (item1.jobType) {
                                    (item.children || (item.children = [])).push(item1);
                                }
                                obj.forEach((item2) => {
                                    if (item2.parentId === item1.rowId && item2.jobType) {
                                        (item.children || (item.children = [])).push(item2);
                                    }
                                });
                            }
                        });
                    });
                }
                //console.log("toJobTree", res);
                return res;
            },
            // 保存设置
            ok() {
                this.form.mapCode =
                    this.form.regionValue || this.form.cityValue || this.form.provinceValue;
                this.setSettings(Object.assign({}, this.form));
                this.$message.success("已更改");
                this.close();
            },
            save() {
                this.form.mapCode =
                    this.form.regionValue || this.form.cityValue || this.form.provinceValue;
                this.setSettings(Object.assign({}, this.form));
                saveGlobalSetting(this.form).then((res) => {
                    this.$message.success("设置成功");
                    this.close();
                });
            },
            // 收起面板
            close() {
                this.$emit("close", false);
            },
            selectProvimce(id) {
                this.cityarr = [];
                this.regionarr = [];
                for (let item of this.provincearr) {
                    if (id == item.id) {
                        //console.log(item);
                        this.cityarr = item.children;
                    }
                }
            },
            selectcity(id) {
                this.regionarr = [];
                for (let item of this.cityarr) {
                    if (id == item.id) {
                        this.regionarr = item.children;
                    }
                }
            },
        },
    };
</script>

<style lang="less" scoped>
    .settings {
        width: 850px;
        height: 625px;
        position: absolute;
        top: 80px;
        right: 185px;
        z-index: 2000;

        .box-card {
            position: relative;
            background-color: rgba(13, 39, 80, 0.95);
            box-shadow: inset 2px 0px 16px 0px rgba(50, 111, 166, 0.8);
            border: solid 1px #1c91ff;
            height: 100%;
            border-radius: 0;

            .clearfix:after {
                clear: both;
            }

            .search-type {
                display: inline-flex;
                // line-height: 30px;
                // height: 48px;
                margin-left: 40px;
                font-size: 15px;
                text-align: center;
                color: @base-fontColor;

                div {
                    width: 60px;
                    cursor: pointer;
                    height: 48px;
                    margin-right: 40px;
                    // align-items: center;
                    span {
                        margin-top: 20px;
                    }

                    img {
                        vertical-align: sub;
                        margin-right: 50px;
                    }
                }

                .active {
                    border-bottom: 2px solid #1c92ff;
                    color: #009af2;
                    // margin-left: 30px;
                }
            }

            .form-con {
                font-family: SourceHanSansCN-Regular;

                .el-form-item {
                    // margin-bottom: 50px;
                }

                .btns {
                    margin-bottom: 0;
                    text-align: right;
                }

                /deep/ .el-form-item__label {
                    color: #00a8ff;
                    font-weight: 900;
                    // align-items: right;
                    white-space: nowrap;
                    // width: ;
                    text-align: right;
                    padding-right: 20px;
                    color: #c4d8e9;
                }

                .el-radio-group {
                    //padding-left: 15px;
                    // text-align: right;
                }

                .el-radio-button,
                .el-radio-button__inner {
                    margin-right: 12px;
                }

                .el-radio-button__inner p {
                    margin: 0;
                    padding: 0;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                }

                /deep/ .el-radio-button .el-radio-button__inner {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    width: 180px;
                    height: 30px;
                    font-size: 14px;
                    margin-top: 5px;
                    margin-bottom: 5px;
                    color: #549bf3;
                    border: solid 1px rgba(84, 155, 243, 0.3);
                    background: transparent;
                }

                /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
                    border-radius: 6px;
                    width: 180px;
                    height: 40px;
                    background-color: rgb(11 152 153);
                    border: rgb(11 152 153);
                    color: #fff;
                }

                /deep/ .el-checkbox__inner {
                    background: transparent;
                    border: solid 1px #1a92cb;
                }

                /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
                    background: #00a8ff;
                }

                /deep/ .el-checkbox__label {
                    color: #009af4;
                    font-family: SourceHanSansCN-Regular;
                }
            }

            .shadow-btn {
                height: 36px;
                margin-right: 20px;
            }

            .footer {
                width: 100%;
                position: absolute;
                bottom: 0;
                margin-left: -20px;
                padding: 10px 0;
                height: 48px;
                line-height: 48px;
                text-align: center;
                border-top: 1px solid #1b4b80;
            }
        }

        /deep/ .el-card__body {
            height: 70%;
            overflow-y: auto;
        }

        /deep/ .el-card__header {
            border-bottom-color: #1b4b80;
        }
    }
</style>