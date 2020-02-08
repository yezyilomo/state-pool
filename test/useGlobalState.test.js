import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useGlobalState, createGlobalstate } from '../src/';


const count = createGlobalstate(0);

test('should update count', () => {
    const { result } = renderHook(() => useGlobalState(count))

    act(() => {
        result.current[1](1)
    })

    expect(result.current[0]).toStrictEqual(1)
})

