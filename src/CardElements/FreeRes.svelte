<script>
    import {getContext} from "svelte";
    import DiffRenderer from "../DiffRenderer.svelte";

    export let answer;
    export let learnCard;
    const guess = getContext("guess");
</script>

<h3>Your answer</h3>
{#if $guess === null}
    <form on:submit|preventDefault={ev => $guess = new FormData(ev.target).get("answer").toLowerCase()}>
        <input placeholder="Type the Answer" autocomplete="off" autocapitalize="off" name="answer" autofocus />
        <button>Don't know?</button>
        <button>Submit</button>
    </form>
{:else}
    {#if $guess === answer}
        Correct!
    {:else}
        <DiffRenderer original={$guess} changed={answer} />
        You guessed: {$guess}<br />
        Answer: {answer}<br />
        <input placeholder="Copy the correct answer:" on:input={ev => { if (ev.target.value.toLowerCase() === answer) learnCard(false) }} autofocus />
        <button on:click={learnCard.bind(this, true)}>Override: I was correct</button>
    {/if}
{/if}
