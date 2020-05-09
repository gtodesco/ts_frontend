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
            <span class="headline">Tipo de Atividade</span>
        </v-card-title>
        <v-form 
            ref="form"
            v-model="valid"
            @submit.prevent="salvarTipoAtividade()"
        >
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="12">
                            <v-text-field 
                                v-model="objTipoAtividade.descricao"
                                label="Descrição"
                                :rules="[rules.required]"
                            />
                        </v-col>
                    </v-row>
                    <v-row justify="center" align="center">
                        <v-col cols="12" sm="6">
                            <v-color-picker 
                                v-model="objTipoAtividade.color"
                                mode="hexa" 
                                hide-canvas 
                                hide-mode-switch
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
                    :loading="sn_carregando_tipo_de_atividade"
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

export default {
    model: {
        prop: 'show',
        event: 'change-show'
    },
    name: 'CadastroTipoAtividade',

    mixins: [
        mixinFuncoesGerais
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
        objTipoAtividade: {
            type: Object
        }
    },

    data: () => ({
        valid: true,    

        sn_carregando_tipo_de_atividade: false,

        rules: {
            required: v => !!v || 'Obrigatório',
        },
    }),

    methods: {
        fecharModal: function () {
            this.$emit('change-show', false);
        },

        async salvarTipoAtividade() {
            try {

                this.sn_carregando_tipo_de_atividade = true;

                let retorno = null;

                // Envia objetos diferentes dependendo da operação
                if (this.snEditar) {
                    retorno = await axios_ts.put('/tipo-atividade', {
                        "id": this.objTipoAtividade.id,
                        "descricao": this.objTipoAtividade.descricao,
                        "color": this.objTipoAtividade.color
                    });
                }
                else {
                    retorno = await axios_ts.post('/tipo-atividade', {
                        "equipe_id": localStorage.getItem('team'),
                        "descricao": this.objTipoAtividade.descricao,
                        "color": this.objTipoAtividade.color
                    });
                }

                if (!retorno.data.status) {
                    throw retorno.data.msg;
                }

                this.$emit('salvou-tipo-atividade');

                this.fecharModal();

            } catch (e) {

                this.mxAlertErroInesperado(e);
                this.sn_carregando_tipo_de_atividade = false;
            }
        },
    },
}
</script>
