// 全局作业设置
import {getStore, setStore} from '@/util/store'

const settings = {
  state: {
    settings: getStore({name: 'settings'}) || {}, // 全局作业设置
    isShowGroupBox: false, // 全局的农机分组框
    isShowCheckBox: false, // 农机分组控制是否显示复选框
    groupData: {name: '', ids: [], machine: [], data: []}, // 全局农机分组框保存的数据-名字和id
  },
  mutations: {
    setSettings: (state, value) => {
      state.settings = value
      setStore({
        name: 'settings',
        content: state.settings,
        type: 'setting'
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
      state.isShowCheckBox = value;
    },
    // 保存农机分组数据
    setGroupData: (state, value) => {
      // debugger
      state.groupData = value;
    }
  }
}

export default settings