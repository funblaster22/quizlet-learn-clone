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
        <button class="secondary">Don't know?</button>
        <button id="submit">Submit</button>
    </form>
{:else}
    {#if $guess === answer}
        Correct!
    {:else}
        <DiffRenderer original={$guess} changed={answer} />
        You guessed: {$guess}<br />
        Answer: {answer}<br />
        <input placeholder="Copy the correct answer:" on:input={ev => { if (ev.target.value.toLowerCase() === answer) learnCard(false) }} autofocus />
        <button class="secondary" on:click={learnCard.bind(this, true)}>Override: I was correct</button>
    {/if}
{/if}

<style>
    input {
        background: #f4f4f4;
        border: .125rem solid transparent;
    }

    input:focus {
        outline: none;
        border-bottom-color: var(--color-button);
    }

    .secondary {
        background: none;
        border: 0;
        color: var(--color-button);
        font-weight: bold;
    }

    #submit {
        background: var(--color-button);
        border: 0;
        color: white;
        font-weight: bold;
    }
</style>
