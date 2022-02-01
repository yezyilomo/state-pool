import { useState, useEffect, useRef } from 'react';
import { GlobalState } from './GlobalState';


type Reducer = (state: any, action: any) => any

type Config = {
    selector?: (state: any) => any,
    patcher?: (state: any, selectedStateValue: any) => any
}

type ReturnType<ValueType> = [
    state: ValueType,
    dispatch: (action: any) => any
]

function useGlobalStateReducer<ValueType=any>(
    reducer: Reducer,
    globalState: GlobalState<any>,
    config: Config = {}
): ReturnType<ValueType> {
    const [, setState] = useState(null);
    const isMounted = useRef(false);

    const selector = config.selector;
    const patcher = config.patcher;

    const currentState: ValueType = globalState.getValue<ValueType>(selector);
    
    function reRender() {
        // re-render if the component is mounted
        if (isMounted.current) {
            setState({});
        }
    }

    function observer(newState: any) {
        if (currentState === newState) {
            // Do nothing because the selected state has not changed
        }
        else {
            reRender();
        }
    }

    const subscription = {
        observer: observer,
        selector: selector ?
            selector :
            (state) => state,  // Select the whole global state if selector is not specified
        reRender: reRender
    }

    useEffect(() => {
        const unsubscribe = globalState.subscribe(subscription);
        isMounted.current = true;

        return () => {
            unsubscribe();
            isMounted.current = false;
        }
    }, [])

    function dispatch(action: any) {
        const newState = reducer(currentState, action);
        globalState.updateValue(oldState => newState, patcher, selector);
    }

    return [currentState, dispatch]
}

export { useGlobalStateReducer };
