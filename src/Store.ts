import { GlobalState, createGlobalstate } from './GlobalState';
import { useGlobalState } from './useGlobalState';
import { useGlobalStateReducer } from './useGlobalStateReducer';


type Reducer = (state: any, action: any) => any
type Observer = (key: string, value: any) => void
type Config<T> = {
    default?: T,
    selector?: (state: any) => any,
    patcher?: (state: any, selectedStateValue: any) => any,
    persist?: boolean
}

type PersistenceConfig = {
    saveState: (key: string, state: any, isInitialSet?: boolean) => void,
    loadState: (key: string, noState) => any,
    removeState?: (key: string) => void,
    clear?: () => void,
    PERSIST_ENTIRE_STORE?: boolean
}


const notImplementedErrorMsg = [
    `You must implement 'loadState' and 'saveState' to be able `,
    'to save state to your preffered storage. E.g \n',
    'store.persist({ \n',
    '    saveState: function(key, state, isInitialSet){/*logics to save state to storage*/}, \n',
    '    loadState: function(key, noState){/*logics to load state from storage*/} \n',
    '}) \n'
].join("");


class Empty {}  // Class for empty state/value
const EMPTY =  new Empty();

class PersistentStorage {
    // Persist all states in a store unless parsist = false is passed
    SHOULD_PERSIST_BY_DEFAULT: boolean = false;

    loadState(key: string, noState: Empty): any {
        throw TypeError(notImplementedErrorMsg);
    }

    saveState(key: string, state: any, isInitialSet?: boolean) {
        throw TypeError(notImplementedErrorMsg);
    }

    removeState: (key: string) => void

    clear: () => void
}

class Store {
    value: Map<string, GlobalState<any>>;
    subscriptions: Array<Observer>;
    persistentStorage: PersistentStorage;

    constructor() {
        this.value = new Map();
        this.subscriptions = [];
        this.persistentStorage = new PersistentStorage();
    }

    subscribe(observer: Observer): () => void {
        if (this.subscriptions.indexOf(observer) === -1) {
            // Subscribe a component to this store
            this.subscriptions.push(observer);
        }

        const unsubscribe = () => {
            this.subscriptions = this.subscriptions.filter(
                subscriber => subscriber !== observer
            );
        }

        return unsubscribe
    }

    onStoreUpdate(key: string, value: any): void {
        this.subscriptions.forEach(subscription => {
            subscription(key, value);
        });
    }

    persist(config: PersistenceConfig): void {
        if (config.saveState) {
            PersistentStorage.prototype.saveState = config.saveState;
        }
        if (config.loadState) {
            PersistentStorage.prototype.loadState = config.loadState;
        }
        if (config.removeState) {
            PersistentStorage.prototype.removeState = config.removeState;
        }
        if (config.clear) {
            PersistentStorage.prototype.clear = config.clear;
        }
        if (config.PERSIST_ENTIRE_STORE) {
            PersistentStorage.prototype.SHOULD_PERSIST_BY_DEFAULT = config.PERSIST_ENTIRE_STORE;
        }
    }

    setState<T>(
        key: string,
        initialValue: T,
        { persist }: { persist?: boolean } = { }
    ): void {

        const shouldPersist: boolean = persist === undefined ?
            this.persistentStorage.SHOULD_PERSIST_BY_DEFAULT : persist;

        if (shouldPersist) {
            // Load state from localStorage
            const savedState = this.persistentStorage.loadState(key, EMPTY);

            if (savedState !== EMPTY) {
                // Use savedState as the initialValue
                initialValue = savedState;
            }
            else {
                // This is the initial set
                this.persistentStorage.saveState(key, initialValue, true);
            }
        }

        const onGlobalStateChange = (newValue: any) => {
            // Note key, persist & timerId variables depends on the scope

            this.onStoreUpdate(key, newValue);

            if (shouldPersist) {
                this.persistentStorage.saveState(key, newValue, false);
            }
        }

        // Create global state
        const globalState: GlobalState<T> = createGlobalstate<T>(initialValue);
        globalState.persist = shouldPersist;
        globalState.subscribe({
            observer: onGlobalStateChange,
            selector: (state) => state
        });
        // Add global state to the store
        this.value.set(key, globalState);
    }

    getState<T>(
        key: string,
        config: { default?: T | Empty, persist?: boolean } = { default: EMPTY }
    ): GlobalState<any> {
        const defaultValue: any = config.default;
        // Get key based global state
        if (!this.value.has(key)) {  // Global state is not found
            if (defaultValue !== EMPTY) {  // Default value is found
                // Create a global state and use defaultValue as the initial value
                this.setState<T>(key, defaultValue, { persist: config.persist });
            }
            else {
                // Global state is not found and the default value is not specified
                const errorMsg = [
                    `There is no global state with the key '${key}', `,
                    `You are either trying to access a global `,
                    `state which was not created or it was deleted.`
                ];
                throw Error(errorMsg.join(""));
            }
        }
        return this.value.get(key);
    }

    clear(fn?: () => void): void {
        // Copy store
        const storeCopy = this.value;

        // Clear store
        this.value = new Map();
        if (this.persistentStorage.clear) {
            this.persistentStorage.clear()
        }

        if (fn) {
            // Run store re-initialization
            fn();
        }

        storeCopy.forEach((oldState, key) => {
            // Notify subscribers to a store that a global state has been removed
            if (this.value.has(key)) {
                const newGlobalState = this.getState(key);
                this.onStoreUpdate(key, newGlobalState.getValue());
            }
            // Rerender all components using this global state
            oldState.refresh();
        })
    }

    remove(globalStatekey: string | string[], fn?: () => void): void {
        let keys: string[] = [];
        if (typeof globalStatekey === 'string') {
            keys = [globalStatekey];
        }
        else {
            keys = globalStatekey;
        }

        const globalStatesToRemove: Map<string, GlobalState<any>> = new Map();
        keys.forEach(key => {
            // Copy global state to remove from a store
            globalStatesToRemove.set(key, this.getState(key));

            // Remove global state from a store
            this.value.delete(key);
            if (
                globalStatesToRemove.get(key).persist &&  // Is state persisted
                this.persistentStorage.removeState &&  // Is removeState Implemented
                this.persistentStorage.loadState(key, EMPTY) !== EMPTY  // Is state to remove available
            ) {
                this.persistentStorage.removeState(key)
            }
        });

        if (fn) {
            // Run global state re-initialization
            fn();
        }

        globalStatesToRemove.forEach((oldState, key) => {
            // Notify subscribers to a store that a global state has been removed
            if (this.value.has(key)) {
                const newGlobalState = this.getState(key);
                this.onStoreUpdate(key, newGlobalState.getValue());
            }

            // Rerender all components depending on this global state
            oldState.refresh();
        })
    }

    useState<ST=any, T=any>(key: string, config: Config<T> = {}) {
        const globalState: GlobalState<T> = this.getState<T>(key, config);
        return useGlobalState<ST>(globalState, config);
    }

    useReducer<ST=any, T=any>(reducer: Reducer, key: string, config: Config<T> = {}) {
        const globalState: GlobalState<T> = this.getState<T>(key, config);
        return useGlobalStateReducer<ST>(reducer, globalState, config);
    }
}


function createStore(): Store {
    // Create a store for key based global state
    return new Store();
}

export { Store, createStore };
