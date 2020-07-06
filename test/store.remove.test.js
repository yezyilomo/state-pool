import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { store, useGlobalState } from '../src/';


store.setState("count", 0);

test('should remove `count` global state and re-initialize it with value 10', () => {
    const hook1 = renderHook(() => useGlobalState("count"))

    act(() => {
        hook1.result.current[1](count => 1)
    })

    const hook2 = renderHook(() => useGlobalState("age", {default: 18}));

    act(() => {
        hook2.result.current[1](age => age + 2)
    })

    act(() => {
        store.remove("count", ()=>{ store.setState("count", 10); })
    })

    expect(hook1.result.current[0]).toStrictEqual(10)

    expect(hook2.result.current[0]).toStrictEqual(20)
})
