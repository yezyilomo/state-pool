import { store } from '../store';
import { useGlobal } from './useGlobal';


function useGlobalState(key, config = {}) {
    const globalState = store.getState(key, config);
    return useGlobal(globalState, config);
}

export { useGlobalState };
