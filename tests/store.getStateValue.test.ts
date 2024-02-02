import React from 'react';
import StatePool from '../src/';


const store = StatePool.createStore({
    user: { name: "Yezy", age: 20 }
});

test('should get user values', () => {
    const selector = (user): string => user.name;

    expect(store.getStateValue("user")).toStrictEqual({ name: "Yezy", age: 20 })
    expect(store.getStateValue("user", selector)).toStrictEqual("Yezy")
})