<template>
    <el-dialog
            class="my-dialog history-dialog"
            :destroy-on-close="true"
            :title="title"
            :visible.sync="dialogVisible"
            top="15vh"
            width="1145px">
        <div class="tableTool" @click="exportExcel">
            <img src="img/table_tool2.png" alt="">
            <span>报表导出</span>
        </div>
        <div class="my-table">
            <el-table
                    v-loading="loading"
                    :data="tableData"
                    style="width: 100%"
                    border
                    height="100%">
                <el-table-column fixed type="index" label="序号" width="60" :index="indexMethod"></el-table-column>
                <el-table-column prop="time" label="设备时间" width="160px"></el-table-column>
                <el-table-column prop="serverTime" label="服务器时间" width="160px"></el-table-column>
                <el-table-column prop="lon" label="经度" width="160px"></el-table-column>
                <el-table-column prop="lat" label="纬度" width="160px"></el-table-column>
                <el-table-column prop="velocity" label="速度" width="100px"></el-table-column>
                <el-table-column prop="height" label="深度" width="100px"></el-table-column>
                <el-table-column prop="platenumber" label="车牌号码" width="120px"></el-table-column>
                <el-table-column prop="terminalCode" label="终端编号" width="120px"></el-table-column>
                <el-table-column prop="toolCode" label="机具识别码" width="120px"></el-table-column>
                <el-table-column prop="ownername" label="机手姓名" width="120px"></el-table-column>
                <el-table-column prop="ownercontact" label="联系电话" width="120px"></el-table-column>
                <el-table-column prop="alarmStatus" label="告警信息" width="120px"></el-table-column>
                <el-table-column prop="groupname" label="分组路径" width="450px"
                                 :show-overflow-tooltip="true"></el-table-column>
            </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
            <div class="page">
                <pagination
                        :currentPage.sync="page.currentPage"
                        :pageSize="page.pageSize"
                        :pageSizes="page.pageSizes"
                        :total="page.total"
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"/>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import pagination from '_com/myPagination/index'
    import {dateFormat} from "@/util/util";
    import {queryHistoryTraceList, exportHistoryTraceList,} from '@/api/monitoring/index'
    import {handBlobDown} from '@/util/util'

    export default {
        name: 'historyDialog',
        components: {
            pagination
        },
        props: {
            machine: {
                type: Object,
            },
            time: {
                type: Object
            }
        },
        watch: {
            time: {
                handler: function (newV) {
                    if (newV.queryStartTime) {
                        this.title = `${this.machine.plateNumber}（${newV.queryStartTime}-${newV.queryEndTime}）`;
                    }
                    this.initData();
                    return newV
                },
                // immediate: true
            },
            dialogVisible(newV) {
                //console.log("historyDialong dialogVisible is change");
                // this.initData();
                // this.tableData.splice(0);
                this.$set(this.page, "currentPage", 1);
                this.$set(this.page, "pageSize", 10);
            }
        },
        // updated(){
        //   //console.log("historyDialong is updated");
        // },
        // destroyed(){
        //   //console.log("historyDialong is destroyed");
        // },
        data() {
            return {
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    pageSizes: [10, 20, 50, 100, 200, 1000],
                    total: 0
                },
                title: '',
                tableData: [],
                dialogVisible: false,
                loading: false
            }
        },
        methods: {
            async initData() {
                let params = {
                    terminalid: this.machine.machineId,
                    bTime: this.time.queryStartTime,
                    eTime: this.time.queryEndTime,
                    /* terminalid: '1000000003631',
                     bTime: '2021-04-08 00:00:00',
                     eTime: '2021-04-08 23:59:59',*/
                    page: this.page.currentPage,
                    rows: this.page.pageSize
                }
                let res = await queryHistoryTraceList(params);

                const {code, data, msg} = res;
                if (code == 0) {
                    this.tableData = data.rows;
                    this.page.total = data.total;
                } else {
                    this.$message.error(msg || '当前无历史轨迹数据')
                }


            },
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.initData();
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.initData();
            },
            async exportExcel() {
                let params = {
                    terminalid: this.machine.machineId,
                    bTime: this.time.queryStartTime,
                    eTime: this.time.queryEndTime,
                    /* terminalid: '1000000003631',
                     bTime: '2021-04-08 00:00:00',
                     eTime: '2021-04-08 23:59:59'*/
                }
                let res = await exportHistoryTraceList(params);
                const {code, data, msg} = res;
                if (res && res.data && res.data.success) {
                    // let obj = encodeURI(res.data.obj)
                    // let url = window.globalUrl.HOME_API + 'agri-web/rp/statistics/downloadExcel?filePath='+obj;
                    // downloadPost(url)
                    let url
                    let obj = res.data.obj;
                    let titleExcel = this.title + '作业轨迹表.xls';
                    handBlobDown(url, obj, titleExcel)
                } else {
                    this.$message.error(msg || '导出失败')
                }
            },
            indexMethod(index) {
                return (this.page.currentPage - 1) * this.page.pageSize + index + 1;
            },
        }
    }
</script>

<style lang="less" scoped>
    .history-dialog {
        /deep/ .el-dialog__body {
            padding: 7px 26px 15px;
            height: 610px;
            // overflow-y: hidden;
        }

        .tableTool {
            display: flex;
            align-items: center;
            font-size: 14px;
            cursor: pointer;
            color: @base-fontColor;
            float: right;
            margin-bottom: 14px;
            cursor: pointer;

            img {
                margin-right: 5px;
                vertical-align: bottom;
            }
        }

        .my-table {
            height: calc(100% - 34px);
        }

        /deep/ .el-dialog__footer {
            padding: 15px 0 25px;
            border-top: 1px solid #102c4b;
        }

        .dialog-footer {
            text-align: left;
            padding-left: 30px;
        }
    }
</style>