---
sidebar_position: 2
---

# Using Store State
After creating a store and setting states to it we need to use our states in components. Here a store provides `store.useState` hook which is used to consume a state from a store in a component, it's basically a way for a component to subscribe to a global state from a store.

`store.useState` works just like `React.useState` hook but it accepts a key for the global state to use and returns an array of `[state, setState, updateState]` rather than `[state, setState]`.

In addition to the key parameter it also accept another optional parameter which is the config object, available configurations are `default`, `persist`, `selector` & `patcher`, these are discussed in detail on [`store.useState` API](/docs/api_reference/high_level_api/store.useState).

```js
// Signature
store.useState(
    key: String,
    config?: {default: Any, persist: Boolean, selector: Function, patcher: Function}
)
```

Below is an example showing how to use `store.useState` hook

```js
store.setState("user", {name: "Yezy", email: "yezy@me.com"});

function Component(props){
    const [user, setUser, updateUser] = store.useState("user");
    // Other stuff
}
```

Here `updateUser` is a higher order function which accepts another function for updating user as an argument(this another functions takes user(old state) as the argument). So to update any value on user you could do

```js
updateUser(function(user){
    user.name = "Yezy Ilomo";
    user.email = "hello@yezy.com";
})
```

Or you could just use `setUser` instead of `updateUser` i.e

```js
setUser({name: "Yezy Ilomo", email: "hello@yezy.com"});
```

Or 

```js
setUser(function(user){
    return {
        name: "Yezy Ilomo",
        email: "hello@yezy.com"
    }
})
```


<br/>

Another way to use store state is through `store.useReducer` which is an alternative to `store.useState`, it works just like `React.useReducer` hook(If you’re familiar with `React.useReducer`, you already know how this works).

`store.useReducer` accepts a reducer and a key for the global state as parameters, it returns the current state paired with a dispatch method.

In addition to the two parameters it also accept another optinal perameter which is the configuration object, available configurations are `default`, `persist`, `selector` & `patcher`, they work exactly the same just like in `store.useState`.


Below is a simple example showing how to use it

```js
store.setState("user", {name: "Yezy", email: "yezy@me.com"});

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

You can learn more about `store.useReducer` on [`store.useReducer` API section](/docs/api_reference/high_level_api/store.useReducer)

<br/>


:::tip
Both `store.useState` and `store.useReducer` accepts an optional `default` configuration, this is used to specify the default value if you want `store.useState` or `store.useReducer` to create a global state if it doesn't find the one for the key specified in the first argument. For example

  ```js
  const [user, setUser] = store.useState("user", {default: null});
  ```

  This piece of code means, get the global state for the key "user" if it's not available in a store, create one and assign it the value `null`. So state pool can create state dynamically.
:::