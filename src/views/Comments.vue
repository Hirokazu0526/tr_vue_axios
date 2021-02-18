<template>
  <div>
    <h3>掲示板に投稿す</h3>
    <label for="name">ニックネーム：</label>
    <!-- v-modelでつなぐ -->
    <input type="text" name="" id="name" v-model="name" />
    <br /><br />
    <label for="comment">コメント：</label>
    <!-- v-modelでつなぐ -->
    <textarea id="comment" v-model="comment"></textarea
    ><!-- /# -->
    <br /><br />
    <button @click="creatComment">コメントをサーバーに送る</button>
    <h2>掲示板</h2>
    <div v-for="post in posts" :key="post.name">
      <div>名前：{{ post.fields.name.stringValue }}</div>
      <div>コメント：{{ post.fields.comment.stringValue }}</div>
      <br />
    </div>
  </div>
</template>

<script>
import axios from "axios";
//axiosのカスタムインスタンス
// import axios from "./axios-auth";

export default {
  data() {
    return {
      name: "",
      comment: "",
      posts: [],
    };
  },
  //index.jsのgetterから取得
  computed: {
    idToken() {
      return this.$store.getters.idToken;
    },
  },
  created() {
    axios
      //データをcreatedのフックの時に取得
      .get("/comments", {
        //idTokenをくっつけるためにheaderに入れてidTokenを送る
        headers: {
          Authorization: `Bearer ${this.idToken}`,
        },
      })
      //getしたデータを受け取る
      .then((response) => {
        //data:{post:[]}の中にデータを配列で代入する
        this.posts = response.data.documents;
        //cathをつなげる場合
        // }).catch(error => {処理});
      });
  },
  methods: {
    creatComment() {
      //dataを送る時はpost methodsを使う
      axios.post(
        //第一引数に送るURL
        "/comments",
        //第二引数に送るデータ
        {
          //cloudfirebaseの例
          fields: {
            name: {
              //型を指定する
              stringValue: this.name,
            },
            comment: {
              //型を指定する
              stringValue: this.comment,
            },
          },
        },
        //第三引数にheadersを入れる
        {
          headers: {
            Authorization: `Bearer ${this.idToken}`,
          },
        }
      );
      //送った結果を返す(プロミス)
      // .then((response) => {
      //   console.log(response);
      // })
      //エラーの場合
      // .catch((error) => {
      //   console.log(error);
      // });
      this.name = "";
      this.comment = "";
    },
  },
};
</script>

<style></style>
