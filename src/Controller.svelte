<script>
    import Card from "./Card.svelte";
    import MultiChoice from "./CardElements/MultiChoice.svelte";
    import FreeRes from "./CardElements/FreeRes.svelte";
    import {getAllCards} from "./manage";

    export let options = [];
    // The amount of new vocabulary the user is exposed to at once
    const LEARN_FRAME = 10;

    function shuffle(array, endAt=undefined) {
        let m = endAt || array.length, t, i;
        // While there remain elements to shuffle…
        while (m) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);
            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }
    const cards = getAllCards().then(shuffle);  // TODO: maybe in the future don't load all data into memory (maybe just ids?)
    cards.then(console.log);
    let pointer = 0;
    async function incr_pointer() {
        // TODO: make more concise
        const tmpPointer = pointer + 1;
        const myCards = await cards;
        console.log(tmpPointer, myCards.length);
        if (tmpPointer === LEARN_FRAME || tmpPointer === myCards.length) {
            pointer = 0;
            shuffle(myCards, Math.min(LEARN_FRAME, myCards.length));
            console.log(myCards);
        } else
            pointer++;
    }
</script>

{#await cards then cards}
    <Card definition={cards[pointer].term}>
        {#if options.length > 0}
            <MultiChoice {options} correct={cards[pointer].definition} />
        {:else}
            <FreeRes correct={cards[pointer].definition} />
        {/if}
    </Card>
{/await}
<button on:click={incr_pointer}>Increase</button>
<!--Card options={['a', 'b', 'c']} correct="a" /-->