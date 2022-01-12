<template>
    <nav class="pagination" role="navigation" aria-label="pagination">
        <a class="pagination-previous">

        </a>
        <a class="pagination-next">
            
        </a>
        <ul class="pagination-list">
            <li v-if="backVisible">
                <a @click="back()" class="pagination-link">
                    <span class="icon">
                        <font-awesome-icon icon="arrow-left"></font-awesome-icon>
                    </span>
                </a>
            </li>

            <!-- 1 is valid always? -->
            <li><a @click="goto(1)" class="pagination-link" :class="{'is-current': current_page == 1}" aria-label="Goto page 1">1</a></li>

            <!-- If 1 isn't the third back, we need to draw ... -->

            <li v-if="current_page - 3 > 1"><span class="pagination-ellipsis">&hellip;</span></li>

            <template v-for="idx in seq" :key=idx>
                <li><a @click="goto(idx)" class="pagination-link" :class="{'is-current': current_page == idx}" :aria-label="`Goto page ${idx}`">{{ idx }}</a></li>
            </template>

            <!-- If the end isnt within 3 pages, we also need ... -->
            <li v-if="current_page + 3 < total_pages"><span class="pagination-ellipsis">&hellip;</span></li>

            <li><a @click="goto(total_pages)" class="pagination-link" :class="{'is-current': current_page == total_pages}" :aria-label="`Goto page ${total_pages}`">{{ total_pages }}</a></li>

            <li v-if="nextVisible">
                <a @click="next()" class="pagination-link">
                    <span class="icon">
                        <font-awesome-icon icon="arrow-right"></font-awesome-icon>
                    </span>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        current_page: {
            type: Number,
            required: true
        },
        total_pages: {
            type: Number,
            required: true
        }
    },
    emits: ['goto']
})
export default class Pagination extends Vue {
    current_page!: number;
    total_pages!: number;

    goto(dest: number)
    {
        this.$emit('goto', dest);
    }

    back()
    {
        if (this.current_page - 1 > 0)
            this.goto(this.current_page - 1);
    }

    next()
    {
        if (this.current_page + 1 <= this.total_pages)
            this.goto(this.current_page + 1);
    }

    get backVisible()
    {
        return this.current_page > 1
    }

    get nextVisible()
    {
        return this.current_page < this.total_pages
    }

    // get the 5 indexes to provide links to (unless they are the first or last pages)
    get seq()
    {
        const x: number[] = [];

        for (let i = this.current_page - 2; i < (this.current_page - 2) + 5; i++ )
        {
            if (i > 1 && i < this.total_pages)
            {
                x.push(i);
            }
        }

        return x
    }
}
</script>