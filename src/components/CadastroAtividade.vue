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
            <span class="headline">Atividade</span>
        </v-card-title>
        <v-form 
            ref="form"
            v-model="valid"
            @submit.prevent="salvarAtividade()"
        >
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field 
                                v-model="objAtividade.titulo"
                                label="Título *"
                                :rules="[rules.required]"
                            />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-textarea
                                v-model="objAtividade.descricao"
                                outlined
                                label="Descrição *"
                                :rules="[rules.required]"
                            ></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row style="margin-top: -15px">
                        <v-col cols="12" sm="12" md="2">
                            <v-text-field 
                                v-model="objAtividade.horas_previsto"
                                type="time"
                                label="Previsto *"
                                :rules="[rules.required]"
                            />
                        </v-col>
                        <v-col cols="12" sm="12" md="2">
                            <v-text-field 
                                v-model="objAtividade.horas_realizado"
                                type="time"
                                label="Realizado"
                            />
                        </v-col>
                        <v-col cols="12" sm="12" md="4">
                            <v-select
                                v-model="objAtividade.prioridade"
                                :items="arrPrioridades"
                                :menu-props="{ offsetY: true }"
                                item-text="descricao"
                                item-value="id"
                                label="Prioridade"
                            >
                            </v-select>
                        </v-col>
                        <v-col cols="12" sm="12" md="4">
                            <v-select
                                v-model="objAtividade.tipo_id"
                                :items="arrTiposAtividades"
                                :menu-props="{ offsetY: true }"
                                item-text="descricao"
                                item-value="id"
                                label="Tipo *"
                                :loading="sn_carregando_tipo_de_atividade"
                                :rules="[rules.required]"
                            >
                            </v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-select
                                v-model="objAtividade.pessoas"
                                :items="arrPessoas"
                                :menu-props="{ offsetY: true }"
                                item-text="nome"
                                item-value="id"
                                label="Membros"
                                multiple
                                deletable-chips
                                chips
                                :loading="sn_carregando_pessoas"
                            >
                            </v-select>
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
                    :loading="sn_carregando_atividade"
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
    name: 'CadastroAtividade',

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
        objAtividade: {
            type: Object
        },
        status: {
            type: Number,
            default: null
        }
    },

    data: () => ({
        valid: true,    

        sn_carregando_tipo_de_atividade: false,
        sn_carregando_pessoas: false,

        sn_carregando_atividade: false,

        rules: {
            required: v => !!v || 'Obrigatório',
        },

        arrPrioridades: [
            {
                'descricao': 'Baixa',
                'id': 1
            },
            {
                'descricao': 'Média',
                'id': 2
            },
            {
                'descricao': 'Alta',
                'id': 3
            },
        ],

        arrTiposAtividades: [],

        arrPessoas: [],
    }),

    methods: {

        async getTiposAtividades() {

            try {

                this.sn_carregando_tipo_de_atividade = true;

                const arrRetorno = await axios_ts.get('/tipo-atividade', {
                    params: {
                        equipe_id: localStorage.getItem('team')
                    }
                });

                this.arrTiposAtividades = arrRetorno.data;

                this.sn_carregando_tipo_de_atividade = false;

            } catch (e) {

                this.mxAlertErroInesperado(e);
                this.sn_carregando_tipo_de_atividade = false;
            }
        },

        async getPessoas() {
            try {

                this.sn_carregando_pessoas = true;

                this.arrPessoas = await this.mxGetPessoasEquipe();

                this.sn_carregando_pessoas = false;

            } catch (e) {
                this.mxAlertErroInesperado(e);
                this.sn_carregando_pessoas = false;
            }
        },

        fecharModal: function () {
            this.$emit('change-show', false);
        },

        async salvarAtividade() {
            try {

                this.sn_carregando_atividade = true;

                let retorno = null;

                let objDataAtividade = {
                    'tipo_id': this.objAtividade.tipo_id,
                    'titulo': this.objAtividade.titulo,
                    'descricao': this.objAtividade.descricao,
                    'prioridade': this.objAtividade.prioridade,
                    'horas_previsto': this.objAtividade.horas_previsto,
                    'horas_realizado': this.objAtividade.horas_realizado,
                    'pessoas': this.objAtividade.pessoas,
                }

                // Envia objetos diferentes dependendo da operação
                if (this.snEditar) {

                    objDataAtividade['id'] = this.objAtividade.id;

                    retorno = await axios_ts.put('/atividade', objDataAtividade);
                }
                else {

                    if (this.status != null) {
                        objDataAtividade['status_id'] = this.status;
                        objDataAtividade['sprint_id'] = await this.mxGetSprintAtual();
                    }

                    objDataAtividade['equipe_id'] = localStorage.getItem('team');

                    retorno = await axios_ts.post('/atividade', objDataAtividade);
                }

                if (!retorno.data.status) {
                    throw retorno.data.msg;
                }

                this.$emit('salvou-atividade');

                this.fecharModal();

            } catch (e) {

                this.mxAlertErroInesperado(e);
                this.sn_carregando_atividade = false;
            }
        },
    },

    async mounted() {
        await this.getTiposAtividades();
        await this.getPessoas();
    }
}
</script>
