<script>
    import { marked } from 'marked';

    export let definition = "definition";
</script>

<div id="container">
    <div id="card">
        <h3>Definition</h3>
        <!-- TODO: markdown is not sanitized, but that should not be an issue? -->
        {@html marked.parse(definition)}

        <slot></slot>
    </div>
</div>

<style>
    #card :global(img) {
        max-height: 50vh;
        max-width: 100%;
    }

    #container {
        border: 1px solid black;
    }
</style>