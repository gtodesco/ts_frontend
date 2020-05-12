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
            <span class="headline">Perfil</span>
        </v-card-title>
        <v-form 
            ref="form"
            v-model="valid"
            @submit.prevent="salvarPerfil()"
        >
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="12">
                            <v-text-field 
                                v-model="novo_nome"
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
                    :loading="sn_carregando_perfil"
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
    name: 'Perfil',

    mixins: [
        mixinFuncoesGerais,
        mixinAlert
    ],

    props: {
        show: {
            type: Boolean,
            default: false
        },
        nome: {
            type: String
        },
        email: {
            type: String
        }
    },

    data: () => ({
        valid: true,    

        sn_carregando_perfil: false,

        novo_nome: '',

        rules: {
            required: v => !!v || 'Obrigatório',
        },
    }),

    methods: {
        fecharModal: function () {
            this.$emit('change-show', false);
        },

        async salvarPerfil() {
            try {

                this.sn_carregando_perfil = true;

                const retorno = await axios_ts.put('/pessoa-email', {
                    "email": this.email,
                    "nome": this.novo_nome,
                });

                if (!retorno.data.status) {
                    throw retorno.data.msg;
                }

                this.$emit('salvou-perfil');

                this.fecharModal();

            } catch (e) {

                this.mxAlertErroInesperado(e);
                this.sn_carregando_perfil = false;
            }
        },
    },

    mounted() {
        this.novo_nome = this.nome;
    }
}
</script>
