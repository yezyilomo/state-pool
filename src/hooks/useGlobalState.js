import produce from 'immer';
import { store } from '../store';
import { useGlobalStateReducer } from './useGlobalStateReducer';


function useGlobalState(globalState, config = {}) {
    if (typeof globalState === 'string') {
        globalState = store.getState(globalState, config);
    }

    function reducer(state, newState) {
        return newState;
    }

    const [state, setState] = useGlobalStateReducer(reducer, globalState, config);

    let globalStateValue = state;

    if (config.selector && !config.patcher) {
        globalStateValue = globalState.getValue();
    }

    function updateState(fn) {
        const newState = produce(globalStateValue, fn);
        setState(newState);
    }

    return [state, setState, updateState];
}

export { useGlobalState };
