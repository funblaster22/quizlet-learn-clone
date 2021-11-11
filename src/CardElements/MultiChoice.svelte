<script>
    export let options;
    export let correct;

    let guess;
    function check(ev) {
        guess = ev.currentTarget.name;
    }
</script>

<h3>Choose matching term</h3>  <!-- TODO: could be term or definition -->
{#each options as option, index}
    <button on:click={check} name={option} disabled={guess !== undefined} incorrect={guess === option && guess !== correct} correct={option === correct && guess !== undefined}>
        <span class="circle">{index + 1}</span>{option}
    </button>
{/each}

<style>
    .circle {
        background-color: grey;
        border-radius: 100%;
        width: 2em;
        height: 2em;
    }

    [correct="true"] {
        background-color: green;
    }
    [incorrect="true"] {
        background-color: red;
    }
</style>