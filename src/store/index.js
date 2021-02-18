import Vue from "vue";
import Vuex from "vuex"; //vuexインポート
import axios from "../axios-auth"; //axiosのインポート
import router from "../router"; //routerのインポート
import axiosRefresh from "../axios-refresh"; //axios-refreshのインポート

Vue.use(Vuex); //vuexの宣言

//vuexインスタンス化
export default new Vuex.Store({
  state: {
    //初期値をnullに
    idToken: null,
  },
  //取得しやすい様にgetterを作る
  getters: {
    idToken: (state) => state.idToken,
  },
  //mutationsで追跡する
  mutations: {
    updateIdToken(state, idToken) {
      state.idToken = idToken;
    },
  },
  actions: {
    //ローカルストレージに保存しているidTokenを取得して描画する
    async autoLogin({ commit, dispatch }) {
      //getItemで取得する
      const idToken = localStorage.getItem("idToken");
      //idTokenがなかった際の処理
      if (!idToken) return;
      //今の時間の取得
      const now = new Date();
      //有効期限が切れているTokenかどうかを確認する
      const expiryTimeMs = localStorage.getItem("expiryTimeMs");
      //expiryTimeMsより今の時間が切れている時
      const isExpired = now.getTime() >= expiryTimeMs;
      //ローカルストレージにあるrefreshTokenを代入
      const refreshToken = localStorage.getItem("refreshToken");
      if (isExpired) {
        await dispatch("refreshIdToken", refreshToken);
      } else {
        //残り時間に応じた対応
        const expiresInMs = expiryTimeMs - now.getTime();
        setTimeout(() => {
          dispatch("refreshIdToken", refreshToken);
        }, expiresInMs);
        //idTokenがあったらupdateIdTokenのmutationsを実行してidTokenを渡す
        commit("updateIdToken", idToken);
      }
    },
    login({ dispatch }, authData) {
      axios
        .post(
          "/accounts:signInWithPassword?key=AIzaSyAoH3GQfdvjmtFL2Ortw65Dow-immPpVaM",
          {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true,
          }
        )
        //ログインした時にもらえるデータ↓
        .then((responce) => {
          //setAuthDataにまとめた処理を使う
          dispatch("setAuthData", {
            idToken: responce.data.idToken,
            expiresIn: responce.data.expiresIn,
            refreshToken: responce.data.refreshToken,
          });
          router.push("/");
        });
    },
    logout({ commit }) {
      //IdTokenをnullにする
      commit("updateIdToken", null);
      //ローカルストレージの中のデータを消す
      localStorage.removeItem("idToken");
      localStorage.removeItem("expiryTimeMs");
      localStorage.removeItem("refreshToken");
      router.replace("/login");
    },
    //refreshTokeを使って１時間後にTokenをレフレッシュさせる処理
    async refreshIdToken({ dispatch }, refreshToken) {
      await axiosRefresh
        //refreshTokenのデータをつかって１時間後にログアウトしない様にする
        .post("/token?key=AIzaSyAoH3GQfdvjmtFL2Ortw65Dow-immPpVaM", {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        })
        .then((responce) => {
          //setAuthDataにまとめた処理を使う
          dispatch("setAuthData", {
            //refreshTokenのときは_アンダースコアで返ってくるので間違えない様にする
            idToken: responce.data.id_token,
            expiresIn: responce.data.expires_in,
            refreshToken: responce.data.refresh_token,
          });
        });
    },

    register({ dispatch }, authData) {
      axios
        .post("/accounts:signUp?key=AIzaSyAoH3GQfdvjmtFL2Ortw65Dow-immPpVaM", {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true,
        })
        .then((responce) => {
          //setAuthDataにまとめた処理を使う
          dispatch("setAuthData", {
            idToken: responce.data.idToken,
            expiresIn: responce.data.expiresIn,
            refreshToken: responce.data.refreshToken,
          });
          //掲示板に移動する
          router.push("/");
        });
    },
    setAuthData({ commit, dispatch }, authData) {
      //いつidTokenの有効期限が切れるかを知る
      const now = new Date();
      //今の時刻＋有効期限の１時間後の時間（秒）
      const expiryTimeMs = now.getTime() + authData.expiresIn * 1000;
      //返っていたデータをコミットする
      //idTokenをアップデートする
      commit("updateIdToken", authData.idToken);
      //取得してきたidTokenをローカルストレージに保存する
      localStorage.setItem("idToken", authData.idToken);
      //expiryTimeMsでとってきた時間をローカルストレージに保存
      localStorage.setItem("expiryTimeMs", expiryTimeMs);
      //refreshTokenもローカルストレージに保存しておく
      localStorage.setItem("refreshToken", authData.refreshToken);
      setTimeout(() => {
        //refreshTokeを使って１時間後にTokenをレフレッシュさせる
        dispatch("refreshIdToken", authData.refreshToken);
      }, authData.expiresIn * 1000); //１時間後
      //掲示板に移動する
    },
  },
});
