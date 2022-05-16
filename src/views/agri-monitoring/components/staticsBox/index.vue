<template>
    <!-- 统计组件 -->
    <div class="statics-box">
        <div
                :class="['box', {'active': currentIndex === index}]"
                v-for="(item,index) in staTypes"
                :key="item.type"
                @click="changeType(item, index)">
            <img class="selectImg" :class="{'showimg': currentIndex === index}" src="../../../../assets/images/agri-monitoring-select.png" alt="">
            <p
                    class="sta"
                    :style="[{'color': item.type === '' ? '#b7afff' : item.type === 1 ? '#3cfad3' : '#f4b350'},{'textShadow': item.type === 1 ? '0 0 36px #b7afff' : item.type === 2 ? '0 0 36px #3cfad3' : '0 0 36px #f4b350'}]">
                <span class="num">{{item.value}}</span> 辆</p>
            <p class="type">{{item.label}}</p>
        </div>
    </div>
</template>

<script>
    import {getMachineOverview, queryLocation} from '@/api/monitoring/index'
    import {mapGetters} from "vuex";


    export default {
        name: 'staticsBox',
        data() {
            return {
                staTypes: [
                    {label: '全部农机', type: '', value: 0},
                    {label: '在线农机', type: 1, value: 0},
                    {label: '离线农机', type: 0, value: 0},
                ],
                currentIndex: 0,
                params: {}
            }
        },
        created() {
            // let params = {
            //     jobType: this.globalSetting.jobType
            // }
            // this.initData(params)
        },
        computed: {
            ...mapGetters(['globalSetting'])
        },
        methods: {
            // 加载数据
            async initData(params = {}, first = true) {
                this.params = Object.assign({}, params);
                let res = await getMachineOverview(this.params);//按条件查询当前用户的农机
                let {code, msg, data} = res;
                if (code == 0) {
                    this.staTypes = [
                        {label: '全部农机', type: '', value: data.total},
                        {label: '在线农机', type: 1, value: data.currOnline},
                        {label: '离线农机', type: 0, value: data.offLine},

                    ]
                    this.currentIndex = 0;
                    /*if (first) {
                        this.changeType(this.staTypes[0], 0)
                    }*/
                }
            },
            // 改变类型
            async changeType(item, index) {
                this.currentIndex = index;
                this.$emit('changeLoading', true);
                let params = Object.assign({}, this.params, {
                    status: item.type
                });
                let res = await queryLocation(params);
                let {code, data, msg} = res;
                if (code == 0) {
                    //console.log(data, 'code')
                    data.forEach(element => {
                        element.geometryType = "Point"
                        element.coordinates = [element.lon, element.lat];
                    });
                    this.$emit('init', data, item.type)
                } else {
                    this.$message.error(msg || '查询失败')
                }
                this.$emit('changeLoading', false);
            }
        }
    }
</script>

<style lang="less" scoped>
    .statics-box {
        // width: 636px;
        width: 40%;
        display: flex;
        justify-content: space-between;

        .box {
            // width: 204px;
            width: 30%;
            height: 94px;
            background-color: #04122c;
            box-shadow: inset 2px 0px 16px 0px rgba(50, 111, 166, 0.8);
            border: solid 1px #1c91ff;
            text-align: center;
            cursor: pointer;
            position: relative;

            .selectImg{
                display: none;
                position: absolute;
                top: 0;
                right: 0;
            }
            .showimg{
                display: inline-block;
            }

            .sta {
                color: #3cfad3;
                font-family: SourceHanSansCN-Medium;
                font-size: 16px;
                margin-bottom: 0;

                .num {
                    font-family: DINNextW1G-MediumItalic;
                    font-size: 30px;
                    font-style: italic;
                }
            }
            .type {
                margin: 0;
                color: #ffffff;
                font-family: SourceHanSansCN-Bold;
                font-size: 16px;
            }
        }
        .active {
            // background-image: url('../../../../assets/images/agri-monitoring-select.png');
            // background-repeat: no-repeat;
            // background-position: 100% 0%;
            box-shadow: inset 0px 0px 50px 0px rgba(0, 134, 255, 0.7);
        }
    }
</style>