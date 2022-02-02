import { GlobalState } from './GlobalState';
import { useGlobalStateReducer } from './useGlobalStateReducer';


type Config = {
    selector?: (state: any) => any,
    patcher?: (state: any, selectedStateValue: any) => any
}

type ReturnType<T> = [
    state: T,
    setState: (state: any) => any,
    updateState: (
        updater: (currentState: any) => any
    ) => any
]

function useGlobalState<T>(
    globalState: GlobalState<any>,
    config: Config = {},
): ReturnType<T> {
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
