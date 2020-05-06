import { useState, useEffect } from 'react';


function useGlobalReducer(reducer, globalState) {
    function dispatch(action) {
        let newState = reducer(globalState.getValue(), action);
        globalState.setValue(newState);
    }

    const [, setState] = useState();
    function reRender() {
        setState({});
    }
    let component = { reRender };

    useEffect(() => {
        globalState.subscribe(component);
        return () => {
            globalState.unsubscribe(component);
        }
    })

    return [globalState.getValue(), dispatch];
}

export { useGlobalReducer };
