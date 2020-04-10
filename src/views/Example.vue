<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <ComponentExample msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import ComponentExample from '@/components/ComponentExample.vue'

export default {
  name: 'Home',
  components: {
    ComponentExample
  }
}
</script>
