import { useState, useEffect } from 'react';


function useGlobalReducer(reducer, globalState) {
    function dispatch(action) {
        let newState = reducer(globalState.getValue(), action);
        globalState.setValue(newState);
    }

    const [, setState] = useState();

    function reRender(newState) {
        setState({});
    }

    useEffect(() => {
        globalState.subscribe(reRender);
        return () => {
            globalState.unsubscribe(reRender);
        }
    })

    return [globalState.getValue(), dispatch];
}

export { useGlobalReducer };
