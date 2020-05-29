<template>
  <v-content>
    <v-container
      class="fill-height"
      fluid
      style="background-color: white;"
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
          <v-card outlined light>
            <v-row justify="center">
              <v-img
                max-height="15%"
                max-width="15%"
                src="../../assets/logo.png"
                class="ma-3"
              ></v-img>  
            </v-row>      

            <v-card-title class="justify-center font-weight-black text-uppercase">
              Nova senha
            </v-card-title>

            <v-form 
              ref="form"
              v-model="valid"
              @submit.prevent="confirmaNovaSenha()"
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

                <v-text-field
                  v-model="senha"
                  :append-icon="mostrar_senha ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="mostrar_senha ? 'text' : 'password'"
                  @click:append="mostrar_senha = !mostrar_senha"
                  id="senha"
                  label="Nova senha"
                  prepend-icon="mdi-lock"
                  :rules="[rules.required, rules.senha]"
                >
                  <template v-slot:append>
                    <v-button 
                      @click="mostrar_senha = !mostrar_senha" 
                      tabindex="-1"
                      style="cursor: pointer;"
                    >
                      <v-icon v-if="mostrar_senha" >mdi-eye</v-icon>
                      <v-icon v-if="!mostrar_senha" >mdi-eye-off</v-icon>
                    </v-button>
                  </template>                
                </v-text-field>

                <v-text-field
                  v-model="senha_confirma"
                  :append-icon="mostrar_senha_confirma ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="mostrar_senha_confirma ? 'text' : 'password'"
                  @click:append="mostrar_senha_confirma = !mostrar_senha_confirma"
                  id="senha-confirm"
                  label="Confirme a nova senha"
                  prepend-icon="mdi-lock-check"
                  :rules="[rules.required, senhaValidacao]"
                >
                  <template v-slot:append>
                    <v-button 
                      @click="mostrar_senha_confirma = !mostrar_senha_confirma" 
                      tabindex="-1"
                      style="cursor: pointer;"
                    >
                      <v-icon v-if="mostrar_senha_confirma" >mdi-eye</v-icon>
                      <v-icon v-if="!mostrar_senha_confirma" >mdi-eye-off</v-icon>
                    </v-button>
                  </template>                
                </v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  class="ml-3" 
                  text 
                  small 
                  color="primary"
                  @click="mxIrPara('login/senha')"
                >
                  Voltar
                </v-btn>

                <v-spacer />

                <v-btn 
                  class="mr-3" 
                  large
                  type="submit" 
                  color="primary" 
                  :loading="sn_carregando_nova_senha"
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
    senha: "",
    senha_confirma: "",
    mostrar_senha: false,
    mostrar_senha_confirma: false,

    rules: {
      email: v => /.+@.+\..+/.test(v) || 'E-mail inválido',
      required: v => !!v || 'Obrigatório',
      senha: v => v.length >= 8 || 'Senha deve ter no mínimo 8 caracteres',
    },

    sn_carregando_nova_senha: false,
  }),

  computed: {
      senhaValidacao() {
        return () => (this.senha === this.senha_confirma) || 'Senha diferente'
      },
  },

  methods: {
    async confirmaNovaSenha() {
      try {
        
        this.sn_carregando_nova_senha = true;

        await Auth.forgotPasswordSubmit(this.email, this.codigo, this.senha);

        // Encaminha para login
        this.mxIrPara('login');

      } catch (e) {

        if (e.code === "CodeMismatchException") {
          this.mxAlertErro("Código incorreto.");
        }
        else if (e.code === "LimitExceededException") {
          this.mxAlertErro("Limite de envios excedido. Tente novamente mais tarde.");
        }
        else {
          this.mxAlertErroInesperado(e);
        }

        this.sn_carregando_nova_senha = false;
      }
    },
  },

  created() {
    this.email = this.$route.params.email;
  }
}
</script>
