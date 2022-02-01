import { GlobalState } from './GlobalState';
import { useGlobalStateReducer } from './useGlobalStateReducer';


type Config = {
    selector?: (state: any) => any,
    patcher?: (state: any, selectedStateValue: any) => any
}

type ReturnType<ValueType> = [
    state: ValueType,
    setState: (state: any) => any,
    updateState: (
        updater: (currentState: any) => any
    ) => any
]

function useGlobalState<ValueType>(
    globalState: GlobalState<any>,
    config: Config = {},
): ReturnType<ValueType> {
    function reducer(currentState: any, newState: any) {
        return newState;
    }

    const [state, setState] = useGlobalStateReducer<ValueType>(reducer, globalState, config);

    function updateState(updater: (currentState: any) => any) {
        globalState.updateValue(updater, config.patcher, config.selector);
    }

    return [state, setState, updateState];
}

export { useGlobalState };
