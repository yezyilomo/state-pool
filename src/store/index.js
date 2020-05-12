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

    this.init = function (initialState, persist=false) {
        for(let key in initialState){
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

    this.onStoreUpdate = function(key, newValue){
        this.subscribers.forEach(subscriber => {
            subscriber(key, newValue);
        });
    }

    this.setState = function (key, initialValue, persist=false) {
        if (persist){
            let savedState = window.localStorage.getItem(key);
            if (savedState !== null){
                initialValue = JSON.parse(savedState);
            }
            else{
                window.localStorage.setItem(key, JSON.stringify(initialValue));
            }
        }

        let onGlobalStateChange = (newValue) => {
            // Note key & persist variables depends on the scope
            this.onStoreUpdate(key, newValue);
            if(persist){
                window.localStorage.setItem(key, JSON.stringify(newValue));
            }
        }
        onGlobalStateChange.bind(this);

        // Create key based global state
        this.value[key] = createGlobalstate(initialValue);
        this.value[key].subscribe(onGlobalStateChange);
    }

    this.getState = function (key, defaultValue, persist=false) {
        // Get key based global state
        if (this.value[key] === undefined) {
            // Global state if not found
            if (defaultValue !== undefined) {
                // Create a global state and assign a default value,
                // This is to avoid returning undefined as  global state
                this.setState(key, defaultValue, persist);
            }
            else {
                // Global state is not found and no default value is specified
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
