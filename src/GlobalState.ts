import produce, { nothing } from "immer";
import { Selector, HookConfig, Unsubscribe } from './types';


type Observer = (value: any) => void
type Updater = (state: any) => void
type StateUpdater = (state: any) => any
type Refresh = () => void

type Subscriber = {
    observer: Observer,
    selector: Selector<any>,
    refresh?: Refresh
}


class GlobalState<T> {
    private value: T;
    private subscribers: Array<Subscriber>;

    constructor(initialValue: T) {
        this.value = initialValue;
        this.subscribers = [];
    }

    getValue<ST>(selector?: Selector<ST>): T | ST {
        if (selector) {
            return selector(this.value);
        }
        return this.value;
    }

    refresh(): void {
        this.subscribers.forEach(subscriber => {
            if (subscriber.refresh) {
                subscriber.refresh();
            }
        });
    }

    setValue(newValue: T | StateUpdater, config: HookConfig = {}) {
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

    updateValue(updater: Updater, config: HookConfig = {}): void {
        const updaterWrapper = function (draftState) {
            // This wrapper is for disabling setting returned value
            // We don't allow returned value to be set(just return undefined)
            updater(draftState)
        }

        this.__updateValue(updaterWrapper, config)
    }

    private __updateValue(updater: StateUpdater, config: HookConfig = {}): void {
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
            this.subscribers.forEach(subscriber => {
                if (subscriber.selector(newState) !== subscriber.selector(oldState)) {
                    // Node value has changed
                    subscriber.observer(
                        subscriber.selector(newState)
                    );
                }
            });
        }
    }

    subscribe(itemToSubscribe: Subscriber | Observer): Unsubscribe {
        let _itemToSubscribe: Subscriber;
        if (Object.prototype.toString.call(itemToSubscribe) === '[object Function]') {
            _itemToSubscribe = {
                observer: itemToSubscribe as Observer,
                selector: (state) => state
            }
        }
        else {
            _itemToSubscribe = itemToSubscribe as Subscriber;
        }

        if (this.subscribers.indexOf(_itemToSubscribe) === -1) {
            // Subscribe a component to this global state
            this.subscribers.push(_itemToSubscribe);
        };

        const unsubscribe = () => {
            this.subscribers = this.subscribers.filter(
                subscriber => (subscriber !== _itemToSubscribe)
            );
        }

        return unsubscribe;
    }

    select<T>(selector: Selector<T>): DerivedGlobalState<T> {
        return createDerivedGlobalstate(this, selector);
    }
}


class DerivedGlobalState<T> {
    globalState: GlobalState<any>;
    selector: Selector<T>;

    constructor(globalState: GlobalState<any>, selector: Selector<T>) {
        this.globalState = globalState;
        this.selector = selector;
    }

    getValue(): T {
        return this.globalState.getValue(this.selector)
    }

    subscribe(observer?: Observer, refresh?: Refresh): Unsubscribe {
        const itemToSubscribe: Subscriber = {
            observer: observer,
            selector: this.selector,
            refresh: refresh
        }

        return this.globalState.subscribe(itemToSubscribe);
    }
}


function createDerivedGlobalstate<T>(globalState: GlobalState<any>, selector: Selector<T>): DerivedGlobalState<T> {
    return new DerivedGlobalState<T>(globalState, selector);
}


function createGlobalstate<T>(initialValue: T): GlobalState<T> {
    return new GlobalState<T>(initialValue);
}

export { GlobalState, DerivedGlobalState, createGlobalstate };