<template>
    <div class="image-header">
        <div class="image-header-con">
            <div class="system-title header-title">
                <img src="img/logo.png" alt="" class="logo" v-if="false"/>
                <span>{{ platTitle }}</span>
            </div>
            <div v-title :data-title="platTitle"></div>

            <div class="navigators">
                <div
                        class="nav-item"
                        v-for="(item, index) in navlists"
                        :class="{ active: currentIndex == index }"
                        :key="item.label"
                        @click="changeNav(item, index)"
                >
                    <span>{{ item.label }}</span>
                </div>
            </div>
            <div class="admin">
        <span class="system" @click="openSetting">
          <img class="icon" src="img/icon-system.png" alt=""/>
          <span>设置</span>
        </span>
                <el-dropdown @command="handleCommand">
                    <div class="user">
                        <img class="icon" src="img/icon_avatar.png" alt=""/>
                        <!-- <span>21314r34ffsdr13567 <i class="el-icon-arrow-down el-icon--right"></i></span> -->
                        <span
                        >{{ username }} <i class="el-icon-arrow-down el-icon--right"></i
                        ></span>
                    </div>
                    <el-dropdown-menu class="dropdown">
                        <el-dropdown-item command="edit" class="dropdown-item">
                            <img
                                    style="vertical-align: sub; margin-right: 7px"
                                    src="img/icon_edit2.png"
                                    alt=""
                            />修改密码
                        </el-dropdown-item>
                        <el-dropdown-item command="logout" class="dropdown-item">
                            <img
                                    style="vertical-align: sub; margin-right: 7px"
                                    src="img/icon-logout.png"
                                    alt=""
                            />退出登录
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <editPwd ref="pwd" :forcePassWord="forcePassWord"/>
    </div>
</template>

<script>
    import {mapMutations, mapGetters} from "vuex";
    import editPwd from "./editPwd";

    export default {
        name: "Header",
        inject: ["Index"],
        components: {
            editPwd,
        },
        data() {
            return {
                navlists: [],
                currentIndex: sessionStorage.getItem("navIndex")
                    ? sessionStorage.getItem("navIndex")
                    : 0,
                username: "",
                items: [],
                platTitle: "",
                forcePassWord: false
            };
        },
        computed: {
            ...mapGetters(["globalSetting", "userInfo","forcePassWordModify"]),
        },
        created() {
            //console.log("this.userInfo", this.userInfo);
            this.username = this.userInfo.username;
            this.platTitle =
                this.globalSetting.userTitle || "湖北省北斗农机信息化智能管理系统";
            this.getTopMenu();
            console.log("this.forcePassWordModify",this.forcePassWordModify)
            this.forcePassWord = this.forcePassWordModify;

            this.$nextTick(()=>{
                this.$refs.pwd.dialogVisible = this.forcePassWordModify;
            })

            // //console.log(sessionStorage.getItem("navIndex"));
        },
        props: {
            isShowPsdEdit: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            globalSetting: {
                handler: function (val, oldVal) {
                    this.platTitle = val.userTitle || "湖北省北斗农机信息化智能管理系统";
                },
                deep: true,
            },
        },
        methods: {
            ...mapMutations({
                SET_MENU_LEFT: "SET_MENU_LEFT",
            }),
            getTopMenu() {
                this.$store.dispatch("GetTopMenu").then((res) => {
                    //console.log("GetTopMenu", res);
                    this.navlists = [...res];
                    let index = sessionStorage.getItem("navIndex");
                    if (index > this.navlists.length) index = 0;
                    this.currentIndex = index || 0;
                    this.changeNav(this.navlists[this.currentIndex], this.currentIndex);

                    //this.$router.$avueRouter.formatRoutes(this.navlists, true);



                });
            },
            changeNav(item, index) {
                //this.Index.openMenu(item)
                // 切换模块 item当前模块的数据 index当前模块的序号
                //console.log("菜单路径", item.path);
                this.currentIndex = index;
                sessionStorage.setItem("navIndex", this.currentIndex);
                sessionStorage.setItem("sideBarIndex", "");
                this.Index.openMenu(item);
                this.Index.openSetting(false);
                //this.$router.push({path: item.path})
            },
            openSetting() {
                this.Index.openSetting(true);
            },
            // 用户操作
            handleCommand(command) {
                if (command == "edit") {
                    this.forcePassWord = false
                    this.$refs.pwd.dialogVisible = true;
                } else if (command == "logout") {
                    this.logout();
                }
            },
            platformServive() {
                this.Index.aboutUs();
            },
            async logout() {
                // 退出登录
                this.$store.dispatch("LogOut").then((res) => {
                    let {code, msg} = res;
                    if (code === 0) {
                        this.$notify.success({
                            title: "提示",
                            message: "退出成功！",
                        });
                        // debugger
                        sessionStorage.clear();
                        this.$localForage.clear();
                        this.$router.push({path: "/login"});
                    } else {
                        this.$notify.error({
                            title: "错误",
                            message: msg,
                        });
                    }
                });
            },
        },
    };
</script>

<style lang="less" scoped>
    @vw: 19.2vw;
    @vh: 10.8vh;
    @Font-size: 14 / @vw;
    @white: #fff;
    .image-header {
        box-sizing: border-box;
        padding: 15px 0 0 0;
        height: 80px;
        line-height: 80px;
        width: 100%;
        background: linear-gradient(to right, #0f1c40 20%, #0d2a54 52%, #0f1c40);
        // background-color: #0a1a2e;

        &-con {
            height: 100%;
            background-image: url("../../assets/images/header-bg-line1.png");
            background-repeat: no-repeat;
            background-size: 120% 100%;
            background-position: 50% 50%;
            display: flex;
        }

        .system-title {
            position: relative;
            top: -15px;
            font-family: SourceHanSansCN-Bold;
            margin-left: 0px;
            // font-weight: bold;
            font-weight: 550;
            color: @white;
            // background-image: -webkit-linear-gradient(270deg, #009bfe 0%, #5cc6fa 100%);
            background-image: linear-gradient(#009bfe 50%, #5cc6fa 70%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;

            .logo {
                vertical-align: middle;
                margin-right: 8px;
                margin-bottom: 8px;
            }
        }

        .navigators {
            position: relative;
            top: 5px;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;

            .nav-item {
                width: 16%;
                margin: -10px;
                height: 60%;
                color: #fff;
                background-image: url("../../assets/images/header-tab.png");
                background-repeat: no-repeat;
                background-size: 100% 100%;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;

                span {
                    opacity: 1;
                    // font-size: @Font-size;
                    // font-size: 17px;
                    font-family: SourceHanSansCN-Bold;
                    white-space: nowrap;
                    position: relative;
                    top: -5%;
                }
            }

            .nav-item:hover {
                background-image: url("../../assets/images/header-tab-active.png");
            }

            .active {
                background-image: url("../../assets/images/header-tab-active.png");
            }
        }

        .admin {
            height: 100%;
            display: flex;
            justify-content: end;
            // justify-content: space-around;
            align-self: center;
            color: #acd3f3;

            .system {
                cursor: pointer;
            }

            .user {
                display: flex;
                align-items: center;
                margin-left: 22px;
                color: #acd3f3;

                img {
                    height: 100%;
                    width: auto;
                }
            }

            .aboutUs {
                cursor: pointer;
                margin-left: 22px;
                margin-right: 22px;
            }

            .line {
                display: inline-block;
                width: 1px;
                height: 16px;
                background-color: #ffffff;
                opacity: 0.2;
                margin: 0 10px;
            }

            .exit {
                margin-right: 20px;
                cursor: pointer;
            }

            .icon {
                vertical-align: sub;
                margin-right: 6px;
            }
        }
    }
</style>

<style lang="less">
    @media screen and (max-width: 1800px) {
        .system-title {
            width: 37% !important;
        }

        .header-title {
            // font-size: 19px !important;
            font-size: 25px !important;
        }

        .admin {
            width: 30% !important;
        }

        .navigators {
            width: 61% !important;

            .nav-item {
                span {
                    font-size: 16px !important;
                }
            }
        }

        .aboutUs {
            margin-left: 11px !important;
        }

        .user {
            margin-left: 11px !important;
        }

        .dropdown-item {
            width: 85px;
        }
    }

    @media screen and (min-width: 1801px) and (max-width: 2000px) {
        .header-title {
            // font-size: 22px !important;
            font-size: 28px !important;
        }

        .system-title {
            width: 33% !important;
        }

        .admin {
            width: 24% !important;
        }

        .navigators {
            width: 58% !important;

            .nav-item {
                span {
                    font-size: 18px !important;
                }
            }
        }

        .aboutUs {
            margin-left: 11px !important;
        }

        .user {
            margin-left: 11px !important;
        }
    }

    @media screen and (min-width: 2001px) and (max-width: 2400px) {
        .header-title {
            // font-size: 24px !important;
            font-size: 30px !important;
        }

        .system-title {
            width: 29% !important;
        }

        .admin {
            width: 20% !important;
        }

        .navigators {
            width: 51% !important;

            .nav-item {
                height: 70% !important;

                span {
                    font-size: 20px !important;
                }
            }
        }
    }

    @media screen and (min-width: 2501px) {
        .header-title {
            // font-size: 30px !important;
            font-size: 34px !important;
        }

        .system-title {
            width: 30% !important;
        }

        .admin {
            width: 20% !important;
        }

        .navigators {
            width: 52% !important;

            .nav-item {
                height: 70% !important;

                span {
                    font-size: 22px !important;
                }
            }
        }
    }
</style>