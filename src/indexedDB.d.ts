// Adapted from https://stackoverflow.com/a/61108377
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

interface IDBTransaction {
    objectStore(name: 'cards'): CardStore;
}

interface CustomSchema {
    id: any;
}

interface CardSchema {
    id: number;
    deckId: number;
    term: string;
    definition: string;
    correct: number;
    incorrect: number;
    lastStudied: Date;
    // &gt;0 : correct streak, <0 : incorrect streak
    streak: number;
    // 0=multiple choice, 1=free response, 2=know
    level: number;
}

type CardStore = CustomStore<CardSchema>;

// @ts-ignore incorrect 'add' signature
interface CustomStore<Schema extends CustomSchema> extends IDBObjectStore {
    add(value: Optional<Schema, 'id'>, key?: keyof Schema): IDBRequest<keyof Schema>;
    //openCursor(query?: keyof Schema | IDBKeyRange | null, direction?: IDBCursorDirection): IDBRequest<IDBCursorWithValue | null>;
}