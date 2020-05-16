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
            <v-row 
                v-if="sn_carregando_impedimentos" 
                justify="center" 
                align="center"
                class="mt-5"
            >
                <v-progress-circular
                    v-if="sn_carregando_impedimentos"
                    :size="60"
                    color="primary"
                    indeterminate
                ></v-progress-circular>
            </v-row>
            
            <v-row dense>
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
import axios_ts from '../axios-config';
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

        arrNomes: [],
        arrHoras: [],

        chart: null,
    }),

    methods: {
        fecharModal: function () {
            this.$emit('change-show', false);
        },

        async getDados() {
            try {

                this.sn_carregando_impedimentos = true;

                const retorno = await axios_ts.get('/get-report-impedimentos', {
                    params: {
                        sprint_id: this.sprint
                    }
                });

                this.arrNomes = retorno.data.nomes;
                this.arrHoras = retorno.data.horas;

                this.sn_carregando_impedimentos = false;
                
            } catch (e) {
                this.mxAlertErroInesperado(e);
                this.sn_carregando_impedimentos = false;
            }
        },

        async criaGrafico() {
            this.chart = new Chart(this.$refs.grafico, {
                type: 'doughnut',
                data: {
                    labels: this.arrNomes,
                    datasets: [
                        {
                            data: this.arrHoras,
                            backgroundColor: ["#eb4c46", "#d68c58", "#ede266", "#acd658", "#6fd658", "#58d686", "#58d6b9",
                            "#56a2c4", "#566cc4", "#3f3e70", "#b584f5", "#f584f1", "#d1c7d0", "#a7b6db","#465159", "#3c735f",
                            "#4f4406", "#5c0519", "#a5c4ab", "#615c56", "#674175", "#d1b2b7", "#4b5447","#eb4c46", "#d68c58", 
                            "#ede266", "#acd658", "#6fd658", "#58d686", "#58d6b9", "#56a2c4", "#566cc4", "#3f3e70", "#b584f5", 
                            "#f584f1", "#d1c7d0", "#a7b6db","#465159", "#3c735f", "#4f4406", "#5c0519", "#a5c4ab", "#615c56", 
                            "#674175", "#d1b2b7", "#4b5447"],
                            borderWidth: 5
                        }
                    ],
                },
                options: {
                    title: {
                        display: true,
                        text: 'Total de impedimentos por pessoa'
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    maintainAspectRatio: false,
                    aspectRatio: 1,
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) { 
                                const pessoa = data.labels[tooltipItem.index];

                                let hora = data.datasets[0].data[tooltipItem.index];

                                hora = hora.replace('.', ':');

                                return `${pessoa}: ${hora} h`;
                            }
                        }
                    }
                }
            });
        }
    },

    async mounted() {
        await this.getDados();
        await this.criaGrafico();
    },
}
</script>
