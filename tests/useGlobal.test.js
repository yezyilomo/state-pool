import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useGlobal, createGlobalstate } from '../src/';


const count = createGlobalstate(0);

test('should update count', () => {
    const { result } = renderHook(() => useGlobal(count))

    act(() => {
        result.current[2](count => ++count)
    })

    expect(result.current[0]).toStrictEqual(1)
})


test('should set count', () => {
    const { result } = renderHook(() => useGlobal(count))

    act(() => {
        result.current[1](5)
    })

    expect(result.current[0]).toStrictEqual(5)
})



const user = createGlobalstate({ name: "Yezy", age: 20 });

test('should update name', () => {
    const selector = (user) => user.name;
    const patcher = (user, name) => { user.name = name }

    const { result } = renderHook(() => useGlobal(user, { selector, patcher }))

    act(() => {
        result.current[2]((name) => "Yezy Ilomo")
    })

    expect(result.current[0]).toStrictEqual("Yezy Ilomo")
})



test('should update name without patcher', () => {
    const selector = (user) => user.name;

    const { result } = renderHook(() => useGlobal(user, { selector }))

    act(() => {
        result.current[2]((usr) => {usr.name = "Ilomo"})
    })

    expect(result.current[0]).toStrictEqual("Ilomo")
})


test('should set name', () => {
    const selector = (user) => user.name;
    const patcher = (user, name) => { user.name = name }

    const { result } = renderHook(() => useGlobal(user, { selector, patcher }))

    act(() => {
        result.current[1]("Ilomo Yezy")
    })

    expect(result.current[0]).toStrictEqual("Ilomo Yezy")
})
