function GlobalState(initialValue) {
    this.value = initialValue;
    this.subscribers = [];

    this.getValue = function () {
        return this.value;
    }

    this.setValue = function (newState) {
        if (this.getValue() === newState) {
            // No new update
            return
        }
        this.value = newState;
        this.subscribers.forEach(subscriber => {
            subscriber(this.value);
        });
    }

    this.subscribe = function (itemToSubscribe) {
        if (this.subscribers.indexOf(itemToSubscribe) > -1) {
            // Already subsribed
            return
        }
        // Subscribe a component
        this.subscribers.push(itemToSubscribe);
    }

    this.unsubscribe = function (itemToUnsubscribe) {
        this.subscribers = this.subscribers.filter(
            subscriber => subscriber !== itemToUnsubscribe
        );
    }
}


function createGlobalstate(initialValue) {
    return new GlobalState(initialValue);
}


function Store() {
    this.value = {};  // Global state container for key based state

    this.subscribers = [];

    this.LOCAL_STORAGE_UPDATE_DEBOUNCE_TIME = 1000;  // Local storage update debounce time in ms

    this.init = function (initialState, persist) {
        for (let key in initialState) {
            this.setState(key, initialState[key], persist);
        }
    }

    this.subscribe = function (itemToSubscribe) {
        if (this.subscribers.indexOf(itemToSubscribe) > -1) {
            // Already subsribed
            return
        }
        // Subscribe a component
        this.subscribers.push(itemToSubscribe);
    }

    this.unsubscribe = function (itemToUnsubscribe) {
        this.subscribers = this.subscribers.filter(
            subscriber => subscriber !== itemToUnsubscribe
        );
    }

    this.onStoreUpdate = function (key, newValue) {
        this.subscribers.forEach(subscriber => {
            subscriber(key, newValue);
        });
    }

    this.getStateFromLocalStorage = function (key) {
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

    this.saveStateToLocalStorage = function (key, state) {
        try {
            const serializedState = JSON.stringify(state);
            window.localStorage.setItem(key, serializedState);
        } catch {
            // Ignore write errors
        }
    }

    this.setState = function (key, initialValue, persist) {
        if (persist) {
            // Load state from localStorage
            const savedState = this.getStateFromLocalStorage(key, initialValue);

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
        let timerId = null;

        let onGlobalStateChange = (newValue) => {
            // Note key, persist & timerId variables depends on the scope
            this.onStoreUpdate(key, newValue);

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

        // Create key based global state
        this.value[key] = createGlobalstate(initialValue);
        this.value[key].subscribe(onGlobalStateChange);
    }

    this.getState = function (key, initialValue, persist) {
        // Get key based global state
        if (this.value[key] === undefined) {
            // Global state if not found
            if (initialValue !== undefined) {
                // Create a global state and assign initial value,
                // This is to avoid returning undefined as global state
                this.setState(key, initialValue, persist);
            }
            else {
                // Global state is not found and no initial value is specified
                let errorMsg = [
                    `No global state with the key '${key}', `,
                    `You are either trying to access a global `,
                    `state which was not created or it was deleted.`
                ];
                throw TypeError(errorMsg.join(""));
            }
        }
        return this.value[key];
    }
}

// Create store for key based global state
const store = new Store();

export { createGlobalstate, store };
