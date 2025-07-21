import State, { createState } from './State';
import {
    StateInitializer, Selector, Patcher,
    Reducer, SetState, Unsubscribe, UpdateState
} from './types';



// Observer function for a store
type StoreObserver = (key: string, value: unknown) => void

type PersistenceConfig = {
    saveState: (key: string, state: unknown, isInitialSet: boolean) => void,
    loadState: (key: string, noState: Empty) => unknown,
    removeState?: (key: string) => void,
    clear?: () => void,
    PERSIST_ENTIRE_STORE?: boolean
}

type StoreState<T> = {
    state: State<T>,
    unsubscribe: Unsubscribe,
    persist: boolean
}

type StoreInitializer = { [key: string]: unknown } | (() => { [key: string]: unknown });


const notImplementedErrorMsg = [
    `You must implement 'loadState' and 'saveState' to be able `,
    'to save state to your preffered storage. E.g \n',
    'store.persist({ \n',
    '    saveState: function(key, state, isInitialSet){/*Code to save state to your storage*/}, \n',
    '    loadState: function(key, noState){/*Code to load state from your storage*/} \n',
    '}) \n'
].join("");


class Empty { }  // Class for empty state/value
const EMPTY = new Empty();

class PersistentStorage {
    SHOULD_PERSIST_BY_DEFAULT: boolean = false;

    loadState(key: string, noState: Empty): unknown {
        throw TypeError(notImplementedErrorMsg);
    }

    saveState(key: string, state: unknown, isInitialSet?: boolean) {
        throw TypeError(notImplementedErrorMsg);
    }

    removeState: (key: string) => void

    clear: () => void
}


export default class Store {
    private states: Map<string, StoreState<unknown>>;
    private subscribers: Array<StoreObserver>;
    private persistentStorage: PersistentStorage;

    constructor(storeInitializer?: StoreInitializer) {
        this.states = new Map();
        this.subscribers = [];
        this.persistentStorage = new PersistentStorage();

        if (storeInitializer) {
            if (typeof storeInitializer === "function") {
                storeInitializer = storeInitializer();
            }

            for (let key in storeInitializer) {
                if (storeInitializer.hasOwnProperty(key)) {
                    this.setState(key, storeInitializer[key]);
                }
            }
        }
    }

    subscribe(observer: StoreObserver): () => void {
        if (this.subscribers.indexOf(observer) === -1) {
            // Subscribe a component to this store
            this.subscribers.push(observer);
        }

        const unsubscribe = () => {
            this.subscribers = this.subscribers.filter(
                subscriber => subscriber !== observer
            );
        }

        return unsubscribe
    }

    private onStoreUpdate(key: string, value: unknown): void {
        this.subscribers.forEach(subscriber => {
            subscriber(key, value);
        });
    }

    persist(config: PersistenceConfig): void {
        if (config.saveState) {
            this.persistentStorage.saveState = config.saveState;
        }
        if (config.loadState) {
            this.persistentStorage.loadState = config.loadState;
        }
        if (config.removeState) {
            this.persistentStorage.removeState = config.removeState;
        }
        if (config.clear) {
            this.persistentStorage.clear = config.clear;
        }
        if (config.PERSIST_ENTIRE_STORE) {
            this.persistentStorage.SHOULD_PERSIST_BY_DEFAULT = config.PERSIST_ENTIRE_STORE;
        }
    }

    setState<T>(
        key: string,
        initialValue: StateInitializer<T> | T,
        { persist }: { persist?: boolean } = {}
    ): void {

        const shouldPersist: boolean = persist === undefined ?
            this.persistentStorage.SHOULD_PERSIST_BY_DEFAULT : persist;

        let shouldSaveToPersistentStorage = false;

        if (shouldPersist) {
            // Try to load state from persistent storage
            const savedState = this.persistentStorage.loadState(key, EMPTY);

            if (savedState !== EMPTY) {
                // We have a saved state, so we use it as the initialValue
                initialValue = savedState as T;
            }
            else {
                // We don't have a saved state so we have to set/save it
                // Here we set this flag to true but we'll save later after creating a state successfully
                shouldSaveToPersistentStorage = true;
            }
        }


        const onStateChange = (newValue: unknown) => {
            // Note key & persist variables depends on scope

            this.onStoreUpdate(key, newValue);

            if (shouldPersist) {
                this.persistentStorage.saveState(key, newValue, false);
            }
        }

        // Create a state
        const state: State<T> = createState<T>(initialValue);
        const unsubscribe = state.subscribe({
            observer: onStateChange,
            selector: (st) => st
        });
        const storeState = {
            "state": state,
            "unsubscribe": unsubscribe,
            "persist": shouldPersist
        }
        // Add state to the store
        this.states.set(key, storeState);

        if (shouldSaveToPersistentStorage) {
            // Saving state to persistent storage after we've created it successfully
            this.persistentStorage.saveState(key, state.getValue(), true);
        }
    }

    getState<T>(
        key: string,
        config: { default?: StateInitializer<T> | T, persist?: boolean } = {}
    ): State<T> {
        let defaultValue;
        if (config.hasOwnProperty('default')) {
            // Use has set default explicitly
            defaultValue = config.default
        }
        else {
            // No default value
            defaultValue = EMPTY;
        }

        // Get key based state
        if (!this.has(key)) {  // state is not found
            if (defaultValue !== EMPTY) {  // Default value is found
                // Create a state and use defaultValue as the initial value
                this.setState<T>(
                    key,
                    defaultValue as (StateInitializer<T> | T),  // Make sure we don't pass EMPTY value
                    { persist: config.persist }
                );
            }
            else {
                // state is not found and the default value is not specified
                const errorMsg = [
                    `There is no state with the key '${key}', `,
                    `You are either trying to access a `,
                    `state that doesn't exist or it was deleted.`
                ];
                throw Error(errorMsg.join(""));
            }
        }
        return this.states.get(key).state as State<T>;
    }

    has(key: string) {
        // Check if we have a state in a store
        return this.states.has(key);
    }

    items(): Array<[key: string, state: unknown, persist: boolean]> {
        const storeItems = [];
        this.states.forEach((storeState, key) => {
            storeItems.push([key, storeState.state.getValue(), storeState.persist]);
        })
        return storeItems;
    }

    getStateValue<ST, T = unknown>(key: string, selector?): T | ST {
        const state = this.getState<T>(key);
        return state.getValue<ST>(selector);
    }

    clear(fn?: () => void): void {
        // Copy store
        const storeCopy = this.states;

        // Clear store
        this.states = new Map();
        if (this.persistentStorage.clear) {
            try {
                this.persistentStorage.clear()
            } catch (error) {
                // Ignore errors in clearing states
            }
        }

        if (fn) {
            // Run store re-initialization
            fn();
        }

        storeCopy.forEach((oldState, key) => {
            // Unsubscribe from an old state 
            oldState.unsubscribe()
            // Notify subscribers to a store that a state has been removed
            if (this.has(key)) {
                const newState = this.getState(key);
                this.onStoreUpdate(key, newState.getValue());
            }
            // Rerender all components using this state
            oldState.state.refresh();
        })
    }

    remove(Statekey: string | string[], fn?: () => void): void {
        let keys: string[] = [];
        if (typeof Statekey === 'string') {
            keys = [Statekey];
        }
        else {
            keys = Statekey;
        }

        const StatesToRemove: Map<string, StoreState<unknown>> = new Map();
        keys.forEach(key => {
            // Copy state to remove from a store
            StatesToRemove.set(key, this.states.get(key));

            // Remove state from a store
            this.states.delete(key);
            if (
                StatesToRemove.get(key).persist &&  // Is state persisted
                this.persistentStorage.removeState  // Is removeState Implemented
            ) {
                try {
                    this.persistentStorage.removeState(key);
                } catch (error) {
                    // Ignore error in removing state
                }
            }
        });

        if (fn) {
            // Run state re-initialization
            fn();
        }

        StatesToRemove.forEach((oldState, key) => {
            // Unsubscribe from an old state 
            oldState.unsubscribe()
            // Notify subscribers to a store that a state has been removed
            if (this.has(key)) {
                const newState = this.getState(key);
                this.onStoreUpdate(key, newState.getValue());
            }

            // Rerender all components depending on this state
            oldState.state.refresh();
        })
    }


    useState<T>(
        key: string,
        config?: { default?: StateInitializer<T> | T, persist?: boolean }
    ): [
            state: T,
            setState: SetState<T>,
            updateState: UpdateState<T>,
            stateObject: State<T>
        ];

    useState<ST, T>(
        key: string,
        config: { selector: Selector<ST>, default?: StateInitializer<T> | T, persist?: boolean },
    ): [
            state: ST,
            setState: SetState<T>,
            updateState: UpdateState<T>,
            stateObject: State<T>
        ];

    useState<ST, T>(
        key: string,
        config: { selector: Selector<ST>, patcher: Patcher<ST>, default?: StateInitializer<T> | T, persist?: boolean },
    ): [
            state: ST,
            setState: SetState<ST>,
            updateState: UpdateState<ST>,
            stateObject: State<T>
        ]

    useState(
        key: string,
        config: { selector?: Selector<unknown>, patcher?: Patcher<unknown>, default?: unknown, persist?: boolean } = {}
    ): [
            state: unknown,
            setState: SetState<unknown>,
            updateState: UpdateState<unknown>,
            stateObject: State<unknown>
        ] {
        const storeStateConfig = config as { default?, persist?};
        const stateConfig = config as { selector?, patcher?};

        const state = this.getState(key, storeStateConfig);
        return state.useState(stateConfig);
    }


    useReducer<T, A>(
        reducer: Reducer<T, A>,
        key: string,
        config?: { default?: StateInitializer<T> | T, persist?: boolean }
    ): [
            state: T,
            dispatch: (action: A) => void,
            stateObject: State<T>
        ];

    useReducer<ST, A, T = unknown>(
        reducer: Reducer<ST, A>,
        key: string,
        config: { selector?: Selector<ST>, default?: StateInitializer<T> | T | never, persist?: boolean }
    ): [
            state: ST,
            dispatch: (action: A) => void,
            stateObject: State<T>
        ];

    useReducer<ST, A, T = unknown>(
        reducer: Reducer<ST, A>,
        key: string,
        config: { selector?: Selector<ST>, patcher?: Patcher<ST>, default?: StateInitializer<T> | T | never, persist?: boolean }
    ): [
            state: ST,
            dispatch: (action: A) => void,
            stateObject: State<T>
        ]

    useReducer(
        reducer: Reducer<unknown, unknown>,
        key: string,
        config: { selector?: Selector<unknown>, patcher?: Patcher<unknown>, default?: unknown, persist?: boolean } = {}
    ): [
            state: unknown,
            dispatch: unknown,
            stateObject: State<unknown>
        ] {
        const storeStateConfig = config as { default?, persist?};
        const stateConfig = config as { selector?, patcher?};

        const state = this.getState(key, storeStateConfig);
        return state.useReducer(reducer, stateConfig);
    }
}


export function createStore(storeInitializer?: StoreInitializer): Store {
    // Create a store for key based state
    return new Store(storeInitializer);
}
