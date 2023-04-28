---
sidebar_position: 3
---

# useReducer
This is an alternative to `useState`, it works just like `React.useReducer` hook(If you’re familiar with `React.useReducer`, you already know how this works). It accepts a reducer and a state object or initial state or state initializer as parameters, it returns the current state paired with a dispatch method plus the state object, but in most cases you won't be using `stateObject` so you'll be okay with `[state, dispatch]`. In addition to the two parameters it also accept another optinal perameter which is the configuration object, available configurations are `selector` and `patcher` they work exactly the same just like in `useState`.


```js
// Signature
useReducer(
    reducer: Function,
    state: State,
    config?: {selector: Function, patcher: Function}
)

// Or in local state as

useReducer(
    reducer: Function,
    initialState: Any,
    config?: {selector: Function, patcher: Function}
)

// Or with lazy state initializer
useReducer(
    reducer: Function,
    stateInitializer: () => Any,
    config?: {selector: Function, patcher: Function}
)
```

Below is a simple example showing how to use `useReducer`

```js
const initialState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

const user = createState(initialState);

function myReducer(state, action){
    // This could be any reducer
    // Do whatever you want to do here
    return newState
}

function Component(props){
    const [name, dispatch] = useReducer(myReducer, user);
    
    // Other stuff ...
}
```

Below is the same example with `selector` and `patcher` parameters

```js
const initialState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

const user = createState(initialState);


function myReducer(state, action){
    // This could be any reducer
    // Do whatever you want to do here
    return newState
}

function UserInfo(props){
    const selector = (user) => user.name;
    const patcher = (user, name) => {user.name = name};
    
    const [name, dispatch] = useReducer(myReducer, user, {selector, patcher});

    // Other stuffs
}
```


# Using useReducer to manage local state
Just like in `useState`, `useReducer` can be used to manage local state too.

Here is an example for managing local state with `useReducer`
```jsx
import React from 'react';
import { useReducer } from 'state-pool';


const myReducer = (state, action) => {
   // Your computaton here
   return action;
}

function ClicksCounter(props){
    // Here `useReducer` hook will create "count" state and initialize it with 0
    // Note: the `useReducer` hook used here is impored from state-pool and not react
    const [count, dispatch] = useReducer(myReducer, 0);

    const incrementCount = (e) => {
        dispatch(count+1)
    }

    return (
        <div>
            Count: {count}
            <br/>
            <button onClick={incrementCount}>Click</button>
        </div>
    );
}

ReactDOM.render(ClicksCounter, document.querySelector("#root"));
```
<br/>

If you don't want **state-pool's** `useState` to collide with **React's** `useState` you can import `StatePool` and use the hook from there,


:::tip

`useState` hook is derived from `useReducer` hook, also this hook is used to implement `store.useReducer`.

:::