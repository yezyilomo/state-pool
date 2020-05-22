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



const user = createGlobalstate({ name: "Yezy", age: 20 });

test('should update name', () => {
    const selector = (user) => user.name;
    const patcher = (user, name) => { user.name = name }

    const { result } = renderHook(() => useGlobal(user, { selector, patcher }))

    act(() => {
        result.current[1]((name) => "Yezy Ilomo")
    })

    expect(result.current[0]).toStrictEqual("Yezy Ilomo")
})



