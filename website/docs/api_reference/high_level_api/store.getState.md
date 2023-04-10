---
sidebar_position: 5
---

# store.getState
`store.getState` is used to get a state object from a store, it accepts one required parameter which is a key(string) and another optional parameters which is the configuration object(available configurations are `default` and `persist` works just like in `store.setState`). When called, `store.getState` returns a state object.

```js
// Signature
store.getState(key: String, config?: {default: Any, persist: Boolean})
```

Here is how to use it

```js
const State = store.getState(key);
```

