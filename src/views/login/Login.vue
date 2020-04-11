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
            <v-form 
              ref="form"
              v-model="valid"
              @submit.prevent="realizaLogin()"
            >
              <v-card-text>

                <v-text-field
                  v-model="email"
                  id="email"
                  label="E-mail"
                  prepend-icon="mdi-account"
                  :rules="emailRules"
                />

                <v-text-field
                  v-model="senha"
                  id="senha"
                  type="password"
                  label="Senha"
                  prepend-icon="mdi-lock"
                  :rules="senhaRules"
                />

                <a class="ml-8">
                  Esqueci minha senha
                </a>

              </v-card-text>
              <v-card-actions>
                <v-btn
                  class="ml-3" 
                  text 
                  small 
                  @click="irParaCadastro"
                >
                  Registre-se
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
                  Entrar
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
export default {

  data: () => ({
    valid: true,
    email: "",
    emailRules: [
      v => !!v || 'Informe o e-mail',
      v => /.+@.+\..+/.test(v) || 'E-mail inválido',
    ],
    senha: "",
    senhaRules: [
      v => !!v || 'Informe a senha',
    ],
    sn_carregando_login: false,
  }),

  methods: {
    async realizaLogin() {
      
      this.sn_carregando_login = true;

      // Requisição para login
      setTimeout(() => {
        this.$router.push('/app');
      }, 5000);
    },

    irParaCadastro: function() {
      this.$router.push('/cadastro');
    }
    
  }
}
</script>
