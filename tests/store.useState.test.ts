import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import StatePool from '../src/';


const store = StatePool.createStore({ count: 0 });  // initialize store during instantiation

test('should update count', () => {
    const { result } = renderHook(() => store.useState("count"))

    act(() => {
        result.current[1](count => 1)
    })

    expect(result.current[0]).toStrictEqual(1)
})


test('should create `age` state with the given default value', () => {
    const { result } = renderHook(() => store.useState("age", { default: 18 }));

    act(() => {
        result.current[1](age => age + 2)
    })

    expect(result.current[0]).toStrictEqual(20)
})


store.setState<{ name: string, age: number }>("user", { name: "Yezy", age: 20 });

test('should update name', () => {
    const selector = (user): string => user.name;
    const patcher = (user, name: string) => { user.name = name }

    const { result } = renderHook(() => store.useState("user", { selector, patcher }))

    act(() => {
        result.current[1]((name) => "Yezy Ilomo")
    })

    expect(result.current[0]).toStrictEqual("Yezy Ilomo")
})


test('should create `birthYear` state with the given state initializer on default', () => {
    const { result } = renderHook(() => store.useState("birthYear", { default: () => 1995 }));

    act(() => {
        result.current[1](birthYear => birthYear + 2)
    })

    expect(result.current[0]).toStrictEqual(1997)
})