<template>
  <!-- Name -->
  <span
    class="has-text-weight-semibold has-text-white"
    v-if="infraction.player.gs_name"
    >{{ infraction.player.gs_name }}</span
  >
  <span
    class="has-text-weight-semibold has-text-white"
    v-else-if="
      infraction.player.gs_id ||
      !infraction.player.ip ||
      infraction.player.ip == 'MISSING_PERMISSIONS'
    "
    >Unknown Player</span
  >
  <UserIP
    class="has-text-weight-semibold has-text-white"
    :ip="infraction.player.ip"
    v-else
  ></UserIP>
  <!-- Actions -->
  <div
    class="dropdown"
    :class="{ 'is-active': dropdownActive }"
    v-if="!readonly"
  >
    <div
      class="dropdown-trigger"
      @click.stop="dropdownActive = !dropdownActive"
    >
      <span class="icon has-text-white">
        <font-awesome-icon icon="cog"></font-awesome-icon>
      </span>
    </div>
    <transition
      name="infractionMenuAnim"
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <div
        class="dropdown-menu"
        ref="mtrigger"
        role="menu"
        v-if="dropdownActive"
      >
        <div class="dropdown-content">
          <!--<a href="#" class="dropdown-item"> {{ infraction.flags & IF.AUTO_TIER ? 'Disassociate Policy' : 'Associate Policy' }} </a>-->
          <a href="#" class="dropdown-item">Edit</a>
          <a href="#" class="dropdown-item"> {{ infraction.flags & IF.VPN ? 'Unset IP Ignored' : 'Set IP Ignored' }} </a>
          <a href="#" class="dropdown-item"> {{ infraction.flags & IF.REMOVED ? 'Reinstate' : 'Remove' }} </a>
        </div>
      </div>
    </transition>
  </div>
  <br />

  <!-- Tags -->
  <!--:data-tooltip="tag.tip"-->
  <div class="tags">
    <span
      v-for="tag in tags"
      :key="tag.color"
      class="tag has-tooltip-multiline has-tooltip-bottom"
      :class="[`is-${tag.color}`]"
      >{{ tag.text }}</span>
  </div>

  <!-- Creation -->
  <!--<span id="created">{{ formatDate(infraction.created) }}</span>-->
  <!--ConfirmModal :active="true" :hasText="true" :loading="true" prompt="Would you like to do the thing?" title="Test Modal"></ConfirmModal>-->
</template>

<script lang="ts">
import UserIP from "@/components/Global/UserIP.vue";
import { IInfraction } from "@/gflbans/infractions";
import { InfractionFlags } from "@/globals";
import { Options, Vue } from "vue-class-component";
import ConfirmModal from './ConfirmModal.vue';

@Options({
  props: {
    infraction: {
      required: true,
    },
    readonly: {
      required: true,
      type: Boolean,
    },
  },
  components: {
    UserIP,
    ConfirmModal
  },
})
export default class ISummaryHeader extends Vue {
  infraction!: IInfraction;
  readonly!: boolean;
  dropdownActive: boolean = false;

  // GLOBALS
  IF = InfractionFlags;

  /* Close the dropdown when we click outside */
  mounted() {
    document.addEventListener("click", this.closeMenuHandler);
  }

  beforeDestroy() {
    document.removeEventListener("click", this.closeMenuHandler);
  }

  closeMenuHandler(e: Event) {
    if (
      this.$refs.mtrigger &&
      !(this.$refs.mtrigger as HTMLElement).contains(e.target as Node)
    ) {
      this.dropdownActive = false;
    }
  }

  /* Summary tags */
  get tags() {
    if (!this.infraction) {
      return [];
    }

    const t = [];

    if (this.infraction.flags & InfractionFlags.REMOVED) {
      t.push({
        color: "ban",
        text: "Removed",
        tip: "This infraction has been removed by an administrator",
      });
    }

    if (this.infraction.flags & InfractionFlags.VPN) {
      t.push({
        color: "vmute",
        text: "IP Ignored",
        tip: "The IP associated with this is not considered when deciding if this infraction applies to a given user. Usually due to it being a VPN, University/School IP, or with siblings.",
      });
    }

    if (this.infraction.flags & InfractionFlags.WEB) {
      t.push({
        color: "tmute",
        text: "Web",
        tip: "This infraction is not associated with a server and was created via the Web UI or API.",
      });
    }

    if (this.infraction.flags & InfractionFlags.DEC_ONLINE_ONLY) {
      t.push({
        color: "caban",
        text: "Timer",
        tip: "This infraction only ticks while the player is connected.",
      });
    }

    if (this.infraction.flags & InfractionFlags.AUTO_TIER) {
      t.push({
        color: "acban",
        text: "Auto Tiering",
        tip: "This infraction's length and punishments were calculated based off of a tiering policy.",
      });
    }

    return t;
  }
}
</script>

<style scoped>
/* Apply fonts */
span {
    font-family: 'Montserrat-Regular';
}

span.has-text-weight-semibold {
    font-family: 'Montserrat-Medium';
}

/* Consistent positions */
.tags {
    min-height: 24px;
}

.tag {
    margin-right: 5px;
    cursor: default;
}

.tags:not(:last-child) {
    margin-bottom: 0rem !important; 
}

/* Menu Styles */
.dropdown-trigger {
    cursor: pointer;
}

.dropdown-content {
    background-color: hsl(0, 0%, 29%);
}

.dropdown-item {
    color: white;
    transition: background-color 100ms linear;
}

.dropdown-item:hover {
    color: white;
    background-color: hsl(0, 0%, 35%);
}
</style>