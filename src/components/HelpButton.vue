<template>
    <div>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn
                    icon
                    dark
                    x-small
                    v-on="on"
                    @click="show = true"
                >
                    <v-icon color="grey lighten-1">
                        mdi-help-circle
                    </v-icon>
                </v-btn>
            </template>
            <span>Ajuda</span>
        </v-tooltip>

        <v-dialog 
            v-model="show"
            max-width="600px"
            @click:outside="show = false"
        >
            <v-card>
                <v-card-title>
                    <span class="headline">{{tela}}</span>
                </v-card-title>
                <v-card-text>
                    <p class="text-justify">
                        {{help}}
                    </p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn 
                        color="blue darken-1" 
                        text 
                        @click="show = false"
                    >
                        Ok, entendi!
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {

    name: 'HelpButton',

    props: {
        tela: {
            type: String,
            default: ''
        },
        help: {
            type: String,
            default: ''
        },
    },

    data: () => ({
        show: false
    }),

}
</script>