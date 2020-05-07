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
            <span class="headline">Buscar pessoa</span>
        </v-card-title>
        <v-form 
            ref="form"
            v-model="valid"
            @submit.prevent="buscarPessoa()"
        >
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="12">
                            <v-text-field 
                                v-model="email"
                                label="E-mail"
                                :rules="[rules.required, rules.email]"
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
                    :loading="sn_carregando_pessoa"
                    :disabled="!valid"
                >
                    Buscar
                </v-btn>
            </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="sn_mostra_pessoa_nao_encontrada"
      :timeout="4000"
      color="error"
    >
      Nenhuma pessoa encontrada.
      <v-btn
        color="white"
        text
        @click="sn_mostra_pessoa_nao_encontrada = false"
      >
        Fechar
      </v-btn>
    </v-snackbar>

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
    name: 'BuscaPessoaPorEmail',

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

        sn_carregando_pessoa: false,
        sn_mostra_pessoa_nao_encontrada: false,

        email: "",

        rules: {
            required: v => !!v || 'Obrigatório',
            email: v => /.+@.+\..+/.test(v) || 'E-mail inválido',
        },
    }),

    methods: {
        fecharModal: function () {
            this.$emit('change-show', false);
        },

        async buscarPessoa() {
            try {

                this.sn_carregando_pessoa = true;

                const retorno = await axios_ts.get('/pessoa/get-pessoa-email', {
                    params: {
                        email: this.email
                    }
                });

                // Se não encontrar, avisa na tela e não fecha a modal
                if (retorno.data.length == 0) {
                    this.sn_carregando_pessoa = false;
                    this.sn_mostra_pessoa_nao_encontrada = true;
                }
                else {
                    this.$emit('buscou-pessoa', retorno.data[0]);
                    this.fecharModal();
                }

            } catch (e) {

                this.mxAlertErroInesperado(e);
                this.sn_carregando_pessoa = false;
            }
        },
    },
}
</script>
