import { useState, useEffect } from 'react';
import produce from 'immer';


function useGlobalReducer(reducer, globalState, { selector, patcher } = {}) {
    const [, setState] = useState();
    const currentState = globalState.getValue();

    function reRender(newState) {
        if (selector && selector(currentState) === selector(newState)) {
            // Do nothing because the selected state has not changed
        }
        else {
            // re-render
            setState({});
        }
    }

    useEffect(() => {
        globalState.subscribe(reRender);
        return () => {
            globalState.unsubscribe(reRender);
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
