import { useState, useEffect } from 'react';
import produce from 'immer';


function useGlobalReducer(reducer, globalState, { selector, patcher } = {}) {
    const [, setState] = useState();
    const currentState = globalState.getValue();

    function sendUpdateSignal(newState) {
        if (selector && selector(currentState) === selector(newState)) {
            // Do nothing because the selected state has not changed
        }
        else {
            // re-render
            setState({});
        }
    }

    function sendDeleteSignal() {
        setState({});
    }

    const observer = {
        sendUpdateSignal: sendUpdateSignal,
        sendDeleteSignal: sendDeleteSignal
    }

    useEffect(() => {
        globalState.subscribe(observer);
        return () => {
            globalState.unsubscribe(observer);
        }
    })

    function dispatch(action) {
        const newState = reducer(globalState.getValue(), action);
        globalState.setValue(newState);
    }

    function patch(action) {
        // patch back changed node to the global state
        const nodeValue = reducer(selector(currentState), action);
        const newState = produce(
            currentState,
            (draftCurrentState) => { return patcher(draftCurrentState, nodeValue); }
        )
        globalState.setValue(newState);
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

export { useGlobalReducer };
