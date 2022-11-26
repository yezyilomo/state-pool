import { GlobalState } from './GlobalState';
import { HookConfig } from './types';
import { useGlobalStateReducer } from './useGlobalStateReducer';


type HookReturnType<T> = [
    state: T,
    setState: (state: any) => any,
    updateState: (
        updater: (currentState: any) => any
    ) => any
]

function useGlobalState<T>(
    globalState: GlobalState<any>,
    config: HookConfig = {},
): HookReturnType<T> {
    function reducer(currentState: any, newState: any) {
        return newState;
    }

    const [state, setState] = useGlobalStateReducer<T>(reducer, globalState, config);

    function updateState(updater: (currentState: any) => any) {
        globalState.updateValue(updater, config);
    }

    return [state, setState, updateState];
}

export { useGlobalState };
