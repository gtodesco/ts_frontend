<template>
  <v-container fluid>

    <v-row v-if="!sn_carregando_dashboard">
      <v-expansion-panels multiple :value="[0, 1, 2, 3, 4, 5]">
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
                    class="mx-auto"
                    max-width="344"
                    outlined
                  >
                    <v-list-item>
                      <v-list-item-content>
                        <div class="mb-2" style="text-align: right;">
                          <v-chip
                            :color="'primary'"
                            label
                            x-small
                            dark
                          >
                            Feature
                          </v-chip>
                        </div>
                        <v-list-item-title class="headline mb-1">Headline 5</v-list-item-title>
                        <v-list-item-subtitle>Greyhound divisely hello coldly fonwderfully</v-list-item-subtitle>
                        <div class="overline mt-4">
                          P: 04:00 | R: 02:00
                        </div>
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
                        <span>Enviar para</span>
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

        const retorno = await axios_ts.get('/status');

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