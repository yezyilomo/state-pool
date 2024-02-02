---
sidebar_position: 12
---

# store.getStateValue
This method is used to get state value directly from a store given its key, it's equivalent of calling `store.getState(key).getValue(selector?)`. You can pass `selector` too if you want to select part of the state.

```js
const userName = store.getStateValue("user", (user) => user.name);
```