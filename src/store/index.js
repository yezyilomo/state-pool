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


function Empty() {

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

    this.getState = function (key, defaultValue = Empty) {
        // Get key based global state
        if (this.value[key] === undefined && defaultValue !== Empty) {
            // This is to avoid returning undefined
            this.value[key] = createGlobalstate(defaultValue);
        }
        return this.value[key];
    }
}

// Create store for key based global state
var store = new Store();

export { createGlobalstate, store, Empty };
