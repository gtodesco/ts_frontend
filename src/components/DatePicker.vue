<template>

    <v-menu
        ref="menu1"
        v-model="menu1"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
    >
        <template v-slot:activator="{ on }">
        <v-text-field
            v-model="dateFormatted"
            :label="label"
            prepend-icon="mdi-calendar"
            v-on="on"
            readonly
            :rules="rules"
        ></v-text-field>
        </template>
        <v-date-picker 
          v-model="date" 
          no-title 
          @input="menu1 = false"
          locale="pt-br"
      ></v-date-picker>
    </v-menu>

</template>

<script>
import mixinFuncoesGerais from '../mixins/mixinFuncoesGerais';
import moment from 'moment';

export default {
    model: {
        prop: 'data',
        event: 'change-date'
    },

    mixins: [
      mixinFuncoesGerais
    ],

    name: 'DatePicker',

    props: {
        data: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: ''
        },
        rules: {
          type: Array,
          default: () => {
            return [];
          }
        }
    },

    data: vm => ({
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      menu1: false,
    }),

    computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
      },
    },

    watch: {
      date (val) {
        this.dateFormatted = this.formatDate(val);
        this.$emit('change-date', this.mxGetDataBd(moment(val)));
      },
    },

    methods: {
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },

      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
    },

    mounted() {
      if (this.data != "") {
        this.date = this.data;
      }
    }

}
</script>