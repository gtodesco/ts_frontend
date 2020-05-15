<template>
  <v-row justify="center">
    <v-dialog 
        v-model="show"
        persistent
        fullscreen
        transition="dialog-bottom-transition"
        @click:outside="fecharModal()"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="fecharModal()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
            
            <v-row v-if="sn_carregando_impedimentos" justify="center" align="center">
                <v-progress-circular
                    v-if="sn_carregando_impedimentos"
                    :size="60"
                    color="primary"
                    indeterminate
                ></v-progress-circular>
            </v-row>
            
            <v-row v-if="!sn_carregando_impedimentos">
                <!-- Grafico aqui -->
            </v-row>

        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import mixinFuncoesGerais from '../mixins/mixinFuncoesGerais';
// import axios_ts from '../axios-config';
import mixinAlert from '../mixins/mixinAlert';

export default {
    model: {    
        prop: 'show',
        event: 'change-show'
    },
    name: 'GraficoImpedimentos',

    mixins: [
        mixinFuncoesGerais,
        mixinAlert
    ],

    props: {
        show: {
            type: Boolean,
            default: false
        },
        sprint: {
            type: Number
        }
    },

    data: () => ({
        sn_carregando_impedimentos: false,
    }),

    methods: {
        fecharModal: function () {
            this.$emit('change-show', false);
        },

        async getDados() {
            try {

                this.sn_carregando_impedimentos = true;
                this.sn_carregando_impedimentos = false;

            } catch (e) {

                this.mxAlertErroInesperado(e);
                this.sn_carregando_impedimentos = false;
            }
        },
    },

    async mounted() {
        await this.getDados();
    }
}
</script>
