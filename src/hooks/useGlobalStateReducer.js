import { store } from '../store';
import { useGlobalReducer } from './useGlobalReducer';


function useGlobalStateReducer(reducer, key, config = {}) {
    const globalState = store.getState(key, config);
    return useGlobalReducer(reducer, globalState, config);
}


export { useGlobalStateReducer }
