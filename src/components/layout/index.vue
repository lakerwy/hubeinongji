<template>
    <div class="page">
        <!-- 顶部导航栏 -->
        <Header @setting="openSetting" :isShowPsdEdit="isShowPsdEdit"/>
        <div class="container">
            <!-- 左侧菜单栏 -->
            <Sidebar v-if="leftmenu && leftmenu.length" class="sidebar"/>
            <!-- 主工作区 -->
            <div :class="{'containerRoute1':(leftmenu && leftmenu.length),'containerRoute2': !(leftmenu && leftmenu.length) }">
                <router-view></router-view>
            </div>
            <Footer class="footer"/>
        </div>
        <!-- 设置页面,可以放在header里面 -->
        <settings v-if="isShowSetting" @close="closeSetting"/>
        <!-- 分组显示框，应该需要放在主视图-->
        <el-dialog class="my-dialog group-dialog" :visible="isShowGroupBox" :show-close="false" @close="close">
            <groupBox class="group" :showCheckBox="isShowCheckBox"/>
        </el-dialog>
    </div>
</template>

<script>
    import Header from '../header/index'
    import Sidebar from '../sidebar/index'
    import settings from '../settings/index'
    import groupBox from '../groupBox/index'
    import Footer from '../footer/index'
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: 'Index',
        provide() {
            return {
                Index: this
            };
        },
        components: {
            Header,
            settings,
            groupBox,
            Sidebar,
            Footer
        },
        data() {
            return {
                isShowSetting: false, // 是否显示设置框
                isShowSidebar: false,
                isShowPsdEdit: false
            }
        },
        computed: {
            ...mapGetters(['isShowGroupBox', 'isShowCheckBox', 'leftmenu'])
        },
        created() {
            if(this.$route.query.modifyPassword==='true'){
                this.isShowPsdEdit = true
            }else {
                this.isShowPsdEdit = false
            }
        },
        methods: {
            ...mapMutations({
                setGroupBoxStatus: 'setGroupBoxStatus',
                setLeftMenu: 'SET_MENU_LEFT'
            }),
            openMenu(item = {}) {
                if (this.$router.$avueRouter.$website.spatailRouterPath.includes(item.path)) {
                    //一级路由，关闭左菜单
                    if (item.path) {
                        this.setLeftMenu([]);
                        this.$router.push({path: item.path}).catch(() => {
                        })
                    }
                } else {
                    this.$store.dispatch("GetLeftMenu", {type: true, id: item.id}).then(data => {
                            //获取菜单
                            if (data.length !== 0) {
                                //this.$router.$avueRouter.formatRoutes(data, true);
                                /* if (data[0].path) {
                                     //console.log("data[0]", data[0])
                                     if (data[0].type === "0")//菜单
                                     {
                                         sessionStorage.setItem('sideBarIndex', item.path)
                                     }
                                     this.$router.push({path: item.path}).catch(() => {
                                     })
                                 }*/
                            } else {
                                if (item.path) {
                                    this.$router.push({path: item.path}).catch(() => {
                                    })
                                }
                            }
                        }
                    );
                }
            },
            aboutUs() {
                sessionStorage.setItem('navIndex', 10000)
                this.setLeftMenu([])
                this.$router.push({path: "/aboutUs"}).catch(() => {
                })
            },
            openSetting(val) {
                this.isShowSetting = val;
            }
            ,
            closeSetting(val) {
                this.isShowSetting = val;
            }
            ,
            close() {
                this.setGroupBoxStatus(false);
            }
        }
    }
</script>


<style lang="less" scoped>
    .page {
        width: 100%;
        height: 100%;
        // background: url("../../assets/images/bg.png");
        // background-size: 100% 100%;
        background: linear-gradient(to right, #0f1c40 20%, #0d2a54 52%, #0f1c40);

        // @media screen and (min-width:1980px) {
        //     .container{
        //         height: calc(100% - 79px) !important;
        //     }
        // }

        .container {
            box-sizing: border-box;
            // padding-top: 20px;
            height: calc(100% - 80px);
            display: flex;

            .sidebar {
                height: 100%;
                width: 240px;
                position: relative;
                /* .sub-con {
                     margin: 32px 21px 0 21px;
                     width: calc(100% - 282px);
                 }*/
            }

            .containerRoute1 {
                box-sizing: border-box;
                height: 100%;
                width: calc(100% - 240px);
                position: relative;
                background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDQ4OCwgMjAyMC8wNy8xMC0yMjowNjo1MyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjZmU5ODI2Ny02MTZhLTliNDUtYmQ3MC1mNjJlNDNlODQ2MmMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NENDRTBDNjAwQzgyMTFFQzlCN0I4RTI0M0ZGREIyMjkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NENDRTBDNUYwQzgyMTFFQzlCN0I4RTI0M0ZGREIyMjkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YmZjMWJjZTYtYzVkOS0xNzQ5LTkwZGQtZjhhNWE4Yzk1MzY0IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MWQwNzliZmEtMjg1Mi1lNzQ2LWFmNTktMDY2YWRiZTQxNWI0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+g5vTzgAAAEBJREFUeNpi/P//PwMuwAIiPFoOMQIpJiBmhIr/21Fj948FymGCKYSC/zBB/MZCVf5DMvY/uuRfdGMZ8bkWIMAAi9oSDBnxIm0AAAAASUVORK5CYII=) repeat;

                div:first-child {
                    box-sizing: border-box;
                    height: calc(100% - 10px);
                }
            }

            .containerRoute2 {
                box-sizing: border-box;
                height: 100%;
                width: 100%;
                position: relative;
                background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDQ4OCwgMjAyMC8wNy8xMC0yMjowNjo1MyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjZmU5ODI2Ny02MTZhLTliNDUtYmQ3MC1mNjJlNDNlODQ2MmMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NENDRTBDNjAwQzgyMTFFQzlCN0I4RTI0M0ZGREIyMjkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NENDRTBDNUYwQzgyMTFFQzlCN0I4RTI0M0ZGREIyMjkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YmZjMWJjZTYtYzVkOS0xNzQ5LTkwZGQtZjhhNWE4Yzk1MzY0IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MWQwNzliZmEtMjg1Mi1lNzQ2LWFmNTktMDY2YWRiZTQxNWI0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+g5vTzgAAAEBJREFUeNpi/P//PwMuwAIiPFoOMQIpJiBmhIr/21Fj948FymGCKYSC/zBB/MZCVf5DMvY/uuRfdGMZ8bkWIMAAi9oSDBnxIm0AAAAASUVORK5CYII=) repeat;

                div:first-child {
                    // box-sizing: border-box;
                    // height: calc(100% - 10px);
                    height: 100%;
                }
            }

            /*  .footer{
                  display:flex;
              }*/
        }

        .group-dialog {
            /deep/ .el-dialog__header {
                display: none;
            }

            /deep/ .el-dialog {
                margin: 0 !important;
                width: 350px;
                height: 70%;
                max-height: 700px;
                border: 0;
                top: 198px;
                left: 0px;
            }

            /deep/ .el-dialog__body {
                padding: 0;
            }
        }
    }
</style>
