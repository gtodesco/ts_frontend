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
            <span class="headline">Criar equipe</span>
        </v-card-title>
        <v-form 
            ref="form"
            v-model="valid"
            @submit.prevent="cadastrarEquipe()"
        >
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="12">
                            <v-text-field 
                                v-model="nome"
                                label="Nome"
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
                    :loading="sn_carregando_equipe"
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
import moment from 'moment';

export default {
    model: {
        prop: 'show',
        event: 'change-show'
    },
    name: 'CadastroEquipe',

    mixins: [
        mixinFuncoesGerais
    ],

    props: {
        show: {
            type: Boolean,
            default: false
        }
    },

    data: () => ({
        valid: true,    

        sn_carregando_equipe: false,

        nome: "",

        rules: {
            required: v => !!v || 'Obrigatório',
        },
    }),

    methods: {
        fecharModal: function () {
            this.$emit('change-show', false);
        },

        async cadastrarEquipe() {
            try {

                this.sn_carregando_equipe = true;

                const new_equipe = await axios_ts.post('/equipe', {
                    "nome": this.nome,
                    "dt_ativacao": this.mxGetDataBd(moment()),
                    "sn_ativa": true,
                    "cd_amazon": localStorage.getItem('currentUserId')
                });

                if (!new_equipe.data.status) {
                    throw new_equipe.data.msg;
                }

                this.$emit('nova-equipe');

                this.fecharModal();

            } catch (e) {

                this.mxAlertErroInesperado(e);
                this.sn_carregando_equipe = false;
            }
        },
    },
}
</script>
