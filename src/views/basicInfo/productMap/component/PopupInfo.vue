<template>
    <div>
        <div class="right_tab_container" v-if="data && data.dialogType == 'machine'">
            <div class="title">
                <strong>农机详情:{{machineTile}}</strong>
                <div class="close-container"><img src="@/assets/images/one-picture-close.png" @click="close"></div>
            </div>
            <div class="content">
                <div v-for="(item,index) in infoList" class="info" :key="index" v-if="item.value">
                    <div class="key-container">{{ item.name }}</div>
                    <div class="value-container" :class="item.class">{{ item.value }}</div>
                </div>
            </div>
        </div>
        <div class="right_tab_container" style="top: 0px" v-if="data && data.dialogType == 'cooperative'">
            <div class="title">
                <strong>合作社详情</strong>
                <div class="close-container"><img src="@/assets/images/one-picture-close.png" @click="close"></div>
            </div>
            <div class="content">
                <div v-for="(item,index) in cooperativeList" class="info" :key="index" v-if="item.value">
                    <div class="key-container">{{ item.name }}</div>
                    <div class="value-container" :class="item.class">{{ item.value }}</div>
                </div>
            </div>
        </div>
        <div class="right_tab_container" style="top: 0px" v-if="data && data.dialogType == 'pit'">
            <div class="title">
                <strong>维修站点详情</strong>
                <div class="close-container"><img src="@/assets/images/one-picture-close.png" @click="close"></div>
            </div>
            <div class="content">
                <div v-for="(item,index) in pitList" class="info" :key="index" v-if="item.value">
                    <div class="key-container">{{ item.name }}</div>
                    <div class="value-container" :class="item.class">{{ item.value }}</div>
                </div>
            </div>
        </div>
        <div class="right_tab_container" style="top: 0px" v-if="data && data.dialogType == 'gasstation'">
            <div class="title">
                <strong>加油站详情</strong>
                <div class="close-container"><img src="@/assets/images/one-picture-close.png" @click="close"></div>
            </div>
            <div class="content">
                <div v-for="(item,index) in gasStationList" class="info" :key="index" v-if="item.value">
                    <div class="key-container">{{ item.name }}</div>
                    <div class="value-container" :class="item.class">{{ item.value }}</div>
                </div>
            </div>
        </div>
        <div class="right_tab_container" v-if="data && data.dialogType == 'sales'">
            <div class="title">
                <strong>销售站点详情</strong>
                <div class="close-container"><img src="@/assets/images/one-picture-close.png" @click="close"></div>
            </div>
            <div class="content">
                <div v-for="(item,index) in saleList" class="info" :key="index">
                    <div class="key-container">{{ item.name }}</div>
                    <div class="value-container" :class="item.class">{{ item.value }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getMachineDetail,getMachineDetail_, getProductDetail} from "../../../../api/agridata";

    export default {
        props: ["selectId", "data"],
        components: {},
        data() {
            return {
                //农机详情
                infoList: [
                    {id: 1, name: '农机分组：', value: '', class: '', relation: 'groupNameFullPath',},
                    {id: 2, name: '车牌号：', value: '', class: '', relation: 'plateNumber',},
                    {id: 3, name: '终端编号：', value: '', class: '', relation: 'terminalCode',},
                    {id: 4, name: '机手姓名：', value: '', class: '', relation: 'ownerName',},
                    {id: 5, name: '设备时间：', value: '', class: '', relation: 'time',},
                    {id: 6, name: '位置：', value: '', class: '', relation: 'x',},
                    {id: 7, name: '地址：', value: '', class: '', relation: 'location',},
                    {id: 8, name: '农机类型：', value: '', class: '', relation: 'machineType',},
                    {id: 9, name: '作业类型：', value: '', class: '', relation: 'jobType',},
                    {id: 10, name: '作业宽幅：', value: '', class: '', relation: 'toolWidth',},
                    {id: 11, name: '农机状态：', value: '', class: 'online', relation: 'additional',},
                    {id: 12, name: '速度：', value: '', class: '', relation: 'velocity',},
                ],
                //合作社详情
                cooperativeList: [
                    {id: 1, name: '合作社名称：', value: '', class: '', relation: 'groupNameFullPath',},
                    {id: 2, name: '地址：', value: '', class: '', relation: 'groupNameFullPath',},
                    {id: 3, name: '联系人：', value: '', class: '', relation: 'groupNameFullPath',},
                    {id: 4, name: '联系电话：', value: '', class: '', relation: 'groupNameFullPath',},
                ],
                //维修站详情
                pitList: [
                    {id: 1, name: '名称：', value: '', class: '', relation: 'resourcesName',},
                    {id: 2, name: '地址：', value: '', class: '', relation: 'address',},
                    {id: 3, name: '联系人：', value: '', class: '', relation: 'ownerName',},
                    {id: 4, name: '联系电话：', value: '', class: '', relation: 'ownerPhone',},
                ],
                //加油站详情
                gasStationList: [
                    {id: 1, name: '名称：', value: '', class: '', relation: 'resourcesName',},
                    {id: 2, name: '地址：', value: '', class: '', relation: 'address',},
                    {id: 3, name: '联系人：', value: '', class: '', relation: 'ownerName',},
                    {id: 4, name: '联系电话：', value: '', class: '', relation: 'ownerPhone',},
                ],
                //销售站点详情
                saleList: [
                    {id: 1, name: '名称：', value: '', class: '', relation: 'resourcesName',},
                    {id: 2, name: '地址：', value: '', class: '', relation: 'address',},
                    {id: 3, name: '联系人：', value: '', class: '', relation: 'ownerName',},
                    {id: 4, name: '联系电话：', value: '', class: '', relation: 'ownerPhone',},
                ],
                machineTile: "",
            }
        },
        methods: {
            close() {
                this.$emit('close')
            },
            //获取农机详情
            async getMachineDetail(id) {
                let res = await getMachineDetail({
                    machinId: id
                });
                if (!res.code) {
                    //console.log(res.data)
                    this.machineTile = res.data.plateNumber
                    this.infoList.forEach(item => {
                        item.value = res.data[item.relation];
                        if (item.relation == 'x') {
                            item.value = '(' + res.data.x + ',' + res.data.y + ')';
                        } else if (item.relation == 'toolWidth') {
                            item.value = item.value ? item.value + '(米)' : '0(米)';
                        } else if (item.relation == 'velocity') {
                            item.value = item.value ? item.value + '(km/h)' : '0(km/h)';
                        } else if (item.relation === 'additional') {
                            if (res.data.additional === '离线') {
                                item.class = 'offline'
                            } else {
                                item.class = 'online'
                            }
                        }

                    })
                }
            },
            //获取生产资源详情
            async getProductDetail(id, type) {
                let res = await getProductDetail({
                    rowId: id
                })
                if (!res.code) {
                    if (type == '1') {
                        this.gasStationList.forEach(item => {
                            item.value = res.data[item.relation];
                        })
                    }
                }
            },
            //维修站详情
            async getpitListDetail(id, type) {
                let res = await getProductDetail({
                    rowId: id
                })
                if (!res.code) {
                    if (type == '2') {
                        this.pitList.forEach(item => {
                            item.value = res.data[item.relation];
                        })
                    }
                }
            }
        },
        watch: {
            "data": {
                handler(newName, oldName) {
                    //console.log("getProductDetail", newName)
                    if (newName.dialogType == 'machine') {
                        this.getMachineDetail(newName.id);
                    } else if (newName.resoucesType == '1') {
                        this.getProductDetail(newName.id, '1');
                    } else if (newName.resoucesType == '2') {
                        this.getpitListDetail(newName.id, '2')
                    }
                },
                immediate: true
            }
        }
    }
</script>

<style lang="less" scoped>
    .right_tab_container {
        position: absolute;
        width: 410px;
        left: 10px;
        top: -190px;
        background-color: rgba(18, 26, 46, 0.9);
        border: 1px solid #64bfff;
        padding-bottom: 10px;

        .title {
            height: 37px;
            background-image: linear-gradient(to right, rgba(9, 100, 181, 1), rgba(0, 0, 0, 0));
            font-size: 16px;
            color: #FFFFFF;
            display: flex;
            flex-direction: row;
            align-items: center;
            padding-left: 20px;
            justify-content: space-between;

            .close-container {
                width: 30px;
                cursor: pointer;
            }
        }

        .content {
            max-height: 364px;
            overflow-y: auto;
        }

        .info {
            font-size: 16px;
            display: flex;
            margin-top: 10px;

            .key-container {

                font-size: 14px;
                color: #a3bbce;
                width: 90px;
                text-align: right;
            }

            .value-container {

                font-size: 14px;
                color: #64bfff;
                width: 300px;
            }

            .online {
                color: #0ba790;
            }

            .offline {
                color: #e9e2e6;
            }
        }
    }
</style>