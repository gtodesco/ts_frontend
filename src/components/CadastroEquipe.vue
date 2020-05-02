<template>
  <v-row justify="center">
    <v-dialog 
        v-model="show"
        persistent
        max-width="600px"
        @click:outside="fecharModal()"
    >
      <v-card>
        <v-card-title>
            <span class="headline">Criar equipe</span>
        </v-card-title>
        <v-form 
            ref="form"
            v-model="valid"
            @submit.prevent="cadastrarEquipe()"
        >
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="12">
                            <v-text-field 
                                v-model="nome"
                                label="Nome"
                                :rules="[rules.required]"
                            />
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                    color="blue darken-1" 
                    text 
                    @click="fecharModal()"
                >
                    Cancelar
                </v-btn>
                <v-btn 
                    color="blue darken-1" 
                    text 
                    type="submit"
                    :loading="sn_carregando_equipe"
                    :disabled="!valid"
                >
                    Salvar
                </v-btn>
            </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    model: {
        prop: 'show',
        event: 'change-show'
    },
    name: 'CadastroEquipe',

    props: {
        show: {
            type: Boolean,
            default: false
        }
    },

    data: () => ({
        valid: true,    

        sn_carregando_equipe: false,

        nome: "",

        rules: {
            required: v => !!v || 'Obrigatório',
        },
    }),

    methods: {
        fecharModal: function () {
            this.$emit('change-show', false);
        },

        async cadastrarEquipe() {

            this.sn_carregando_equipe = true;

            setTimeout(() => {
                this.fecharModal();
            }, 3000);

        },
    },
  }
</script>
