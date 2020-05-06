import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { store, useGlobalState } from '../src/';


store.init({});
store.setState("count", 0);

test('should update count', () => {
    const { result } = renderHook(() => useGlobalState("count"))

    act(() => {
        result.current[1](count => 1)
    })

    expect(result.current[0]).toStrictEqual(1)
})
