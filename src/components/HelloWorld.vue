<template>
<div>
  Home
  <v-btn color="primary" @click="openDirectory">Browse</v-btn>
  <v-btn color="primary" @click="openFile">Load</v-btn>
  <v-btn color="primary" @click="loadPreferences">Preferences</v-btn>
</div>
</template>

<script>
export default {
  name: 'HelloWorld',

  data: () => ({
  }),

  methods: {
    openDirectory () {
      const result = window.myAPI.openDirectory()
      console.log(result)
    },
    openFile () {
      const result = window.myAPI.openFile()
      console.log(result)
    },
    loadPreferences () {
      const result = window.myAPI.loadPreferences()
      console.log(result)
    }
  }
}
</script>
