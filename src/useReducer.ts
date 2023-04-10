import React from 'react';
import State, { createState } from './State';
import { Patcher, Reducer, Selector, StateInitializer } from './types';



export default function useReducer<T, A>(
    reducer: Reducer<T, A>,
    state: State<T> | StateInitializer<T> | T,
    config?: {}
): [
        state: T,
        dispatch: (action: A) => void
    ];

export default function useReducer<ST, A, T = unknown>(
    reducer: Reducer<ST, A>,
    state: State<T | never> | StateInitializer<T> | T,
    config: { selector: Selector<ST> }
): [
        state: ST,
        dispatch: (action: A) => void
    ];

export default function useReducer<ST, A, T = unknown>(
    reducer: Reducer<ST, A>,
    state: State<T | never> | StateInitializer<T> | T,
    config: { selector: Selector<ST>, patcher: Patcher<ST> }
): [
        state: ST,
        dispatch: (action: A) => void
    ];

export default function useReducer(
    reducer: Reducer<unknown, unknown>,
    state: State<unknown> | unknown,
    config: { selector?: Selector<unknown>, patcher?: Patcher<unknown> } = {}
): [
        state: unknown,
        dispatch: unknown
    ] {
    const [, setState] = React.useState(null);
    const isMounted = React.useRef(false);


    // For locala state
    const localStateRef = React.useMemo(() => {
        if (state instanceof State) {
            return null;
        }
        else {
            return createState(state);  // Hold a reference to a local state
        }
    }, [])

    let _state: State<unknown>;
    if (localStateRef instanceof State) {
        _state = localStateRef;
    }
    else {
        _state = state as State<unknown>;
    }
    // End for local state


    const currentState = _state.getValue(config.selector);

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
        const unsubscribe = _state.subscribe(subscription);
        isMounted.current = true;

        return () => {
            unsubscribe();
            isMounted.current = false;
        }
    }, [currentState, State])

    function dispatch(action: unknown) {
        const newState = reducer(currentState, action);
        _state.setValue(newState, config);
    }

    return [currentState, dispatch]
}
