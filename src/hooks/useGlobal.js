import produce from 'immer';
import { useGlobalReducer } from './useGlobalReducer';


function useGlobal(globalState, config = {}) {
    function reducer(state, newState) {
        return newState;
    }

    const [state, setState] = useGlobalReducer(reducer, globalState, config);

    let globalStateValue = state;

    if (config.selector && !config.patcher) {
        globalStateValue = globalState.getValue();
    }

    function updateState(fn) {
        const newState = produce(globalStateValue, fn);
        setState(newState);
    }

    return [state, updateState];
}

export { useGlobal };
