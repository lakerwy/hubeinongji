<template>
    <el-dialog
            :class="forcePassWord?'my-dialog pwd-dialog ':'my-dialog pwd-dialog'"
            :title="forcePassWord? '检测到您的密码不符合安全要求，请修改密码':'修改密码'"
            :visible.sync="dialogVisible"
            :before-close="cancel"
            top="30vh"
            width="550px"
    >
        <el-form
                class="pwd-form"
                ref="formpwd"
                :model="form"
                label-width="100px"
                :rules="rules"
        >
            <el-form-item label="登录账号：">
                <el-input
                        v-model="form.username"
                        readonly
                        placeholder="请输入登录账号"
                ></el-input>
            </el-form-item>
            <el-form-item label="原始密码：" prop="password">
                <el-input
                        v-model="form.password"
                        placeholder="请输入原始密码"
                        type="password"
                        autocomplete="new-password"
                ></el-input>
            </el-form-item>
            <el-form-item label="新设密码：" class="special" prop="newpwd">
                <el-input
                        v-model="form.newpwd"
                        placeholder="请输入新密码（大小写字母、数字和特殊字符组合）"
                        type="password"
                        autocomplete="new-password"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="重复密码：" prop="renewpwd">
                <el-input
                        v-model="form.renewpwd"
                        placeholder="请再次输入新密码"
                        type="password"
                        autocomplete="new-password"
                ></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button class="shadow-btn" plain round @click="cancel" v-if="!forcePassWord">取消</el-button>
            <el-button type="primary" class="shadow-btn" plain round @click="save"
            >确定
            </el-button
            >
        </div>
    </el-dialog>
</template>

<script>
    import {mapGetters,mapMutations} from "vuex";
    import {validatePasswordStrong} from "@/util/validate";
    import {modifyPwd} from "@/api/admin/user";

    export default {
        data() {
            return {
                dialogVisible: false,
                form: {username: ""},
                rules: {
                    password: [
                        {required: true, message: "请输入原账户密码", trigger: "blur"},
                    ],
                    newpwd: [
                        {required: true, message: "请输入新密码", trigger: "blur"},
                        {validator: this.checkPasswordStrong, trigger: "blur"},
                    ],
                    renewpwd: [
                        {required: true, message: "请再次输入密码", trigger: "blur"},
                        {validator: this.checkConfirmPassword, trigger: "blur"},
                    ],
                },
            };
        },
        computed: {
            ...mapGetters(["userInfo"]),
        },
        props: {
            forcePassWord: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            forcePassWord: {
                handler: function (val, oldVal) {

                },
            },
        },
        mounted() {
        },
        created() {
            this.form.username = this.userInfo.username;
            if (this.forcePassWord) {
            }
        },
        methods: {
            ...mapMutations({
                setUserForcePasswordModify: "SET_USRE_FORCEPASSWORD"
            }),
            checkPasswordStrong(rule, value, callback) {
                if (value) {
                    if (!validatePasswordStrong(value)) {
                        callback(
                            new Error("请输入8至16位密码，必须包含大小写字母、数字、特殊字符")
                        );
                    } else {
                        callback();
                    }
                }
            },
            checkConfirmPassword(rule, value, callback) {
                if (!value) {
                    callback(new Error("请再次输入密码"));
                } else {
                    if (value != this.form.newpwd) {
                        return callback(new Error("密码输入不一致"));
                    } else {
                        callback();
                    }
                }
            },
            // 修改密码
            save() {
                var sss = this.$refs.formpwd.validate();
                //console.log(11111, sss);
                this.$refs.formpwd.validate().then((res) => {
                    //console.log(res, res);
                    if (res) {
                        let that = this;
                        modifyPwd(Object.assign({}, this.form)).then((data) => {
                            if (data.code === 0) {
                                this.setUserForcePasswordModify(false);
                                that.$message.success("密码修改成功");
                                this.close();
                            } else {
                                that.$message.error(data.msg);
                            }
                        });
                    }
                });

            },
            close() {
                this.dialogVisible = false;
            },
            cancel() {
              if(!this.forcePassWord){
                this.$refs.formpwd.resetFields();
                this.dialogVisible = false;
              }else{
                this.$message.warning("请先修改密码，以保证系统安全运行")
              }
            },
        },
    };
</script>

<style lang="less" scoped>
    .passwordWarning {
      border: red;
    }

    .pwd-dialog {
        /deep/ .el-dialog__body {
            padding-bottom: 0;
        }

        /deep/ .el-dialog__footer {
            padding-bottom: 10px;
        }
    }

    .pwd-form {
        width: 90%;
        margin: 0 auto;

      .el-dialog__title{

      }

        .el-form-item:last-child {
            margin-bottom: 0;
        }
    }
</style>