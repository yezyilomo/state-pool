import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useGlobalStateReducer, createGlobalstate } from '../src/';


const count = createGlobalstate(0);

test('should update count', () => {
    const reducer = (state, newState) => newState;

    const { result } = renderHook(() => useGlobalStateReducer(reducer, count))

    act(() => {
        result.current[1](1)
    })

    expect(result.current[0]).toStrictEqual(1)
})


const user = createGlobalstate({ name: "Yezy", age: 20 });

test('should update name', () => {
    const reducer = (state, newState) => newState;

    const selector = (user) => user.name;
    const patcher = (user, name) => { user.name = name }

    const { result } = renderHook(() => useGlobalStateReducer(reducer, user, { selector, patcher }))

    act(() => {
        result.current[1]("Yezy Ilomo")
    })

    expect(result.current[0]).toStrictEqual("Yezy Ilomo")
})

