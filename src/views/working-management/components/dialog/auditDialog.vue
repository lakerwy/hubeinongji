<template>
    <el-dialog
            class="my-dialog"
            :title="type == '2' ? '审核' : '审核不通过原因'"
            :visible.sync="dialogVisible"
            top="20vh"
            width="30%"
            @close="close">
        <el-form class="reason-form" ref="form" :model="form" label-width="150px" label-position="top">
            <el-form-item label="审核状态：" v-if="type == '2'">
                <el-select v-model="form.auditFlag" placeholder="请选择审核状态" style="width: 90%">
                    <el-option v-for="item in status" :key="item.label" :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="审核不通过原因:" v-if="form.auditFlag == 2" style="margin-top: 10px">
                <el-checkbox-group v-model="form.reason">
                    <el-checkbox style="display: block;" v-for="item in reasons" :label="item.itemCode"
                                 :key="item.itemCode">{{item.itemName}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button class="shadow-btn" plain round @click="dialogVisible = false">返回</el-button>
            <el-button type="primary" class="shadow-btn" plain round @click="submit">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {getReasonList, updateAuditFlagStatus} from '@/api/working/index'
    import {fetchItemList} from '@/api/admin/dict'

    export default {
        data() {
            return {
                dialogVisible: false,
                form: {reason: [], auditFlag: 2},
                reasons: [
                    // {label: '平均深度', value: '1'},
                    // {label: '深度合格率', value: '2'},
                    // {label: '照片', value: '3'},
                    // {label: '问题地块', value: '4'},
                    // {label: '其他', value: ''},
                ],
                status: [
                    {label: '通过', value: 1},
                    {label: '不通过', value: 2},
                ]
            }
        },
        props: {
            ids: {
                type: String | Number,
                default: ''
            },
            type: {
                type: String,
                default: '1', // 1列表模式审核不通过 2地图模式审核
            },
            auditFlag: {
                type: Number,
                default: 2
            },
            auditReason: {
                type: String,
                default: ''
            }
        },
        watch: {
            dialogVisible(newV) {
                if (newV) {
                    this.initAuditFalg()

                }
            }
        },
        created() {
            this.initData()
        },
        methods: {

            initAuditFalg() {
                this.$set(this.form, 'auditFlag', this.auditFlag)
                this.form.reason = [];
                if (!this.auditReason) {
                  this.form.reason.push(this.auditReason)
                }
            },
            async initData() {
                let res = await fetchItemList(Object.assign({
                    current: 1,
                    size: 1000
                }, {listType: "audit_reason"}));
                const {code, data} = res;
                if (code == 0) {
                    this.reasons = data.records;
                }
                this.$set(this.form, 'auditFlag', this.auditFlag)
            },
            // 提交审核不通过
            async submit() {
                let params = {
                    auditFlag: this.form.auditFlag,
                    auditReason: this.form.reason.join(','),
                    ids: this.ids,
                }
                let res = await updateAuditFlagStatus(params);
                const {code, msg} = res;
                if (code == 0) {
                    this.dialogVisible = false;
                    this.$message.success('提交成功');
                    this.$emit('refreshData',params);
                    this.form.reason = [];
                } else {
                    this.$message.error(msg || '提交失败');
                }
            },
            close() {
                /* this.form = {
                     reason: [],
                     auditFlag: ''
                 }*/
                this.dialogVisible = false;
            }
        }
    }
</script>

<style lang="less" scoped>
    .reason-form {
        padding-left: 10%;

        .el-form-item {
            margin-bottom: 0 !important;
        }

        .el-checkbox, .el-checkbox__inner {
            margin-right: 30px;
            color: @base-fontColor;
        }

        /deep/ .el-checkbox .el-checkbox__inner {
            border-radius: 0;
            border: solid 1px #00a8ff;
            background: transparent;
            color: #009af2;
        }

        /deep/ .el-checkbox__orig-radio:checked + .el-checkbox__inner {
            background-color: #00a8ff;
            border: solid 1px #00a8ff;
            color: #fff;
        }
    }
</style>