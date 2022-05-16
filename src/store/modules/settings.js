// 全局作业设置
import {getStore, setStore} from '@/util/store'

const settings = {
    state: {
        globalSetting: getStore({name: 'globalSetting'}) || {}, // 全局作业设置
        isShowGroupBox: false, // 全局的农机分组框
        isShowCheckBox: false, // 农机分组控制是否显示复选框
        groupTreeType: 1,
        groupTreeIsArea: false,//是否是区域分组树
        isAll: false,
        groupData: {name: '', ids: [], machine: [], data: []}, // 全局农机分组框保存的数据-名字和id
    },
    mutations: {
        setGlobalSetting: (state, value) => {
            state.globalSetting = value
            setStore({
                name: 'globalSetting',
                content: state.globalSetting,
            })
        },
        // 控制农机分组开关
        setGroupBoxStatus: (state, value) => {
            state.isShowGroupBox = value;
            // // 农机分组关闭清空数据
            // if(!state.isShowGroupBox) {
            //   state.groupData = {name: '', ids: []};
            // }
        },
        // 控制农机分组复选框开关事件
        setGroupCheckBox: (state, value) => {
            if(state.isShowCheckBox != value){
                state.isShowCheckBox = value;
                // if(value == 1 && state.groupData.name){
                    state.groupData = {
                        name: '',
                        ids: [],
                        machine: [],
                        data: [],
                        children :[] 
                    }
                // }
            }
            // state.isShowCheckBox = value;
        },
        // 保存农机分组数据
        setGroupData: (state, value) => {
            state.groupData = value;
        },
        // 设置树的加载方式
        setGroupBoxType: (state, value) => {
            if(state.groupTreeType != value){
                state.groupTreeType = value;
                    state.groupData = {
                        name: '',
                        ids: [],
                        machine: [],
                        data: [],
                        children :[] 
                    }
            }
        },
        //设置分组树是不是区域树
        setGroupTreeIsArea:(state,value) => {
            state.groupTreeIsArea = value
        },

        // 保存是否全部加载（管理员用）
        setGroupBoxAll: (state, value) => {
            state.isAll = value;
        }
    }
}

export default settings