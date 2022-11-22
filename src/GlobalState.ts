import produce, { nothing } from "immer";


type Observer = (value: any) => void
type Selector<T> = (state: any) => T
type Patcher = (state: any, selectedStateValue: any) => void
type Config = { patcher?: Patcher, selector?: Selector<any> }
type Updater = (state: any) => void
type StateUpdater = (state: any) => any

type Subscription = {
    observer: Observer,
    selector: Selector<any>,
    reRender?: () => void
}


class GlobalState<T> {
    value: T;
    subscriptions: Array<Subscription>;
    persist: boolean;

    constructor(initialValue: T) {
        this.value = initialValue;
        this.subscriptions = [];
        this.persist = false;
    }

    getValue<ST>(selector?: Selector<ST>): T | ST {
        if (selector) {
            return selector(this.value);
        }
        return this.value;
    }

    refresh(): void {
        this.subscriptions.forEach(subscription => {
            if (subscription.reRender) {
                subscription.reRender();
            }
        });
    }

    setValue(newValue: T | StateUpdater, config: Config = {}) {
        if (newValue === undefined) {
            this.__updateValue(
                (draftVal) => nothing,
                config
            )
        }
        else if (Object.prototype.toString.call(newValue) === '[object Function]') {
            const reducer = newValue as StateUpdater

            this.setValue(
                reducer(this.getValue(config.selector)), config
            )
        }
        else {
            this.__updateValue(
                (draftVal) => newValue,
                config
            )
        }
    }

    updateValue(updater: Updater, config: Config = {}): void {
        const updaterWrapper = function(draftState){
            // This wrapper is for disabling setting returned value
            // We don't allow returned value to be set(just return undefined)
            updater(draftState)
        }

        this.__updateValue(updaterWrapper, config)
    }

    private __updateValue(updater: StateUpdater, config: Config = {}): void {
        const selector = config.selector;
        const patcher = config.patcher;

        const oldState = this.value;

        let newState;
        if (selector && patcher) {
            const nodeValue = produce(selector(oldState), updater);

            newState = produce(
                oldState,
                (draftCurrentState) => {
                    // Avoid setting returns
                    patcher(draftCurrentState, nodeValue);
                }
            )
        }
        else {
            newState = produce(oldState, updater);
        }

        this.value = newState;

        if (newState !== oldState) {
            // There's a new update
            this.subscriptions.forEach(subscription => {
                if (subscription.selector(newState) !== subscription.selector(oldState)) {
                    // Node value has changed
                    subscription.observer(
                        subscription.selector(newState)
                    );
                }
            });
        }
    }

    subscribe(itemToSubscribe: Subscription | Observer): () => void {
        let _itemToSubscribe: Subscription;
        if (Object.prototype.toString.call(itemToSubscribe) === '[object Function]') {
            _itemToSubscribe = {
                observer: itemToSubscribe as Observer,
                selector: (state) => state
            }
        }
        else {
            _itemToSubscribe = itemToSubscribe as Subscription;
        }

        if (this.subscriptions.indexOf(_itemToSubscribe) === -1) {
            // Subscribe a component to this global state
            this.subscriptions.push(_itemToSubscribe);
        };

        const unsubscribe = () => {
            this.subscriptions = this.subscriptions.filter(
                subscription => (subscription !== _itemToSubscribe)
            );
        }

        return unsubscribe;
    }
}


function createGlobalstate<T>(initialValue: T): GlobalState<T> {
    return new GlobalState<T>(initialValue);
}

export { GlobalState, createGlobalstate };