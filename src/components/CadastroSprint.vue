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
            <span class="headline">Sprint</span>
        </v-card-title>
        <v-form 
            ref="form"
            v-model="valid"
            @submit.prevent="salvarSprint()"
        >
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field 
                                v-model="objSprint.numero"
                                label="Número"
                                :rules="[rules.required]"
                            />
                        </v-col>
                    </v-row>
                        <v-row>
                            <v-col cols="12" sm="12">
                                <v-text-field 
                                    v-model="objSprint.objetivo"
                                    label="Objetivo"
                                    :rules="[rules.required]"
                                />
                            </v-col>
                        </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="6">
                            <DatePicker
                                v-model="objSprint.dt_inicio"
                                label="Início"
                                :rules="[rules.required]"
                            />
                        </v-col>
                        <v-col cols="12" sm="12" md="6">
                            <DatePicker
                                v-model="objSprint.dt_fim"
                                label="Fim"
                                :rules="[rules.required]"
                            />
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                    color="blue darken-1" 
                    text 
                    @click="fecharModal()"
                >
                    Cancelar
                </v-btn>
                <v-btn 
                    color="blue darken-1" 
                    text 
                    type="submit"
                    :loading="sn_carregando_sprint"
                    :disabled="!valid"
                >
                    Salvar
                </v-btn>
            </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import mixinFuncoesGerais from '../mixins/mixinFuncoesGerais';
import axios_ts from '../axios-config';  
import DatePicker from './DatePicker';
import mixinAlert from '../mixins/mixinAlert';

export default {
    model: {
        prop: 'show',
        event: 'change-show'
    },
    name: 'CadastroSprint',
    
    components: {
        DatePicker
    },

    mixins: [
        mixinFuncoesGerais,
        mixinAlert
    ],

    props: {
        show: {
            type: Boolean,
            default: false
        },
        snEditar: {
            type: Boolean,
            default: false,
        },
        objSprint: {
            type: Object
        }
    },

    data: () => ({
        valid: true,    

        sn_carregando_sprint: false,

        dateFormatted: '',
        menu1: false,

        rules: {
            required: v => !!v || 'Obrigatório',
        },
    }),

    methods: {

        fecharModal: function () {
            this.$emit('change-show', false);
        },

        async salvarSprint() {
            try {

                this.sn_carregando_sprint = true;

                let retorno = null;

                // Envia objetos diferentes dependendo da operação
                if (this.snEditar) {
                    retorno = await axios_ts.put('/sprint', {
                        'id': this.objSprint.id,
                        'equipe_id': localStorage.getItem('team'),
                        'numero': this.objSprint.numero,
                        'dt_inicio': this.objSprint.dt_inicio,
                        'dt_fim': this.objSprint.dt_fim,
                        'sn_ativa': this.objSprint.sn_ativa,
                        'objetivo': this.objSprint.objetivo
                    });
                }
                else {

                    const continua = await this.mxAlertConfirma(
                        'Deseja mesmo cadastrar uma nova Sprint? Se já existir uma Sprint ativa, ela será encerrada nesse processo.'
                    );

                    if (!continua) {
                        this.sn_carregando_sprint = false;
                        return;
                    }

                    retorno = await axios_ts.post('/sprint', {
                        'equipe_id': localStorage.getItem('team'),
                        'numero': this.objSprint.numero,
                        'dt_inicio': this.objSprint.dt_inicio,
                        'dt_fim': this.objSprint.dt_fim,
                        'sn_ativa': true,
                        'objetivo': this.objSprint.objetivo
                    });
                }

                if (!retorno.data.status) {
                    throw retorno.data.msg;
                }

                this.$emit('salvou-sprint');

                this.fecharModal();

            } catch (e) {

                this.mxAlertErroInesperado(e);
                this.sn_carregando_sprint = false;
            }
        },
    },
}
</script>
