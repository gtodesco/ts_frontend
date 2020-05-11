<template>
  <v-container>
    
    <h1 class="headline">Impedimentos</h1>

    <br>

    <v-row>
      <v-col 
        cols="12"
        sm="12"
        md="4"
      >
        <SelectSprint
          v-model="sprint_selecionada"
        />

      </v-col>
    </v-row>


  </v-container>
</template>

<script>
import SelectSprint from '../../components/SelectSprint'; 

export default {
  name: 'Impedimentos',
  components: {
    SelectSprint
  },

  data: () => ({

    sprint_selecionada: null,
    
  }),
}
</script>