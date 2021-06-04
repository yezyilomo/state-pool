import produce from "immer";
import { useReducer } from 'react';


function useLocalState(initialState) {
    function reducer(state, newState) {
        return newState;
    }
    const [state, setState] = useReducer(reducer, initialState);

    function updateState(fn) {
        const newState = produce(state, fn);
        setState(newState);
    }

    return [state, setState, updateState];
}

export { useLocalState };
