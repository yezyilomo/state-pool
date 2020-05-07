import { store } from '../store';
import { useGlobal } from './useGlobal';


function useGlobalState(key, defaultValue) {
    let globalState = store.getState(key, defaultValue);
    return useGlobal(globalState);
}

export { useGlobalState };
