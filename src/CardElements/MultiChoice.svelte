<script>
    import {getContext} from "svelte";

    export let options;
    export let answer;
    export let learnCard;

    const guess = getContext("guess");
    function check(ev) {
        $guess = ev.currentTarget.name;
        if ($guess !== answer)
            window.onkeypress = continue_;
    }

    function continue_() {
        learnCard(false);
        window.onkeypress = keyboardGuess;
    }

    function keyboardGuess(ev) {
        document.getElementById("" + ev.key)?.click();
    }

    window.onkeypress = keyboardGuess;
</script>

<h3>
    {#if $guess !== null && $guess !== answer}
        <span style="color: var(--incorrect-outline)">No sweat, you're still learning!</span>
    {:else}
        Choose matching term  <!-- TODO: could be term or definition -->
    {/if}
</h3>
<div id="options">
    <!-- Note to self: using shuffle(options) leads to inconsistent behavior as the correct answer will not be marked as correct (visually) -->
    {#each options as option, index}
        <button class="option" id={index + 1} on:click={check} name={option} disabled={$guess !== null} incorrect={$guess === option && $guess !== answer} correct={$guess !== null && option === answer}>
            <span class="circle">{index + 1}</span>{option}
        </button>
    {/each}
</div>
{#if $guess !== null && $guess !== answer}
    <div>Press any key to <button on:click={continue_}>continue</button>...</div>
{/if}

<style>
    .circle {
        display: inline-block;
        background-color: lightgrey;
        border-radius: 100%;
        width: 1.5em;
        height: 1.5em;
        margin-right: 0.5em;
    }

    .option {
        /* Quizlet styles that I don't like too much
        background: transparent;
        border: .125rem solid #edeff4;*/
        border-width: .125rem;
        padding: 16px;
    }

    .option:not([disabled]):hover, .option:not([disabled]):focus {
        border-color: dimgrey;
    }

    #options {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 24px;
    }

    [disabled] {
        color: black;
    }

    [correct="true"] {
        background-color: var(--correct-bg);
        border-color: var(--correct-outline);
    }
    [incorrect="true"] {
        background-color: var(--incorrect-bg);
        border-color: var(--incorrect-outline);
    }
</style>