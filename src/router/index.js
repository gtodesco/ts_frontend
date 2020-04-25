import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home.vue'
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
    component: Home // Deve diretionar para uma tela de rota inválida
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login/senha',
    name: 'Senha',
    component: EnvioSenha,
  },
  {
    path: '/cadastro',
    name: 'Cadastrar',
    component: Cadastro,
  },
  {
    path: '/nova-senha',
    name: 'Nova senha',
    component: NovaSenha,
  },
  {
    path: '/confirma-conta/:email',
    name: 'Confirma conta',
    component: ConfirmaConta,
  },
  {
    path: '/equipes',
    name: 'Equipes',
    component: Equipes
  }
]

// Rota /app para dentro do aplicativo???

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach( (to, from, next) => {

    console.log(localStorage.getItem('currentUserId'));
    console.log(localStorage.getItem('jwtToken'));

    console.log('to', to);
    console.log('from', from);
    console.log('next', next);

    next();

  // if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  // else next()
})

export default router