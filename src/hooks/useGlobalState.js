import {useGlobalStateReducer} from './useGlobalStateReducer';


function useGlobalState(globalState){
    function reducer(state, newState){
        return newState
    }
    return useGlobalStateReducer(reducer, globalState);
}

export {useGlobalState};
