<template>
  <v-container>
    
    <div style="display: inline-flex">
      <h1 class="headline">Retrospectivas</h1>
      <HelpButton
        tela="Retrospectivas"
        help='Esta tela exibe as retrospectivas de cada sprint. A sprint atual virá selecionada por padrão.
        A retrospectiva tem como objetivo avaliar o processo de trabalho em uma sprint. Ela é dividida em três grupos, onde as pessoas podem digitar o que acham que a equipe deve 
        Começar, Continuar ou Parar.'
      />
    </div>

    <br>

    <v-row>
      <v-col 
        cols="12"
        sm="12"
        md="3"
      >
        <SelectSprint
          v-model="sprint_selecionada"
          @change-sprint="getRetrospectiva()"
        />

      </v-col>
    </v-row>

    <v-row v-if="!sn_carregando_retrospectiva && sprint_selecionada != null">
      <v-col
        cols='12'
        sm='12'
        md='4'
      >
        <v-textarea
            v-model="objRetrospectiva.start"
            outlined
            label="Começar"
            @change="alteraRetrospectiva()"
        ></v-textarea>
      </v-col>
      <v-col
        cols='12'
        sm='12'
        md='4'
      >
        <v-textarea
            v-model="objRetrospectiva.continuar"
            outlined
            label="Continuar"
            @change="alteraRetrospectiva()"
        ></v-textarea>
      </v-col>
      <v-col
        cols='12'
        sm='12'
        md='4'
      >
        <v-textarea
            v-model="objRetrospectiva.stop"
            outlined
            label="Parar"
            @change="alteraRetrospectiva()"
        ></v-textarea>
      </v-col>
    </v-row>

    <v-alert 
      type="info" 
      v-if="sprint_selecionada == null"
      text
    >
      Selecione uma sprint.
    </v-alert>

    <v-row v-if="sn_carregando_retrospectiva" justify="center" align="center">
      <v-progress-circular
        v-if="sn_carregando_retrospectiva"
        :size="60"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-row>

  </v-container>
</template>

<script>
import axios_ts from '../../axios-config';
import SelectSprint from '../../components/SelectSprint';
import mixinFuncoesGerais from '../../mixins/mixinFuncoesGerais';
import mixinAlert from '../../mixins/mixinAlert'; 
import HelpButton from '../../components/HelpButton';

export default {
  name: 'Retrospectivas',

  mixins: [
    mixinFuncoesGerais,
    mixinAlert
  ],

  components: {
    SelectSprint,
    HelpButton
  },

  data: () => ({

    sn_carregando_retrospectiva: false,

    sprint_selecionada: null,

    objRetrospectiva: {}

  }),

  methods: {
    
    async getRetrospectiva() {
      
      try {

        if (this.sprint_selecionada == null) {
          return;
        }

        this.sn_carregando_retrospectiva = true;

        const arrRetorno = await axios_ts.get('/retrospectiva', {
          params: {
            sprint_id: this.sprint_selecionada,
          }
        });
        
        this.objRetrospectiva.id = arrRetorno.data[0].id;
        this.objRetrospectiva.start = arrRetorno.data[0].start;
        this.objRetrospectiva.stop = arrRetorno.data[0].stop;
        this.objRetrospectiva.continuar = arrRetorno.data[0].continuar;

        this.sn_carregando_retrospectiva = false;

      } catch(e) {
        this.mxAlertErroInesperado(e);
        this.sn_carregando_retrospectiva = false;
      }

    },

    async alteraRetrospectiva() {
      try {

        const retorno = await axios_ts.put('/retrospectiva', {
          id: this.objRetrospectiva.id,
          start: this.objRetrospectiva.start,
          stop: this.objRetrospectiva.stop,
          continuar: this.objRetrospectiva.continuar
        });

        if (!retorno.data.status) {
          throw retorno.data.msg;
        }

      } catch(e) {
        this.mxAlertErroInesperado(e);
      }
    },

    async getSprintAtual() {
      try {
      
        this.sn_carregando_retrospectiva = true;

        this.sprint_selecionada = await this.mxGetSprintAtual();

        this.sn_carregando_retrospectiva = false;

      } catch(e) {
        this.mxAlertErroInesperado(e);
        this.sn_carregando_retrospectiva = false;
      }
    },

  },

  async mounted() {
    this.objRetrospectiva = {
      id: '',
      start: '',
      stop: '',
      continuar: ''
    };

    await this.getSprintAtual();
  }

}
</script>