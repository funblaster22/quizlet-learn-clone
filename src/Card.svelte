<script>
    import { fly } from 'svelte/transition';
    import { marked } from 'marked';

    export let definition = "definition";
</script>

<div id="card" in:fly={{ x: 200, duration: 500, delay: 500 }} out:fly={{ x: -200, duration: 500 }}>
    <h3>Definition</h3>
    <!-- TODO: markdown is not sanitized, but that should not be an issue? -->
    {@html decodeURIComponent(marked.parse(definition))}

    <slot></slot>
</div>

<style>
    #card {
        position: relative;
        overflow: auto;
        max-height: calc(100vh - 1em);
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 .25rem 1rem 0 rgba(48, 53, 69, 0.08);
        width: 100%;
        height: fit-content;
        padding: 0.5em;
    }

    #card :global(img) {
        max-height: 50vh;
        max-width: 100%;
    }
</style>