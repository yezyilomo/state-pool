---
sidebar_position: 3
---

# useGlobalStateReducer
This is an alternative to `useGlobalState`, it works just like `React.useReducer` hook(If you’re familiar with `React.useReducer`, you already know how this works). It accepts a reducer and a global state object as parameters, it returns the current state paired with a dispatch method. In addition to the two parameters it also accept another optinal perameter which is the configuration object, available configurations are `selector` and `patcher` they work exactly the same just like in `useGlobalState`.


```js
// Signature
useGlobalStateReducer(
    reducer: Function,
    globalState: GlobalState,
    config?: {selector: Function, patcher: Function}
)
```

Below is a simple example showing how to use `useGlobalStateReducer`

```js
const initialGlobalState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

const user = createGlobalState(initialGlobalState);

function myReducer(state, action){
    // This could be any reducer
    // Do whatever you want to do here
    return newState
}

function Component(props){
    const [name, dispatch] = useGlobalStateReducer(myReducer, user);
    
    // Other stuff ...
}
```

Below is an example with `selector` and `patcher` parameters

```js
const initialGlobalState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

const user = createGlobalState(initialGlobalState);


function myReducer(state, action){
    // This could be any reducer
    // Do whatever you want to do here
    return newState
}

function UserInfo(props){
    const selector = (user) => user.name;
    const patcher = (user, name) => {user.name = name};
    
    const [name, dispatch] = useGlobalStateReducer(myReducer, user, {selector, patcher});

    // Other stuffs
}
```

:::tip

`useGlobalState` hook is derived from `useGlobalStateReducer` hook, also this hook is used to implement `store.useReducer`.

:::