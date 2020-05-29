<template>
  <v-container>
    
    <h1 class="headline">Impedimentos</h1>

    <br>

    <v-row>
      <v-col 
        cols="6"
        md="3"
      >
        <SelectSprint
          v-model="sprint_selecionada"
          @change-sprint="getImpedimentos()"
        />

      </v-col>
      <v-col style="align-self: center; text-align: right;">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              root
              x-large
              v-on="on"
              :disabled="arrImpedimentos.length == 0"
              @click="abrirGrafico()"
            >
              <v-icon color="primary">mdi-chart-donut</v-icon>
            </v-btn>
          </template>
          <span>Ver impedimentos</span>
        </v-tooltip> 
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
          :footer-props="{
            'itemsPerPageAllText': 'Todos',
            'itemsPerPageText': 'Itens por página',
          }"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="abrirModal(true, item)"
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

    <v-tooltip top v-if="sprint_selecionada != null">
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
          @click="abrirModal(false)"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Incluir</span>
    </v-tooltip>

    <CadastroImpedimento 
      v-if="show_modal_cadastro" 
      v-model="show_modal_cadastro"
      :sn-editar="sn_editar_registro"
      :obj-impedimento="objImpedimento"
      :sprint="sprint_selecionada"
      @salvou-impedimento="getImpedimentos()"
    />

    <GraficoImpedimentos 
      v-if="show_modal_grafico" 
      v-model="show_modal_grafico"
      :sprint="sprint_selecionada"
    />

  </v-container>
</template>

<script>
import axios_ts from '../../axios-config';
import SelectSprint from '../../components/SelectSprint';
import CadastroImpedimento from '../../components/CadastroImpedimento';  
import mixinFuncoesGerais from '../../mixins/mixinFuncoesGerais';
import mixinAlert from '../../mixins/mixinAlert';
import GraficoImpedimentos from '../../components/GraficoImpedimentos';

export default {
  name: 'Impedimentos',
  components: {
    SelectSprint,
    CadastroImpedimento,
    GraficoImpedimentos
  },

  mixins: [
    mixinFuncoesGerais,
    mixinAlert
  ],

  data: () => ({

    sn_carregando_impedimentos: false,

    show_modal_cadastro: false,
    sn_editar_registro: false,

    show_modal_grafico: false,

    sprint_selecionada: null,

    arrImpedimentos: [],

    objImpedimento: {},

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
        text: 'Ações', 
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

        this.sprint_selecionada = await this.mxGetSprintAtual();

        this.sn_carregando_impedimentos = false;

      } catch(e) {
        this.mxAlertErroInesperado(e);
        this.sn_carregando_impedimentos = false;
      }
    },

    async remover(impedimento) {

      try {

        const confirmacao = await this.mxAlertConfirma('Deseja mesmo remover este impedimento?');

        if (!confirmacao) {
          return;
        }

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

    abrirModal: function(sn_editar, impedimento = null) {

      this.sn_editar_registro = sn_editar;

      // Se for editar, passa os valores atuais do registro para o componente
      if (this.sn_editar_registro) {
        this.objImpedimento = {...impedimento};
      }
      else {
        this.objImpedimento = {
            'descricao': '',
            'horas': '',
        };
      }

      this.show_modal_cadastro = true;

    },

    abrirGrafico: function () {
      this.show_modal_grafico = true;
    },
  },

  async mounted() {
    await this.getSprintAtual();
  }


}
</script>