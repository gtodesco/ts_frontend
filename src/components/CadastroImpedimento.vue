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
            <span class="headline">Impedimento</span>
        </v-card-title>
        <v-form 
            ref="form"
            v-model="valid"
            @submit.prevent="salvarImpedimento()"
        >
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field 
                                v-model="objImpedimento.descricao"
                                label="Descrição"
                                :rules="[rules.required]"
                            />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="6">
                            <v-text-field 
                                v-model="objImpedimento.horas"
                                type="time"
                                label="Tempo"
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
                    :loading="sn_carregando_impedimento"
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
import mixinAlert from '../mixins/mixinAlert';

export default {
    model: {
        prop: 'show',
        event: 'change-show'
    },
    name: 'CadastroImpedimento',

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
        objImpedimento: {
            type: Object
        },
        sprint: {
            type: Number,
            require,
        }
    },

    data: () => ({
        valid: true,    

        sn_carregando_impedimento: false,

        rules: {
            required: v => !!v || 'Obrigatório',
        },
    }),

    methods: {

        fecharModal: function () {
            this.$emit('change-show', false);
        },

        async salvarImpedimento() {
            try {

                this.sn_carregando_impedimento = true;

                const pessoa_logada = await axios_ts.get('/pessoa/get-pessoa', {
                    params: {
                        cd_amazon: localStorage.getItem('currentUserId')
                    }
                });

                let retorno = null;

                // Envia objetos diferentes dependendo da operação
                if (this.snEditar) {
                    retorno = await axios_ts.put('/impedimento', {
                        'id': this.objImpedimento.id,
                        'sprint_id': this.sprint,
                        'pessoa_id': pessoa_logada.data[0].id,
                        'descricao': this.objImpedimento.descricao,
                        'horas': this.objImpedimento.horas,
                    });
                }
                else {
                    retorno = await axios_ts.post('/impedimento', {
                        'sprint_id': this.sprint,
                        'pessoa_id': pessoa_logada.data[0].id,
                        'descricao': this.objImpedimento.descricao,
                        'horas': this.objImpedimento.horas,
                    });
                }

                if (!retorno.data.status) {
                    throw retorno.data.msg;
                }

                this.$emit('salvou-impedimento');

                this.fecharModal();

            } catch (e) {

                this.mxAlertErroInesperado(e);
                this.sn_carregando_impedimento = false;
            }
        },
    },
}
</script>
