<script>
    // TODO: abstract into Controller and Card Components?
    import Card from "./Card.svelte";
    import MultiChoice from "./CardElements/MultiChoice.svelte";
    import FreeRes from "./CardElements/FreeRes.svelte";
    import {getAllCards, learn, shuffle} from "./manage";
    import {setContext} from "svelte";
    import {writable} from "svelte/store";

    export let options = [];
    let answer;
    let guess = writable(null);
    setContext('guess', guess);
    // The amount of new vocabulary the user is exposed to at once
    const LEARN_FRAME = 10;

    const cards = getAllCards().then(shuffle);  // TODO: maybe in the future don't load all data into memory (maybe just ids?)
    let pointer = -1;
    async function incr_pointer() {
        // TODO: make more concise
        const tmpPointer = pointer + 1;
        const myCards = await cards;
        if (tmpPointer === LEARN_FRAME || tmpPointer === myCards.length) {
            pointer = 0;
            shuffle(myCards, Math.min(LEARN_FRAME, myCards.length));
            console.log("Shuffled", myCards.slice(0, Math.min(LEARN_FRAME, myCards.length)));
        } else
            pointer++;
        console.log("Pointer at index", pointer, "of", myCards.length - 1);
        $guess = null;
        answer = myCards[pointer].definition.toString().toLowerCase();
    }
    incr_pointer();  // Initialize the first answer

    $: if ($guess !== null) {
        const isCorrect = $guess === answer;
        if (isCorrect)
            setTimeout(learnCard.bind(globalThis, true), 500);
    }

    async function learnCard(correct) {
        learn((await cards)[pointer].id, correct);
        incr_pointer();
    }
</script>

{#await cards then cards}
    <Card definition={cards[pointer].term}>
        {#if options.length > 0}
            <!--MultiChoice {options} correct={cards[pointer].definition} learn={learnCard} /-->
        {:else}
            <FreeRes {learnCard} {answer} />
        {/if}
    </Card>
{/await}