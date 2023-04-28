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
        updateState: UpdateState<T>,
        stateObject: State<T>
    ];

export default function useState<ST, T = unknown>(
    state: State<T | never> | StateInitializer<T> | T,
    config: { selector: Selector<ST> },
): [
        state: ST,
        setState: SetState<T>,
        updateState: UpdateState<T>,
        stateObject: State<T>
    ];

export default function useState<ST, T = unknown>(
    state: State<T | never> | StateInitializer<T> | T,
    config: { selector: Selector<ST>, patcher: Patcher<ST> },
): [
        state: ST,
        setState: SetState<ST>,
        updateState: UpdateState<ST>,
        stateObject: State<T>
    ];

export default function useState(
    state: State<unknown> | unknown,
    config: { selector?: Selector<unknown>, patcher?: Patcher<unknown> } = {},
): [
        state: unknown,
        setState: SetState<unknown>,
        updateState: UpdateState<unknown>,
        stateObject: State<unknown>
    ] {

    function reducer(currentState, newState) {
        return newState;
    }

    const [stateValue, setStateValue, stateObject] = useReducer(reducer, state, config);

    function updateStateValue(updater): void {
        stateObject.updateValue(updater, config);
    }

    return [stateValue, setStateValue, updateStateValue, stateObject];
}