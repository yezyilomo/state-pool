import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useGlobal, createGlobalstate } from '../src/';


const count = createGlobalstate(0);

test('should update count', () => {
    const { result } = renderHook(() => useGlobal(count))

    act(() => {
        result.current[1](count => ++count)
    })

    expect(result.current[0]).toStrictEqual(1)
})

