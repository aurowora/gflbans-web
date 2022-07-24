<template>
    <teleport to="body">
        <div class="modal" :class="{'is-active': active}">
            <div class="modal-background"></div>
            <transition name="confirmModalAnim" enter-active-class="animated zoomIn faster" leave-active-class="animated zoomOut faster">
                <div v-if="active" class="modal-content">
                    <div class="box has-background-gray-darkest">
                        <article class="media">
                            <div class="media-content">
                                <h4 class="title is-5 has-text-white">{{title}}</h4>
                                <hr class="line" />
                                <span class="has-text-white t">{{ prompt }}</span>
                                <textarea v-if="hasText" rows=2 class="textarea" :placeholder="placeholder" :disabled="loading"></textarea>
                                <div class="field is-grouped">
                                    <p class="control">
                                        <button class="button has-background-grey-darker" :disabled="loading">Cancel</button>
                                    </p>
                                    <p class="control">
                                        <button class="button" :class="[$store.getters.isThemeClass, loading ? 'is-loading' : '']">OK</button>
                                    </p>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </transition>
        </div>
    </teleport>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        hasText: Boolean,
        prompt: String,
        active: Boolean,
        title: String,
        placeholder: String,
        loading: Boolean
    }
})
export default class ConfirmModal extends Vue {
    hasText!: boolean;
    prompt!: string;
    active!: boolean;
    title!: string;
    placeholder!: string;
    loading!: boolean;
}
</script>

<style scoped>
.modal {
    z-index: 50;
}

.box {
    min-height: 120px;
}

.title {
    font-family: 'Montserrat-Medium', sans-serif;
    margin-bottom: .75em;
}

hr.line {
    background-color: hsl(0, 0%, 27%);
    margin-top: .25em;
    margin-bottom: .5em;
    height: 1px;
    line-height: 1px;
}

span.t {
    font-family: 'Montserrat-Regular', sans-serif;
}

textarea {
    margin: 0.5em 0;
}

.button.has-background-grey-darker {
    border: none;
    color: white;
}

.has-background-gray-darkest {
    background-color: hsl(0, 0%, 14%);
}

.field {
    margin-top: 1em;
}
</style>