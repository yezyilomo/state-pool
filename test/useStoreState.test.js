import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { initStore, setGlobalState, useStoreState } from '../src/';


initStore({});
setGlobalState("count", 0);

test('should update count', () => {
    const { result } = renderHook(() => useStoreState("count"))

    act(() => {
        result.current[1](1)
    })

    expect(result.current[0]).toStrictEqual(1)
})
