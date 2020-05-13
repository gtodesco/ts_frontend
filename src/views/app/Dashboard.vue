<template>
  <v-container fluid>

    <v-row v-if="!sn_carregando_dashboard">
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
                  <v-card
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
                          >
                            <v-icon color="error">mdi-calendar-remove</v-icon>
                          </v-btn>
                        </template>
                        <span>Retirar da Sprint</span>
                      </v-tooltip>   

                      <v-spacer/>               

                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            icon
                            dark
                            large
                            v-on="on"
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

    <v-row v-if="sn_carregando_dashboard" justify="center" align="center">
      <v-progress-circular
        v-if="sn_carregando_dashboard"
        :size="60"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-row>

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

        const sprint_atual = await this.mxGetSprintAtual();

        const retorno = await axios_ts.get('/status-atividades', {
            params: {
                sprint_id: sprint_atual == null ? 0 : sprint_atual // Precisa enviar como 0, pois null o axios remove dos params
            }
        });

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