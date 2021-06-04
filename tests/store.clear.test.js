import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { store, useGlobalState } from '../src/';


store.setState("count", 0);

test('should clear the entire global state and initialize `count` with 5 and `age` with 18', () => {
    const hook1 = renderHook(() => useGlobalState("count"))

    act(() => {
        hook1.result.current[2](count => 1)
    })

    const hook2 = renderHook(() => useGlobalState("age", {default: 18}));

    act(() => {
        hook2.result.current[2](age => age + 2)
    })

    act(() => {
        store.clear(()=>{ store.setState("count", 5); })
    })

    expect(hook1.result.current[0]).toStrictEqual(5)

    expect(hook2.result.current[0]).toStrictEqual(18)
})



