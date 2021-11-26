// The amount of new vocabulary the user is exposed to at once
export const LEARN_FRAME = 10;

export function shuffle(array, endAt=undefined) {
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