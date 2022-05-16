<template>
    <!-- 实时图片组件 -->
    <div class="picture-box">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <div class="search-type">
                    <div class="active">
                        <img src="img/monitoring/icon-title.png" alt="">
                        <span>实时图片</span>
                    </div>
                </div>
                <el-button style="float: right; padding-top: 15px;" type="text" @click="close">
                    <img src="img/monitoring/icon_expand.png" alt="">
                </el-button>
            </div>

            <div class="my-form form-con">
                <el-date-picker
                        class="datepicker"
                        v-model="beginTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        :clearable="false"
                        prefix-icon="el-icon-date"
                        placeholder="选择开始时间"
                        :picker-options="pickerOptions"
                ></el-date-picker>
                <el-date-picker
                        class="datepicker"
                        v-model="endTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        :clearable="false"
                        prefix-icon="el-icon-date"
                        placeholder="选择结束时间"
                        :picker-options="pickerOptions"
                ></el-date-picker>
                <div class="btns">
                    <el-button round type="primary"  class="primary-btn-plain" plain @click="takePhotos" v-if="false">照片拍摄</el-button>
                    <el-button type="primary" class="primary-btn" round @click="query">照片查询</el-button>
                </div>
            </div>
            <div
                    v-if="picData.length > 0"
                    class="pics-con"
                    ref="pics"
                    :style="{'overflow-y': overflow}"
                    @mouseenter="handleMouserEnter"
                    @mouseleave="handleMouseLeave">
                <div class="pic" ref="pic" v-for="item in picData" :key="item.mediafullpath" @click="clickPhotos(item)">
                    <img :src="item.mediafullpath" alt="">
                    <div class="mask">{{item.time}}</div>
                </div>
            </div>
            <div v-else class="nodata">暂无图片</div>
        </el-card>
    </div>
</template>

<script>
    import {getPhoto, takePhoto} from '@/api/monitoring/index'
    import {prevMonth} from '@/util/date'

    export default {
        name: 'pictureBox',
        data() {
            return {
                beginTime: '', // 查询 开始时间
                endTime: '', // 查询 结束时间
                pickerOptions: {
                    disabledDate: time => {
                        let maxDate = new Date();
                        // 点击此刻后的问题
                        return time.getTime() >= maxDate.getTime() + 10
                    },
                },
                listData: sessionStorage.getItem('currentCar') ? JSON.parse(sessionStorage.getItem('currentCar')) : {},
                picData: [],
                scrollInterval: null,
                overflow: 'hidden', //默认不展示滚动条
                queryPhotoInterval:null
            }
        },
        created() {
            // this.handleScroll();
            this.initTime();
            this.query();
            if (this.queryPhotoInterval) {
                clearInterval(this.queryPhotoInterval);
            }
            this.queryPhotoInterval = setInterval(this.query, 1000 * 60 * 10);
        },
        methods: {
            //初始化时间，默认一周内的时间
            initTime() {
                this.beginTime = new Date((new Date()).setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000 * 3);
                this.endTime = new Date((new Date()).setHours(24, 0, 0, 0) - 1000)
            },
            // 查询
            async query() {
                if (!this.listData) return
                //this.initTime();

                let params = {
                    beginTime: this.beginTime,
                    endTime: this.endTime,
                    machineId: this.listData.machineId,
                    currentPage:1,
                    pageSize:100
                }
                const res = await getPhoto(params);
                const {code, data, msg} = res;
                if (code == 0) {
                    this.picData = data.list;
                    this.handleScroll();
                } else {
                    //this.$message.error(msg || '查询失败')
                }
            },
            handleScroll() {
                if (this.scrollInterval) {
                    clearInterval(this.scrollInterval)
                }
                this.overflow = 'hidden';
                this.scrollInterval = setInterval(() => {
                    let pics = this.$refs.pics;
                    let pic = this.$refs.pic;
                    if (pics && pics.length > 0) {
                        pics.scrollTop++;
                        // //console.log(pics.scrollTop + pics.offsetHeight, Number(pic.offsetHeight)*4 + 16*3, '0000') // 519.8000030517578 520 '0000'
                        if (Number(pics.scrollTop) + Number(pics.offsetHeight) >= Number(pic[0].offsetHeight) * 4 + 16 * 3) {
                            pics.scrollTop = 0;
                        }
                    }
                }, 50)
            },
            handleMouserEnter() {
                if (this.scrollInterval) {
                    clearInterval(this.scrollInterval)
                }
                this.overflow = 'auto';
            },
            handleMouseLeave() {
                this.handleScroll();
            },
            // 照片拍摄
            async takePhotos() {
                let params = {
                    machineId: this.listData.machineId
                }
                let res = await takePhoto(params);
                const {code, data, msg} = res;
                if (code == 0) {

                } else {
                    this.$message.error(msg || '照片拍摄失败')
                }
            },
            // 照片拍摄
            async clickPhotos(item) {
                this.$emit("photoClick", item)
            },
            // 收起面板
            close() {

            }
        },
        beforeDestroy() {
            if (this.scrollInterval) {
                clearInterval(this.scrollInterval);
            }
            if (this.queryPhotoInterval) {
                clearInterval(this.queryPhotoInterval);
            }
        }
    }
</script>

<style lang="less" scoped>
    .picture-box {
        width: 400px;
        height: 47%;
        // min-height: 460px;
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
                    width: 128px;
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
                .datepicker {
                    width: 175px !important;
                    font-size: 13px;
                    margin-bottom: 16px;
                }

                .datepicker:first-child {
                    margin-right: 8px;
                }

                .btns {
                    text-align: right;
                    margin-bottom: 14px;

                    .el-button {
                        width: 80px;
                        height: 32px;
                        padding: 0;
                    }
                }
            }

            .pics-con {

                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: center;
                padding: 0 8px;
                // height: 268px;
                height: calc(100% - 98px);
                overflow-y: auto;

                .pic {
                    cursor: pointer;
                    width: 168px;
                    height: 118px;
                    background-color: #436e95;
                    position: relative;
                    margin-top: 16px;
                    text-align: center;

                    img {
                        height: 100%;
                        width: 100%;
                    }

                    .mask {
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        width: 100%;
                        height: 24px;
                        line-height: 24px;
                        background-color: rgba(9, 19, 41, .78);
                        color: #80c5ff;
                    }
                }

                .pic:nth-child(1), .pic:nth-child(2) {
                    margin-top: 0;
                }
            }
        }

        /deep/ .el-card__body {
            padding: 16px 16px 24px 16px;
            height: calc(100% - 89px);
            overflow-y: auto;
        }

        .nodata {
            color: @base-fontColor;
            text-align: center;
            line-height: 80px;
        }
    }
</style>