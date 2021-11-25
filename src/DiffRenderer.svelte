<script>
    export let original = "";
    export let changed = "";

    const discrepancies = [];
    // TODO: implement
</script>

<div>
    {#each Array.from(original) as letter}
        <span style="background-color: red">{letter}</span>
    {/each}
</div>