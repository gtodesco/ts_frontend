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

Vue.use(VueRouter)

const routes = [
  {
    path: '*', // Caminho para quando for digitado uma url que não existe
    name: 'Inexistent',
    component: NotFound // Deve diretionar para uma tela de rota inválida
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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router