<template>
  <div class="app">
    <h1>Equipes</h1>
      <a class="ml-8" @click="sair()">
        Sair
      </a>
  </div>
</template>
<script>
import mixinFuncoesGerais from '../../mixins/mixinFuncoesGerais';
import { Auth } from 'aws-amplify';
import axios_ts from '../../axios-config';

export default {
  name: 'Equipes',
  mixins: [
    mixinFuncoesGerais
  ],

  methods: {

    async sair() {
      await Auth.signOut();
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('jwtToken');
      this.mxIrPara('login');
    }

  },

  async mounted() {

    const equipes = await axios_ts.get('equipe');
    console.log(equipes);

  },

};
</script>