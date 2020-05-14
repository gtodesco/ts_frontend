<template>
  <v-content>
    
    <v-card
      class="mx-auto overflow-hidden"
      height="100%"
    >
      <v-app-bar
        color="primary"
        dark
        app
      >
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
        <v-toolbar-title>Equipes</v-toolbar-title>
      </v-app-bar>

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

          <v-divider></v-divider>

          <v-list-item-group v-model="item">
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
            v-if="arrEquipes.length == 0"
            cols="12" 
            sm="12"
          >
            <v-alert 
              type="info"
              text
            >
              Você não pertence à nenhuma equipe. Cadastre uma agora mesmo!
            </v-alert>
          </v-col>
          <v-col
            v-else-if="arrEquipes.length > 0"
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

                <div 
                  v-if="equipe.equipes_pessoas.sn_scrummaster"
                  style="max-width: 120px;"
                >
                  <v-chip
                    class="ma-2"
                    :color="equipe.sn_ativa ? 'green' : 'grey lighten-1'"
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
                  @click="entrar(equipe.id, equipe.equipes_pessoas.sn_scrummaster)"
                >
                  Entrar
                </v-btn>
                <v-btn
                  v-if="equipe.sn_ativa && equipe.equipes_pessoas.sn_scrummaster" 
                  color="error" 
                  text
                  @click="alteraStatusEquipe(equipe.id, equipe.sn_ativa)"
                  :loading="sn_alterando_status_equipe"
                >
                  Desativar
                </v-btn>
                <v-btn
                  v-if="!equipe.sn_ativa && equipe.equipes_pessoas.sn_scrummaster" 
                  color="primary" 
                  text
                  @click="alteraStatusEquipe(equipe.id, equipe.sn_ativa)"
                  :loading="sn_alterando_status_equipe"
                >
                  Ativar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="sn_carregando_equipes" justify="center" align="center">
          <v-progress-circular
            v-if="sn_carregando_equipes"
            :size="60"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-row>

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
import moment from 'moment';

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
    sn_alterando_status_equipe: false,

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

    async alteraStatusEquipe(equipe_id, status) {
      try {

        this.sn_alterando_status_equipe = true;

        let objEquipe = {
          'id': equipe_id,
          'sn_ativa': !status
        }

        /**
         * Se o status atual for ativa, significa que vai desativar a equipe. 
         * Com isso, deve enviar a data de desativacao para a API
         * Se o status atual for inativa, significa que vai ativar.
         * Com isso, deve enviar a data de ativação para API e apagar a data de desativação
         */ 
        if (status == true) {
          objEquipe['dt_desativacao'] = this.mxGetDataBd(moment());
        }
        else if (status == false) {
          objEquipe['dt_ativacao'] = this.mxGetDataBd(moment());
          objEquipe['dt_desativacao'] = null;
        }

        const retorno = await axios_ts.put('/equipe', objEquipe);

        if (!retorno.data.status) {
            throw retorno.data.msg;
        }

        this.sn_alterando_status_equipe = false;

        this.getDados();

      } catch(e) {
        this.mxAlertErroInesperado(e);
        this.sn_alterando_status_equipe = false;
      }
    },

    async entrar(equipe_id, sn_scrummaster) {
      localStorage.setItem('team', equipe_id);
      localStorage.setItem('scm', sn_scrummaster);
      this.mxIrPara('main');
    },

    async sair() {
      await Auth.signOut();
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('team');
      localStorage.removeItem('scm');
      this.mxIrPara('login');
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