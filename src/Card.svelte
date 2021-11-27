<script>
    import { fly } from 'svelte/transition';
    import { marked } from 'marked';

    export let definition = "definition";
</script>

<div id="container" in:fly={{ x: 200, duration: 500, delay: 500 }} out:fly={{ x: -200, duration: 500 }}>
    <div id="card">
        <h3>Definition</h3>
        <!-- TODO: markdown is not sanitized, but that should not be an issue? -->
        {@html marked.parse(definition)}

        <slot></slot>
    </div>
</div>

<style>
    #card {
        overflow: auto;
    }

    #card :global(img) {
        max-height: 50vh;
        max-width: 100%;
    }

    #container {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 .25rem 1rem 0 rgba(48, 53, 69, 0.08);
        width: 100%;
        height: fit-content;
    }
</style>