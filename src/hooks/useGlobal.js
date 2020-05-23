import produce from 'immer';
import { useGlobalReducer } from './useGlobalReducer';


function useGlobal(globalState, config = {}) {
    function reducer(state, newState) {
        return newState;
    }

    const [state, setState] = useGlobalReducer(reducer, globalState, config);

    function updateState(fn) {
        const newState = produce(state, fn);
        setState(newState);
    }

    return [state, updateState];
}

export { useGlobal };
