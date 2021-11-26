<script>
    // TODO: abstract into Controller and Card Components?
    import Card from "./Card.svelte";
    import MultiChoice from "./CardElements/MultiChoice.svelte";
    import FreeRes from "./CardElements/FreeRes.svelte";
    import {getAllCards, getCard, learn} from "./manage";
    import {shuffle, LEARN_FRAME} from "./util";
    import {setContext} from "svelte";
    import {writable} from "svelte/store";

    let options = [];
    let answer;
    let guess = writable(null);
    setContext('guess', guess);

    // TODO: getFrame() function?

    const cards = getAllCards().then(cards => cards.filter(card => card.level !== 2)).then(shuffle);  // TODO: maybe in the future don't load all data into memory (maybe just ids?)
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

        // shuffle options
        options = shuffle(myCards
            .slice(0, Math.min(LEARN_FRAME, myCards.length))  // Get learn frame
            .map(card => card.definition.toString().toLowerCase())
            .slice(0, Math.min(4, myCards.length)));  // Get first 4 without overflowing
    }
    incr_pointer();  // Initialize the first answer

    $: if ($guess !== null) {
        const isCorrect = $guess === answer;
        if (isCorrect)
            setTimeout(learnCard.bind(globalThis, true), 500);
    }

    async function learnCard(isCorrect) {
        const myCards = await cards;
        const id = myCards[pointer].id;
        await learn(id, isCorrect);
        const card = await getCard(id);
        if (card.level === 2) {
            myCards.splice(pointer--, 1);  // TODO: will this actually modify the contents?
            console.log(myCards);
        }
        incr_pointer();
    }
</script>

{#await cards then cards}
    {#if cards.length > 0}
        <Card definition={cards[pointer].term}>
            {#if cards[pointer].level === 0}
                <MultiChoice {learnCard} {answer} {options} />
            {:else}
                <FreeRes {learnCard} {answer} />
            {/if}
        </Card>
    {:else}
        You finished! <button>Study Again!</button>
    {/if}
{/await}