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
            <v-spacer/>
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
            
            <v-row dense v-if="!sn_carregando_impedimentos">
                <v-col cols="12">
                    <canvas
                        ref="grafico"
                        style="max-height: 600px;"
                    ></canvas>
                </v-col>
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
import Chart from 'chart.js';

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

                this.chart = new Chart(this.$refs.grafico, {
                    type: 'doughnut',
                    data: {
                        labels: ['Red', 'Blue', 'Yellow', 'Joao', 'Maria', 'Carlos', 'Millena'],
                        datasets: [{
                            data: [60, 20, 30, 15, 9, 35, 12],
                            backgroundColor: ["#eb4c46", "#d68c58", "#ede266", "#acd658", "#6fd658", "#58d686", "#58d6b9",
                            "#56a2c4", "#566cc4", "#3f3e70", "#b584f5", "#f584f1", "#d1c7d0", "#a7b6db","#465159", "#3c735f",
                            "#4f4406", "#5c0519", "#a5c4ab", "#615c56", "#674175", "#d1b2b7", "#4b5447"],
                            borderWidth: 5
                        }],
                    },
                    options: {
                        legend: {
                            display: true,
                            position: 'bottom'
                        },
                        maintainAspectRatio: false,
                        aspectRatio: 1,
                    }
                });

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
