<template>
    <v-select
        v-model="sprint_selecionada"
        :items="arrSprints"
        :menu-props="{ offsetY: true }"
        item-text="numero"
        item-value="id"
        clearable
        label="Sprint"
        :loading="sn_carregando_sprint"
        @change="selecionaSprint()"
    >
    </v-select>
</template>

<script>
import axios_ts from '../axios-config';
import mixinAlert from '../mixins/mixinAlert';

export default {
    model: {
        prop: 'sprint',
        event: 'change-sprint'
    },
    name: 'SelectSprint', 

    mixins: [
        mixinAlert
    ],

    props: {
        sprint: {
            default: null
        }
    },
    
    data: () => ({
        sn_carregando_sprint: false,

        sprint_selecionada: null,

        arrSprints: []
    }),

    methods: {

        async getSprints() {
            try {

                this.sn_carregando_sprint = true;

                const arrRetorno = await axios_ts.get('/sprint', {
                    params: {
                        equipe_id: localStorage.getItem('team')
                    }
                });

                this.arrSprints = arrRetorno.data;

                this.sn_carregando_sprint = false;

            } catch (e) {

                this.mxAlertErroInesperado(e);
                this.sn_carregando_sprint = false;
            }
        },

        selecionaSprint: function() {
            this.$emit('change-sprint', this.sprint_selecionada != undefined ? this.sprint_selecionada : null);
        }

    },

    async mounted() {
        await this.getSprints();
    },

    watch: {
        sprint: function(val) {

            if (val == this.sprint_selecionada) {
                return;
            }

            this.sprint_selecionada = val;
            this.selecionaSprint();
        }
    },

}
</script>