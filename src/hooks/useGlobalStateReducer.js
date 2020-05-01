import { useState, useEffect } from 'react';


function useGlobalStateReducer(reducer, globalState) {
    function setGlobalState(action) {
        let newState = reducer(globalState.getValue(), action);
        globalState.setValue(newState);
    }

    function updateGlobalState(fn) {
        globalState.updateValue(globalState.getValue(), fn);
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

    return [globalState.getValue(), setGlobalState, updateGlobalState];
}

export { useGlobalStateReducer };
