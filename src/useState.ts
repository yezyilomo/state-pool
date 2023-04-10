import React from 'react';
import useReducer from './useReducer';
import State, { createState } from './State';
import { Patcher, Selector, SetState, StateInitializer, UpdateState } from './types';



export default function useState<T>(
    state: State<T> | StateInitializer<T> | T,
    config?: {}
): [
        state: T,
        setState: SetState<T>,
        updateState: UpdateState<T>
    ];

export default function useState<ST, T = unknown>(
    state: State<T | never> | StateInitializer<T> | T,
    config: { selector: Selector<ST> },
): [
        state: ST,
        setState: SetState<T>,
        updateState: UpdateState<T>
    ];

export default function useState<ST, T = unknown>(
    state: State<T | never> | StateInitializer<T> | T,
    config: { selector: Selector<ST>, patcher: Patcher<ST> },
): [
        state: ST,
        setState: SetState<ST>,
        updateState: UpdateState<ST>
    ];

export default function useState(
    state: State<unknown> | unknown,
    config: { selector?: Selector<unknown>, patcher?: Patcher<unknown> } = {},
): [
        state: unknown,
        setState: SetState<unknown>,
        updateState: UpdateState<unknown>
    ] {

    function reducer(currentState, newState) {
        return newState;
    }


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


    const [stateValue, setStateValue] = useReducer(reducer, _state, config);

    function updateStateValue(updater): void {
        _state.updateValue(updater, config);
    }

    return [stateValue, setStateValue, updateStateValue];
}