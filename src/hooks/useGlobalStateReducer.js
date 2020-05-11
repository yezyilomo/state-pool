import { store } from '../store';
import { useGlobalReducer } from './useGlobalReducer';


function useGlobalStateReducer(reducer, key, defaultValue) {
    let globalState = store.getState(key, defaultValue);
    return useGlobalReducer(reducer, globalState);
}


export { useGlobalStateReducer }
