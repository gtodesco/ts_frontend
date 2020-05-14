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
            <span class="headline">{{atividade.titulo}}</span>
        </v-card-title>
        <v-form 
            ref="form"
            v-model="valid"
            @submit.prevent="moverAtividade()"
        >
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-select
                                v-model="status_selecionado"
                                :items="arrStatus"
                                :menu-props="{ offsetY: true }"
                                item-text="descricao"
                                item-value="id"
                                label="Mover para"
                                :loading="sn_carregando_status"
                                :rules="[rules.required]"
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
                    :loading="sn_carregando_mover"
                    :disabled="!valid"
                >
                    Mover
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
    name: 'MoverAtividade',

    mixins: [
        mixinFuncoesGerais,
        mixinAlert
    ],

    props: {
        show: {
            type: Boolean,
            default: false
        },
        atividade: {
            type: Object
        },
    },

    data: () => ({
        valid: true,    

        sn_carregando_status: false,

        sn_carregando_mover: false,

        status_selecionado: null,

        rules: {
            required: v => !!v || 'Obrigatório',
        },

        arrStatus: [],

    }),

    methods: {

        async getStatus() {

            try {

                this.sn_carregando_status = true;

                const arrRetorno = await axios_ts.get('/status');

                this.arrStatus = arrRetorno.data;

                this.sn_carregando_status = false;

            } catch (e) {

                this.mxAlertErroInesperado(e);
                this.sn_carregando_status = false;
            }
        },

        fecharModal: function () {
            this.$emit('change-show', false);
        },

        async moverAtividade() {
            try {

                this.sn_carregando_mover = true;

                const retorno = await axios_ts.put('/atividade', {
                    id: this.atividade.id,
                    status_id: this.status_selecionado 
                });

                if (!retorno.data.status) {
                    throw retorno.data.msg;
                }

                this.$emit('moveu-atividade');

                this.fecharModal();

            } catch (e) {

                this.mxAlertErroInesperado(e);
                this.sn_carregando_mover = false;
            }
        },
    },

    async mounted() {
        await this.getStatus();
    }
}
</script>
