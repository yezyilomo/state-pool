import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useLocalState } from '../src/';


test('should update count', () => {
    const { result } = renderHook(() => useLocalState(0))

    act(() => {
        result.current[1](count => 1)
    })

    expect(result.current[0]).toStrictEqual(1)
})


test('should set count', () => {
    const { result } = renderHook(() => useLocalState(0))

    act(() => {
        result.current[2](5)
    })

    expect(result.current[0]).toStrictEqual(5)
})

