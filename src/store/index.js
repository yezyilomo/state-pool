var store = {};  // Global state container for key based state

function GlobalState(initialValue){
    this.value = initialValue;
    
    this.update = function(newState){
        this.value = newState;
        this.subscribers.forEach(subscriber => {
            subscriber.reRender();
        });
    }
    
    this.subscribers = [];
    
    this.subscribe = function(component){
        this.subscribers.push(component);
    }
}


function createGlobalstate(initialValue){
    return new GlobalState(initialValue);
}


function setGlobalstate(key, initialValue){
    // Create key based global state
    store[key] = createGlobalstate(initialValue);
}


function getGlobalState(key){
    // Get key based global state
    return store[key];
}

export {createGlobalstate, setGlobalstate, getGlobalState};
