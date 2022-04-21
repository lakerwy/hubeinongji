import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import settings from './modules/settings'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cityAdress: {
      city: "",
      county: "",
      nation: "",
      province: "湖北省",
      town: ""
    }
  },
  getters,
  mutations: {
    setCityAdress(state,value){
      state.cityAdress = Object.assign({},value)
    }
  },
  actions: {
  },
  modules: {
    user,
    settings
  },
})
