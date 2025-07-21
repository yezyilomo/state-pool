import State, { createState, DerivedState, createDerivedState } from './State';
import Store, { createStore } from './Store';
import useReducer from './useReducer';
import useState from './useState';


export {
    State, createState,
    Store, createStore,
    useState, useReducer,
    DerivedState, createDerivedState,
};


const StatePool = {
    State, createState,
    Store, createStore,
    useState, useReducer,
    DerivedState, createDerivedState,
}

export default StatePool;