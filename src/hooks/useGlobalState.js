import { store, Empty } from '../store';
import { useGlobal } from './useGlobal';


function useGlobalState(key, defaultValue = Empty) {
    let globalState = store.getState(key, defaultValue);
    return useGlobal(globalState);
}

export { useGlobalState };
