import { getGlobalState } from '../store';
import { useGlobalState } from './useGlobalState';


function useStoreState(key) {
    let globalState = getGlobalState(key);
    return useGlobalState(globalState);
}

export { useStoreState };
