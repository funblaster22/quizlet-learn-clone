<script>
    // TODO: abstract into Controller and Card Components?
    import Card from "./Card.svelte";
    import MultiChoice from "./CardElements/MultiChoice.svelte";
    import FreeRes from "./CardElements/FreeRes.svelte";
    import {getAllCards, getCard, learn} from "./manage";
    import {shuffle, LEARN_FRAME} from "./util";
    import {setContext} from "svelte";
    import {writable} from "svelte/store";
    import Accuracy from "./Accuracy.svelte";

    let options = [];
    let answer;
    let guess = writable(null);
    setContext('guess', guess);

    // TODO: getFrame() function?

    let cards = [];
    // I initialize cards within a callback instead of using promises to ensure pointer is de-incremented after mastering a card before returning to the event loop
    const cardsPromise = getAllCards().then(cards => cards.filter(card => card.level !== 2)).then(shuffle).then(allCards => {
        cards = allCards;
        console.log("LOADED", cards);
        if (cards.length > 0) incr_pointer();  // Initialize the first answer
    });  // TODO: maybe in the future don't load all data into memory (maybe just ids?)
    let pointer = -1;
    function incr_pointer() {
        if (cards.length === 0) return;
        // TODO: make more concise
        const tmpPointer = pointer + 1;
        if (tmpPointer === LEARN_FRAME || tmpPointer === cards.length) {
            pointer = 0;
            shuffle(cards, Math.min(LEARN_FRAME, cards.length));
            console.log("Shuffled", cards.slice(0, Math.min(LEARN_FRAME, cards.length)));
        } else
            pointer++;
        console.log("Pointer at index", pointer, "of", cards.length - 1);
        $guess = null;
        answer = cards[pointer].definition.toString().toLowerCase();

        // shuffle options
        options = cards
            .slice(0, Math.min(LEARN_FRAME, cards.length))  // Get learn frame
            .map(card => card.definition.toString().toLowerCase());
        options.splice(pointer, 1)  // Remove the answer to prevent duplication
        options = shuffle([answer, ...shuffle(options)
            .slice(0, Math.min(3, cards.length - 1))  // Get first 4 without overflowing
        ]);
    }

    $: if ($guess !== null) {
        const isCorrect = $guess === answer;
        if (isCorrect)
            setTimeout(learnCard.bind(globalThis, true), 500);
    }

    async function learnCard(isCorrect) {
        const id = cards[pointer].id;
        await learn(id, isCorrect);
        const card = await getCard(id);
        if (card.level === 2) {
            cards.splice(pointer--, 1);
        }
        incr_pointer();
    }
    // TODO: pull options from outside of learn frame if learn frame < available cards
</script>

{#await cardsPromise then _}
    {#if cards.length > 0}
        {#await getCard(cards[pointer].id) then card}
            <Card definition={card.term}>
                <Accuracy value={card.correct / (card.incorrect + card.correct) * 100} />
                {#if card.level === 0}
                    <MultiChoice {learnCard} {answer} {options} />
                {:else}
                    <FreeRes {learnCard} {answer} />
                {/if}
            </Card>
        {/await}
    {:else}
        You finished! <button>Study Again!</button>
    {/if}
{/await}