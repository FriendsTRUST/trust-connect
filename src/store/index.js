import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    coins: [],
  },
  mutations: {
    setCoins(state, value) {
      state.coins = value;
    },
  },
  actions: {
    async fetchCoins({commit}) {
      const {data} = await axios.get(
        'https://explorer-api.minter.network/api/v2/coins',
      );

      await commit('setCoins', data.data);
    },
  },
  getters: {
    getCoin: (state) => (id) => {
      return state.coins.find(coin => Number(coin.id) === Number(id));
    },
  },
});
