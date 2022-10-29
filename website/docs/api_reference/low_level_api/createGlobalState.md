---
sidebar_position: 1
---

# createGlobalState
This is the basic unit of **state-pool**, it's a function which is used to create a global state object, it accepts one parameter which is the initial value.

```js
// Signature
createGlobalState(initialValue: Any)
```

Here is how to use it

```js
import { createGlobalState } from 'state-pool';

const userName = createGlobalState("Yezy");
```

Some of the methods available in a global state object are `getValue`, `updateValue` and `subscribe`

- `getValue`: This is used to get the value of a global state
  ```js
  // Signature
  globalState.getValue(selector?: Function);
  ```
- `setValue`: This is used to set the value of a global state
  ```js
  // Signature
  globalState.setValue(value | stateUpdater: Any | Function, config?: {selector, patcher});
  ```
- `updateValue`: This is used to update the value of a global state
  ```js
  // Signature
  globalState.updateValue(updater: Function, config?: {selector, patcher});
  ```
- `subscribe`: This is used to listen to all changes from a global state
  ```js
  // Signature
  globalState.subscribe(observer: Function | Subscription: {observer, selector});
  ```

Below is an example showing all of them in action
```js
import { createGlobalState } from 'state-pool';

const count = createGlobalState(0);

count.getValue()  // This will give 0

count.setValue(1)  // This set the value of count to 1

count.updateValue(val => val+1)  // This will increment the value of count

// This will print whenever count change
const unsubscribe = count.subscribe(val => console.log(val)) 

unsubscribe()  // This will unsubscribe the observer above
```


:::important

`createGlobalState` should be used outside of a react component. 

:::

:::tip

`createGlobalState` is used to implement `store.setState` API. 

:::