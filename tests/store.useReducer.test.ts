import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { createStore } from '../src/';


const store = createStore();
store.setState("count", 0);

test('should update count', () => {
    const reducer = (state, newState) => newState;

    const { result } = renderHook(() => store.useReducer(reducer, "count"))

    act(() => {
        result.current[1](1)
    })

    expect(result.current[0]).toStrictEqual(1)
})


test('should create `age` state with the given default value', () => {
    const reducer = (state: number, newState: number): number => newState;

    const { result } = renderHook(() => store.useReducer(reducer, "age", {default: 18}));

    act(() => {
        result.current[1](result.current[0] + 2)
    })

    expect(result.current[0]).toStrictEqual(20)
})

