<!--
  This file is part of GFLBans Web and is licensed under the terms of the third version (only) of the GNU General Public License.
  See README.md and LICENSE.txt for more information.
-->

<template>
  <div class="navbar-item" id="wrapAv">
    <img :src="avatar" alt="User Avatar" />
    <span>{{ user_name }}</span>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { INSTANCE } from "@/config";

export default class UserButton extends Vue {
  get avatar() {
    if (this.$store.state.current_user && this.$store.state.current_user.avatar_id) {
      return `${INSTANCE}file/uploads/${this.$store.state.current_user.avatar_id}/avatar.webp`;
    } else {
      return "@/assets/animated/pinwheel.webp";
    }
  }

  get user_name() {
    return this.$store.state.current_user !== undefined
      ? this.$store.state.current_user.admin_name
      : "ERROR";
  }
}
</script>

<style scoped>
  #wrapAv
  {
    display: flex;
    align-items: center;
  }

  img {
    margin-right: 5px;
    border-radius: 50%;
  }
</style>