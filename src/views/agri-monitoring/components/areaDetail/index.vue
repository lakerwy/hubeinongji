<template>
    <!-- 作业面积详情组件 -->
    <div class="working-area-box">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <div class="search-type">
                    <div class="active">
                        <img src="img/monitoring/icon-title.png" alt="">
                        <span>今日作业面积详情</span>
                    </div>
                </div>
                <el-button style="float: right; padding-top: 15px;" type="text" @click="close">
                    <!-- <img src="img/monitoring/icon_unfolded.png" alt=""> -->
                    关闭
                </el-button>
            </div>
            <div class="my-table area-table">
                <el-table
                    v-loading="loading"
                    :data="data"
                    style="width: 100%"
                    border
                    height="100%"
                >
                    <el-table-column type="index" label="序号" width="60"></el-table-column>
                    <el-table-column prop="jobType" label="作业类型" width="120px":formatter="typeFilter"></el-table-column>
                    <el-table-column prop="btime" label="开始时间" width="160px"></el-table-column>
                    <el-table-column prop="etime" label="结束时间" width="160px"></el-table-column>
                    <el-table-column prop="area" label="作业面积（亩）" width="120px"></el-table-column>
                    <el-table-column prop="avgDepth" label="平均深度（cm）" width="140px"></el-table-column>
                    <el-table-column prop="toolCode" label="机具识别码" width="200px"></el-table-column>
                    <el-table-column prop="toolWidth" label="机具宽幅（米）" width="120px"></el-table-column>
                    <el-table-column prop="address" label="作业地址" width="200px"></el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
    import {
        fetchItemList,
    } from '@/api/admin/dict'
    import {filterDict} from '@/util/util.js'

    export default {
        name: 'workingArea',
        props: {
            data: {
                type: Array,
                default: ()=>[]
            },
            dict: { // 字典
                type: Array,
                default:  ()=>[]
            }
        },
        data() {
            return {
                loading: false,
                tableData: [],
                jobTypes: []
            }
        },
        created() {
            this.initJobTypes();
        },
        methods: {
            async initJobTypes() {
                let res = await fetchItemList(Object.assign({
                    current: 1,
                    size: 1000
                }, {listType: "job_type"}))
                if (res.code === 0) this.jobTypes = res.data.records;

            },
            typeFilter(row) {
                return filterDict(row.jobType, {labelKey: 'itemName', valueKey: 'itemCode'}, this.jobTypes)
            },
            close() {
                this.$emit('close')
            },
        }
    }
</script>

<style lang="less" scoped>
    .working-area-box {
        width: 662px;
        height: 236px;

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

            .el-button--text {
                font-family: SourceHanSansCN-Medium;
                font-size: 14px;
                color: #1a92cb;
            }

            .my-table {
                height: 100%;
            }

            .area-table {
                /deep/ .el-table tr {
                    height: 29px;
                }

                /deep/ .el-table th {
                    height: 30px;
                }

                /deep/ .el-table__header-wrapper tr {
                    background: rgba(0, 160, 233, 0.05);
                }

                /deep/ .el-table tbody tr:nth-child(2n) {
                    background: none;
                }

                /deep/ .el-table td, .el-table th.is-leaf {
                    border-bottom: 1px solid #07203c;
                }
            }
        }

        /deep/ .el-card__body {
            height: calc(100% - 88px);
            overflow-y: auto;
        }
    }
</style>