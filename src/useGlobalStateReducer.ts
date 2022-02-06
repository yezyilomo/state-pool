import { useState, useEffect, useRef } from 'react';
import { GlobalState } from './GlobalState';


type Reducer = (state: any, action: any) => any

type Config = {
    selector?: (state: any) => any,
    patcher?: (state: any, selectedStateValue: any) => any
}

type ReturnType<T> = [
    state: T,
    dispatch: (action: any) => any
]

function useGlobalStateReducer<T=any>(
    reducer: Reducer,
    globalState: GlobalState<any>,
    config: Config = {}
): ReturnType<T> {
    const [, setState] = useState(null);
    const isMounted = useRef(false);

    const currentState: T = globalState.getValue<T>(config.selector);

    function reRender() {
        // re-render if the component is mounted
        if (isMounted.current) {
            setState({});
        }
    }

    function observer(newState: any) {
        if (currentState === newState) {
            // Do nothing because the selected state is up-to-date
        }
        else {
            reRender();
        }
    }

    const subscription = {
        observer: observer,
        selector: config.selector ?
            config.selector :
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
    }, [currentState, globalState])

    function dispatch(action: any) {
        const newState = reducer(currentState, action);
        globalState.updateValue(oldState => newState, config);
    }

    return [currentState, dispatch]
}

export { useGlobalStateReducer };
