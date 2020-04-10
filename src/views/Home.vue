<template>
  <div>
    <v-app-bar
      app
      color="white"
      height="100"
    >
      <v-avatar
        class="mr-3"
        size="70"
        tile
      >
        <v-img
          contain
          max-height="70%"
          src="../assets/logo.png"
        ></v-img>
      </v-avatar>

      <v-toolbar-title class="font-weight-black headline hidden-xs-only">
        TEAM STATS
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <router-link to="/cadastrar" style="text-decoration: none;">
        <v-btn
          color="primary"
          outlined
          large
          class="ma-2"
        >
          <span class="gfont-weight-bold">
            Registrar
          </span>
        </v-btn>
      </router-link>

			<router-link to="/login" style="text-decoration: none;">
        <v-btn
          color="grey"
          outlined
          large
          class="ma-2"
        >
          <span class="grey--text text--darken-1 font-weight-bold">
            Entrar
          </span>
        </v-btn>
      </router-link>

    </v-app-bar>

    <v-content>

      <!-- Apresentação -->
      <section id="apresentacao">
        <v-row no-gutters>
          <v-img
            :min-height="'calc(100vh - ' + $vuetify.application.top + 'px)'"
            src="../assets/inicio/team.jpg"
            gradient="to bottom, rgba(0,0,0,.50), rgba(0,0,0,.90)"
          >
            <v-theme-provider dark>
              <v-container fill-height>
                <v-row
                  align="center"
                  class="white--text mx-auto"
                  justify="center"
                >
                  <v-col
                    class="white--text text-center"
                    cols="12"
                    tag="h1"
                  >
                    <span
                      :class="[$vuetify.breakpoint.smAndDown ? 'display-3': 'display-4']"
                      class="font-weight-black"
                    >
                      OTIMIZE A GESTÃO DOS SEUS TIMES
                    </span>
                    
                    <br>
                    
                    <span
                      class="font-weight-light"
                      :class="[$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-2']"
                    >
                      COM O MELHOR SOFTWARE DO MERCADO
                    </span>
                  </v-col>

                  <v-btn
                    class="align-self-end"
                    fab
                    outlined
                    @click="$vuetify.goTo('#features')"
                  >
                    <v-icon>mdi-chevron-double-down</v-icon>
                  </v-btn>
                </v-row>
              </v-container>
            </v-theme-provider>
          </v-img>
        </v-row>
      </section>

      <!-- Features -->
      <section
        id="features"
        class="grey lighten-3"
      >
        <div class="py-12"></div>

        <v-container class="text-center">
          <h2 class="display-2 font-weight-bold mb-3">FEATURES</h2>

          <v-responsive
            class="mx-auto mb-12"
            width="56"
          >
            <v-divider class="mb-1"></v-divider>
          </v-responsive>

          <v-row>
            <v-col
              v-for="({ icone, titulo, texto }, i) in features"
              :key="i"
              cols="12"
              md="4"
            >
              <v-card
                class="py-12 px-4"
                color="grey lighten-5"
                flat
              >
                <v-theme-provider dark>
                  <div>
                    <v-avatar
                      color="red darken-4"
                      size="88"
                    >
                      <v-icon
                        large
                        v-text="icone"
                      ></v-icon>
                    </v-avatar>
                  </div>
                </v-theme-provider>

                <v-card-title
                  class="justify-center font-weight-black text-uppercase"
                  v-text="titulo"
                ></v-card-title>

                <v-card-text
                  class="subtitle-1"
                  v-text="texto"
                >
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>

        <div class="py-12"></div>
      </section>

      <!-- Status -->
      <section id="status">
        <v-parallax
          :height="$vuetify.breakpoint.smAndDown ? 700 : 500"
          src="../assets/inicio/board.png"
        >
          <v-container fill-height>
            <v-row class="mx-auto">
              <v-col
                v-for="[valor, titulo] of status"
                :key="titulo"
                cols="12"
                md="3"
              >
                <div class="text-center black--text">
                  <div
                    class="display-3 font-weight-black mb-4"
                    v-text="valor"
                  ></div>

                  <div
                    class="title font-weight-regular text-uppercase"
                    v-text="titulo"
                  ></div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-parallax>
      </section>

      <!-- Sobre mim -->
      <section id="autor">
        <div class="py-12"></div>

        <v-container class="text-center">
          <h2 class="display-2 font-weight-bold mb-3">SOBRE MIM</h2>

          <v-responsive
            class="mx-auto mb-8"
            width="56"
          >
            <v-divider class="mb-1"></v-divider>
          </v-responsive>

          <v-responsive
            class="mx-auto title font-weight-light mb-8"
            max-width="720"
          >
            Meu nome é Gabriel Jensen Todesco, tenho 22 anos e sou graduando em Sistemas de Informação pela FURB - Universidade Regional de Blumenau.
            Atuo no mercado de TI desde 2014, quando iniciei na área de qualidade de software, que desenvolveu em mim um grande senso crítico em relação a um sistema e suas regras de negócio. Atualmente, trabalho como programador e gosto de explorar novas tecnologias, conhecer processos e aplicar as melhores práticas no desenvolvimento de um software.
            Sou um grande entusiasta de metodologias ágeis, tanto é que este é o tema deste projeto. Estou em constante aprendizado e acredito que a troca de experiências e conhecimentos seja a melhor forma para evoluirmos e contribuirmos para a sociedade, criando soluções que supram as necessidades do ecossistema ao nosso redor. 
          </v-responsive>

          <v-avatar
            class="elevation-12 mb-12"
            size="128"
          >
            <v-img src="../assets/inicio/gabriel.jpg"></v-img>
          </v-avatar>

          <div></div>

          <v-btn
            color="grey"
            href="https://github.com/gtodesco"
            outlined
            large
            target="_blank"
            class="ma-2"
          >
                 
            <span class="grey--text text--darken-1 font-weight-bold">
              <v-icon>mdi-github</v-icon>
              GitHub
            </span>
          </v-btn>

          <v-btn
            color="grey"
            href="https://www.linkedin.com/in/gabriel-jensen-todesco/"
            outlined
            large
            target="_blank"
            class="ma-2"
          >
            <span class="grey--text text--darken-1 font-weight-bold">
              <v-icon>mdi-linkedin</v-icon>
              LinkedIn
            </span>
          </v-btn>
        </v-container>

        <div class="py-12"></div>
      </section>

      <!-- Contato -->
      <v-sheet
        id="contato"
        color="#333333"
        dark
        tag="section"
        tile
      >
        <div class="py-12"></div>

        <v-container>
          <h2 class="display-2 font-weight-bold mb-3 text-uppercase text-center">Saiba mais</h2>

          <v-responsive
            class="mx-auto mb-12"
            width="56"
          >
            <v-divider class="mb-1"></v-divider>
          </v-responsive>

          <v-theme-provider light>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  flat
                  label="Nome*"
                  solo
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  flat
                  label="Email*"
                  solo
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  flat
                  label="Assunto*"
                  solo
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  flat
                  label="Mensagem*"
                  solo
                ></v-textarea>
              </v-col>

              <v-col
                class="mx-auto"
                cols="auto"
              >
                <v-btn
                  color="accent"
                  x-large
                  @click="enviarMensagem()"
                >
                  Enviar
                </v-btn>
              </v-col>
            </v-row>
          </v-theme-provider>
        </v-container>

        <div class="py-12"></div>
      </v-sheet>
    </v-content>

    <!-- Rodapé (copyright) -->
    <v-footer
      class="justify-center"
      color="#292929"
      height="100"
    >
      <div class="title font-weight-light grey--text text--lighten-1 text-center">
        &copy; 2020 — Team Stats, TS — by Gabriel Jensen Todesco
      </div>
    </v-footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    features: [
      {
        icone: 'mdi-account-group-outline',
        titulo: 'Gestão de equipes',
        texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto cupiditate sint possimus quidem atque harum excepturi nemo velit tempora! Enim inventore fuga, qui ipsum eveniet facilis obcaecati corrupti asperiores nam',
      },
      {
        icone: 'mdi-file-tree',
        titulo: 'Fluxo de atividades',
        texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto cupiditate sint possimus quidem atque harum excepturi nemo velit tempora! Enim inventore fuga, qui ipsum eveniet facilis obcaecati corrupti asperiores nam',
      },
      {
        icone: 'mdi-chart-line',
        titulo: 'Gráficos comparativos',
        texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto cupiditate sint possimus quidem atque harum excepturi nemo velit tempora! Enim inventore fuga, qui ipsum eveniet facilis obcaecati corrupti asperiores nam',
      },
      {
        icone: 'mdi-account-supervisor',
        titulo: 'Permissões por usuário',
        texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto cupiditate sint possimus quidem atque harum excepturi nemo velit tempora! Enim inventore fuga, qui ipsum eveniet facilis obcaecati corrupti asperiores nam',
      },
      {
        icone: 'mdi-cellphone-link',
        titulo: 'Multiplataforma',
        texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto cupiditate sint possimus quidem atque harum excepturi nemo velit tempora! Enim inventore fuga, qui ipsum eveniet facilis obcaecati corrupti asperiores nam',
      },
      {
        icone: 'mdi-currency-usd',
        titulo: 'Custo-benefício',
        texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto cupiditate sint possimus quidem atque harum excepturi nemo velit tempora! Enim inventore fuga, qui ipsum eveniet facilis obcaecati corrupti asperiores nam',
      },
    ],

    status: [
      ['60+', 'Clientes'],
      ['410+', 'Equipes gerenciadas'],
      ['1200+', 'Usuários'],
      ['28%', 'Aumento da produtividade'],
    ],
  }),
  methods: {
    enviarMensagem: function () {
      alert("Mensagem enviada!");
    }
  }
};
</script>