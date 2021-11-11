<script>
    export let definition = "definition";
</script>

<div id="container">
    <div id="card">
        <h3>Definition</h3>
        {definition}

        <slot></slot>
    </div>
</div>

<style>
    #container {
        border: 1px solid black;
    }
</style>