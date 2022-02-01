import produce from "immer";


type Observer = (value: any) => void
type Selector<T> = (state: any) => T
type Patcher = (state: any, selectedStateValue: any) => any
type Updater = (state: any) => any

type Subscription = {
    observer: Observer,
    selector: Selector<any>,
    reRender?: () => void
}


class GlobalState<ValueType> {
    value: ValueType;
    subscriptions: Array<Subscription>;
    persist: boolean;

    constructor(initialValue: ValueType) {
        this.value = initialValue;
        this.subscriptions = [];
        this.persist = false;
    }

    getValue<SelectedValueType>(selector?: Selector<SelectedValueType>): ValueType| SelectedValueType {
        if (selector) {
            return selector(this.value);
        }
        return this.value;
    }

    refresh() {
        this.subscriptions.forEach(subscription => {
            if (subscription.reRender) {
                subscription.reRender();
            }
        });
    }

    updateValue(updater: Updater, patcher?: Patcher, selector?: Selector<any>) {
        const oldState = this.value;

        let newState;
        if (selector && patcher) {
            const nodeValue = produce(selector(oldState), updater);

            newState = produce(
                oldState,
                (draftCurrentState) => {
                    const val = patcher(draftCurrentState, nodeValue);
                    if (val !== undefined) {
                        return val
                    }
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

    subscribe(itemToSubscribe: Subscription | Observer) {
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


function createGlobalstate<ValueType>(initialValue: ValueType): GlobalState<ValueType> {
    return new GlobalState<ValueType>(initialValue);
}

export { GlobalState, createGlobalstate };