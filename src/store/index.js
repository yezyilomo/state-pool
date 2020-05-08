function GlobalState(initialValue) {
    this.value = initialValue;

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
            subscriber.reRender();
        });
    }

    this.subscribers = [];

    this.subscribe = function (component) {
        if (this.subscribers.indexOf(component) > -1) {
            // Already subsribed
            return
        }
        // Subscribe a component
        this.subscribers.push(component);
    }

    this.unsubscribe = function (component) {
        this.subscribers = this.subscribers.filter(
            subscriber => subscriber !== component
        );
    }
}


function createGlobalstate(initialValue) {
    return new GlobalState(initialValue);
}


function Store() {
    this.value = null;  // Global state container for key based state

    this.init = function (initialState) {
        this.value = initialState;
    }

    this.setState = function (key, initialValue) {
        // Create key based global state
        this.value[key] = createGlobalstate(initialValue);
    }

    this.getState = function (key, defaultValue) {
        // Get key based global state
        if (this.value[key] === undefined) {
            // Global state if not found
            if (defaultValue !== undefined) {
                // Create a global state and assign a default value,
                // This is to avoid returning undefined as  global state
                this.value[key] = createGlobalstate(defaultValue);
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
