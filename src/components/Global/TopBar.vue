<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
  <nav :class="[$store.getters.isThemeClass]" class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link class="navbar-item" :active-class="$screen.width < 1023 ? 'is-active-m' : 'is-active'" to="/home">
        <span class="icon-text">
          <span class="icon is-medium">
            <font-awesome-icon icon="gavel" size="2x" />
          </span>
          <span id="logoText" class="is-size-4 has-text-weight-bold">{{APP_NAME}}</span>
        </span>
      </router-link>
      <a role="button" :class="{ 'is-active': nav_open }" class="navbar-burger is-hidden-desktop  " aria-label="menu" aria-expanded="false" v-on:click="toggleMenu">
          <template v-if="loggedIn">
            <img id="avImg1" :src="avatar" />
          </template>
          <template v-else>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </template>
      </a>
    </div>

    <div :class="{ 'is-active': nav_open }" class="navbar-menu">
      <div class="navbar-start">
        <!--Add an extra home entry for mobile devices-->
        <router-link to="/home" active-class="is-active" class="is-hidden-desktop navbar-item">
          <span class="icon-text">
            <span class="icon">
              <font-awesome-icon icon="home" />
            </span>
            <span class="lab">Home</span>
          </span>
        </router-link>
        <router-link to="/servers" active-class="is-active" class="navbar-item">
          <span class="icon-text">
            <span class="icon">
              <font-awesome-icon icon="server" />
            </span>
            <span class="lab">Servers</span>
          </span>
        </router-link>
        <router-link
          to="/infractions"
          active-class="is-active"
          class="navbar-item">
          <span class="icon-text">
            <span class="icon">
              <font-awesome-icon icon="exclamation-triangle" />
            </span>
            <span class="lab">Infractions</span>
          </span>
        </router-link>
        <router-link
          v-if="isAdmin"
          to="/manage"
          active-class="is-active"
          class="navbar-item">
          <span class="icon-text">
            <span class="icon">
              <font-awesome-icon icon="user-shield" />
            </span>
            <span class="lab">Manage</span>
          </span>
        </router-link>
      </div>
      <div class="navbar-end">
        <UserButton v-if="loggedIn" class="navbar-item is-hidden-touch"></UserButton>
        <LogInOutButton></LogInOutButton>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { APP_NAME, INSTANCE } from "@/config";
import UserButton from "@/components/Global/UserButton.vue";
import LogInOutButton from "@/components/Global/LogInOutButton.vue";

@Options({
  components: {
    UserButton,
    LogInOutButton,
  },
})
export default class TopBar extends Vue {
  APP_NAME = APP_NAME;
  nav_open = false;

  get loggedIn()
  {
    return this.$store.getters.isLoggedIn;
  }

  get avatar()
  {
    if (this.$store.state.current_user && this.$store.state.current_user.avatar_id) {
      return `${INSTANCE}file/uploads/${this.$store.state.current_user.avatar_id}/avatar.webp`;
    } else {
      return "@/images/default_avatar.webp";
    }
  }

  get isAdmin() 
  {
    return this.$store.getters.isAdmin;
  }

  toggleMenu() 
  {
    this.nav_open = !this.nav_open;
  }
}
</script>

<style scoped>
#logoText {
  font-family: "Montserrat-Bold", sans-serif;
}

.navbar-menu > .navbar-start, .navbar-end > a,div,a > span > span {
  font-family: "Montserrat-Regular", sans-serif;
}

.navbar-menu > .navbar-start, .navbar-end > a.is-active, a.is-active > span > span {
  font-family: "Montserrat-Medium", sans-serif;
}

.navbar-menu > .navbar-start,
.navbar-end > a:hover,
a:hover > span > span {
  font-family: "Montserrat-Medium", sans-serif;
}

/* Add a nice transition to the background color */
.navbar-item,
.navbar-burger {
  transition: background-color 0.25s ease;
}

/* By default, Bulma's mobile menu uses white. We want a dark theme */
@media screen and (max-width: 1023px) {
  .navbar-menu {
    background-color: hsl(
      0,
      0%,
      21%
    ); /* This is the bulma color scheme's DARKER GRAY color */
    transition: margin 300ms cubic-bezier(0.17, 0.04, 0.03, 0.94);
  }

  .navbar-item {
    color: white;
  }

  .navbar-item.is-active {
    background-color: hsl(0, 0%, 14%);
    color: white;
  }

  .navbar-item:hover {
    background-color: hsl(0, 0%, 14%);
    color: white;
  }
}

/* Center the icons with the text */
.icon-text {
  display: flex;
  align-items: center;
}

#avImg1
{
  border-radius: 50%;
  height: 65%;
  width: auto;
  border-color: white;
  border-style: solid;
  border-width: 1.5px;
  transition: box-shadow 300ms ease;
}

.navbar-burger:hover > #avImg1,
.navbar-burger.is-active > #avImg1
{
  box-shadow: 0px 0px 5px;
}

.navbar-burger {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
