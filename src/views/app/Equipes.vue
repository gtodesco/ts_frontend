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
              <v-list-item-title>Gabriel Todesco</v-list-item-title>
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
      
      <!-- Preencher aqui as equipes -->

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

    <CadastroEquipe v-if="show_modal_equipe" v-model='show_modal_equipe' />

    <!-- Modal criar equipe (terá o componente de criação de equipe dentro dela -->
    
    <!-- Modal editar perfil (terá o componente de editar perfil dentro dela) -->

  </v-content>
</template>

<script>
import mixinFuncoesGerais from '../../mixins/mixinFuncoesGerais';
import { Auth } from 'aws-amplify';
// import axios_ts from '../../axios-config';
import CadastroEquipe from '../../components/CadastroEquipe'

export default {
  name: 'Equipes',
  components: {
    CadastroEquipe
  },
  mixins: [
    mixinFuncoesGerais
  ],
  
  data: () => ({

    item: null,
    drawer: false,
    show_modal_equipe: false,

    arrEquipes: [
      {
        "nome": "Fênix",
        "dt_ativacao": "25/08/2020",
        "dt_inativacao": null,
        "sn_ativa": true
      },
      {
        "nome": "Monster",
        "dt_ativacao": "15/02/2017",
        "dt_inativacao": null,
        "sn_ativa": true
      },
      {
        "nome": "Gestão",
        "dt_ativacao": "23/09/2018",
        "dt_inativacao": "30/11/2020",
        "sn_ativa": false
      },
    ],
  }),

  methods: {

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

    // const equipes = await axios_ts.get('/equipe');
    // console.log(equipes);

    // Get usuário by amazon id

  },

};
</script>