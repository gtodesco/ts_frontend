<template>
  <v-row justify="center">
    <v-dialog 
        v-model="show"
        persistent
        max-width="600px"
        @click:outside="fecharModal()"
    >
      <v-card>
        <v-card-title>
            <span class="headline">Impedimentos</span>
        </v-card-title>
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
                {{sprint}}
            </v-row>
            

        </v-card-text>
        
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
                color="blue darken-1" 
                text 
                @click="fecharModal()"
            >
                Fechar
            </v-btn>
        </v-card-actions>
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
