import { GlobalState, createGlobalstate } from './GlobalState';


class GlobalStateStore {
    value: { [key: string]: GlobalState };  // Container for key based global states
    subscribers: any[];
    LOCAL_STORAGE_UPDATE_DEBOUNCE_TIME: number;  // Local storage update debounce time in ms

    constructor() {
        this.value = {};
        this.subscribers = [];
        this.LOCAL_STORAGE_UPDATE_DEBOUNCE_TIME = 1000;

    }

    subscribe(itemToSubscribe: any) {
        if (this.subscribers.indexOf(itemToSubscribe) > -1) {
            // Already subscribed
            return
        }
        // Subscribe a component to this store
        this.subscribers.push(itemToSubscribe);
    }

    unsubscribe(itemToUnsubscribe: any) {
        this.subscribers = this.subscribers.filter(
            subscriber => subscriber !== itemToUnsubscribe
        );
    }

    onStoreUpdate(event: any) {
        this.subscribers.forEach(subscriber => {
            subscriber(event);
        });
    }

    getStateFromLocalStorage(key: string) {
        try {
            const serializedState = window.localStorage.getItem(key);
            if (serializedState === null) {
                // No state saved
                return undefined
            }
            return JSON.parse(serializedState);
        } catch (err) {
            // Failed to load state
            return undefined
        }
    }

    saveStateToLocalStorage(key: string, state: any) {
        try {
            const serializedState = JSON.stringify(state);
            window.localStorage.setItem(key, serializedState);
        } catch {
            // Ignore write errors
        }
    }

    deleteStateFromLocalStorage(key: string) {
        return window.localStorage.removeItem(key);
    }

    setState(
        key: string,
        initialValue: any,
        { persist }: { persist: boolean } = { persist: false }
    ) {
        if (persist) {
            // Load state from localStorage
            const savedState = this.getStateFromLocalStorage(key);

            if (savedState !== undefined) {
                // Use savedState as the initialValue
                initialValue = savedState;
            }
            else {
                // No need to debounce this because it's executed only once
                this.saveStateToLocalStorage(key, initialValue);
            }
        }

        // Timer for debounce
        let timerId: any = null;

        const onGlobalStateChange = (newValue: any) => {
            // Note key, persist & timerId variables depends on the scope
            this.onStoreUpdate({ key: key, action: 'update', value: newValue });

            if (persist) {
                // Debounce saving state to localStorage because `onGlobalStateChange`
                // is called every time the store state changes. However, it should not
                // be called too often because it triggers the expensive `JSON.stringify` operation.
                clearTimeout(timerId);
                timerId = setTimeout(() => {
                    this.saveStateToLocalStorage(key, newValue);
                }, this.LOCAL_STORAGE_UPDATE_DEBOUNCE_TIME);
            }
        }
        onGlobalStateChange.bind(this);

        const onGlobalStateDelete = () => {
            if (persist) {
                // Delete state from localStorage
                this.deleteStateFromLocalStorage(key);
            }
        }
        onGlobalStateDelete.bind(this);

        const observer = {
            sendUpdateSignal: onGlobalStateChange,
            sendDeleteSignal: onGlobalStateDelete
        }

        // Create key based global state
        this.value[key] = createGlobalstate(initialValue);
        this.value[key].subscribe(observer);
    }

    getState(
        key: string,
        config: { default?: any, persist: boolean } = { persist: false }
    ) {
        const defaultValue: any = config.default;
        const persist: boolean = config.persist;
        // Get key based global state
        if (this.value[key] === undefined) {  // Global state is not found
            if (defaultValue !== undefined) {  // Default value is found
                // Create a global state and use defaultValue as the initial value
                this.setState(key, defaultValue, { persist: persist });
            }
            else {
                // Global state is not found and the default value is not specified
                const errorMsg = [
                    `There is no global state with the key '${key}', `,
                    `You are either trying to access a global `,
                    `state which was not created or it was deleted.`
                ];
                throw TypeError(errorMsg.join(""));
            }
        }
        return this.value[key];
    }

    clear(fn?: () => any) {
        // Copy store
        const storeCopy = this.value;

        // Clear store
        this.value = {};

        if (fn) {
            // Run store re-initialization
            fn();
        }

        for (let key in storeCopy) {
            // Notify subscribers to a store that a global state has been removed
            this.onStoreUpdate({ key: key, action: 'delete' });

            // Get global state to remove
            let globalState = storeCopy[key];

            // Rerender all components
            globalState.delete()
        }
    }

    remove(globalStatekey: string | string[], fn?: () => any) {

        let keys: string[] = [];
        if (typeof globalStatekey === 'string') {
            keys = [globalStatekey];
        }
        else {
            keys = globalStatekey;
        }

        const globalStatesToRemove: { [key: string]: GlobalState } = {};
        keys.forEach(key => {
            // Copy global state to remove from a store
            globalStatesToRemove[key] = this.getState(key);

            // Remove global state from a store
            delete this.value[key];
        });

        if (fn) {
            // Run global state re-initialization
            fn();
        }

        for (let key in globalStatesToRemove) {
            // Notify subscribers to a store that a global state has been removed
            this.onStoreUpdate({ key: key, action: 'delete' });

            // Get global state to delete
            let globalState = globalStatesToRemove[key];

            // Rerender all components
            globalState.delete()
        }
    }
}

// Create store for key based global state
const store: GlobalStateStore = new GlobalStateStore();

export { GlobalStateStore, store };
