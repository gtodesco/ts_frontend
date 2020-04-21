<template>
  <v-content>
    <v-container
      class="fill-height"
      fluid
      style="background-color: #1d1d1d"
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          sm="8"
          md="4"
        >
          <v-card outlined>
            <v-row justify="center">
              <v-img
                max-height="15%"
                max-width="15%"
                src="../../assets/logo.png"
                class="ma-3"
              ></v-img>  
            </v-row>       

            <v-card-title class="justify-center font-weight-black text-uppercase">
              Confirmar conta
            </v-card-title>

            <v-form 
              ref="form"
              v-model="valid"
              @submit.prevent="realizaConfirmacao()"
            >
              <v-card-text>

                <v-chip
                  class="ma-2"
                  color="green"
                  outlined
                  label
                  small
                >
                  Verifique seu e-mail
                </v-chip>

                <v-text-field
                  v-model="email"
                  id="email"
                  label="E-mail"
                  prepend-icon="mdi-email"
                  :rules="[rules.required, rules.email]"
                  disabled
                />

                <v-text-field
                  v-model="codigo"
                  id="codigo"
                  label="Código"
                  prepend-icon="mdi-security"
                  :rules="[rules.required]"
                />

                <a class="ml-8" @click="reenviarCodigo()">
                    Reenviar código
                </a>

              </v-card-text>
              <v-card-actions>
                <v-btn
                  class="ml-3" 
                  text 
                  small 
                  onClick="javascript:history.go(-1)"
                >
                  Voltar
                </v-btn>

                <v-spacer />

                <v-btn 
                  class="mr-3" 
                  large
                  type="submit" 
                  color="primary" 
                  :loading="sn_carregando_confirmacao"
                  :disabled="!valid"
                >
                  Confirmar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    
    <v-snackbar
      v-model="sn_mostra_enviar_codigo"
      :timeout="4000"
      color="success"
    >
      Código enviado
      <v-btn
        color="white"
        text
        @click="snackbar = false"
      >
        Fechar
      </v-btn>
    </v-snackbar>

  </v-content>
</template>

<script>
import mixinFuncoesGerais from '../../mixins/mixinFuncoesGerais';
import mixinAlert from '../../mixins/mixinAlert';
import { Auth } from 'aws-amplify';

export default {
  mixins: [
    mixinFuncoesGerais,
    mixinAlert,
  ],

  data: () => ({
    valid: true,

    email: "",
    codigo: "",

    sn_mostra_enviar_codigo: false,

    rules: {
      required: v => !!v || 'Obrigatório',
      email: v => /.+@.+\..+/.test(v) || 'E-mail inválido',
    },

    sn_carregando_confirmacao: false,
  }),

  methods: {
    async realizaConfirmacao() {
      try{

        this.sn_carregando_confirmacao = true;

        // Confirma rgistro com o código enviado por e-mail
        await Auth.confirmSignUp(this.email, this.codigo);

        // Após confirmar, direciona para tela de login
        setTimeout(() => {
          this.mxIrPara('login');
        }, 5000);
      
      } catch (e) {

        if (e.code === "CodeMismatchException") {
          this.mxAlertErro("Código de confirmação inválido.");
        }
        else {
          this.mxAlertErroInesperado(e);
        }

        this.sn_carregando_confirmacao = false;
      }
    },

    async reenviarCodigo() {
        try {
          // Reenvia o código para o usuário
          await Auth.resendSignUp(this.email);

          this.sn_mostra_enviar_codigo = true;

        } catch(e) {
          if (e.code === "LimitExceededException") {
            this.mxAlertErro("Limite de envios excedido. Tente novamente mais tarde.");
          }
          else {
            this.mxAlertErroInesperado(e);
          }
        }
        
    }

  },

  created() {
      this.email = this.$route.params.email
  }
}
</script>
