<template>
  <div id="app">
    <header>
      <!-- isAuthenticatedがnullじゃない時に表示する -->
      <template v-if="isAuthenticated">
        <router-link to="/" class="header-item">掲示板</router-link>
        <span class="header-item" @click="logOut">ログアウト</span> </template
      ><!-- isAuthenticatedがnullじゃない時に表示する -->

      <!-- isAuthenticatedがnullの時に表示する -->
      <template v-if="!isAuthenticated">
        <router-link to="/login" class="header-item">ログイン</router-link>
        <router-link to="/register" class="header-item"
          >登録</router-link
        > </template
      ><!-- isAuthenticatedがnullの時に表示する -->
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      //トークンに文字が入っている時
      return this.$store.getters.idToken !== null;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch("logout");
    },
  },
};
</script>

<style scoped>
.header-item {
  padding: 10px;
  cursor: pointer;
}
</style>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
