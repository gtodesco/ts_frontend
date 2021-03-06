<template>
  <v-container>
    
    <div style="display: inline-flex">
      <h1 class="headline">Burndown</h1>
      <HelpButton
        tela="Burndown"
        help="Nesta tela é exibido o gráfico de burndown da sprint atual. Ele é considerado um dos mais úteis para monitorar o progresso de um time ágil.
        O gráfico representa a quantidade de trabalho que falta ser feita no eixo vertical (y) versus o tempo no eixo horizontal (x). 
        Neste caso, o burndown por horas serve para acompanhamento do ritmo diário da equipe.
        A linha azul representa a quantidade de horas que deve faltar em cada dia da sprint para que se consiga finalizar todas as atividades até o fim dela. A linha vermelha representa o progresso atual do time, gerando um comparativo que pode ser usado para prever se tudo que foi planejado será entregue e permite ao gestor da equipe tomar ações de forma antecipada.
        O gráfico burndown conta apenas dias úteis."
      />
    </div>

    <br>

    <v-row>
      <v-col 
        v-if="sprint_atual == null"
        cols="12" 
        sm="12"
      >
        <v-alert 
          type="info"
          text
        >
          Não existe uma sprint ativa no momento.
        </v-alert>
      </v-col>
      <v-col>
        <canvas
          ref="grafico"
          style="max-height: 500px; max-width: 1200px;"
        ></canvas>
      </v-col>
    </v-row>

    <v-row 
        v-if="sn_carregando_burndown" 
        justify="center" 
        align="center"
        class="mt-5"
    >
        <v-progress-circular
            v-if="sn_carregando_burndown"
            :size="60"
            color="primary"
            indeterminate
        ></v-progress-circular>
    </v-row>

  </v-container>
</template>

<script>
import mixinFuncoesGerais from '../../mixins/mixinFuncoesGerais';
import mixinAlert from '../../mixins/mixinAlert';
import axios_ts from '../../axios-config';
import Chart from 'chart.js';
import HelpButton from '../../components/HelpButton'; 

export default {
    name: 'Burndown',

    mixins: [
        mixinFuncoesGerais,
        mixinAlert
    ],

    components: {
      HelpButton
    },

    data: () => ({

      sn_carregando_burndown: false,

      sprint_atual: null,

      arrDatas: [],
      arrHorasIdeal: [],
      arrHorasAtual: [],

      chart: null,

    }),

    methods: {

      async getDados() {
        try {
          this.sn_carregando_burndown = true;

          this.sprint_atual = await this.mxGetSprintAtual();

          if (this.sprint_atual == null) {
            this.sn_carregando_burndown = false;
            return;
          }

          const retorno = await axios_ts.get('/get-burndown', {
              params: {
                  sprint_id: this.sprint_atual
              }
          });

          this.arrDatas = retorno.data.arr_labels;
          this.arrHorasIdeal = retorno.data.arr_horas_ideial_por_dia;
          this.arrHorasAtual = retorno.data.arr_horas_por_dia;

          this.sn_carregando_burndown = false;

          await this.criaGrafico();
            
        } catch (e) {
            this.mxAlertErroInesperado(e);
            this.sn_carregando_burndown = false;
        }
      },
      
      async criaGrafico() {
        this.chart = new Chart(this.$refs.grafico, {
            type: 'line',
            data: {
                labels: this.arrDatas,
                datasets: [
                    {
                      label: 'Atual',
                      data: this.arrHorasAtual,
                      fill: false,
                      backgroundColor: "#d63c41",
                      borderColor: "#d63c41",
                      pointBackgroundColor: "#a12225",
                      pointBorderColor: "#a12225",
                      pointHoverBackgroundColor: "#eb9496",
                      pointHoverBorderColor: "#eb9496",
                    },
                    {
                      label: 'Ideal',
                      data: this.arrHorasIdeal,
                      fill: false,
                      backgroundColor: "#4c6fad",
                      borderColor: "#99b8f0",
                      pointBackgroundColor: "#4c6fad",
                      pointBorderColor: "#4c6fad",
                      pointHoverBackgroundColor: "#b4c9ed",
                      pointHoverBorderColor: "#b4c9ed",
                    }
                ],
            },
            options: {
              legend: {
                  display: true,
                  position: 'top',
                  labels: {
                      fontColor: this.$vuetify.theme.dark ? "#ffffff" : '#666'
                  }
              },
              scales: {
                xAxes: [
                  {
                    gridLines: { 
                      color: this.$vuetify.theme.dark ? '#666' : '#e3e1e1'
                    }
                  }
                ],
                yAxes: [
                  {
                    gridLines: { 
                      color: this.$vuetify.theme.dark ? '#666' : '#e3e1e1'
                    }
                  }
                ]
              },
            }
        });
      }

    },

    async mounted() {
      await this.getDados();
    },

    watch: {
    '$vuetify.theme.dark':{
      handler: function () {
        this.criaGrafico();
      }
    },
  },

}
</script>