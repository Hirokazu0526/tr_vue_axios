import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

//共通のURLがある時に、あらかじめ共通部分を設定しておく
axios.defaults.baseURL =
  "https://firestore.googleapis.com/v1/projects/tr-vue-http/databases/(default)/documents";

//サーバーに送る時に、その途中で処理したい場合
//.use()はidの様な値を返している
axios.interceptors.request.use(
  // const interceptorsReqest = axios.interceptors.request.use(
  (config) => {
    //処理を書く
    // console.log("interceptors reqest", config);
    return config;
  },
  (error) => {
    //catchにつなげる
    return Promise.reject(error);
  }
);

//サーバーから返ってきて、受け渡す前に途中で処理したい場合
axios.interceptors.response.use(
  // const interceptorsResponse = axios.interceptors.response.use(
  (response) => {
    //処理を書く
    // console.log("interceptors response", response);
    return response; //responseに返す
  },
  (error) => {
    return Promise.reject(error);
  }
);

//取り消す作業
// axios.interceptors.request.eject(interceptorsReqest);
// axios.interceptors.response.eject(interceptorsResponse);

//index.jsのactionのautoLoginが最初に実行される
store.dispatch("autoLogin").then(() => {
  new Vue({
    render: (h) => h(App),
    router,
    store,
  }).$mount("#app");
});
