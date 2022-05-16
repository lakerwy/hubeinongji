<!--
  -    Copyright (c) 2018-2025, intelligence All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the pig4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: intelligence
  -->

<template>
    <div class="user">
        <titleBox :headName="'用户管理'"/>
        <basic-container class="basic-con">
            <el-row :span="24" style="width: 100%; height: 100%">
                <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="height: 100%">
                    <groupBox
                            class="self-box"
                            :showCheckBox="false"
                            :isSelf="true"
                            :isAll="true"
                            @getData="handleNodeClick"
                    />
                </el-col>
                <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18" class="user__main">
                    <el-form
                            :model="searchForm"
                            :inline="true"
                            class="my-form"
                            label-width="90px"
                    >
                        <!-- <el-form-item label="分组名称:">
                                         <el-input v-model="searchForm.groupIds" placeholder="请选择分组"
                                                   @focus="openGroupbox"></el-input>
                                     </el-form-item> -->
                        <el-form-item label="用户名:">
                            <el-input
                                    v-model.trim="searchForm.username"
                                    placeholder="请输入用户名"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="真实姓名:">
                            <el-input
                                    v-model.trim="searchForm.realName"
                                    placeholder="请输入真实姓名"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="用户类型:">
                            <el-select
                                    v-model.trim="searchForm.usertype"
                                    placeholder="请选择用户类型"
                            >
                                <el-option label="全部" value=""></el-option>
                                <el-option
                                        v-for="item in userTypes"
                                        :key="item.itemCode"
                                        :label="item.itemName"
                                        :value="item.itemCode"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!-- <el-form-item label="用户角色:">
                                         <el-input v-model="searchForm.roleId" placeholder="请输入角色信息"></el-input>
                                     </el-form-item>-->
                        <el-button
                                style="width: 90px"
                                class="shadow-btn"
                                plain
                                round
                                size="medium"
                                @click="searchUser"
                        >查询
                        </el-button>
                        <!-- <el-button style="width: 90px;" class="shadow-btn" plain round size="medium"
                                                @click="searchUser">新增
                                     </el-button>-->
                    </el-form>
                    <div class="my-table">
                        <div
                                class="avue-crud__menu"
                                v-if="userManager_btn_add || userManager_btn_batchdel"
                        >
                            <div class="avue-crud__left">
                                <el-button
                                        v-if="userManager_btn_add"
                                        class="shadow-btn"
                                        plain
                                        round
                                        size="mini"
                                        @click="handleAdd"
                                >新增
                                </el-button>
                                <el-button
                                        v-if="userManager_btn_batchdel"
                                        class="shadow-btn"
                                        plain
                                        round
                                        size="mini"
                                        @click="deletes"
                                >批量删除
                                </el-button>
                            </div>
                        </div>
                        <el-table
                                :data="list"
                                style="width: 100%"
                                height="calc(100% - 50px)"
                                @selection-change="handleSelectionChange"
                        >
                            <el-table-column
                                    type="selection"
                                    label="全选"
                                    width="50"
                                    fixed="left"
                            >
                            </el-table-column>
                            <el-table-column
                                    type="index"
                                    label="序号"
                                    width="80"
                                    fixed="left"
                                    :index="indexMethod"
                            >
                            </el-table-column>
                            <el-table-column
                                    v-for="item in column"
                                    :key="item.label"
                                    :prop="item.prop"
                                    :label="item.label"
                                    :width="item.width"
                                    :formatter="item.formatter"
                            >
                            </el-table-column>
                            <el-table-column label="操作" width="300px" fixed="right">
                                <template slot-scope="scope">
                                    <el-button
                                            v-if="userManager_btn_edit"
                                            type="text"
                                            size="small"
                                            icon="el-icon-edit"
                                            @click="handleUpdate(scope.row, scope.index)"
                                    >编辑
                                    </el-button>
                                    <el-button
                                            v-if="userManager_btn_del"
                                            type="text"
                                            size="small"
                                            icon="el-icon-delete"
                                            @click="handleDelete(scope.row, scope.index)"
                                    >删除
                                    </el-button>
                                    <el-button
                                            v-if="userManager_btn_perm"
                                            type="text"
                                            size="small"
                                            icon="el-icon-user"
                                            @click="handlePermission(scope.row, scope.index)"
                                    >数据权限
                                    </el-button>
                                    <el-button
                                            v-if="userManager_btn_reset"
                                            type="text"
                                            size="small"
                                            icon="el-icon-setting"
                                            @click="handleResetPassword(scope.row, scope.index)"
                                    >重置密码
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <myPagination
                                style="margin-top: 10px"
                                :currentPage="page.currentPage"
                                :pageSize="page.pageSize"
                                :total="page.total"
                                @current-change="currentChange"
                                @size-change="sizeChange"
                        />
                    </div>
                </el-col>
            </el-row>
        </basic-container>

        <el-dialog
                class="my-dialog"
                :title="dialogTitle"
                :visible.sync="dialogVisible"
                width="40%"
                top="20vh"
                :before-close="Cancel"

        >
            <div class="content">
                <el-form
                        class="my-form"
                        ref="form"
                        label-position="right"
                        label-width="120px"
                        :model="form"
                        :rules="rules"
                >
                    <el-row>
                        <el-col hidden>
                            <el-form-item label="所属分组ID：" prop="groupNameFullPath">
                                <el-input v-model.trim="form.groupid"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="所属分组：" prop="groupNameFullPath">
                                <el-input v-model.trim="form.groupName" readonly></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="账户名称：" prop="username">
                                <el-input
                                        v-model.trim="form.username"
                                        placeholder="请输入账户名称"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号码：" prop="mobile">
                                <el-input
                                        v-model.trim="form.mobile"
                                        placeholder="请输入手机号码"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户姓名：" prop="realName">
                                <el-input
                                        v-model.trim="form.realName"
                                        placeholder="请输入用户真实姓名"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="到期时间：" prop="expirationNtime">
                                <el-date-picker
                                        class="datepicker"
                                        v-model="form.expirationNtime"
                                        type="date"
                                        :clearable="false"
                                        prefix-icon="el-icon-date"
                                        placeholder="服务到期时间"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="showpassword">
                            <el-form-item label="设置密码：" prop="password">
                                <el-input
                                        v-model.trim="form.password"
                                        placeholder="请输入密码"
                                        type="password"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="showpassword">
                            <el-form-item label="确认密码：" prop="confirmPassword">
                                <el-input
                                        v-model.trim="form.confirmPassword"
                                        placeholder="请再次输入密码"
                                        type="password"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户角色：" prop="role">
                                <el-select
                                        v-model.trim="form.role"
                                        multiple
                                        placeholder="请选择用户角色"
                                        style="width: 100%"
                                        :filterable="true"
                                >
                                    <el-option
                                            v-for="item in roles"
                                            :key="item.rowId"
                                            :label="item.roleName"
                                            :value="item.rowId"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <!--  <el-form-item label="首页标题：">
                                              <el-input v-model="form.usertitle" placeholder="请输入用户首页标题"></el-input>
                                          </el-form-item>-->
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户类型：" prop="usertype">
                                <el-select
                                        v-model="form.usertype"
                                        placeholder="请选择用户类型"
                                        style="width: 100%"
                                        @change="usertypeChange"
                                >
                                    <el-option
                                            v-for="item in userTypes"
                                            :key="item.itemCode"
                                            :label="item.itemName"
                                            :value="item.itemCode"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="needCompany" prop="companyId">
                            <el-form-item label="厂商名称：">
                                <el-select
                                        v-model.trim="form.companyId"
                                        placeholder="请选择所属厂商"
                                        @change="companyChange"
                                        style="width: 100%"
                                >
                                    <el-option
                                            v-for="item in companys"
                                            :key="item.itemCode"
                                            :label="item.itemName"
                                            :value="item.itemCode"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" class="shadow-btn" @click="save" round
                >保 存
                </el-button
                >
                <el-button type="primary" class="shadow-btn" @click="Cancel" round
                >取 消
                </el-button
                >
            </div>
        </el-dialog>

        <el-dialog
                class="my-dialog"
                :visible.sync="dialogPermissionVisible"
                :close-on-click-modal="false"
                title="分配数据权限"
                top="10vh"
                width="400px !important"
        >
            <div class="dialog-main-tree">
                <groupBox
                        style="position: static; height: 600px"
                        :showCheckBox="true"
                        :isSelf="true"
                        :isAll="true"
                        :checkedKeys="checkedKeys"
                        @getCheckData="handleCheckDate"
                />
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button
                        style="margin: 0 10px"
                        type="primary"
                        size="small"
                        @click="updatePermession"
                >更新
                </el-button>
                <el-button
                        type="default"
                        size="small"
                        @click="Cancel"
                >取消
                </el-button>
            </div>
        </el-dialog>

        <el-dialog
                class="my-dialog"
                :visible.sync="dialogPasswordVisible"
                :close-on-click-modal="false"
                title="重置密码"
                top="10vh"
                width="500px !important"
        >
            <div class="content">
                <el-form
                        class="my-form"
                        ref="form"
                        label-position="left"
                        :model="form"
                        :rules="rules"
                >
                    <el-row>
                        <el-col :span="24">
                            <el-form-item
                                    label="重置密码成功，请妥善保管密码："
                                    prop="groupNameFullPath"
                            >
                                <!--<el-input v-model="resetPwd" readonly></el-input>-->
                                <el-tag>{{ resetPwd }}</el-tag>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button
                        style="margin: 0 10px"
                        type="primary"
                        size="small"
                        v-clipboard:copy="resetPwd"
                        v-clipboard:success="onPwdCopy"
                        v-clipboard:error="onPwdCopyError"
                >
                    复制密码
                </el-button>
                <el-button
                        type="default"
                        size="small"
                        @click="dialogPasswordVisible = false"
                >确定
                </el-button>
            </div>
        </el-dialog>

        <importDialog ref="import"/>
    </div>
</template>

<script>
    import {
        addObj,
        delObj,
        getUserList,
        fetchList,
        putObj,
        fetchRoles,
        resetPwd,
        getGroups,
        updateGroups,
    } from "@/api/admin/user";
    import {roleList} from "@/api/admin/role";
    import {getPassword} from "@/util/util";
    import {fetchTree} from "@/api/admin/dept";
    //import {tableOption} from '@/const/crud/admin/user'
    import {mapGetters, mapMutations} from "vuex";
    import titleBox from "_com/contenBox/titleBox.vue";
    import myPagination from "_com/myPagination/index.vue";
    import importDialog from "../components/importDialog";
    import {fetchItemList} from "@/api/admin/dict";
    import groupBox from "_com/groupBox2/index.vue";
    import "../../../const/crud/admin/token.js";

    const searchForm = {
        username: "",
        realName: "",
        usertype: "",
        roleId: "",
        companyName: "",
    };

    export default {
        name: "SysUser",
        components: {
            titleBox,
            myPagination,
            importDialog,
            groupBox,
        },
        data() {
            return {
                searchForm: Object.assign({}, searchForm),
                userTypes: [],
                checkedKeys: [],
                page: {
                    total: 0, // 总页数
                    pagerCount: 5,
                    currentPage: 1, // 当前页数
                    pageSize: 20, // 每页显示多少条,
                    isAsc: false, // 是否倒序
                    layout: "total, sizes, prev, pager, next, jumper",
                    pageSizes: [10, 20, 30, 40, 50, 100],
                },
                list: [],
                listLoading: false,
                roles: [],
                form: {role: []},
                rolesOptions: [],
                selection: [],
                tableOption: {
                    border: true,
                    index: true,
                    indexLabel: "序号",
                    indexWidth: 100,
                    selection: true,
                    stripe: false,
                    menuAlign: "center",
                    menuWidth: 300,
                    searchMenuSpan: 6,
                    editBtn: false,
                    delBtn: false,
                    align: "left",
                    addBtn: false,
                    refreshBtn: false, // 刷新按钮
                    columnBtn: false, // 列显隐按钮
                    searchBtn: false, // 搜索按钮
                    dialogWidth: "750",
                    dialogTop: "30%",
                    labelWidth: 100,
                    menu: true,
                    column: [
                        {
                            // fixed: true,
                            label: "id",
                            prop: "rowId",
                            // span: 24,
                            hide: true,
                            editDisabled: true,
                            editDisplay: false,
                            addDisplay: false,
                        },
                        {
                            // fixed: true,
                            label: "登录名",
                            prop: "username",
                            width: 150,
                            // addDisplay: false,
                        },
                        {
                            label: "真实姓名",
                            prop: "realName",
                            width: 150,
                        },
                        {
                            label: "手机号",
                            prop: "mobile",
                            width: 150,
                        },
                        {
                            width: 150,
                            label: "过期时间",
                            prop: "expirationNtime",
                            type: "datetime",
                            format: "yyyy-MM-dd HH:mm",
                            valueFormat: "yyyy-MM-dd HH:mm:ss",
                            span: 24,
                        },
                        {
                            label: "用户类型",
                            width: 150,
                            formatter: this.formatterUserType,
                        },
                        {
                            label: "所属分组",
                            width: 500,
                            prop: "groupName",
                        },
                        /*  {
                                            label: '厂商名称',
                                            prop: 'companyName',
                                            labelslot: true,
                                            formslot: true,
                                            showClomnu: false,
                                            hide: true,
                                        },*/
                        /*   {
                                             label: '首页标题',
                                             prop: 'usertitle',
                                             value: '',
                                             hide: true,
                                             // span: 24,
                                         }*/
                    ],
                },
                userManager_btn_view: true,
                userManager_btn_add: true,
                userManager_btn_batchdel: true,
                userManager_btn_edit: true,
                userManager_btn_del: true,
                userManager_btn_perm: true,
                userManager_btn_reset: true,
                dialogVisible: false,
                needCompany: false,
                clickdata: {},
                companys: [],
                dialogTitle: "新增用户",
                submitType: "",
                showpassword: true,
                dialogPermissionVisible: false,
                checkedNodes: [],
                resetPwd: "",
                dialogPasswordVisible: false,
                rules: {
                    username: [
                        {required: true, message: "请输入账户名称", trigger: "blur"},
                        {min: 2, max: 50, message: "最多50位字符", trigger: "blur"},
                    ],
                    realName: [
                        {required: true, message: "请输入真实姓名", trigger: "blur"},
                        {min: 2, max: 50, message: "最多25个汉字", trigger: "blur"},
                    ],
                    expirationNtime: [
                        {required: true, message: "请输入过期时间", trigger: "blur"},
                    ],
                    mobile: [
                        {required: true, message: "请输入手机号码", trigger: "blur"},
                        {min: 11, max: 11, message: "请输入11位手机号码", trigger: "blur"},
                        {
                            pattern:
                                /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
                            message: "请输入正确的手机号码",
                        },
                    ],
                    password: [
                        {required: true, message: "请输入密码", trigger: "blur"},
                        {min: 6, max: 20, message: "请输入6至20位密码", trigger: "blur"},
                    ],
                    confirmPassword: [
                        {required: true, message: "请再次输入密码", trigger: "blur"},
                        {validator: this.checkConfirmPassword, trigger: "blur"},
                    ],
                    usertype: [
                        {required: true, message: "请选择用户类型", trigger: "change"},
                    ],
                    role: [
                        {required: true, message: "请选择用户角色", trigger: "blur"},
                    ],
                },
                column: [
                    /*{
                                // fixed: true,
                                label: 'id',
                                prop: 'rowId',
                                show: false,
                                editDisabled: true,
                                editDisplay: false,
                                addDisplay: false
                            },*/
                    {
                        fixed: true,
                        label: "登录名",
                        prop: "username",
                        width: 150,
                    },
                    {
                        label: "真实姓名",
                        prop: "realName",
                        width: 150,
                    },
                    {
                        label: "手机号",
                        prop: "mobile",
                        width: 150,
                    },
                    {
                        width: 180,
                        label: "过期时间",
                        prop: "expirationNtime",
                        type: "datetime",
                        format: "yyyy-MM-dd HH:mm",
                        valueFormat: "yyyy-MM-dd HH:mm:ss",
                    },
                    {
                        label: "用户类型",
                        prop: "usertype",
                        formatter: this.usertypeFormatter,
                        width: 150,
                    },
                    {
                        label: "所属分组",
                        prop: "groupName",
                        width: 400,
                        formatter: this.groupName,
                    },
                    /*{
                                    label: '厂商名称',
                                    prop: 'companyName',

                                },
                                {
                                    label: '首页标题',
                                    prop: 'usertitle',
                                    value: '',
                                    hide: true,
                                }*/
                ],
            };
        },
        computed: {
            ...mapGetters(["permissions", "groupData"]),
        },
        watch: {
            role() {
                this.form.role = this.role;
            },
        },

        created() {
            // this.sys_user_add = this.permissions['sys_user_add']
            // this.sys_user_edit = this.permissions['sys_user_edit']
            // this.roleManager_btn_add = this.permissions['sys_role_add']
            // this.roleManager_btn_edit = this.permissions['sys_role_edit']
            // this.roleManager_btn_del = this.permissions['sys_role_del']
            // this.roleManager_btn_perm = this.permissions['sys_role_perm']
            //this.sys_user_del = this.permissions['sys_user_del'] || true
            this.getBtnPermis(); //按钮权限
            this.init();
        },
        methods: {
            ...mapMutations({
                setGroupBoxStatus: "setGroupBoxStatus",
                setGroupCheckBox: "setGroupCheckBox",
            }),
            getBtnPermis() {
                this.userManager_btn_view =
                    this.permissions[window.global.buttonPremission.userView];
                this.userManager_btn_add =
                    this.permissions[window.global.buttonPremission.userAdd];
                this.userManager_btn_batchdel =
                    this.permissions[window.global.buttonPremission.userDelete];
                this.userManager_btn_edit =
                    this.permissions[window.global.buttonPremission.userEdit];
                this.userManager_btn_del =
                    this.permissions[window.global.buttonPremission.userDelete];
                this.userManager_btn_perm =
                    this.permissions[window.global.buttonPremission.userMag];
                this.userManager_btn_reset =
                    this.permissions[window.global.buttonPremission.userReset];
                //console.log("this.permissions", this.permissions);
            },
            checkConfirmPassword(rule, value, callback) {
                if (!value) {
                    callback(new Error("请再次输入密码"));
                } else {
                    if (value != this.form.password) {
                        return callback(new Error("密码输入不一致"));
                    } else {
                        callback();
                    }
                }
            },
            handleCheckDate(checkedNodes) {
                this.checkedNodes = checkedNodes;
            },
            handleNodeClick(val) {
                if (val && val.id) {
                    //获取所有子id
                    this.searchForm.groupid = val.id;
                    this.clickdata = val;
                } else {
                    this.searchForm.groupid = null;
                    this.clickdata = {}
                }
                /* if (val.length) {
                               this.searchForm.groupsId = checkedKeys.join(",");
                           }*/
            },
            openGroupbox() {
                this.setGroupCheckBox(true);
                this.setGroupBoxStatus(true);
            },
            init() {
                //初始化用户类型
                this.initRole();
                this.initUserTypes("user_type");
                this.searchUser();
            },
            initRole() {
                roleList().then((response) => {
                    if (response.code === 0) {
                        this.roles = Object.assign([], response.data);
                    }
                });
            },
            //可以写成全局的
            initUserTypes(listType) {
                fetchItemList(
                    Object.assign(
                        {
                            current: 1,
                            size: 10000,
                        },
                        {listType: listType}
                    )
                ).then((response) => {
                    this.userTypes = Object.assign([], response.data.records);
                });
            },
            //获取用户列表
            searchUser() {
                // this.searchForm = param
                this.page.currentPage = 1;
                this.getList(this.page, this.searchForm);
                // done()
            },
            async getList(page, params) {
                this.listLoading = true;
                let res = await fetchList(
                    Object.assign(
                        {
                            current: page.currentPage,
                            size: page.pageSize,
                        },
                        params
                    )
                );
                if (res) {
                    this.list = res.data.records;
                    this.page.total = res.data.total;
                    this.listLoading = false;
                }
            },

            sizeChange(pageSize) {
                this.page.pageSize = pageSize;
                this.getList(this.page, this.searchForm);
                //return false;
            },
            currentChange(current) {
                this.page.currentPage = current;
                this.getList(this.page, this.searchForm);
            },

            // 表格选择项发生改变时触发
            handleSelectionChange(selection) {
                this.selection = selection;
            },
            //新增用户
            resetForm() {
                this.form = {};
                this.$refs.form.resetFields();
            },
            Cancel() {
                this.resetForm();
                this.dialogVisible = false;
            },
            handleAdd() {
                if (!this.clickdata.id) {
                    this.$message.info("请选择分组");
                    return;
                }
                this.form = {role: []};
                //this.resetForm()
                this.showpassword = true;
                this.dialogVisible = true;
                this.form.groupid = this.clickdata.id;
                this.form.groupName = this.clickdata.groupNameFullPath;
                this.form.expirationNtime = getPassYearFormatDate();
                this.form.usertitle = this.clickdata.name + "北斗农机管理平台";
                this.submitType = "add";
                this.dialogTitle = "新增用户";


                function getPassYearFormatDate() {
                    var nowDate = new Date();
                    var date = new Date(nowDate);
                    date.setDate(date.getDate() + 365 * 1);
                    var seperator1 = "-";
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var strDate = date.getDate();
                    if (month >= 1 && month <= 9) {
                        month = "0" + month;
                    }
                    if (strDate >= 0 && strDate <= 9) {
                        strDate = "0" + strDate;
                    }
                    var currentdate = year + seperator1 + month + seperator1 + strDate;
                    return currentdate;
                }
            },
            // 编辑用户
            async handleUpdate(row) {
                if (!row) {
                    this.$message.info("请选择需要修改的用户");
                    return;
                }
                this.submitType = "update";
                this.dialogTitle = "编辑用户";
                this.form = Object.assign({}, row);
                //获取用户拥有的角色
                let res = await fetchRoles(this.form.rowId);
                if (res.code === 0) {
                    this.form.role = Object.assign([], res.data);
                }
                this.form = {...this.form};
                this.showpassword = false;
                this.usertypeChange(row.usertype);
                this.dialogVisible = true;
            },

            save() {
                if (this.submitType == "add") {
                    this.create();
                }
                if (this.submitType == "update") {
                    this.update();
                }
            },
            // 新增保存用户
            create(row, done, loading) {
                let that = this;
                this.$refs.form.validate().then((va) => {
                    if (va) {
                        let paramters = Object.assign({}, that.form);

                        if (paramters.expirationNtime) {
                            paramters.expirationNtime = paramters.expirationNtime + " 23:59:59";
                        }
                        addObj(paramters)
                            .then((response) => {
                                if (response.code === 0) {
                                    that.$notify.success("新增成功");
                                    that.dialogVisible = false;
                                    that.searchUser();
                                } else {
                                    that.$notify.error("新增失败：" + response.msg);
                                }
                            })
                            .catch(() => {
                            });
                    }
                });
            },
            // 编辑更新
            update(row, index, done, loading) {
                let that = this;
                this.$refs.form.validate().then((va) => {
                    if (va) {
                        let paramters = Object.assign({}, this.form);

                        // if (paramters.expirationNtime) {
                        //     paramters.expirationNtime = paramters.expirationNtime + " 23:59:59";
                        // }
                        //console.log(paramters.expirationNtime,"shuchu")
                        let a = new Date(paramters.expirationNtime);
                        paramters.expirationNtime = a.getFullYear() + "-" + (a.getMonth() + 1) + "-" + a.getDate() + " 23:59:59"
                        //console.log(paramters.expirationNtime,"afafas")
                        putObj(paramters)
                            .then((response) => {
                                if (response.code === 0) {
                                    that.$notify.success("修改成功");
                                    that.dialogVisible = false;
                                    that.searchUser();
                                } else {
                                    that.$notify.error("修改失败：" + response.msg);
                                }
                            })
                            .catch(() => {
                            });
                    }
                });
            },
            // 删除用户
            handleDelete(row, index) {
                this.$confirm(
                    "将永久删除用户【" + row.username + "】,确认删除？",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                ).then(() => {
                    delObj(row.rowId)
                        .then((respones) => {
                            if (respones.code === 0) {
                                this.$notify.success("删除成功");
                                this.searchUser();
                            } else {
                                this.$notify.error("删除失败");
                            }
                        })
                        .catch(() => {
                            this.$notify.error("删除失败");
                        });
                });
            },
            handleResetPassword(row, index) {
                this.$confirm(
                    "将重置用户【" + row.username + "】的密码,是否继续？",
                    "提示",
                    {
                        confirmButtonText: "继续",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                ).then(() => {
                    let ressetPassword = getPassword(8);
                    //console.log("ressetPassword", ressetPassword);

                    resetPwd(
                        Object.assign({}, {rowId: row.rowId, newpassword: ressetPassword})
                    ).then((response) => {
                        if (response.code === 0) {
                            /*this.$confirm('重置成功，密码为:' + ressetPassword + '  请妥善保管', '提示', {
                                                confirmButtonText: '复制密码',
                                                cancelButtonText: '取消',
                                                type: 'warning'
                                            }).then(
                                                () => {
                                                    window.clipboardData.setData("Text", ressetPassword);
                                                    this.$notify.success('复制成功')
                                                }
                                            )*/
                            this.resetPwd = ressetPassword;
                            this.dialogPasswordVisible = true;
                        } else {
                            this.$notify.error("重置失败");
                        }
                    });
                    /*delObj(row.rowId)
                                    .then((respones) => {
                                        if (respones.code === 0) {
                                            this.$notify.success('删除成功')
                                            this.searchUser();
                                        } else {
                                            this.$notify.error('删除失败')
                                        }

                                    }).catch(() => {

                                })*/
                });
            },
            async handlePermission(row, index) {
                if (!row) return;
                this.form = Object.assign({}, row);
                let res = await getGroups(row.rowId);
                if (res.code === 0) {
                    this.checkedKeys = Object.assign([], res.data);
                    this.dialogPermissionVisible = true;
                } else {
                    this.$notify.error("获取用户权限失败");
                }
            },
            updatePermession() {
                if (!this.form.rowId) {
                    return;
                }
                if (this.checkedNodes) {
                    var ids = [];
                    var pids = [];
                    for (var i = 0; i < this.checkedNodes.length; i++) {
                        ids.push(this.checkedNodes[i].id);
                        pids.push(this.checkedNodes[i].pId);
                    }
                    var result = [];
                    for (var j = 0; j < pids.length; j++) {
                        for (var h = 0; h < ids.length; h++) {
                            if (pids[j] == ids[h]) {
                                result.push(ids[j]);
                            }
                        }
                    }
                    let newArray = this.minus(ids, result);
                    //console.log("newArray", newArray);
                    this.form.groups = newArray;
                }

                let that = this;
                if (!this.form.groups || this.form.groups.length == 0) {
                    this.$confirm(
                        "是否将用户" + this.form.username + "的数据权限置空?",
                        "提示",
                        {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
                        }
                    ).then(() => {
                        that.updateUserPermission();
                    });
                } else {
                    this.updateUserPermission();
                }
            },
            updateUserPermission() {
                updateGroups(Object.assign({}, this.form)).then((response) => {
                    if (response.code === 0) {
                        this.$notify.success("更新成功");
                        this.dialogPermissionVisible = false;
                    }
                });
            },
            // 批量删除用户
            deletes() {
                if (this.selection.length <= 0) {
                    this.$message.info("请选择需要删除的用户");
                    return;
                }
                let that = this;
                this.$confirm("是否确认删除选中的数据?", "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    let tmpplandatas = [];
                    that.selection.forEach((ele, index) => {
                        tmpplandatas.push(
                            new Promise(function (resolve, reject) {
                                // 此处进行异步请求
                                delObj(ele.rowId).then((res) => {
                                    res.username = ele.username;
                                    res.realName = ele.realName;
                                    resolve(res);
                                });
                            })
                        );
                    });
                    Promise.all(tmpplandatas).then((res) => {
                        //console.log("Promise", res);
                        var isrefresh = false;
                        var suceessGroup = "";
                        var errorGroup = "";
                        res.forEach((ele, index) => {
                            if (ele.code === 0) {
                                suceessGroup +=
                                    "删除" + ele.username + "(" + ele.realName + ")成功";
                                if (index < res.length - 1) {
                                    suceessGroup += " <br/>";
                                }
                                isrefresh = true;
                            } else {
                                errorGroup +=
                                    "删除" +
                                    ele.username +
                                    "(" +
                                    ele.realName +
                                    ")失败：" +
                                    ele.msg;
                                if (index < res.length - 1) {
                                    errorGroup += " <br/>";
                                }
                            }
                        });
                        if (suceessGroup.length > 0) {
                            that.$notify({
                                duration: 3000,
                                dangerouslyUseHTMLString: true,
                                message: suceessGroup,
                                type: "success",
                            });
                        }
                        if (errorGroup.length > 0) {
                            that.$notify({
                                duration: 3000,
                                dangerouslyUseHTMLString: true,
                                message: errorGroup,
                                type: "error",
                            });
                        }
                        if (isrefresh) this.searchUser();
                    });
                });
            },
            // 导入用户
            handleImport(row, index) {
                this.$refs.import.dialogVisible = true;
            },
            formatterUserType(val) {
                let userTypeName = val.usertype;
                if (this.userTypes) {
                    this.userTypes.forEach((ele, index) => {
                        if (ele.itemCode == val.usertype) {
                            userTypeName = ele.itemName;
                            return;
                        }
                    });
                }
                return userTypeName;
            },
            usertypeChange(val) {
                //console.log("usertypeChange", val);
                this.companys = [];
                let listType;
                if (val * 1 === 4) {
                    listType = "terminal_agent";
                } else if (val * 1 === 5) {
                    listType = "machine_agent";
                } else if (val * 1 === 6) {
                    listType = "ternimal_manufacturer";
                } else if (val * 1 === 7) {
                    listType = "machine_manufacturer";
                }
                if (listType) {
                    this.needCompany = true;
                    fetchItemList(
                        Object.assign(
                            {
                                current: 1,
                                size: 10000,
                            },
                            {listType: listType}
                        )
                    ).then((response) => {
                        this.companys = Object.assign([], response.data.records);
                    });
                } else {
                    this.needCompany = false;
                }
            },
            usertypeFormatter(val) {
                let usertypename = val.usertype;
                if (this.userTypes) {
                    this.userTypes.forEach((ele, index) => {
                        if (ele.itemCode == val.usertype) {
                            usertypename = ele.itemName;
                            return;
                        }
                    });
                }
                return usertypename;
            },
            companyChange(val) {
                //console.log("companyChange", val);
                this.companys.forEach((item) => {
                    if (item.itemCode * 1 === val * 1) {
                        this.form.companyName = item.itemName;
                        return;
                    }
                });
            },
            minus(o, arr) {
                var result = new Array();
                var obj = {};
                for (var i = 0; i < arr.length; i++) {
                    obj[arr[i]] = 1;
                }
                for (var j = 0; j < o.length; j++) {
                    if (!obj[o[j]]) {
                        obj[o[j]] = 1;
                        result.push(o[j]);
                    }
                }
                return result;
            },
            onPwdCopy() {
                this.$notify.success("复制成功");
            },
            onPwdCopyError() {
                this.$notify.error("复制失败");
            },
            indexMethod(index) {
                return (this.page.currentPage - 1) * this.page.pageSize + index + 1;
            },
        },
    };
</script>
<style lang="less" scoped>
    .user {
        height: 100%;

        .datepicker {
            width: 100% !important;
        }

        &__tree {
            padding-top: 3px;
            padding-right: 20px;
        }

        &__main {
            height: 100%;

            .el-card__body {
                padding-top: 0;
            }

            .my-form {
                border-bottom: #133460 1px solid;
            }

            .my-table {
            }
        }

        .basic-con {
            /deep/ .el-card__body {
                width: 100%;
            }

            .self-box {
                position: unset;
                background: transparent;
                height: 100%;
                padding-right: 20px;
                margin-right: 20px;
                border-right: 1px solid #133460;

                .group-box {
                    .box-card {
                        background: transparent !important;
                    }
                }

                div {
                    position: unset;
                }
            }

            .my-form {
                // border-bottom: #133460 1px solid;
                .el-form-item {
                    margin-bottom: 18px;
                    margin-right: 20px;
                }

                @media screen and (max-width: 1600px) {
                    .el-input {
                        width: 150px;
                    }
                }

                /deep/ .el-form-item__label {
                    line-height: 36px;
                }
            }

            .my-table {
                margin-top: 10px;
                height: calc(100% - 120px);
                //overflow: auto !important;

                /deep/ .el-form {
                    height: 440px;
                    width: 100%;
                }

                /deep/ .el-table {
                    //height: auto;
                }
            }
        }
    }
</style>

