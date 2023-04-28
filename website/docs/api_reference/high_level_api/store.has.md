---
sidebar_position: 10
---

# store.has
`store.has` is a method for checking if a state is available in a store. If you try to get a state from a store with `store.getState(key)` and it’s not available, state-pool will throw an error, so we need a good way to handle this, i.e check if a state is available first, then access it, This is where `store.has` swoops in.

Here is an example of `store.has` in action


```js
// We want to access user state in a store but first we have to check if it's available
if(store.has("user")) {
    const user = store.getState("user");
}
else {
    // There is not user state in a store
}

```