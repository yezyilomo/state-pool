var store = {};  // Global state container for key based state

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


function setGlobalState(key, initialValue) {
    // Create key based global state
    store[key] = createGlobalstate(initialValue);
}


function getGlobalState(key) {
    // Get key based global state
    return store[key];
}

export { createGlobalstate, setGlobalState, getGlobalState };
