import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { store, useGlobalStateReducer } from '../src/';


store.init({});
store.setState("count", 0);

test('should update count', () => {
    let reducer = (state, newState) => newState;

    const { result } = renderHook(() => useGlobalStateReducer(reducer, "count"))

    act(() => {
        result.current[1](1)
    })

    expect(result.current[0]).toStrictEqual(1)
})


test('should create `age` global state with the given default value', () => {
    let reducer = (state, newState) => newState;

    const { result } = renderHook(() => useGlobalStateReducer(reducer, "age", 18)) // Here 18 is the default value

    act(() => {
        result.current[1](result.current[0] + 2)
    })

    expect(result.current[0]).toStrictEqual(20)
})

