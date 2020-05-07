<template>
    
  <v-container>

    <h1 class="headline">Time</h1>

    <br>

    <v-row v-if="!sn_carregando_pessoas">
      <v-col
        v-for="(pessoa, i) in arrPessoas"
        :key="i"
        cols="12"
        md="4"
      >
        <v-card>

          <v-card-title
            v-text="pessoa.nome"
          ></v-card-title>

          <v-card-subtitle v-text="pessoa.email"></v-card-subtitle>

          <v-card-actions v-if="sn_scrummaster">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  dark
                  large
                  v-on="on"
                >
                  <v-icon color="error">mdi-account-remove-outline</v-icon>
                </v-btn>
              </template>
              <span>Remover pessoa</span>
            </v-tooltip>

            <v-tooltip bottom v-if="pessoa.equipes_pessoas.sn_scrummaster" >
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  dark
                  large
                  v-on="on"
                >
                  <v-icon color="primary">mdi-star-off</v-icon>
                </v-btn>
              </template>
              <span>Retirar Scrum Master</span>
            </v-tooltip>
            
            <v-tooltip bottom v-if="!pessoa.equipes_pessoas.sn_scrummaster" >
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  dark
                  large
                  v-on="on"
                >
                  <v-icon color="primary">mdi-star-outline</v-icon>
                </v-btn>
              </template>
              <span>Tornar Scrum Master</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="sn_carregando_pessoas" justify="center" align="center">
      <v-progress-circular
        v-if="sn_carregando_pessoas"
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
      <span>Adicionar pessoa</span>
    </v-tooltip>

  </v-container>
    
</template>

<script>
import mixinAlert from '../../mixins/mixinAlert';
import axios_ts from '../../axios-config';

export default {
  name: 'Time',

  mixins: [
    mixinAlert
  ],

  data: () => ({

    sn_carregando_pessoas: false,

    nomeEquipe: "",
    arrPessoas: [],

    sn_scrummaster: false,

  }),

  methods: {

    async getDados() {

      try {

        this.sn_carregando_pessoas = true;

        const arrRetorno = await axios_ts.get('/equipe/pessoa', {
          params: {
            equipe_id: localStorage.getItem('team')
          }
        });

        this.nomeEquipe = arrRetorno.data.nome;
        this.arrPessoas = arrRetorno.data.pessoas;

        this.sn_scrummaster = localStorage.getItem('scm') == "true" ? true : false;

        this.sn_carregando_pessoas = false;

      } catch (e) {

        this.mxAlertErroInesperado(e);
        this.sn_carregando_pessoas = false;
      }

    },

  },

  async mounted() {
    await this.getDados();
  }



}
</script>