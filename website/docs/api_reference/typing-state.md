---
sidebar_position: 4
---


# Typing State
All state related functions support implicity and explicity typing 

```ts
store.setState<number>('count', 0);

store.useState<number>('count');

store.useReducer<number>(reducer, 'count');

// For none key based
const count = createState<number>(0);

useState<number>(count);

useReducer<number>(reducer, count);


// Typing with selector
store.setState<{name: string, age: number}>('user', {name: 'Yezy', age: 25});

store.useState<string>('user', {selector: user => user.name});
store.useState<number>('age', {selector: user => user.age});

store.useReducer<string>(reducer, 'user', {selector: user => user.name});
store.useReducer<number>(reducer, 'user', {selector: user => user.age});

// For none key based
const user = createState<{name: string, age: number}>({name: 'Yezy', age: 25});

useState<string>(user, {selector: user => user.name});
useState<number>(user, {selector: user => user.age});

useReducer<string>(reducer, user, {selector: user => user.name});
useReducer<number>(reducer, user, {selector: user => user.age});
```
