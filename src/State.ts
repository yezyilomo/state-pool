import { produce, nothing } from "immer";
import {
    StateInitializer, Selector, Patcher,
    Reducer, Unsubscribe, StateModifier,
    StateUpdater, SetState, UpdateState,
} from './types';
import _useState from "./useState";
import _useReducer from "./useReducer";



type Refresh = () => void

// Might subscribe to derived/selected state, so we use <ST> cuz it might not always be <T>
type Observer<ST> = (newState: ST) => void

// Subscribe to a state
type Subscriber<ST> = {
    observer: Observer<ST>,
    selector: Selector<ST>,
    refresh?: Refresh
}


export default class State<T> {
    private value: T;
    private subscribers: Array<Subscriber<unknown>>;

    constructor(initialValue: StateInitializer<T> | T) {
        if (typeof initialValue === "function") {
            this.value = (initialValue as StateInitializer<T>)();
        }
        else {
            this.value = initialValue as T;
        }
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

    setValue(
        newValue: T | StateUpdater<T>
    ): void;

    setValue<ST>(
        newValue: ST | StateUpdater<ST>,
        config: { selector?: Selector<ST> }
    ): void;

    setValue<ST>(
        newValue: ST | StateUpdater<ST>,
        config: { selector?: Selector<ST>, patcher?: Patcher<ST> },
    ): void;

    setValue<ST>(
        newValue: (T | ST) | StateUpdater<T | ST>,
        config: { selector?: Selector<T | ST>, patcher?: Patcher<T | ST> } = {},
    ): void {
        if (newValue === undefined) {
            this.__updateValue<T | ST>(
                (draftVal) => nothing as undefined,  // nothing is equivalent to undefined
                config
            )
        }
        else if (typeof newValue === 'function') {
            const reducer = newValue as StateUpdater<T | ST>

            this.setValue(
                reducer(this.getValue(config.selector)), config
            )
        }
        else {
            this.__updateValue<T | ST>(
                (draftVal) => newValue,
                config
            )
        }
    }


    updateValue(
        stateModifier: StateModifier<T>
    ): void;

    updateValue<ST>(
        stateModifier: StateModifier<ST>,
        config: { selector?: Selector<ST> }
    ): void;

    updateValue<ST>(
        stateModifier: StateModifier<ST>,
        config: { selector?: Selector<ST>, patcher?: Patcher<ST> }
    ): void;

    updateValue<ST>(
        stateModifier: StateModifier<T> | StateModifier<ST>,
        config: { selector?: Selector<T | ST>, patcher?: Patcher<T | ST> } = {},
    ): void {
        const stateModifierWrapper = function (draftState) {
            // This wrapper is for disabling setting returned value
            // We don't allow returned value to be set(just return undefined)
            stateModifier(draftState)
        }

        this.__updateValue<ST>(stateModifierWrapper, config)
    }

    private __updateValue<ST>(stateUpdater: StateUpdater<T | ST> | StateModifier<T | ST>, config): void {
        // No need to do a lot of type checking here bcuz this is an internal method
        const selector = config.selector as Selector<ST>;
        const patcher = config.patcher as Patcher<ST>;

        const oldState = this.value;

        let newState: T;
        if (selector && patcher) {
            // Update the selected node first and get its value
            const selectedNodeValue: ST = produce(selector(oldState), stateUpdater) as ST;

            // Here we're patching back the updated selected node to the main state
            newState = produce(
                oldState,
                (draftCurrentState: T) => {
                    // Avoid setting returns
                    patcher(draftCurrentState, selectedNodeValue);
                }
            )
        }
        else {
            newState = produce(oldState, stateUpdater);
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

    subscribe<ST>(itemToSubscribe: Subscriber<T | ST> | Observer<T | ST>): Unsubscribe {
        let _itemToSubscribe;
        if (typeof itemToSubscribe === 'function') {
            const selector: Selector<T> = (state) => state;
            _itemToSubscribe = {
                observer: itemToSubscribe as Observer<T>,
                selector: selector
            } as Subscriber<T>;
        }
        else {
            _itemToSubscribe = itemToSubscribe as Subscriber<ST>;
        }

        if (this.subscribers.indexOf(_itemToSubscribe) === -1) {
            // Subscribe a component to this state
            this.subscribers.push(_itemToSubscribe);
        };

        const unsubscribe = () => {
            this.subscribers = this.subscribers.filter(
                subscriber => (subscriber !== _itemToSubscribe)
            );
        }

        return unsubscribe;
    }

    select<ST>(selector: Selector<ST>): DerivedState<T, ST> {
        return createDerivedState(this, selector);
    }


    useState(config?: {}): [
        state: T,
        setState: SetState<T>,
        updateState: UpdateState<T>,
        stateObject: State<T>
    ];

    useState<ST>(
        config: { selector: Selector<ST> },
    ): [
            state: ST,
            setState: SetState<T>,
            updateState: UpdateState<T>,
            stateObject: State<T>
        ];

    useState<ST>(
        config: { selector: Selector<ST>, patcher: Patcher<ST> },
    ): [
            state: ST,
            setState: SetState<ST>,
            updateState: UpdateState<ST>,
            stateObject: State<T>
        ]

    useState<ST>(
        config: { selector?: Selector<T | ST>, patcher?: Patcher<T | ST> } = {},
    ): [
            state: T | ST,
            setState: SetState<T | ST>,
            updateState: UpdateState<T | ST>,
            stateObject: State<T>
        ] {
        return _useState(this, config);
    }


    useReducer<_T extends T, A>(
        reducer: Reducer<_T, A>,
        config?: {}
    ): [
            state: _T,
            dispatch: (action: A) => void,
            stateObject: State<_T>
        ];

    useReducer<ST, A>(
        reducer: Reducer<ST, A>,
        config: { selector: Selector<ST> }
    ): [
            state: ST,
            dispatch: (action: A) => void,
            stateObject: State<T>
        ];

    useReducer<ST, A>(
        reducer: Reducer<ST, A>,
        config: { selector: Selector<ST>, patcher: Patcher<ST> }
    ): [
            state: ST,
            dispatch: (action: A) => void,
            stateObject: State<T>
        ]

    useReducer(
        reducer: Reducer<unknown, unknown>,
        config: { selector?: Selector<unknown>, patcher?: Patcher<unknown> } = {}
    ): [
            state: unknown,
            dispatch: (action: unknown) => void,
            stateObject: State<unknown>
        ] {
        return _useReducer(reducer, this, config);
    }
}


export class DerivedState<T, ST> {
    State: State<unknown>;
    selector: Selector<ST>;

    constructor(State: State<unknown>, selector: Selector<ST>) {
        this.State = State;
        this.selector = selector;
    }

    getValue(): ST {
        return this.State.getValue(this.selector) as ST;
    }

    subscribe(observer?: Observer<ST>, refresh?: Refresh): Unsubscribe {
        const itemToSubscribe: Subscriber<ST> = {
            observer: observer,
            selector: this.selector,
            refresh: refresh
        }

        return this.State.subscribe(itemToSubscribe);
    }
}


export function createDerivedState<T, ST>(State: State<T>, selector: Selector<ST>): DerivedState<T, ST> {
    return new DerivedState<T, ST>(State, selector);
}


export function createState<T>(initialValue: StateInitializer<T> | T): State<T> {
    return new State<T>(initialValue);
}