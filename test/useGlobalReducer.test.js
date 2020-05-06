import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useGlobalReducer, createGlobalstate } from '../src/';


const count = createGlobalstate(0);

test('should update count', () => {
    let reducer = (state, newState) => newState;

    const { result } = renderHook(() => useGlobalReducer(reducer, count))

    act(() => {
        result.current[1](1)
    })

    expect(result.current[0]).toStrictEqual(1)
})
