import { createGlobalstate, store } from './store';
import { 
    useGlobalReducer, useGlobal,  // Non key based API(Low level API)
    useGlobalStateReducer, useGlobalState,  // Key based API(High level API)
    useLocalState
} from './hooks';


export {
    createGlobalstate, useGlobalReducer, useGlobal,  // Non key based API(Low level API)
    store, useGlobalStateReducer, useGlobalState,  // Key based API(High level API)
    useLocalState
};
