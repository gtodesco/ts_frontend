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
              @submit.prevent="realizaCadastro()"
            >
              <v-card-text>

                <v-text-field
                  v-model="senha"
                  :append-icon="mostrar_senha ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="mostrar_senha ? 'text' : 'password'"
                  @click:append="mostrar_senha = !mostrar_senha"
                  id="senha"
                  label="Nova senha"
                  prepend-icon="mdi-lock"
                  :rules="[rules.required, rules.senha]"
                />

                <v-text-field
                  v-model="senha_confirma"
                  :append-icon="mostrar_senha_confirma ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="mostrar_senha_confirma ? 'text' : 'password'"
                  @click:append="mostrar_senha_confirma = !mostrar_senha_confirma"
                  id="senha-confirm"
                  label="Confirme a nova senha"
                  prepend-icon="mdi-lock-check"
                  :rules="[rules.required, senhaValidacao]"
                />

              </v-card-text>
              <v-card-actions>
                <v-spacer />

                <v-btn 
                  class="mr-3" 
                  large
                  type="submit" 
                  color="primary" 
                  :loading="sn_carregando_cadastro"
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

export default {
  mixins: [mixinFuncoesGerais],

  data: () => ({
    valid: true,

    senha: "",
    senha_confirma: "",
    mostrar_senha: false,
    mostrar_senha_confirma: false,

    rules: {
      required: v => !!v || 'Obrigatório',
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
      
      this.sn_carregando_cadastro = true;

      // Requisição para login
      setTimeout(() => {
        this.mxIrPara('app');
      }, 5000);
    },

}
}
</script>
