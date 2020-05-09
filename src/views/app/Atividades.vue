<template>
  
  <v-container>

    <h1 class="headline">Atividades</h1>

    <br>

    <v-row>
        <v-col 
          cols="12"
          sm="12"
          md="4"
        >

        <v-select
          v-model="tipo_selecionado"
          :items="arrTiposAtividades"
          :menu-props="{ offsetY: true }"
          item-text="descricao"
          item-value="id"
          clearable
          label="Tipo"
        >
        </v-select>

        </v-col>
        {{tipo_selecionado}}
    </v-row>


  </v-container>

</template>

<script>
import mixinAlert from '../../mixins/mixinAlert';
import axios_ts from '../../axios-config';

export default {
  name: 'Atividades',
  mixins: [
    mixinAlert
  ],

  data: () => ({
    
    sn_carregando_atividade: false,

    arrTiposAtividades: [],
    arrAtividades: [],

    tipo_selecionado: null,

  }),

  methods: {

    async getTiposAtividades() {

      try {

        this.sn_carregando_atividade = true;

        const arrRetorno = await axios_ts.get('/tipo-atividade', {
            params: {
                equipe_id: localStorage.getItem('team')
            }
        });

        this.arrTiposAtividades = arrRetorno.data;

        this.sn_carregando_atividade = false;

      } catch (e) {

        this.mxAlertErroInesperado(e);
        this.sn_carregando_atividade = false;
      }
    },

    async getAtividades() {
      this.sn_carregando_atividade = true;

// Verifica se o tipo selecionado for null ou não para enviar para a API

      this.sn_carregando_atividade = false;
    },

  },

  async mounted() {
    await this.getTiposAtividades();
    await this.getAtividades();
  }

}
</script>