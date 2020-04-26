<template>
  <v-container
    class="text-center"
    fill-height
    style="height: calc(100vh - 58px);"
  >
    <v-row align="center">
      <v-col>
        <h1 class="display-2 primary--text">Whoops, 404</h1>

        <p>A página que você procurou não existe...</p>

        <v-btn
          @click="mxIrPara('')"
          color="primary"
          outlined
        >
          Voltar ao site
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import mixinFuncoesGerais from '../../mixins/mixinFuncoesGerais';

export default {
    mixins: [
        mixinFuncoesGerais
    ]
}
</script>