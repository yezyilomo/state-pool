import { store } from '../store';
import { useGlobal } from './useGlobal';


function useGlobalState(key, defaultValue, persist) {
    let globalState = store.getState(key, defaultValue, persist);
    return useGlobal(globalState);
}

export { useGlobalState };
