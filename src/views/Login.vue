<template>
  <div>
    <h2>ログイン</h2>
    <label for="email">Email：</label>
    <!-- v-modelでつなぐ -->
    <input type="email" id="email" v-model="email" />
    <br /><br />
    <label for="password">パスワード：</label>
    <!-- v-modelでつなぐ -->
    <input type="password" id="password" v-model="password" />
    <br /><br />
    <button @click="login">ログインする</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      //dispacthでデータを渡す
      this.$store.dispatch("login", {
        email: this.email,
        password: this.password,
      });
      this.email = "";
      this.password = "";
    },
  },
};
</script>

<style></style>
