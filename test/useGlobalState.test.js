import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { store, useGlobalState } from '../src/';


store.setState("count", 0);

test('should update count', () => {
    const { result } = renderHook(() => useGlobalState("count"))

    act(() => {
        result.current[1](count => 1)
    })

    expect(result.current[0]).toStrictEqual(1)
})


test('should create `age` global state with the given default value', () => {
    const { result } = renderHook(() => useGlobalState("age", {default: 18}));

    act(() => {
        result.current[1](age => age + 2)
    })

    expect(result.current[0]).toStrictEqual(20)
})
