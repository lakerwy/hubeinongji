<template>
    <div class="dict-table-form">
        <!--<div class="dict-title">
            <div>
                <span>{{forms.listType || '无'}}</span>
                <img src="img/admin/icon_修改.png" alt="">
            </div>
            <el-button type="text">
                <img src="img/admin/icon-back.png" alt="">
                撤销
            </el-button>
        </div>-->
        <el-form :model="forms" class="my-table my-form" ref="forms" inline :rules="rules">
            <el-form-item label="列表代码:" prop="listType">
                <el-input v-model="forms.listType"></el-input>
            </el-form-item>
            <el-form-item label="列表描述:" prop="listTypeDesc">
                <el-input v-model="forms.listTypeDesc"></el-input>
            </el-form-item>
            <el-form-item>
                <div class="btns">
                    <el-button class="shadow-btn" plain round @click="save">保存</el-button>
                    <el-button class="shadow-btn" plain round @click="cancle">取消</el-button>
                </div>
            </el-form-item>

            <el-table :data="forms.data.records" class="form-table">
                <el-table-column label="排序码" width="100px">
                    <template slot-scope="scope">
                        <!--  :inline-message="true" -->
                        <el-form-item v-if="scope.row.isEdit" :prop="'data.records.' + scope.$index + '.taxisNo'"
                                      :rules="rules.taxisNo" :inline-message="true">
                            <el-input v-model="scope.row.taxisNo"></el-input>
                        </el-form-item>
                        <span v-else>{{scope.row.taxisNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数据项值" width="100px">
                    <template slot-scope="scope">
                        <el-form-item v-if="scope.row.isEdit" :prop="'data.records.' + scope.$index + '.itemCode'"
                                      :rules="rules.itemCode" :inline-message="true">
                            <el-input v-model="scope.row.itemCode"></el-input>
                        </el-form-item>
                        <span v-else>{{scope.row.itemCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数据项描述">
                    <template slot-scope="scope">
                        <el-form-item v-if="scope.row.isEdit" :prop="'data.records.' + scope.$index + '.itemName'"
                                      :rules="rules.itemName" :inline-message="true">
                            <el-input v-model="scope.row.itemName"></el-input>
                        </el-form-item>
                        <span v-else>{{scope.row.itemName}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="80px">
                    <template slot-scope="scope">
                        <el-button type="text" @click="edit(scope.row, scope.$index)"><img
                                :src="[scope.row.isEdit ? 'img/admin/icon_修改_高亮.png' : 'img/admin/icon_修改.png']" alt="">
                        </el-button>
                        <el-button type="text" @click="del(scope.row, scope.$index)"><img src="img/admin/icon_删除.png"
                                                                                          alt=""></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="add-btn" @click="add"><img src="img/admin/icon_增加.png" alt="">添加行</div>

        </el-form>
    </div>
</template>


<script>
    import {
        addItemObj,
        addObj,
        delItemObj,
        delObj,
        fetchItemList,
        updateItemList,
        fetchList,
        putItemObj,
        putObj
    } from '@/api/admin/dict'


    export default {
        name: 'dictTableForm',
        props: {
            listdata: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                forms: {
                    data: {
                        records: []
                    },
                    listType: "",
                    listTypeDesc: "",
                },
                rules: {
                    listType: [
                        {required: true, message: '列表代码不能为空', trigger: 'blur'}
                    ],
                    listTypeDesc: [
                        {required: true, message: '列表描述不能为空', trigger: 'blur'}
                    ],
                    taxisNo: [
                        {required: true, message: '序号不能为空', trigger: 'blur'}
                    ],
                    itemCode: [
                        {required: true, message: '数据项值不能为空', trigger: 'blur'}
                    ],
                    itemName: [
                        {required: true, message: '数据项描述不能为空', trigger: 'blur'}
                    ]
                },
            }
        },
        watch: {
            listdata: {
                handler: function (newV) {
                    this.$set(this.forms, 'listType', newV.listType);
                    this.$set(this.forms, 'listTypeDesc', newV.listTypeDesc);
                    this.$set(this.forms, 'data', newV.data);
                },
                immediate: true,
            }
        },
        methods: {
            // 添加行
            add() {
                this.forms.data.records.push(
                    {
                        itemCode: '',
                        itemName: '',
                        taxisNo: '',
                        listType: this.forms.listType,
                        isEdit: true,
                        listTypeDesc: this.forms.listTypeDesc
                    })
            },
            // 编辑
            edit(row, index) {
                this.forms.data.records[index].isEdit = true;
                this.forms.data.records = this.forms.data.records.concat([]);
            },
            // 删除
            del(row, index) {
                let that = this;
                if (!row.rowId) {
                    that.forms.data.records.splice(index, 1)
                    return
                }
                this.$confirm('是否确认删除当前数据项[' + row.listType + ":" + row.itemName + "]?", '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    console.log("确认删除");
                    delItemObj(row.rowId).then(response => {
                        if (response.code === 0) {
                            that.forms.data.records.splice(index, 1);
                        } else {
                            that.$message.info("删除失败");
                        }
                    })
                })
            },

            // 保存
            save() {
                let that = this;
                this.$refs.forms.validate(valid => {
                    if (valid) {
                        /*let result=that.forms.data.records.filter((value,index,number)=>{
                            return value.rowEdit;
                        })*/
                        if(!that.forms.data.records || that.forms.data.records.length==0){
                            that.$message.info("请至少增加一个字典项");
                            return
                        }
                        //字典代码合名称一起更新
                        that.forms.data.records.forEach((ele, index) => {
                            ele.listType = that.forms.listType;
                            ele.listTypeDesc = that.forms.listTypeDesc;
                        })
                        console.log("result", that.forms.data.records);
                        updateItemList(that.forms.data.records).then(response => {
                            if (response.code === 0) {
                                that.$message.info("保存成功");
                                that.forms.data.records.forEach((ele, index) => {
                                    ele.isEdit = false;
                                });
                                this.$parent.getList();
                            } else {
                                that.$message.info("保存失败");
                            }
                        })
                    } else {
                        that.$message.info("信息填写有误，请检查");
                    }
                })
                console.log(this.forms, 'forms')
            },
            // 取消
            cancle() {
                this.$emit('close', false)
            }
        }
    }
</script>

<style lang="less" scoped>
    .dict-table-form {
        width: 740px;
        margin-left: 47px;
        margin-top: 16px;
        height: 100%;

        .dict-title {
            height: 60px;
            line-height: 60px;
            color: #c4d8e9;
            border-bottom: 1px solid #3a8cd9;
            display: flex;
            justify-content: space-between;
            font-size: 14px;

            img {
                margin-left: 8px;
            }
        }

        .my-form {
            margin-top: 12px;
            height: 100%;
            overflow-y: auto;

            .el-form-item {
                margin-bottom: 12px;
            }

            .el-table {
                height: auto;
            }

            .form-table {
                .el-form-item {
                    margin-bottom: 0;
                }

                /deep/ .el-input__inner {
                    height: 30px;
                }
            }
        }

        .add-btn {
            height: 33px;
            line-height: 33px;
            border-radius: 4px;
            border: dashed 1px #10519e;
            margin: 22px 0;
            color: #388ef2;
            text-align: center;
            cursor: pointer;

            img {
                vertical-align: sub;
                margin-right: 6px;
            }
        }

        .btns {
            text-align: left;
        }
    }
</style>