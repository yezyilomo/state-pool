import produce from 'immer';
import { useGlobalReducer } from './useGlobalReducer';


function useGlobal(globalState) {
    function reducer(state, newState) {
        return newState;
    }

    const [state, setState] = useGlobalReducer(reducer, globalState);

    function updateState(fn) {
        let newState = produce(state, fn);
        setState(newState);
    }

    return [state, updateState];
}

export { useGlobal };
