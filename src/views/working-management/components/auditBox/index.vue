<template>
    <!-- 作业工况组件 -->
    <div class="audit-box">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <div class="search-type">
                    <div class="active">
                        <img src="img/monitoring/icon-title.png" alt="">
                        <span>重复作业审核</span>
                    </div>
                </div>
                <el-button style="float: right; padding-top: 15px;" type="text" @click="close">
                    <!-- <img src="img/monitoring/icon_unfolded.png" alt="">-->
                    <i class="el-icon-close" style="font-size:20px"/>
                </el-button>
            </div>
            <div class="form-con">
                <el-form class="my-form" label-position="right" label-width="120px" :model="form">
                    <el-form-item label="重复总面积:">
                        <!--<el-input v-model="form.intersectArea" placeholder="请输入重复面积" disabled style="width: 50%"></el-input>-->
                        <span style="width: 50%;font-size:18px;color: #eaaa1b;padding: 0 5px">{{ form.repeatArea }}亩</span>
                        <span style="width: 50%;font-size:18px;color: #eaaa1b;padding: 0 5px">{{ form.percent }}%</span>
                        <span style="width: 50%;font-size:18px;color: #eaaa1b;">{{ form.differenceAnalyze }}</span>
                    </el-form-item>
                    <!--<el-form-item label="重复程度:" label-width="120px" label-position="right">
                        <el-input v-model="form.differenceAnalyze" placeholder="请输入重复面积" disabled></el-input>
                        &lt;!&ndash; <el-select v-model="form.main.differenceAnalyze" style="width:100%;" placeholder="请选择重复程度">
                             <el-option label="一般重复" value="0"></el-option>
                             <el-option label="严重重复" value="1"></el-option>
                         </el-select>&ndash;&gt;
                    </el-form-item>-->
                </el-form>
            </div>
            <div class="list-con">
                <div  :class="form.main.auditFlag==2?'list list-no-pass':'list'">
                    <div class="title">主体地块</div>
                    <div :class="currentIndex==0? 'info active select':'info active' " @click="handleClick(form.main,0)">
                        <el-form class="my-form" label-position="right" label-width="120px">
                            <el-form-item label="车牌号/终端号:">
                                <span>{{ form.main.plateNumber }}/{{ form.main.terminalCode }}</span>
                            </el-form-item>
                            <el-form-item label="机手姓名/电话:">
                                <span>{{ form.main.ownerName }}/{{ form.main.ownerPhone }}</span>
                            </el-form-item>
                            <el-form-item label="审核状态:">
                                <span>{{ auditFlagFilter(form.main.auditFlag) }}</span>
                            </el-form-item>
                            <el-form-item label="作业时间起:">
                                <span>{{ form.main.jobStartTime }}</span>
                            </el-form-item>
                            <el-form-item label="作业时间止:">
                                <span>{{ form.main.jobEndTime }}</span>
                            </el-form-item>
                            <el-form-item label="作业类型:">
                                <span>{{ jobTypeFilter(form.main.jobType) }}</span>
                            </el-form-item>
                            <el-form-item label="作业面积:">
                                <span style="color: #07d9ae;">{{ form.main.computeArea }}</span>
                            </el-form-item>

                            <!--   <el-form-item label="作业地址:">
                                   <span>{{ form.main.adree }}</span>
                               </el-form-item>-->
                        </el-form>
                        <div class="btns">
                            <el-button class="shadow-btn" plain round v-if="form.main.auditFlag!='1' && btnPermis.btnAudit"
                                       @click.stop="handleAudit(form.main,1)">审核通过
                            </el-button>
                            <el-button class="shadow-btn" plain round v-if="form.main.auditFlag!='2' && btnPermis.btnAudit"
                                       @click.stop="handleAudit(form.main,2)">审核不通过
                            </el-button>
                        </div>
                    </div>
                </div>
                <div :class="item.auditFlag==2?'list list-no-pass':'list'" v-for="(item,index) in form.repeatList"
                     :key="index">
                    <div class="title">{{index+1}}-重复面积:{{item.interectArea}}({{item.percentOfPass}}%)</div>
                    <div :class="currentIndex==(index+1)? 'info active select':'info active' " @click="handleClick(item,index+1)">
                        <el-form class="my-form" label-position="right" :model="form" label-width="120px">
                            <!-- <el-form-item label="农机分组:">
                               <span>{{ form.groupName }}</span>
                             </el-form-item>-->
                            <el-form-item label="车牌号/终端号:">
                                <span>{{ item.plateNumber }}/{{ item.terminalCode }}</span>
                            </el-form-item>
                            <el-form-item label="机手姓名/电话:">
                                <span>{{ item.ownerName }}/{{ item.ownerPhone }}</span>
                            </el-form-item>
                            <el-form-item label="审核状态:">
                                <span>{{ auditFlagFilter(item.auditFlag) }}</span>
                            </el-form-item>
                            <el-form-item label="作业时间起:">
                                <span>{{ item.jobStartTime }}</span>
                            </el-form-item>
                            <el-form-item label="作业时间止:">
                                <span>{{ item.jobEndTime }}</span>
                            </el-form-item>
                            <el-form-item label="作业类型:">
                                <span>{{ jobTypeFilter(item.jobType) }}</span>
                            </el-form-item>
                            <el-form-item label="作业面积:">
                                <span style="color: #07d9ae;">{{ item.computeArea }}</span>
                            </el-form-item>
                            <!--                            <el-form-item label="作业地址:">
                                                            <span>{{ item.originalAddress }}</span>
                                                        </el-form-item>-->
                        </el-form>
                        <div class="btns">
                            <el-button class="shadow-btn" plain round v-if="item.auditFlag!='1' && btnPermis.btnAudit"
                                       @click.stop="handleAudit(item,1)">审核通过
                            </el-button>
                            <el-button class="shadow-btn" plain round v-if="item.auditFlag!='2' && btnPermis.btnAudit"
                                       @click.stop="handleAudit(item,2)">审核不通过
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import myPagination from '_com/myPagination/index'
    import {getMachineDict} from "../../../../api/basic/machine";
    import {filterDict} from '@/util/util.js'
    import {mapGetters} from "vuex";

    export default {
        name: 'workingQueryBox',
        props: {
            row: {
                type: Object,
                default: () => {
                }
            }
        },
        watch: {
            row: {
                handler: function (newVal) {
                    this.summaryRepeatInfo()
                },
                deep: true
            }
        },
        components: {
            myPagination
        },
        data() {
            return {
                currentPage: 1,
                pageSize: 10,
                total: 0,
                form: {
                    main: {
                        plateNumber: ""
                    },
                    repeatList: []
                },
                currentIndex: 0,
                jobType: [],
                auditFlags: [],
                btnPermis: {  //按钮权限
                    btnAudit: false,
                },
                selectId:"",
            }
        },
        computed: {
            ...mapGetters(['groupData','permissions'])
        },
        created() {
            this.getBtnPermis()
            this.getWorkType()
            this.summaryRepeatInfo()
        },
        methods: {
            //获取审核权限
            getBtnPermis() {
                this.btnPermis.btnAudit = this.permissions[window.global.buttonPremission.jobCheck];
                // this.btnPermis.btnAuditMap = this.permissions[window.global.buttonPremission.jobAuditMap];
                //console.log('this.btnPermis', this.btnPermis)
            },
            //获取作业类型字典
            async getWorkType() {
                let res = await getMachineDict({
                    listType: 'job_type'
                });
                if (res.code === 0) {
                    this.jobType = res.data;
                    //this.row.originalJobType = this.jobTypeFilter(this.row);
                }
                let res2 = await getMachineDict({
                    listType: 'audit_flag2'
                });
                if (res2.code === 0) {
                    this.auditFlags = res2.data;
                }
            },
            //统计重复总面积
            summaryRepeatInfo() {
                if (!this.row) return
                this.form = Object.assign(this.form, this.row)
                this.form.main = {};
                this.form.repeatList = [];
                if (this.row.list && this.row.list.length) {
                    this.form.main = this.row.list[0]
                }
                if (this.row.list && this.row.list.length > 1) {
                    this.form.repeatList = this.row.list.slice(1)
                }
            },
            //统计重复总面积
            jobTypeFilter(val) {
                return filterDict(val, {labelKey: 'itemName', valueKey: 'itemCode'}, this.jobType)
            },

            auditFlagFilter(val) {
                return filterDict(val, {labelKey: 'itemName', valueKey: 'itemCode'}, this.auditFlags)
            },
            // 收起面板
            close() {
                this.$emit("close");
            },
            // 选择
            handleClick(item, index) {
                this.currentIndex = index;
                this.$emit("click", item)
            },
            handleAudit(item, val) {
                if (!item) return
                item.auditType = val;
                item.auditReason = '8'
                this.$emit("handleAudit", item)
            }
        }
    }
</script>

<style lang="less" scoped>
    @vw: 19.2vw;
    @vh: 10.8vh;
    .audit-box {
        width: 400px;
        height: calc(100% - 50px);

        .box-card {
            background: @base-darkBlue;
            height: 100%;

            .clearfix:after {
                clear: both
            }

            .search-type {
                display: inline-flex;
                line-height: 48px;
                color: @base-fontColor;

                div {
                    // width: 128px;
                    cursor: pointer;

                    img {
                        vertical-align: sub;
                        margin-right: 5px;
                    }
                }

                .active {
                    color: #2d7de9;
                }

            }

            .form-con {
                .el-form-item {
                    margin-bottom: 16px;
                }
            }

            .list-con {
                padding: 0 10px;
                // height: 574px;
                height: calc(100% - 100px);
                overflow-y: auto;

                .list-no-pass {
                    background-color: #ff00005e
                }

                list:first-child {
                    margin-top: 0;
                }

                .list {
                    width: 100%;
                    color: @base-fontColor;
                    margin-top: 18px;

                    .title {
                        line-height: 32px;
                        color: #fff;
                        text-align: center;
                        background-image: linear-gradient(90deg,
                        rgba(0, 0, 0, .2) 10%,
                        rgba(23, 134, 199, .3) 50%,
                        rgba(0, 0, 0, .2) 90%);
                        box-shadow: 0px 3px 2px 0px rgba(0, 0, 0, 0.35);
                    }

                    .info {
                        border: solid 1px rgba(40, 128, 173, .2);
                        color: #80c5ff;
                        margin-top: 9px;
                        padding: 10px 12px;
                        cursor: pointer;

                        .el-form-item {
                            margin-bottom: 4px;
                        }

                        /deep/ .el-form-item__label {
                            color: @base-fontColor;
                            line-height: 24px;
                        }

                        /deep/ .el-form-item__content {
                            line-height: 24px;

                            span {
                                font-family: SourceHanSansCN-Regular;
                                line-height: 24px;
                            }
                        }
                    }

                    .active {
                        background-color: rgba(0, 67, 124, .1);

                        span {
                            color: #ffffff;
                        }
                    }
                    .select{
                        border: solid 3px blue;
                    }
                }
            }

            .pagination {
                margin-top: 16px;
            }
        }

        /deep/ .el-card__header {
            border-image-source: url('../../../../assets/images/line.png');
            border-image-slice: 0 0 100% 0;
            border-image-width: 1px;
            // border-image-repeat: repeat;
        }

        /deep/ .el-card__body {
            padding-bottom: 12px;
            padding-left: 12px;
            height: calc(100% - 76px);
            /*overflow-y: auto;*/
        }

        .btns {
            text-align: left;
            margin-top: 10px;

            .el-button {
                width: 90px;
                height: 32px;
                margin-right: 10px;
                padding: 0;
            }
        }
    }
</style>