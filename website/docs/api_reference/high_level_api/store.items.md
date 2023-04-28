---
sidebar_position: 11
---

# store.items
`store.items` is used to iterate over an entire store, it returns an array containing `key`, `value` and `persist` for each state in a store.


Here is how to use it.

```js
store.items().map(([key, value, persist]) => {
    // Do whatever you want with these values
})
```