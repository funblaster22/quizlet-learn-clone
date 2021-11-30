<script>
    import {marked} from "marked";
    import {getAllCards} from "./manage";

    export let deckId = -1;


    const registration = new Promise((res, rej) => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').then(function(registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
                registration.onupdatefound

                navigator.serviceWorker.ready.then(res);

                // alert client when change is available
                // TODO: why does this sometimes error?
                registration.active.onstatechange = ev => {
                    if (confirm("Website updated. Reload now?")) location.reload();
                }
            }, function(err) {
                // registration failed :(
                rej(err);
            });

            navigator.serviceWorker.addEventListener('message', event => {
                // event is a MessageEvent object
                const {head, body} = event.data;
                if (head === 'progress' && body === 100)
                    alert("Ready for offline use!")
            });
        }
    });

    function extractURLs(markdown) {
        const html = decodeURIComponent(marked.parse(markdown));
        const dom = new DOMParser().parseFromString(html, 'text/html');
        return Array.from(dom.getElementsByTagName('img')).map(elem => elem.src);
    }

    async function saveOffline() {
        console.log("Downloading deck", deckId);
        const cards = await getAllCards(deckId);
        const urls = cards.map(card => [...extractURLs(card.definition), ...extractURLs(card.term)]).flat();
        (await registration).active.postMessage({urls: [...new Set(urls)], deckId});
    }
</script>

{#await registration then registration}
    <div id="save">
        <button title="Save for offline" on:click={saveOffline}>🚫🌐💾</button>
        <span title="Saving to computer...">☁️🔜💻</span>
        <button title="Delete offline copy">🗑️💾</button>
    </div>
{/await}

<style>
    #save {
        position: fixed;
        bottom: 0;
        right: 0;
    }

    #save > button {
        border: 0;
        background: none;
    }
</style>