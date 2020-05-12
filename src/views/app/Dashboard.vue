<template>
  <v-container>

    <v-row v-if="!sn_carregando_dashboard">
      <v-col
        v-for="(status, i) in arrStatus"
        :key="i"
        cols="12"
        md="4"
      >

      <!-- v-expansion-panel -->

      </v-col>
    </v-row>

    <v-row v-if="sn_carregando_dashboard" justify="center" align="center">
      <v-progress-circular
        v-if="sn_carregando_dashboard"
        :size="60"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-row>

    Dashboard
    {{arrStatus}}
  </v-container>
</template>

<script>
import axios_ts from '../../axios-config';
import mixinAlert from '../../mixins/mixinAlert';
import mixinFuncoesGerais from '../../mixins/mixinFuncoesGerais';

export default {
  name: 'Dashboard',

  mixins: [
    mixinFuncoesGerais,
    mixinAlert
  ],

  data: () => ({

    sn_carregando_dashboard: false,

    arrStatus: false,

  }),

  methods: {

    async getDados() {

      try {

        this.sn_carregando_dashboard = true;

        const retorno = await axios_ts.get('/status');

        this.arrStatus = retorno.data;

        this.sn_carregando_dashboard = false;

      } catch(e) {
        this.mxAlertErroInesperado(e);
        this.sn_carregando_dashboard = false;
      }

    },

  },

  async mounted() {
    await this.getDados();
  }

}
</script>