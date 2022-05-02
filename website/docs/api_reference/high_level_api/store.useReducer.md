---
sidebar_position: 4
---

# store.useReducer
This is an alternative to `store.useState`, it works just like `React.useReducer` hook((If you’re familiar with `React.useReducer`, you already know how this works). It accepts a reducer and a key for the global state as parameters, it returns the current state paired with a dispatch method. In addition to the two parameters it also accept another optinal perameter which is the configuration object, available configurations are `default`, `persist`, `selector` & `patcher` they work exactly the same just like in `store.useState`.

```js
// Signature
store.useReducer(
    reducer: Function,
    key: String,
    config?: {default: Any, persist: Boolean, selector: Function, patcher: Function}
)
```

Below is a simple example showing how to use `store.useReducer` hook

```js
const initialGlobalState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}

store.setState("user", initialGlobalState);

function myReducer(state, action){
    // This could be any reducer
    // Do whatever you want to do here
    return newState
}

function Component(props){
    const [name, dispatch] = store.useReducer(myReducer, "user");

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

store.setState("user", initialGlobalState);


function myReducer(state, action){
    // This could be any reducer
    // Do whatever you want to do here
    return newState
}

function UserInfo(props){
    const selector = (user) => user.name;
    const patcher = (user, name) => {user.name = name};
    
    const [name, dispatch] = store.useReducer(myReducer, "user", {selector, patcher});

    // Other stuff
}
```
