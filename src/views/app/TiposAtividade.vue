<template>
  
  <v-container>

    <h1 class="headline">Tipos de Atividades</h1>

    <br>

    <v-row v-if="!sn_carregando_tipos_atividade">
      <v-col 
        v-if="arrTiposAtividades.length == 0"
        cols="12" 
        sm="12"
      >
        <v-alert 
          type="info"
          text
        >
          Sem tipos de atividade
        </v-alert>
      </v-col>
      <v-col
        v-else-if="arrTiposAtividades.length > 0"
        v-for="(tipo_atividade, i) in arrTiposAtividades"
        :key="i"
        cols="12"
        md="4"
      >
        <v-card 
          class="mx-auto"
          outlined
        >

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1">{{tipo_atividade.descricao}}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-avatar
              tile
              size="80"
              :color="tipo_atividade.color"
            ></v-list-item-avatar>
          </v-list-item>

          <v-card-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  dark
                  large
                  v-on="on"
                  @click="abrirModal(true, tipo_atividade)"
                >
                  <v-icon color="primary">mdi-pencil-outline</v-icon>
                </v-btn>
              </template>
              <span>Editar</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  dark
                  large
                  v-on="on"
                  @click="remover(tipo_atividade.id)"
                >
                  <v-icon color="error">mdi-delete-forever-outline</v-icon>
                </v-btn>
              </template>
              <span>Remover</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="sn_carregando_tipos_atividade" justify="center" align="center">
      <v-progress-circular
        v-if="sn_carregando_tipos_atividade"
        :size="60"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-row>

    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-btn
          absolute
          dark
          fab
          right
          bottom
          fixed 
          x-large
          v-on="on"
          color="primary"
          style="margin-bottom: 80px; margin-right: 20px;"
          @click="abrirModal(false)"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Incluir</span>
    </v-tooltip>

    <CadastroTipoAtividade 
      v-if="show_modal_cadastro" 
      v-model="show_modal_cadastro"
      :sn-editar="sn_editar_registro"
      :obj-tipo-atividade="objTipoAtividade"
      @salvou-tipo-atividade="getDados()"
    />

  </v-container>

</template>

<script>
import mixinAlert from '../../mixins/mixinAlert';
import axios_ts from '../../axios-config';
import CadastroTipoAtividade from '../../components/CadastroTipoAtividade'; 

export default {
  name: 'TiposAtividade',
  components: {
    CadastroTipoAtividade
  },
  mixins: [
    mixinAlert
  ],

  data: () => ({
    
    sn_carregando_tipos_atividade: false,

    show_modal_cadastro: false,
    sn_editar_registro: false,

    objTipoAtividade: {},

    arrTiposAtividades: [],

  }),

  methods: {

    async getDados() {

      try {

        this.sn_carregando_tipos_atividade = true;

        const arrRetorno = await axios_ts.get('/tipo-atividade', {
            params: {
                equipe_id: localStorage.getItem('team')
            }
        });

        this.arrTiposAtividades = arrRetorno.data;

        this.sn_carregando_tipos_atividade = false;

      } catch (e) {

        this.mxAlertErroInesperado(e);
        this.sn_carregando_tipos_atividade = false;
      }

    },

    async remover(id) {

      try {

        this.sn_carregando_tipos_atividade = true;

        const retorno = await axios_ts.delete('/tipo-atividade', {
          data: {
            'id': id
          }
        });

        if (!retorno.data.status) {
            throw retorno.data.msg;
        }

        this.getDados();

      } catch(e) {
        this.mxAlertErroInesperado(e);
        this.sn_carregando_tipos_atividade = false;
      }

    },

    abrirModal: function(sn_editar, tipoAtividade = null) {

      this.sn_editar_registro = sn_editar;

      // Se for editar, passa os valores atuais do registro para o componente
      if (this.sn_editar_registro) {
        this.objTipoAtividade = {...tipoAtividade};
      }
      else {
        this.objTipoAtividade = {
          'id': null,
          'descricao': '',
          'color': '',
        };
      }

      this.show_modal_cadastro = true;

    }

  },

  async mounted() {
    await this.getDados();
  },
}
</script>