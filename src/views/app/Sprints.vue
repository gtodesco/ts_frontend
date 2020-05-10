<template>
  <v-container>

    <h1 class="headline">Sprints</h1>

    <br>

    <v-row v-if="!sn_carregando_sprints">
      <v-col
        v-for="(sprint, i) in arrSprints"
        :key="i"
        cols="12"
        :md="sprint.sn_ativa ? '12' : '4'"
      >

        <v-card 
          class="mx-auto"
          :outlined="!sprint.sn_ativa"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1">Sprint {{sprint.numero}}</v-list-item-title>
              <v-list-item-subtitle>{{mxFormataDataBd(sprint.dt_inicio)}} - {{mxFormataDataBd(sprint.dt_fim)}}</v-list-item-subtitle>
            </v-list-item-content>

            <v-chip
              v-if="sprint.sn_ativa"
              class="ma-2"
              color="primary"
              label
              outlined
              small
              dark
            >
              Atual
            </v-chip>
          </v-list-item>

          <v-card-actions v-if="sprint.sn_ativa">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  dark
                  large
                  v-on="on"
                >
                  <v-icon color="primary">mdi-calendar-edit</v-icon>
                </v-btn>
              </template>
              <span>Ajustar Sprint</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  dark
                  large
                  v-on="on"
                >
                  <v-icon color="primary">mdi-calendar-check-outline</v-icon>
                </v-btn>
              </template>
              <span>Fechar Sprint</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="sn_carregando_sprints" justify="center" align="center">
      <v-progress-circular
        v-if="sn_carregando_sprints"
        :size="60"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-row>

    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-btn
          absolute
          dark
          fab
          right
          bottom
          fixed 
          x-large
          v-on="on"
          color="primary"
          style="margin-bottom: 80px; margin-right: 20px;"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Incluir</span>
    </v-tooltip>

  </v-container>
</template>

<script>
import mixinAlert from '../../mixins/mixinAlert';
import axios_ts from '../../axios-config';
import mixinFuncoesGerais from '../../mixins/mixinFuncoesGerais';

export default {
  name: 'Sprints',
  mixins: [
    mixinFuncoesGerais,
    mixinAlert
  ],

  data: () => ({
    
    sn_carregando_sprints: false,

    arrSprints: [],

  }),

  methods: {

    async getSprints() {
      try {

        this.sn_carregando_sprints = true;

        const arrRetorno = await axios_ts.get('/sprint', {
            params: {
                equipe_id: localStorage.getItem('team')
            }
        });

        this.arrSprints = arrRetorno.data;

        this.sn_carregando_sprints = false;

      } catch (e) {

        this.mxAlertErroInesperado(e);
        this.sn_carregando_sprints = false;
      }
    },

  },

  async mounted() {
    await this.getSprints();
  }
}
</script>