import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home.vue'
import NotFound from '../views/not-found/NotFound.vue'
import Login from '../views/login/Login.vue'
import EnvioSenha from '../views/login/EnvioSenha.vue'
import Cadastro from '../views/cadastro/Cadastro.vue'
import NovaSenha from '../views/cadastro/NovaSenha.vue'
import ConfirmaConta from '../views/cadastro/ConfirmaConta.vue'
import Equipes from '../views/app/Equipes.vue'
import Main from '../views/app/Main.vue'
import Atividades from '../views/app/Atividades.vue'
import Dashboard from '../views/app/Dashboard.vue'
import Impedimentos from '../views/app/Impedimentos.vue'
import Time from '../views/app/Time.vue'
import Retrospectivas from '../views/app/Retrospectivas.vue'
import Sprints from '../views/app/Sprints.vue'
import TiposAtividade from '../views/app/TiposAtividade.vue'
import Burndown from '../views/app/Burndown.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '*', // Caminho para quando for digitado uma url que não existe
    name: 'Inexistent',
    component: NotFound // Deve diretionar para uma tela de rota inválida
  },
  {
    path: '/index.html', // No Pwa, ao dar reload na página de login estava definindo a rota para o start do pwa.
    name: 'pwaStart',
    beforeEnter: (to, from, next) => {
      next('/login');
    }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('currentUserId') != "" && 
          localStorage.getItem('currentUserId') != null
      ){
        next('/equipes');
      }
      else {
        next();
      }
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('currentUserId') != "" && 
          localStorage.getItem('currentUserId') != null
      ){
        next('/equipes');
      }
      else {
        next();
      }
    }
  },
  {
    path: '/login/senha',
    name: 'Senha',
    component: EnvioSenha,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('currentUserId') != "" && 
          localStorage.getItem('currentUserId') != null
      ){
        next('/equipes');
      }
      else {
        next();
      }
    }
  },
  {
    path: '/cadastro',
    name: 'Cadastrar',
    component: Cadastro,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('currentUserId') != "" && 
          localStorage.getItem('currentUserId') != null
      ){
        next('/equipes');
      }
      else {
        next();
      }
    }
  },
  {
    path: '/nova-senha/:email',
    name: 'Nova senha',
    component: NovaSenha,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('currentUserId') != "" && 
          localStorage.getItem('currentUserId') != null
      ){
        next('/equipes');
      }
      else {
        next();
      }
    }
  },
  {
    path: '/confirma-conta/:email',
    name: 'Confirma conta',
    component: ConfirmaConta,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('currentUserId') != "" && 
          localStorage.getItem('currentUserId') != null
      ){
        next('/equipes');
      }
      else {
        next();
      }
    }
  },
  {
    path: '/equipes',
    name: 'Equipes',
    component: Equipes,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('currentUserId') == "" || 
          localStorage.getItem('currentUserId') == null
      ){
        next('/login');
      }
      else {
        next();
      }
    }
  },
  {
    path: '/main',
    component: Main,
    children: [
      { 
        path: '', 
        name:'Main',
        component: Dashboard,
        beforeEnter: (to, from, next) => {
          if (localStorage.getItem('currentUserId') == "" || 
              localStorage.getItem('currentUserId') == null
          ){
            next('/login');
          }
          else {
            next();
          }
        } 
      },
      { 
        path: 'dashboard', 
        name:'Dashboard',
        component: Dashboard,
        beforeEnter: (to, from, next) => {
          if (localStorage.getItem('currentUserId') == "" || 
              localStorage.getItem('currentUserId') == null
          ){
            next('/login');
          }
          else {
            next();
          }
        }
      },
      { 
        path: 'burndown', 
        name:'Burndown',
        component: Burndown,
        beforeEnter: (to, from, next) => {
          if (localStorage.getItem('currentUserId') == "" || 
              localStorage.getItem('currentUserId') == null
          ){
            next('/login');
          }
          else {
            next();
          }
        }
      },
      { 
        path: 'atividades', 
        name:'Atividades',
        component: Atividades,
        beforeEnter: (to, from, next) => {
          if (localStorage.getItem('currentUserId') == "" || 
              localStorage.getItem('currentUserId') == null
          ){
            next('/login');
          }
          else {
            next();
          }
        }
      },
      { 
        path: 'impedimentos', 
        name:'Impedimentos',
        component: Impedimentos,
        beforeEnter: (to, from, next) => {
          if (localStorage.getItem('currentUserId') == "" || 
              localStorage.getItem('currentUserId') == null
          ){
            next('/login');
          }
          else {
            next();
          }
        }
      },
      { 
        path: 'time', 
        name:'Times',
        component: Time,
        beforeEnter: (to, from, next) => {
          if (localStorage.getItem('currentUserId') == "" || 
              localStorage.getItem('currentUserId') == null
          ){
            next('/login');
          }
          else {
            next();
          }
        }
      },
      { 
        path: 'retrospectivas',
        name:'Retrospectivas', 
        component: Retrospectivas,
        beforeEnter: (to, from, next) => {
          if (localStorage.getItem('currentUserId') == "" || 
              localStorage.getItem('currentUserId') == null
          ){
            next('/login');
          }
          else {
            next();
          }
        }
      },
      { 
        path: 'sprints', 
        name:'Sprints',
        component: Sprints,
        beforeEnter: (to, from, next) => {
          if (localStorage.getItem('currentUserId') == "" || 
              localStorage.getItem('currentUserId') == null
          ){
            next('/login');
          }
          else {
            next();
          }
        }
      },
      { 
        path: 'tipos-atividade', 
        name:'TiposAtividade',
        component: TiposAtividade,
        beforeEnter: (to, from, next) => {
          if (localStorage.getItem('currentUserId') == "" || 
              localStorage.getItem('currentUserId') == null
          ){
            next('/login');
          }
          else {
            next();
          }
        }
      },
    ],
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('currentUserId') == "" || 
          localStorage.getItem('currentUserId') == null
      ){
        next('/login');
      }
      else {
        next();
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router