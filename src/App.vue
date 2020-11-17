<template>
  <v-app>
    <v-navigation-drawer permanent app>
      <!--      -->
      <v-list-item link :to="home.link">
        <v-list-item-content>
          <v-list-item-title class="title">
            Home
          </v-list-item-title>
          <v-list-item-subtitle>
            subtext
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" link :to="item.link">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
    home: { link: '/' },
    items: [
      { title: 'Page1', icon: 'mdi-view-dashboard', link: '/page1' },
      { title: 'Page2', icon: 'mdi-view-dashboard', link: '/page2' },
      { title: 'Setup', icon: 'mdi-view-dashboard', link: '/setup' },
      { title: 'About', icon: 'mdi-help-box', link: '/about' }
    ]
  }),

  mounted: function () {
    const preferences = window.myAPI.loadPreferences()
    this.$store.state.preferences = preferences
    console.log('App: ', this.$store.state.preferences)
  }
}
</script>
