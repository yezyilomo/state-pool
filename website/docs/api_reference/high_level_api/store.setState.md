---
sidebar_position: 2
---

# store.setState
This is used to create a global state and map it to a key so that you won't need to use it directly, instead you use a key to get it. `store.setState` takes two required parameters, a key(string) to map to a global state object and the initial value, In addition to those two parameters it takes a third optional parameter which is the configuration object. `persist` is the only available config which is the flag to determine whether to save/persist state in a permanent storage or not.

```js
// Signature
store.setState(key: String, initialState: Any, config?: {persist: Boolean})
```

Here is how to use it

```js
const userState = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}
store.setState("user", userState);
```

:::important

`store.setState` should be used outside of a react component.

:::

