var store = {};  // Global state container for key based state

function GlobalState(initialValue) {
    this.value = initialValue;

    this.getValue = function () {
        return this.value;
    }

    this.setValue = function (newState) {
        this.value = newState;
        this.subscribers.forEach(subscriber => {
            subscriber.reRender();
        });
    }

    this.updateValue = function (oldState, updaterFunction) {
        updaterFunction(oldState);
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


function setGlobalstate(key, initialValue) {
    // Create key based global state
    store[key] = createGlobalstate(initialValue);
}


function getGlobalState(key) {
    // Get key based global state
    return store[key];
}

export { createGlobalstate, setGlobalstate, getGlobalState };
