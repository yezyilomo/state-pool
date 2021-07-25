import produce from 'immer';

import { useState, useEffect, useRef } from 'react';
import { GlobalState } from './GlobalState';
import { store } from './GlobalStateStore';


type Reducer = (currentState: any, newState: any) => any
type Config = {
    default?: any,
    selector?: (state: any) => any,
    patcher?: (state: any, selectedState: any) => any,
    persist: boolean
}

function useGlobalStateReducer(
    reducer: Reducer,
    globalState: string | GlobalState,
    config: Config = { persist: true }
): [any, (action: any) => any] {

    let _globalState: GlobalState;

    if (typeof globalState === 'string') {
        _globalState = store.getState(globalState, config);
    }
    else {
        _globalState = globalState;
    }

    const [, setState]: [any, any] = useState();
    const isMounted = useRef(false);
    const currentState = _globalState.getValue();
    const selector = config.selector;
    const patcher = config.patcher;

    function reRender() {
        // re-render if the component is mounted
        if (isMounted.current) {
            setState({});
        }
    }

    function sendUpdateSignal(newState: any) {
        if (selector && selector(currentState) === selector(newState)) {
            // Do nothing because the selected state has not changed
        }
        else {
            reRender();
        }
    }

    function sendDeleteSignal() {
        reRender();
    }

    const observer = {
        sendUpdateSignal: sendUpdateSignal,
        sendDeleteSignal: sendDeleteSignal
    }

    useEffect(() => {
        _globalState.subscribe(observer);
        isMounted.current = true;

        return () => {
            _globalState.unsubscribe(observer);
            isMounted.current = false;
        }
    }, [])

    function dispatch(action: any) {
        const newState = reducer(_globalState.getValue(), action);
        _globalState.setValue(newState);
    }

    function patch(action: any) {
        // patch back changed node to the global state
        const nodeValue = reducer(selector(currentState), action);
        const newState = produce(
            currentState,
            (draftCurrentState: any) => {
                return patcher(draftCurrentState, nodeValue);
            }
        )
        _globalState.setValue(newState);
    }

    if (selector) {
        if (patcher) {
            return [selector(currentState), patch];
        }
        else {
            return [selector(currentState), dispatch];
        }
    }
    return [currentState, dispatch];
}

export { useGlobalStateReducer };
