import produce from 'immer';
import { GlobalState } from './GlobalState';
import { store } from './GlobalStateStore';
import { useGlobalStateReducer } from './useGlobalStateReducer';


type Config = {
    default?: any,
    selector?: (state: any) => any,
    patcher?: (state: any, selectedState: any) => any,
    persist: boolean
}

function useGlobalState(
    globalState: string | GlobalState,
    config: Config = { persist: true }
): [any, (value: any) => any, (state: any) => any] {
    if (typeof globalState === 'string') {
        globalState = store.getState(globalState, config);
    }

    function reducer(currentState: any, newState: any) {
        return newState;
    }

    const [state, setState] = useGlobalStateReducer(reducer, globalState, config);

    let globalStateValue = state;

    if (config.selector && !config.patcher) {
        globalStateValue = globalState.getValue();
    }

    function updateState(fn: (oldState: any) => void) {
        const newState = produce(globalStateValue, fn);
        setState(newState);
    }

    return [state, setState, updateState];
}

export { useGlobalState };
