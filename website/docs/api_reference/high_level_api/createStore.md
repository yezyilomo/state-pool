---
sidebar_position: 1
---

# createStore
Store is a container for state, it comes with several methods which are used to manage states in it including `store.setState`, `store.getState`, `store.remove`, `store.clear`, `store.useState`, `store.useReducer` and `store.subscribe`. Store is created by using `createStore` API as 

```js
import { createStore } from 'state-pool';

const store = createStore();

// Or with initialization as 

const store = createStore({"state1": value1, "state2": value2, ...});
```
