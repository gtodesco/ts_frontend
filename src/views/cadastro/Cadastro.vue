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
              Cadastro
            </v-card-title>

            <v-form 
              ref="form"
              v-model="valid"
              @submit.prevent="realizaCadastro()"
            >
              <v-card-text>

                <v-text-field
                  v-model="nome"
                  id="nome"
                  label="Nome"
                  prepend-icon="mdi-account"
                  :rules="[rules.required]"
                />

                <v-text-field
                  v-model="email"
                  id="email"
                  label="E-mail"
                  prepend-icon="mdi-email"
                  :rules="[rules.required, rules.email]"
                />

                <v-text-field
                  v-model="senha"
                  :append-icon="mostrar_senha ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="mostrar_senha ? 'text' : 'password'"
                  @click:append="mostrar_senha = !mostrar_senha"
                  id="senha"
                  label="Senha"
                  prepend-icon="mdi-lock"
                  :rules="[rules.required, rules.senha]"
                />

                <v-text-field
                  v-model="senha_confirma"
                  :append-icon="mostrar_senha_confirma ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="mostrar_senha_confirma ? 'text' : 'password'"
                  @click:append="mostrar_senha_confirma = !mostrar_senha_confirma"
                  id="senha-confirm"
                  label="Confirme a senha"
                  prepend-icon="mdi-lock-check"
                  :rules="[rules.required, senhaValidacao]"
                />

              </v-card-text>
              <v-card-actions>
                <v-btn
                  class="ml-3" 
                  text 
                  small 
                  @click="mxIrPara('login')"
                >
                  Login
                </v-btn>

                <v-spacer />

                <v-btn 
                  class="mr-3" 
                  large
                  type="submit" 
                  color="primary" 
                  :loading="sn_carregando_cadastro"
                  :disabled="!valid"
                >
                  Registrar
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

    nome: "",
    email: "",
    senha: "",
    senha_confirma: "",
    mostrar_senha: false,
    mostrar_senha_confirma: false,

    rules: {
      required: v => !!v || 'Obrigatório',
      email: v => /.+@.+\..+/.test(v) || 'E-mail inválido',
      senha: v => v.length >= 8 || 'Senha deve ter no mínimo 8 caracteres',
    },

    sn_carregando_cadastro: false,
  }),

  computed: {
      senhaValidacao() {
        return () => (this.senha === this.senha_confirma) || 'Senha diferente'
      },
  },

  methods: {
    async realizaCadastro() {
      try{

        this.sn_carregando_cadastro = true;

        // Cadastra usuário na Amazon
        await Auth.signUp({
          username: this.email,
          password: this.senha,
          attributes: {
            email: this.email
          }
        });

        // Após cadastrar, direciona para tela de confirmacao de conta
        this.mxIrPara('confirma-conta/' + this.email);
      
      } catch (e) {

        if (e.code === "UsernameExistsException") {
          this.mxAlertErro("Este e-mail já está cadastrado.");
        }
        else {
          this.mxAlertErroInesperado(e);
        }

        this.sn_carregando_cadastro = false;
      }
    },
  }
}
</script>
