import produce from 'immer';
import { useGlobalStateReducer } from './useGlobalStateReducer';


function useGlobalState(globalState) {
    function reducer(state, newState) {
        return newState;
    }

    const [state, setState] = useGlobalStateReducer(reducer, globalState);

    function updateState(fn) {
        let newState = produce(state, fn);
        setState(newState);
    }

    return [state, setState, updateState];
}

export { useGlobalState };
