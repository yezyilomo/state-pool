import produce from "immer";
import { useReducer } from 'react';


function useLocalState(
    initialState: any
): [any, (value: any) => any, (state: any) => any] {
    function reducer(currentState: any, newState: any): any {
        return newState;
    }
    const [state, setState] = useReducer(reducer, initialState);

    function updateState(fn: (currentState: any) => any): any {
        const newState = produce(state, fn);
        setState(newState);
    }

    return [state, setState, updateState];
}

export { useLocalState };
