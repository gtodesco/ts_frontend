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
              Login
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
                  label="E-mail"
                  prepend-icon="mdi-email"
                  :rules="[rules.required, rules.email]"
                />

                <v-text-field
                  v-model="senha"
                  id="senha"
                  :append-icon="mostrar_senha ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="mostrar_senha ? 'text' : 'password'"
                  @click:append="mostrar_senha = !mostrar_senha"
                  label="Senha"
                  prepend-icon="mdi-lock"
                  :rules="[rules.required]"
                />
                
                <router-link to="login/senha" style="text-decoration: none;">
                  <a class="ml-8">
                    Esqueci minha senha
                  </a>
                </router-link>

                <!-- <v-checkbox
                  v-model="sn_lembrar"
                  label="Manter-me logado"
                ></v-checkbox> -->

              </v-card-text>
              <v-card-actions>
                <v-btn
                  class="ml-3" 
                  text
                  small
                  color="primary" 
                  @click="mxIrPara('cadastro')"
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
import mixinFuncoesGerais from '../../mixins/mixinFuncoesGerais';
import mixinAlert from '../../mixins/mixinAlert';
import { Auth, Cache } from 'aws-amplify';

export default {
  mixins: [
    mixinFuncoesGerais,
    mixinAlert
  ],
  
  data: () => ({
    valid: true,

    email: "",
    senha: "",
    mostrar_senha: false,
    sn_lembrar: false,

    rules: {
      required: v => !!v || 'Obrigatório',
      email: v => /.+@.+\..+/.test(v) || 'E-mail inválido',
    },

    sn_carregando_login: false,
  }),

  methods: {
    async realizaLogin() {
      
      try {

        this.sn_carregando_login = true;

        let storageCache;

        // Verifica se irá armazenar a informação no localStorage ou sessionStorage
        // if (this.sn_lembrar) {
        //   storageCache = Cache.createInstance({
        //       keyPrefix: "localStorageAuthCache",
        //       storage: window.localStorage
        //   });
        // } else {
        //   storageCache = Cache.createInstance({
        //       keyPrefix: "sessionAuthCache",
        //       storage: window.sessionStorage
        //   });
        // }

        storageCache = Cache.createInstance({
            keyPrefix: "localStorageAuthCache",
            storage: window.localStorage
        });

        // Seta o storage
        await Auth.configure({
          storage: storageCache
        });

        // Realiza login
        const user = await Auth.signIn(this.email, this.senha);

        // Salva o id do usuário logado e o token JWT
        localStorage.setItem('currentUserId', user.username);
        localStorage.setItem('jwtToken', user.signInUserSession.idToken.jwtToken);

        // Direciona para o aplicativo
        this.mxIrPara('equipes');

      } catch(e) {

        if (e.code === 'UserNotConfirmedException') {
          
          const retorno = await this.mxAlertConfirma("Você precisa confirmar sua conta. Deseja fazer isso agora?");

          if (retorno) {
            this.mxIrPara('confirma-conta/' + this.email);
          }

        } else if (e.code === 'PasswordResetRequiredException') {
          
          await this.mxAlertErro("Você precisa atualizar a sua senha.");

          this.mxIrPara('login/senha');

        } else if (e.code === 'NotAuthorizedException') {

          this.mxAlertErro("Usuário ou senha incorretos.");

        }
        else {

          this.mxAlertErroInesperado(e);

        }

        this.sn_carregando_login = false;
      }

    },
  }
}
</script>
