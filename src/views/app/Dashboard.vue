<template>
  <v-container fluid>

    <v-row justify="center" align="center">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            dark
            x-small
            v-on="on"
            @click="getDados()"
          >
            <v-icon color="primary">mdi-refresh</v-icon>
          </v-btn>
        </template>
        <span>Atualizar</span>
      </v-tooltip> 
    </v-row>

    <v-row>
      <v-expansion-panels 
        multiple
        :value="[0, 1, 2, 3, 4, 5]"
      >
        <v-col
          v-for="(status, i) in arrStatus"
          :key="i"
          cols="12"
          md="2"
        >
          <v-expansion-panel>
            <v-expansion-panel-header>{{status.descricao}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-btn 
                block 
                tile 
                outlined 
                color="success"
                :disabled="sprint_atual == null"
                @click="abrirModal(false, status.id)"
              >
                <v-icon left>mdi-plus</v-icon> 
                Atividade
              </v-btn>

              <v-row 
                v-if="sn_carregando_atividades" 
                justify="center" 
                align="center"
                class="mt-5"
              >
                <v-progress-circular
                  v-if="sn_carregando_atividades"
                  :size="60"
                  color="primary"
                  indeterminate
                ></v-progress-circular>
              </v-row>

              <v-alert 
                class="mt-2"
                v-if="status.atividades.length == 0 && !sn_carregando_atividades"
                color="grey"
                text
              >
                Sem atividades
              </v-alert>

              <v-card
                v-else-if="status.atividades.length > 0 && !sn_carregando_atividades"
                class="mx-auto mt-2"
                outlined
                v-for="(atividade, i) in status.atividades"
                :key="i"
              >
                <v-list-item>
                  <v-list-item-content>
                    <div class="mb-2" style="text-align: right;">
                      <v-chip
                        :color="atividade.tipos_atividade.color"
                        label
                        x-small
                        dark
                      >
                        {{atividade.tipos_atividade.descricao}}
                      </v-chip>
                    </div>
                    <div class="overline mb-2">
                      P: {{mxFormataTimeBd(atividade.horas_previsto)}} | R: {{mxFormataTimeBd(atividade.horas_realizado)}}
                    </div>
                    <h4>{{atividade.titulo}}</h4>
                    <v-list-item-subtitle>{{atividade.descricao}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-card-actions>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        dark
                        large
                        v-on="on"
                        @click="abrirModal(true, status.id, atividade)"
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
                        @click="retirarAtividade(atividade.id)"
                      >
                        <v-icon color="error">mdi-calendar-remove</v-icon>
                      </v-btn>
                    </template>
                    <span>Retirar da sprint</span>
                  </v-tooltip>   

                  <v-spacer/>               

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        dark
                        large
                        v-on="on"
                        @click="abrirModalMover(atividade)"
                      >
                        <v-icon color="primary">mdi-send-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Mover para</span>
                  </v-tooltip>                      
                </v-card-actions>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-col>
      </v-expansion-panels>
    </v-row>

    <CadastroAtividade 
      v-if="show_modal_cadastro" 
      v-model="show_modal_cadastro"
      :sn-editar="sn_editar_registro"
      :obj-atividade="objAtividade"
      :status="status_selecionado"
      @salvou-atividade="getDados()"
    />

    <MoverAtividade
      v-if="show_modal_mover"
      v-model="show_modal_mover"
      :atividade="atividade_selecionada"
      @moveu-atividade="getDados()"
    />

  </v-container>
</template>

<script>
import axios_ts from '../../axios-config';
import mixinAlert from '../../mixins/mixinAlert';
import mixinFuncoesGerais from '../../mixins/mixinFuncoesGerais';
import CadastroAtividade from '../../components/CadastroAtividade';
import MoverAtividade from '../../components/MoverAtividade';

export default {
  name: 'Dashboard',

  mixins: [
    mixinFuncoesGerais,
    mixinAlert
  ],

  components: {
    CadastroAtividade,
    MoverAtividade
  },

  data: () => ({

    show_modal_cadastro: false,
    show_modal_mover: false,
    sn_editar_registro: false,
    sn_carregando_atividades: false,

    status_selecionado: null,
    atividade_selecionada: null,

    sprint_atual: null,

    objAtividade: {},

    arrStatus: [
      {
        id: 1,
        descricao: 'Backlog',
        atividades: []
      },
      {
        id: 2,
        descricao: 'A fazer',
        atividades: []
      },
      {
        id: 3,
        descricao: 'Em desenvolvimento',
        atividades: []
      },
      {
        id: 4,
        descricao: 'Impedimento',
        atividades: []
      },
      {
        id: 6,
        descricao: 'Em testes',
        atividades: []
      },
      {
        id: 7,
        descricao: 'Concluídos',
        atividades: []
      },
    ],

  }),

  methods: {

    async getDados() {

      try {

        this.sn_carregando_atividades = true;

        this.sprint_atual = await this.mxGetSprintAtual();

        const retorno = await axios_ts.get('/status-atividades', {
            params: {
                sprint_id: this.sprint_atual == null ? 0 : this.sprint_atual // Precisa enviar como 0, pois null o axios remove dos params
            }
        });

        this.arrStatus = retorno.data;

        this.sn_carregando_atividades = false;

      } catch(e) {
        this.mxAlertErroInesperado(e);
        this.sn_carregando_atividades = false;
      }

    },

    async retirarAtividade(id) {

      try {

        const confirmacao = await this.mxAlertConfirma('Deseja mesmo remover esta atividade da sprint?');

        if (!confirmacao) {
          return;
        }

        const retorno = await axios_ts.put('/atividade', {
            id: id,
            sprint_id: null,
            status_id: null
        });

        if (!retorno.data.status) {
            throw retorno.data.msg;
        }

        this.getDados();

      } catch(e) {
        this.mxAlertErroInesperado(e);
      }

    },

    async abrirModal (sn_editar, status, atividade = null) {

      this.sn_editar_registro = sn_editar;
      this.status_selecionado = status;

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

    async abrirModalMover (atividade) {
      this.atividade_selecionada = atividade;
      this.show_modal_mover = true;
    },

  },

  async mounted() {
    await this.getDados();
  }

}
</script>