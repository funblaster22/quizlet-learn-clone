/** @return {Promise<CardSchema[]>} */
export function getAllCards(deckId=-1) {
    return new Promise(res => {
        db.then(db => db.transaction('cards').objectStore('cards').index('deckId').getAll(deckId).onsuccess = ev => {
            res(ev.target.result);
        });
    });
}

/** @return {Promise<number>} */
export function countCards(deckId=-1) {
    return new Promise(res => {
        db.then(db => db.transaction('cards').objectStore('cards').index('deckId').count(deckId).onsuccess = ev => {
            res(ev.target.result);
        });
    });
}

/** @return {Promise<CardSchema>} */
export function getCard(cardId) {
    return new Promise(res => {
        db.then(db => db.transaction('cards').objectStore('cards').index('id').get(cardId).onsuccess = ev => {
            res(ev.target.result);
        });
    });
}

/**
 *
 * @param cardId {number}
 * @param learn {boolean} whether or not the attempt was correct
 * @returns {Promise<CardSchema>}
 */
export function learn(cardId, learn) {
    return new Promise(res => {
        getCard(cardId).then(card => {
            if (card.lastCorrect === learn) {
                if (learn === false) card.level = Math.max(card.level - 1, 0);
                else if (learn === true) Math.min(card.level + 1, 2);
            }
            card.lastCorrect = learn;
            card.lastStudied = new Date();
            db.then(db => db.transaction('cards', 'readwrite').objectStore('cards').put(card).onsuccess = ev => {
                res(ev.target.result);
            });
        });
    })
}

export function makeCard(term, definition) {
    const transaction = db.then(db => db.transaction('cards', 'readwrite'));
    const cardsStore = transaction.objectStore('cards');
    // TODO: why is type checking complaining?
    cardsStore.add({
        deckId: -1,
        term,
        definition,
        correct: 0,
        incorrect: 0,
        lastStudied: new Date(),
        lastCorrect: false,
        level: 0
    });
    //transaction.oncomplete = ev => reloadSongs(albumId);
}

// Adapted from https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage#storing_complex_data_%E2%80%94_indexeddb
/** @type {Promise<IDBDatabase>} */ const db = new Promise((res, rej) => {
    const request = window.indexedDB.open('quizlet', 1);
    request.onsuccess = function() {
        console.log('Database opened successfully');
        res(request.result);

        /*makeCard("2+2=", 5);
        makeCard("letter after A", "B");
        makeCard("What's Obama's last name?", "Obama");
        makeCard("You go at red, but stop at green. What am I?", "Watermelon");*/
    };

    request.onerror = function(ev) {
        rej(ev.target.error);
        alert("Database permission is required to store songs and playlists");
    };

    request.onupgradeneeded = function(e) {
        // Grab a reference to the opened database
        const db = e.target.result;

        // Create an objectStore to store our notes in (basically like a single table)
        // including a auto-incrementing key
        const cardStore = db.createObjectStore('cards', { keyPath: 'id', autoIncrement:true });

        // Define what data items the objectStore will contain
        cardStore.createIndex('deckId', 'deckId', { unique: false });

        console.log('Database setup complete');
    };
});