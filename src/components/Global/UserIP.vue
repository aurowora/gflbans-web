<!-- A component that hides user IPs (but can be toggled to show them) -->
<template>
    <span class="icon-text" @click="ipVisible = !ipVisible" :class="{'is-closed': !ipVisible}">
        <span>{{ ipVisible ? ip : 'IP Hidden'}}</span>
        <span class="icon">
            <font-awesome-icon :icon="icon"></font-awesome-icon>
        </span>
    </span>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

@Options({
    props: {
        ip: {
            required: true,
            type: String
        }
    }
})
export default class UserIP extends Vue
{
    ip!: string;
    ipVisible: boolean = false;

    get icon()
    {
        return this.ipVisible ? faEye : faEyeSlash
    }
}
</script>

<style scoped>
.is-closed {
    /* Give it a faded effect when closed */
    opacity: 0.8;
    transition: opacity 250ms ease-in-out;
}

.icon-text:hover {
    cursor: pointer;
    opacity: 1;
}

span {
    flex-wrap: nowrap;
    text-overflow: clip;
    white-space: nowrap;
}

</style>