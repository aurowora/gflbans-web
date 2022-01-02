<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
  <template v-if="loggedIn">
    <a class="navbar-item" v-on:click="logOut">
        <span class="icon-text">
            <span class="icon">
                <font-awesome-icon icon="sign-out" />
            </span>
            <span class="is-hidden-desktop">Log Out</span>
        </span>
    </a>
  </template>
  <template v-else>
    <a class="navbar-item" v-on:click="beginLogin">
      <span class="icon-text">
        <span class="icon">
          <font-awesome-icon icon="right-to-bracket" />
        </span>
        <span>Log In</span>
      </span>
    </a>
  </template>
</template>

<script lang="ts">
import { EncodingError, GFLBansError, HTTPError, NetworkError } from "@/errors";
import { check_login, fetch_login_data, log_out } from "@/gflbans/login";
import { Vue } from "vue-class-component";

export default class LogInOutButton extends Vue {
  get loggedIn() {
    return this.$store.getters.isLoggedIn;
  }

  async getLoginInfo() {
    let li = await fetch_login_data();

    if (
      li instanceof HTTPError ||
      li instanceof EncodingError ||
      li instanceof NetworkError
    ) {
      this.$store.commit("setError", li);
      return;
    } else {
      // Login Data
      var [uri, state, pkce] = await li.uri();
    }

    localStorage.setItem("oauth_state", state);
    localStorage.setItem("oauth_pkce", pkce);

    window.location.href = uri;
  }

  beginLogin() {
    let thisRed = this;

    console.log("Begin login process");

    this.getLoginInfo().catch(function (e) {
      thisRed.$store.commit("setError", new GFLBansError(e));
    });
  }

  logOut() {
      const store = this.$store;
      const router = this.$router;
      store.commit('setLoading', true);

      log_out().then(function (r) {
          if (r instanceof HTTPError || r instanceof NetworkError)
          {
              store.commit('setError', r);
              return;
          }

          if (router.currentRoute.value.path.startsWith('/manage'))
          {
            // Can't be here
            router.push('/home').finally(function () {
              console.log('Navigating home...');
            });
          }
      }).catch(function (e) {
          store.commit('setError', new GFLBansError(e));
      }).finally(function () {
          store.commit('setLoading', false);
          check_login(store);
      })
  }
}
</script>
