<template>
  <v-content>
    
    <v-card
      class="mx-auto overflow-hidden"
      height="100%"
    >
      <v-app-bar
        color="primary"
        dark
      >
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
        <v-toolbar-title>Equipes</v-toolbar-title>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
      >
        <v-list
          nav
          dense
        >
          <v-list-item>

            <v-list-item-avatar>
              <v-img src="../../assets/avatar.jpg"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{nomePessoa}}</v-list-item-title>
              <v-list-item-subtitle>{{emailPessoa}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item-group v-model="item">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title @click="editarPerfil()">Perfil</v-list-item-title>
            </v-list-item>
            <v-list-item @click="sair()" color="red">
              <v-list-item-icon>
                <v-icon color="red">mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title style="color: red">Sair</v-list-item-title>
            </v-list-item>
          </v-list-item-group>

        </v-list>
      </v-navigation-drawer>
      
      <v-container>
        <v-row v-if="!sn_carregando_equipes">
          <v-col
            v-for="(equipe, i) in arrEquipes"
            :key="i"
            cols="12"
          >
            <v-card 
              :outlined="!equipe.sn_ativa"
            >
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title
                    class="headline"
                    v-text="equipe.nome"
                  ></v-card-title>

                  <v-card-subtitle v-if="equipe.sn_ativa" v-text="'Ativada em: ' + mxFormataDataBd(equipe.dt_ativacao)"></v-card-subtitle>
                  <v-card-subtitle v-if="!equipe.sn_ativa" v-text="'Desativada em: ' + mxFormataDataBd(equipe.dt_desativacao)"></v-card-subtitle>
                </div>

                <div v-if="equipe.equipes_pessoas.sn_scrummaster">
                  <v-chip
                    class="ma-2"
                    color="green"
                    outlined
                    label
                    small
                  >
                    Scrum Master
                  </v-chip>
                </div>
              </div>
              <v-card-actions>
                <v-btn
                  v-if="equipe.sn_ativa" 
                  color="primary" 
                  text
                >
                  Entrar
                </v-btn>
                <v-btn
                  v-if="!equipe.sn_ativa" 
                  color="primary" 
                  text
                >
                  Ativar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-progress-circular
          v-if="sn_carregando_equipes"
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>

      </v-container>

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
            @click="incluirEquipe()"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Incluir equipe</span>
      </v-tooltip>
    </v-card>

    <CadastroEquipe 
      v-if="show_modal_equipe" 
      v-model="show_modal_equipe"
      @nova-equipe="getDados()"
    />

    <!-- Modal editar perfil (terá o componente de editar perfil dentro dela) -->

  </v-content>
</template>

<script>
import mixinFuncoesGerais from '../../mixins/mixinFuncoesGerais';
import mixinAlert from '../../mixins/mixinAlert';
import { Auth } from 'aws-amplify';
import axios_ts from '../../axios-config';
import CadastroEquipe from '../../components/CadastroEquipe';

export default {
  name: 'Equipes',
  components: {
    CadastroEquipe
  },
  mixins: [
    mixinFuncoesGerais,
    mixinAlert
  ],
  
  data: () => ({

    item: null,
    drawer: false,
    
    show_modal_equipe: false,

    sn_carregando_equipes: false,

    nomePessoa: "",
    emailPessoa: "",
    arrEquipes: [],

  }),

  methods: {

    async getDados() {

      try {

        this.sn_carregando_equipes = true;

        const arrRetorno = await axios_ts.get('/pessoa/get-equipes-pessoa', {
          params: {
            cd_amazon: localStorage.getItem('currentUserId')
          }
        });

        this.nomePessoa = arrRetorno.data[0].nome;
        this.emailPessoa = arrRetorno.data[0].email;
        this.arrEquipes = arrRetorno.data[0].equipes;

        this.sn_carregando_equipes = false;

      } catch (e) {

        this.mxAlertErroInesperado(e);
        this.sn_carregando_equipes = false;
      }
    },

    async sair() {
      await Auth.signOut();
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('jwtToken');
      this.mxIrPara('login');
    },

    async editarPerfil() {
      console.log('editar perfil');
    },

    async incluirEquipe() {
      this.show_modal_equipe = true;
    },

  },

  async mounted() {

    await this.getDados();

  },

};
</script>