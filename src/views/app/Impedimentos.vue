<template>
  <v-container>
    
    <h1 class="headline">Impedimentos</h1>

    <br>

    <v-row>
      <v-col 
        cols="12"
        sm="12"
        md="3"
      >
        <SelectSprint
          v-model="sprint_selecionada"
          @change-sprint="getImpedimentos()"
        />

      </v-col>
    </v-row>

    <v-row v-if="!sn_carregando_impedimentos && sprint_selecionada != null">
      <v-col 
        cols="12"
        sm="12"
      >
        <v-data-table
          :headers="headers"
          :items="arrImpedimentos"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="console.log(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="remover(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            Sem informações.
          </template>
        </v-data-table>
        <!-- locale="pt-BR" -->
      </v-col>
    </v-row>

    <v-alert 
      type="info" 
      v-if="sprint_selecionada == null"
      text
    >
      Selecione uma sprint.
    </v-alert>

    <v-row v-if="sn_carregando_impedimentos" justify="center" align="center">
      <v-progress-circular
        v-if="sn_carregando_impedimentos"
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
import axios_ts from '../../axios-config';
import SelectSprint from '../../components/SelectSprint'; 

export default {
  name: 'Impedimentos',
  components: {
    SelectSprint
  },

  data: () => ({

    sn_carregando_impedimentos: false,

    sprint_selecionada: null,

    arrImpedimentos: [],

    headers: [
      {
        text: 'Pessoa',
        align: 'start',
        sortable: false,
        value: 'pessoa.nome',
      },
      { 
        text: 'Descrição',
        sortable: false, 
        value: 'descricao' },
      { 
        text: 'Horas', 
        value: 'horas' 
      },
      { 
        text: 'Actions', 
        value: 'actions', 
        sortable: false 
      },
    ]


  }),

  methods: {

    
    async getImpedimentos() {
      
      try {
        
        if (this.sprint_selecionada == null) {
          return;
        }

        this.sn_carregando_impedimentos = true;

        const arrRetorno = await axios_ts.get('/impedimento/get-impedimentos-sprint', {
          params: {
            sprint_id: this.sprint_selecionada,
            }
        });
        
        this.arrImpedimentos = arrRetorno.data;

        this.sn_carregando_impedimentos = false;

      } catch(e) {
        this.mxAlertErroInesperado(e);
        this.sn_carregando_impedimentos = false;
      }

    },

    async getSprintAtual() {
      try {
      
        this.sn_carregando_impedimentos = true;

        const retorno = await axios_ts.get('/sprint-ativa');

        if (retorno.data.length == 0) {
          this.sn_carregando_impedimentos = false;
          return;
        }

        const sprint_atual = retorno.data[0];

        this.sprint_selecionada = sprint_atual.id;

        this.sn_carregando_impedimentos = false;

      } catch(e) {
        this.mxAlertErroInesperado(e);
        this.sn_carregando_impedimentos = false;
      }
    },

    async remover(impedimento) {

      try {

        this.sn_carregando_impedimentos = true;

        const retorno = await axios_ts.delete('/impedimento', {
          data: {
            'id': impedimento.id
          }
        });

        if (!retorno.data.status) {
            throw retorno.data.msg;
        }

        this.getImpedimentos();

      } catch(e) {
        this.mxAlertErroInesperado(e);
        this.sn_carregando_impedimentos = false;
      }

    },
  },

  async mounted() {
    await this.getSprintAtual();
  }


}
</script>