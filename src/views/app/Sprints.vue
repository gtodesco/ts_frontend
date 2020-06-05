<template>
  <v-container>

    <div style="display: inline-flex">
      <h1 class="headline">Sprints</h1>
      <HelpButton
        tela="Sprints"
        help="Nesta tela você irá cadastrar suas sprints, definindo seu número e as datas de início e fim. 
        Sempre que uma nova sprint for criada, a atual será encerrada automaticamente. Você pode ajustar uma sprint ou encerrá-la."
      />
    </div>

    <br>

    <v-row v-if="!sn_carregando_sprints">
      <v-col 
        v-if="arrSprints.length == 0"
        cols="12" 
        sm="12"
      >
        <v-alert 
          type="info"
          text
        >
          Sem sprints
        </v-alert>
      </v-col>
      <v-col
        v-else-if="arrSprints.length > 0"
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

          <v-card-text class="headline font-weight-bold text-md-center">
            {{sprint.objetivo}}
          </v-card-text>

          <v-card-actions v-if="sprint.sn_ativa">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  dark
                  large
                  v-on="on"
                  @click="abrirModal(true, sprint)"
                >
                  <v-icon color="primary">mdi-calendar-edit</v-icon>
                </v-btn>
              </template>
              <span>Ajustar sprint</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  dark
                  large
                  v-on="on"
                  @click="fecharSprint(sprint.id)"
                >
                  <v-icon color="primary">mdi-calendar-check-outline</v-icon>
                </v-btn>
              </template>
              <span>Fechar sprint</span>
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
          @click="abrirModal(false)"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Incluir</span>
    </v-tooltip>

    <CadastroSprint 
      v-if="show_modal_cadastro" 
      v-model="show_modal_cadastro"
      :sn-editar="sn_editar_registro"
      :obj-sprint="objSprint"
      @salvou-sprint="getSprints()"
    />

  </v-container>
</template>

<script>
import mixinAlert from '../../mixins/mixinAlert';
import axios_ts from '../../axios-config';
import mixinFuncoesGerais from '../../mixins/mixinFuncoesGerais';
import CadastroSprint from '../../components/CadastroSprint'; 
import HelpButton from '../../components/HelpButton';

export default {
  name: 'Sprints',
  components: {
    CadastroSprint,
    HelpButton
  },
  mixins: [
    mixinFuncoesGerais,
    mixinAlert
  ],

  data: () => ({
    
    sn_carregando_sprints: false,

    show_modal_cadastro: false,
    sn_editar_registro: false,

    arrSprints: [],

    objSprint: {},

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

    abrirModal: function(sn_editar, sprint = null) {

      this.sn_editar_registro = sn_editar;

      // Se for editar, passa os valores atuais do registro para o componente
      if (this.sn_editar_registro) {
        this.objSprint = {...sprint};
      }
      else {
        this.objSprint = {
          'numero': '',
          'dt_inicio': '',
          'dt_fim': '',
          'objetivo': ''
        };
      }

      this.show_modal_cadastro = true;

    },

    async fecharSprint(id) {
      try {

          const confirmacao = await this.mxAlertConfirma('Deseja mesmo encerrar esta sprint? Esta ação é irreversível!!!');

          if (!confirmacao) {
            return;
          }

          this.sn_carregando_sprints = true;

          const retorno = await axios_ts.put('/sprint', {
              "id": id,
              "sn_ativa": false,
          });

          if (!retorno.data.status) {
              throw retorno.data.msg;
          }

          this.getSprints();

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