import { store } from '../store';
import { useGlobalReducer } from './useGlobalReducer';


function useGlobalStateReducer(reducer, key, defaultValue, persist) {
    let globalState = store.getState(key, defaultValue, persist);
    return useGlobalReducer(reducer, globalState);
}


export { useGlobalStateReducer }
