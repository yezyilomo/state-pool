import { useState, useEffect } from 'react';


function useGlobalStateReducer(reducer, globalState) {
    function updateGlobalState(action) {
        let newState = reducer(globalState.value, action);
        globalState.update(newState);
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

    return [globalState.value, updateGlobalState];
}

export { useGlobalStateReducer };
