import { store } from '../store';
import { useGlobal } from './useGlobal';


function useGlobalState(key, initialValue, persist) {
    let globalState = store.getState(key, initialValue, persist);
    return useGlobal(globalState);
}

export { useGlobalState };
