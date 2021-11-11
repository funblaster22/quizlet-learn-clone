<script>
    import Card from "./Card.svelte";
    import MultiChoice from "./CardElements/MultiChoice.svelte";
    import FreeRes from "./CardElements/FreeRes.svelte";

    export let options = [];
    export let correct = "";

    function shuffle(array) {
        let m = array.length, t, i;
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
    const order = shuffle([...Array(5).keys()]);
    console.log(order);
</script>

<Card>
    {#if options.length > 0}
        <MultiChoice {options} {correct} />
    {:else}
        <FreeRes {correct} />
    {/if}
</Card>
<Card options={['a', 'b', 'c']} correct="a" />