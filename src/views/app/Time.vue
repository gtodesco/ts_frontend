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
                  @click="removePessoa(pessoa)"
                >
                  <v-icon color="error">mdi-account-remove-outline</v-icon>
                </v-btn>
              </template>
              <span>Remover pessoa</span>
            </v-tooltip>

            <v-tooltip bottom v-if="pessoa.equipes_pessoas.sn_scrummaster">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  dark
                  large
                  v-on="on"
                  @click="setPessoaScrumMaster(pessoa)"
                >
                  <v-icon color="primary">mdi-star-off</v-icon>
                </v-btn>
              </template>
              <span>Retirar Scrum Master</span>
            </v-tooltip>
            
            <v-tooltip bottom v-if="!pessoa.equipes_pessoas.sn_scrummaster">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  dark
                  large
                  v-on="on"
                  @click="setPessoaScrumMaster(pessoa)"
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
          @click="show_modal_pessoa = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Adicionar pessoa</span>
    </v-tooltip>

    <BuscaPessoaPorEmail 
      v-if="show_modal_pessoa" 
      v-model="show_modal_pessoa"
      @buscou-pessoa="addPessoa($event)"
    />

    <v-snackbar
      v-model="sn_mostra_pessoa_existente"
      :timeout="4000"
      color="error"
    >
      Pessoa já faz parte da equipe.
      <v-btn
        color="white"
        text
        @click="sn_mostra_pessoa_existente = false"
      >
        Fechar
      </v-btn>
    </v-snackbar>

  </v-container>
    
</template>

<script>
import mixinFuncoesGerais from '../../mixins/mixinFuncoesGerais';
import mixinAlert from '../../mixins/mixinAlert';
import axios_ts from '../../axios-config';
import BuscaPessoaPorEmail from '../../components/BuscaPessoaPorEmail'; 

export default {
  name: 'Time',
  components: {
    BuscaPessoaPorEmail
  },
  mixins: [
    mixinFuncoesGerais,
    mixinAlert
  ],

  data: () => ({

    sn_carregando_pessoas: false,
    sn_mostra_pessoa_existente: false,

    show_modal_pessoa: false,

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

    async addPessoa(pessoa) {

      try {

        this.sn_carregando_pessoas = true;

        let pessoaExistente = false;

        // Verifica se a pessoa já existe nessa equipe
        this.arrPessoas.forEach((objPessoa) => {
          if (objPessoa.id == pessoa.id) {
            pessoaExistente = true;
            return;
          }
        });

        if (!pessoaExistente) {
          const retorno = await axios_ts.post('/equipe/pessoa', {
            'equipe_id': localStorage.getItem('team'),
            'pessoa_id': pessoa.id,
            'sn_scrummaster': false,
          });

          if (!retorno.data.status) {
            throw retorno.data.msg;
          }

          this.getDados();
        }
        else {
          this.sn_carregando_pessoas = false;
          this.sn_mostra_pessoa_existente = true;
        }

      } catch(e) {
        this.mxAlertErroInesperado(e);
        this.sn_carregando_pessoas = false;
      }
    },

    async removePessoa(pessoa) {
      try {

        this.sn_carregando_pessoas = true;

        const retorno = await axios_ts.delete('/equipe/pessoa', {
          data: {
            'equipe_id': localStorage.getItem('team'),
            'pessoa_id': pessoa.id
          }
        });

        if (!retorno.data.status) {
            throw retorno.data.msg;
        }

        // Se a pessoa for scrummaster e se remover da equipe, deve enviá-lo para tela de equipes
        if (pessoa.cd_amazon == localStorage.getItem('currentUserId')) {
          this.mxIrPara('equipes');
        }

        this.getDados();

      } catch(e) {
        this.mxAlertErroInesperado(e);
        this.sn_carregando_pessoas = false;
      }
    },

    async setPessoaScrumMaster(pessoa) {
      try {

          const retorno = await axios_ts.post('/equipe/pessoa', {
            'equipe_id': localStorage.getItem('team'),
            'pessoa_id': pessoa.id,
            'sn_scrummaster': !pessoa.equipes_pessoas.sn_scrummaster,
          });

          if (!retorno.data.status) {
            throw retorno.data.msg;
          }

          // Se a pessoa for scrummaster e se tirar o privilégio, deve atualiar no storage
          if (pessoa.cd_amazon == localStorage.getItem('currentUserId')) {
            localStorage.setItem('scm', !this.sn_scrummaster);
          }

          this.getDados();

      } catch(e) {
        this.mxAlertErroInesperado(e);
      }
    },

  },

  async mounted() {
    await this.getDados();
  }

}
</script>