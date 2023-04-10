import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { createStore } from '../src/';


const store = createStore();
store.setState("count", 0);

test('should clear the entire store and initialize `count` with 5', () => {
    const hook1 = renderHook(() => store.useState("count"))

    act(() => {
        hook1.result.current[1](count => 1)
    })

    act(() => {
        store.clear(()=>{ store.setState("count", 5); })
    })

    expect(hook1.result.current[0]).toStrictEqual(5)
})


const store2 = createStore();
store2.setState("count", 0);

test('should clear the entire store and initialize `age` with 18', () => {
    const hook2 = renderHook(() => store2.useState("age", {default: 18}));

    act(() => {
        hook2.result.current[1](age => age + 2)
    })

    act(() => {
        store2.clear(()=>{ })
    })

    expect(hook2.result.current[0]).toStrictEqual(18)
})

