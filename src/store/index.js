import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({

  state: {
    // currentUserId: "",
    // jwtToken: "",
  },
  
  mutations: {
    
    // this.$store.commit('updateCurrentUserId', user.username);
    // this.$store.commit('updateJwtToken', user.signInUserSession.idToken.jwtToken);

    // updateCurrentUserId (state, param) {
    //   state.currentUserId = param;
    // },
    // updateJwtToken (state, param) {
    //   state.jwtToken = param;
    // },
  },

  actions: {
  },
  modules: {
  },

  getters: {
    // jwtToken: state => {
    //   return state.jwtToken;
    // },
    // currentUserId: state => {
    //   return state.currentUserId;
    // }
  }
})

export default store