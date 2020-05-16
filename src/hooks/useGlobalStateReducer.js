import { store } from '../store';
import { useGlobalReducer } from './useGlobalReducer';


function useGlobalStateReducer(reducer, key, initialValue, persist) {
    let globalState = store.getState(key, initialValue, persist);
    return useGlobalReducer(reducer, globalState);
}


export { useGlobalStateReducer }
