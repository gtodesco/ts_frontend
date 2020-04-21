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
              Esqueci minha senha
            </v-card-title>

            <v-form 
              ref="form"
              v-model="valid"
              @submit.prevent="realizaLogin()"
            >
              <v-card-text>

                <v-text-field
                  v-model="email"
                  id="email"
                  label="Digite seu e-mail"
                  prepend-icon="mdi-email"
                  :rules="[rules.required, rules.email]"
                />

              </v-card-text>
              <v-card-actions>
                <v-btn
                  class="ml-3" 
                  text 
                  small 
                  @click="mxIrPara('login')"
                >
                  Voltar
                </v-btn>

                <v-spacer />

                <v-btn 
                  class="mr-3" 
                  large
                  type="submit" 
                  color="primary" 
                  :loading="sn_carregando_login"
                  :disabled="!valid"
                >
                  Enviar
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

export default {
  mixins: [mixinFuncoesGerais],

  data: () => ({
    valid: true,

    email: "",

    rules: {
      required: v => !!v || 'Obrigatório',
      email: v => /.+@.+\..+/.test(v) || 'E-mail inválido',
    },

    sn_carregando_login: false,
  }),

  methods: {
    async realizaLogin() {
      
      this.sn_carregando_login = true;

      // Requisição para login
      setTimeout(() => {
        this.mxIrPara('app');
      }, 5000);
    },
    
  }
}
</script>
