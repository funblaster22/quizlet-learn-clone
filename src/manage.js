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
        db.then(db => db.transaction('cards').objectStore('cards').get(cardId).onsuccess = ev => {
            res(ev.target.result);
        });
    });
}

/**
 *
 * @param cardId {number}
 * @param isCorrect {boolean} whether or not the attempt was correct
 * @returns {Promise<CardSchema>} the cardId
 */
export function learn(cardId, isCorrect) {
    return new Promise(res => {
        getCard(cardId).then(card => {
            // TODO: this conditional logic is kinda confusing
            if (isCorrect) { card.correct++; card.streak = card.streak > 0 ? card.streak + 1 : 1; }
            else { card.incorrect++; card.streak = card.streak < 0 ? card.streak - 1 : -1; }
            if (Math.abs(card.streak) === 2) {
                if (card.streak > 0) card.level = Math.min(card.level + 1, 2);
                else card.level = Math.max(card.level - 1, 0);
                card.streak = 0;  // Ensures that the user has to do at least two questions per level
            }
            card.lastStudied = new Date();
            db.then(db => db.transaction('cards', 'readwrite').objectStore('cards').put(card).onsuccess = ev => {
                res(ev.target.result);
            });
        });
    })
}

export function resetLearning(deckId, level, streak) {

}

export function makeCard(term, definition) {
    return new Promise(res => {
        db.then(db => {
            const transaction = db.transaction('cards', 'readwrite');
            const cardsStore = transaction.objectStore('cards');
            // TODO: why is type checking complaining?
            cardsStore.add({
                deckId: -1,
                term,
                definition,
                correct: 0,
                incorrect: 0,
                lastStudied: new Date(),
                streak: 0,
                level: 0
            });
            transaction.oncomplete = res;
        });
    });
}

// Adapted from https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage#storing_complex_data_%E2%80%94_indexeddb
/** @type {Promise<IDBDatabase>} */ const db = new Promise((res, rej) => {
    let dbShouldInit = false;
    const request = window.indexedDB.open('quizlet', 1);
    request.onsuccess = function() {
        console.log('Database opened successfully');

        if (dbShouldInit) {
            fetch("/names.json").then(res => res.json()).then(json => {
                console.log(json);
                const promises = [];
                for (const [img, name] of Object.entries(json)) {
                    promises.push(makeCard(`![student](${img})`, name));
                }
                Promise.all(promises).then(() => location.reload());  // TODO: temp
            });
        }

        res(request.result);
    };

    request.onerror = function(ev) {
        rej(ev.target.error);
        alert("Database permission is required to flashcards");
    };

    request.onupgradeneeded = function(e) {
        // Grab a reference to the opened database
        const db = e.target.result;
        dbShouldInit = true;

        // Create an objectStore to store our notes in (basically like a single table)
        // including a auto-incrementing key
        const cardStore = db.createObjectStore('cards', { keyPath: 'id', autoIncrement:true });

        // Define what data items the objectStore will contain
        cardStore.createIndex('deckId', 'deckId', { unique: false });

        console.log('Database setup complete');
    };
});