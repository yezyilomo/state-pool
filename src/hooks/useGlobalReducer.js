import { useState, useEffect } from 'react';
import produce from 'immer';


function useGlobalReducer(reducer, globalState, {selector, patcher} = {}) {
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
        let newState = reducer(globalState.getValue(), action);
        globalState.setValue(newState);
    }

    function patch(action) {
        let nodeValue = reducer(selector(currentState), action);
        let newState = produce(
            currentState,
            (draftCurrentState) => { return patcher(draftCurrentState, nodeValue); }
        )
        globalState.setValue(newState);
    }

    if (selector && patcher) {
        return [selector(currentState), patch];
    }
    return [currentState, dispatch];
}

export { useGlobalReducer };
