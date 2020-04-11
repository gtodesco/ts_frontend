import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home.vue'
import Login from '../views/login/Login.vue'
import Cadastro from '../views/cadastro/Cadastro.vue'
import App from '../views/app/App.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '*', // Caminho para quando for digitado uma url que não existe
    name: 'Inexistent',
    component: Home
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/cadastro',
    name: 'Cadastrar',
    component: Cadastro
  },
  {
    path: '/app',
    name: 'App',
    component: App
  }
]

// Rota /app para dentro do aplicativo???

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
