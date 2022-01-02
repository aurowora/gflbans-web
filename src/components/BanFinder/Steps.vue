<template>
    <ul class="steps has-content-centered">
        <li class="steps-segment" :class="[step > 0 ? $store.getters.isThemeClass : 'is-white']">
            <a @click=rewind0 class="steps-marker" :class="[step >= 0 ? $store.getters.isThemeClass : 'is-white', step <= 0 ? 'no-click' : '']"></a>
            <div class="steps-content">
                <p class="is-size-4">Select Platform</p>
            </div>
        </li>
        <li class="steps-segment" :class="[step > 1 ? $store.getters.isThemeClass : 'is-white']">
            <a @click=rewind1 class="steps-marker" :class="[step >= 1 ? $store.getters.isThemeClass : 'is-white', step <= 1 ? 'no-click' : '']"></a>
            <div class="steps-content">
                <p class="is-size-4">Select Infractions</p>
            </div>
        </li>
        <li class="steps-segment" :class="[step > 2 ? $store.getters.isThemeClass : 'is-white']">
            <a href="#" class="steps-marker" :class="[step >= 2 ? $store.getters.isThemeClass : 'is-white', 'no-click']"></a>
            <div class="steps-content">
                <p class="is-size-4">Appeal</p>
            </div>
        </li>
    </ul>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        step: Number
    },
    emits: ['rewind-platform', 'rewind-infractions']
})
export default class Steps extends Vue {
    step!: number;

    rewind0()
    {
        if (this.step > 0)
        {
            this.$emit('rewind-platform');
        }
    }

    rewind1()
    {
        if (this.step > 1)
        {
            this.$emit('rewind-platform');
        }
    }
}
</script>

<style scoped>
    .no-click
    {
        cursor:not-allowed;
    }

    p {
        font-family: 'Montserrat-Regular', sans-serif;
    }
</style>