import { useState, useEffect, useRef } from 'react';
import produce from 'immer';


function useGlobalReducer(reducer, globalState, { selector, patcher } = {}) {
    const [, setState] = useState();
    const isMounted = useRef(false);
    const currentState = globalState.getValue();

    function reRender() {
        // re-render if the component is mounted
        if (isMounted.current) {
            setState({});
        }
    }

    function sendUpdateSignal(newState) {
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
        globalState.subscribe(observer);
        isMounted.current = true;
        return () => {
            globalState.unsubscribe(observer);
            isMounted.current = false;
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
