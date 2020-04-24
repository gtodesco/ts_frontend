import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({

  state: {
    currentUserId: "",
    jwtToken: "",
  },
  
  mutations: {
  },
  actions: {
  },
  modules: {
  },
  getters: {
    jwtToken: state => {
      return state.jwtToken;
    },
    currentUserId: state => {
      return state.currentUserId;
    }
  }
})

export default store