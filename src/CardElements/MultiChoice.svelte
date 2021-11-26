<script>
    import {getContext} from "svelte";

    export let options;
    export let answer;
    export let learnCard;

    const guess = getContext("guess");
    function check(ev) {
        $guess = ev.currentTarget.name;
        if ($guess !== answer)
            window.onkeypress = () => {
                learnCard(false);
                window.onkeypress = null;
            };
    }
</script>

<h3>Choose matching term</h3>  <!-- TODO: could be term or definition -->

<!-- Note to self: using shuffle(options) leads to inconsistent behavior as the correct answer will not be marked as correct (visually) -->
{#each options as option, index}
    <button on:click={check} name={option} disabled={$guess !== null} incorrect={$guess === option && $guess !== answer} correct={$guess !== null && option === answer}>
        <span class="circle">{index + 1}</span>{option}
    </button>
{/each}
{#if $guess !== null && $guess !== answer}
    <div>Press any key to continue...</div>
{/if}

<style>
    .circle {
        display: inline-block;
        background-color: grey;
        border-radius: 100%;
        width: 1.5em;
        height: 1.5em;
        margin-right: 0.5em;
    }

    [correct="true"] {
        background-color: green;
    }
    [incorrect="true"] {
        background-color: red;
    }
</style>