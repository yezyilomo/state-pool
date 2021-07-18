class GlobalState {
    value: any;
    subscribers: any[]

    constructor(initialValue: any) {
        this.value = initialValue;
        this.subscribers = [];
    }

    getValue() {
        return this.value;
    }

    setValue(newState: any) {
        if (this.getValue() === newState) {
            // No new update
            return
        }
        this.value = newState;
        this.subscribers.forEach(subscriber => {
            subscriber.sendUpdateSignal(this.value);
        });
    }

    public delete() {
        this.subscribers.forEach(subscriber => {
            subscriber.sendDeleteSignal();
        });
    }

    subscribe(itemToSubscribe: any) {
        if (this.subscribers.indexOf(itemToSubscribe) > -1) {
            // Already subscribed
            return
        }
        // Subscribe a component to this global state
        this.subscribers.push(itemToSubscribe);
    }

    unsubscribe(itemToUnsubscribe: any) {
        this.subscribers = this.subscribers.filter(
            subscriber => subscriber !== itemToUnsubscribe
        );
    }
}


function createGlobalstate(initialValue: any): GlobalState {
    return new GlobalState(initialValue);
}

export { GlobalState, createGlobalstate };