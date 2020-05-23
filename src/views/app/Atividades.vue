<template>
  <v-container>

    <h1 class="headline">Atividades planejadas</h1>

    <br>

    <v-row v-if="!sn_carregando_atividade">
      <v-col 
        cols="12"
        sm="12"
        md="4"
      >

        <v-select
          v-model="tipo_selecionado"
          :items="arrTiposAtividades"
          :menu-props="{ offsetY: true }"
          item-text="descricao"
          item-value="id"
          clearable
          label="Tipo"
          no-data-text="Sem dados"
          @change="getAtividades()"
        >
        </v-select>

      </v-col>
    </v-row>

    <v-row v-if="!sn_carregando_atividade">
      <v-col 
        v-if="arrAtividades.length == 0"
        cols="12" 
        sm="12"
      >
        <v-alert 
          type="info"
          text
        >
          Sem atividades
        </v-alert>
      </v-col>
      <v-col
        v-else-if="arrAtividades.length > 0"
        v-for="(atividade, i) in arrAtividades"
        :key="i"
        cols="12"
        md="4"
      >

        <v-card 
          class="mx-auto"
          outlined
        >

          <v-list-item>
            <v-list-item-content>
              <div class="overline mb-4">P: {{mxFormataTimeBd(atividade.horas_previsto)}} | R: {{mxFormataTimeBd(atividade.horas_realizado)}}</div>
              <v-list-item-title class="headline mb-1">{{atividade.titulo}}</v-list-item-title>
              <v-list-item-subtitle>{{atividade.descricao}}</v-list-item-subtitle>
            </v-list-item-content>

            <v-chip
              class="ma-2"
              :color="atividade.tipos_atividade.color"
              label
              small
              dark
            >
              {{atividade.tipos_atividade.descricao}}
            </v-chip>
          </v-list-item>

          <v-card-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  dark
                  large
                  v-on="on"
                  @click="abrirModal(true, atividade)"
                >
                  <v-icon color="primary">mdi-eye-outline</v-icon>
                </v-btn>
              </template>
              <span>Visualizar</span>
            </v-tooltip>
            
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  dark
                  large
                  v-on="on"
                  @click="adicionarSprintAtual(atividade.id)"
                >
                  <v-icon color="primary">mdi-calendar-plus</v-icon>
                </v-btn>
              </template>
              <span>Adicionar à Sprint atual</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  dark
                  large
                  v-on="on"
                  @click="remover(atividade.id)"
                >
                  <v-icon color="error">mdi-delete-forever-outline</v-icon>
                </v-btn>
              </template>
              <span>Excluir</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>

      </v-col>
    </v-row>

    <v-row v-if="sn_carregando_atividade" justify="center" align="center">
      <v-progress-circular
        v-if="sn_carregando_atividade"
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

    <CadastroAtividade 
      v-if="show_modal_cadastro" 
      v-model="show_modal_cadastro"
      :sn-editar="sn_editar_registro"
      :obj-atividade="objAtividade"
      @salvou-atividade="getAtividades()"
    />

  </v-container>
</template>

<script>
import mixinAlert from '../../mixins/mixinAlert';
import axios_ts from '../../axios-config';
import mixinFuncoesGerais from '../../mixins/mixinFuncoesGerais';
import CadastroAtividade from '../../components/CadastroAtividade'; 

export default {
  name: 'Atividades',
  components: {
    CadastroAtividade
  },
  mixins: [
    mixinFuncoesGerais,
    mixinAlert
  ],

  data: () => ({
    
    sn_carregando_atividade: false,

    show_modal_cadastro: false,
    sn_editar_registro: false,

    objAtividade: {},

    arrTiposAtividades: [],
    arrAtividades: [],

    tipo_selecionado: null,

  }),

  methods: {

    async getTiposAtividades() {

      try {

        this.sn_carregando_atividade = true;

        const arrRetorno = await axios_ts.get('/tipo-atividade', {
            params: {
                equipe_id: localStorage.getItem('team')
            }
        });

        this.arrTiposAtividades = arrRetorno.data;

        this.sn_carregando_atividade = false;

      } catch (e) {

        this.mxAlertErroInesperado(e);
        this.sn_carregando_atividade = false;
      }
    },

    async getAtividades() {
      try {

        this.sn_carregando_atividade = true;

        const arrRetorno = await axios_ts.get('/atividade/get-atividade-equipe-sem-sprint', {
            params: {
                equipe_id: localStorage.getItem('team'),
                tipo_id: this.tipo_selecionado
            }
        });

        this.arrAtividades = arrRetorno.data;

        this.sn_carregando_atividade = false;

      } catch (e) {

        this.mxAlertErroInesperado(e);
        this.sn_carregando_atividade = false;
      }
    },

    async remover(id) {

      try {

        const confirmacao = await this.mxAlertConfirma('Deseja mesmo excluir esta atividade?');

        if (!confirmacao) {
          return;
        }

        this.sn_carregando_atividade = true;

        const retorno = await axios_ts.delete('/atividade', {
          data: {
            'id': id
          }
        });

        if (!retorno.data.status) {
            throw retorno.data.msg;
        }

        this.getAtividades();

      } catch(e) {
        this.mxAlertErroInesperado(e);
        this.sn_carregando_atividade = false;
      }

    },

    async adicionarSprintAtual(id) {

      try {
      
        this.sn_carregando_atividade = true;

        const sprint_ativa = await this.mxGetSprintAtual();

        if (sprint_ativa == null) {
          await this.mxAlertErro('Não existe uma sprint ativa no momento.');
          this.sn_carregando_atividade = false;
          return;
        }

        // Cadastra a atividade no Backlog da sprint atual
        const retorno = await axios_ts.put('/atividade', {
          'id': id,
          'sprint_id': sprint_ativa,
          'status_id': 1
        });
      
        if (!retorno.data.status) {
            throw retorno.data.msg;
        }

        this.getAtividades();

      } catch(e) {
        this.mxAlertErroInesperado(e);
        this.sn_carregando_atividade = false;
      }

    },

    abrirModal: function(sn_editar, atividade = null) {

      this.sn_editar_registro = sn_editar;

      // Se for editar, passa os valores atuais do registro para o componente
      if (this.sn_editar_registro) {
        this.objAtividade = {...atividade};
      }
      else {
        this.objAtividade = {
            'tipo_id': null,
            'titulo': '',
            'descricao': '',
            'prioridade': 1,
            'horas_previsto': '',
            'horas_realizado': null,
            'pessoas': []
        };
      }

      this.show_modal_cadastro = true;

    },


  },

  async mounted() {
    await this.getTiposAtividades();
    await this.getAtividades();
  }

}
</script>