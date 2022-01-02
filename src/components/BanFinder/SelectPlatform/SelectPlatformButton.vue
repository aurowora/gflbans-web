<template>
    <p>UwU</p>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { PLATFORMS } from '@/data';
import { ConfigError } from '@/errors';

@Options({
    props: {
        platform: String
    }
})
export default class SelectPlatformButton extends Vue {
    platform!: string;

    getPlatform(name: string): any
    {
        if (!(name in PLATFORMS))
        {
            const c = new ConfigError(`Platform ${name} specified in config is not supported.`);
            this.$store.commit('setError', c);
            throw c;
        }

        return PLATFORMS[name];
    }
    
    get platformIcon()
    {

    }

    get platformName()
    {

    }

    get platformText()
    {

    }

    get platformPrimaryColor()
    {

    }

    get platformSecondaryColor()
    {

    }
}
</script>