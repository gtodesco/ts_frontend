<template>
    <v-app>
        <v-navigation-drawer 
            v-model="drawer"
            app 
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

                <v-list-item-group v-model="item">
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>mdi-account-edit-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Perfil</v-list-item-title>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item @click="mxIrPara('main/dashboard')">
                        <v-list-item-icon>
                            <v-icon>mdi-view-dashboard-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Dashboard</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="mxIrPara('main/time')">
                        <v-list-item-icon>
                            <v-icon>mdi-account-group-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Time</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="mxIrPara('main/atividades')">
                        <v-list-item-icon>
                            <v-icon>mdi-card-text-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Atividades</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="mxIrPara('main/sprints')">
                        <v-list-item-icon>
                            <v-icon>mdi-calendar-month-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Sprints</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="mxIrPara('main/impedimentos')">
                        <v-list-item-icon>
                            <v-icon>mdi-clock-alert-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Impedimentos</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="mxIrPara('main/retrospectivas')">
                        <v-list-item-icon>
                            <v-icon>mdi-calendar-clock</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Retrospectivas</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="mxIrPara('main/tipos-atividade')">
                        <v-list-item-icon>
                            <v-icon>mdi-tag-multiple-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Tipos de atividade</v-list-item-title>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item @click="mxIrPara('equipes')">
                        <v-list-item-icon>
                            <v-icon >mdi-table</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Equipes</v-list-item-title>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item @click="sair()" color="red">
                        <v-list-item-icon>
                            <v-icon color="red">mdi-logout</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title style="color: red">Sair</v-list-item-title>
                    </v-list-item>

                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar 
            app
            color="primary"
            dark
        >
            <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
            <v-toolbar-title>{{nomeEquipe}}</v-toolbar-title>
        </v-app-bar>

        <v-content>

            <v-container fluid>

            <router-view></router-view>
            </v-container>
        </v-content>

    </v-app>
</template>

<script>
import mixinFuncoesGerais from '../../mixins/mixinFuncoesGerais';
import mixinAlert from '../../mixins/mixinAlert';
import { Auth } from 'aws-amplify';
import axios_ts from '../../axios-config';

export default {
  name: 'Main',
  mixins: [
      mixinFuncoesGerais,
      mixinAlert
  ],

  props: {
  },
  
  data: () => ({

      drawer: false,
      item: null,

      sn_carregando_pessoa: false,

      nomeEquipe: '',  
      nomePessoa: '',
      emailPessoa: '',

  }),

  methods: {

    async getDados() {

        try {

            this.sn_carregando_pessoa = true;

            const arrRetorno = await axios_ts.get('/pessoa/get-pessoa', {
                params: {
                    cd_amazon: localStorage.getItem('currentUserId')
                }
            });

            this.nomePessoa = arrRetorno.data[0].nome;
            this.emailPessoa = arrRetorno.data[0].email;

            const arrRetornoEquipes = await axios_ts.get('/equipe/pessoa', {
                params: {
                    equipe_id: localStorage.getItem('team')
                }
            });

            this.nomeEquipe = arrRetornoEquipes.data.nome;

            this.sn_carregando_pessoa = false;

        } catch (e) {
            this.mxAlertErroInesperado(e);
            this.sn_carregando_pessoa = false;
        }

    },

    async sair() {
        await Auth.signOut();
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('team');
        this.mxIrPara('login');
    },

  },

  async mounted() {
        await this.getDados();
  },

};
</script>