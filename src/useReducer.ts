import React from 'react';
import State, { createState } from './State';
import { Patcher, Reducer, Selector, StateInitializer } from './types';



function useStateObject(state) {
    // This is for internal use only
    const localStateRef = React.useMemo(() => {
        if (state instanceof State) {
            // We have a global state, so we'll simply pass it out
            return null;
        }
        else {
            // We have a local state, so we create state obj and keep its ref for futer renders
            return createState(state);
        }
    }, [])

    let stateObject: State<unknown>;
    if (localStateRef instanceof State) {
        stateObject = localStateRef;
    }
    else {
        stateObject = state as State<unknown>;
    }

    return stateObject;
}


export default function useReducer<T, A>(
    reducer: Reducer<T, A>,
    state: State<T> | StateInitializer<T> | T,
    config?: {}
): [
        state: T,
        dispatch: (action: A) => void,
        stateObject: State<T>
    ];

export default function useReducer<ST, A, T = unknown>(
    reducer: Reducer<ST, A>,
    state: State<T | never> | StateInitializer<T> | T,
    config: { selector: Selector<ST> }
): [
        state: ST,
        dispatch: (action: A) => void,
        stateObject: State<T>
    ];

export default function useReducer<ST, A, T = unknown>(
    reducer: Reducer<ST, A>,
    state: State<T | never> | StateInitializer<T> | T,
    config: { selector: Selector<ST>, patcher: Patcher<ST> }
): [
        state: ST,
        dispatch: (action: A) => void,
        stateObject: State<T>
    ];

export default function useReducer(
    reducer: Reducer<unknown, unknown>,
    state: State<unknown> | unknown,
    config: { selector?: Selector<unknown>, patcher?: Patcher<unknown> } = {}
): [
        state: unknown,
        dispatch: unknown,
        stateObject: State<unknown>
    ] {
    const [, setState] = React.useState(null);
    const isMounted = React.useRef(false);

    const stateObject = useStateObject(state);

    const currentState = stateObject.getValue(config.selector);

    function reRender() {
        // re-render if the component is mounted
        if (isMounted.current) {
            setState({});
        }
    }

    function observer(newState) {
        if (currentState === newState) {
            // Do nothing because the selected state is up-to-date
        }
        else {
            reRender();
        }
    }

    const subscription = {
        observer: observer,
        selector: config.selector ?
            config.selector :
            (state) => state,  // Select the whole state if selector is not specified
        refresh: reRender
    }

    React.useEffect(() => {
        const unsubscribe = stateObject.subscribe(subscription);
        isMounted.current = true;

        return () => {
            unsubscribe();
            isMounted.current = false;
        }
    }, [currentState, State])

    function dispatch(action: unknown) {
        const newState = reducer(currentState, action);
        stateObject.setValue(newState, config);
    }

    return [currentState, dispatch, stateObject]
}
