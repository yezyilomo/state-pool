---
sidebar_position: 1
---

# createState
This is the basic unit of **state-pool**, it's a function which is used to create a state object, it accepts one parameter which is the initial value.

```js
// Signature
createState(initialValue: Any)
```

Here is how to use it

```js
import { createState } from 'state-pool';

const userName = createState("Yezy");
```

Some of the methods available in a state object are `getValue`, `updateValue` and `subscribe`

- `getValue`: This is used to get the value of a state
  ```js
  // Signature
  State.getValue(selector?: Function);
  ```
- `setValue`: This is used to set the value of a state
  ```js
  // Signature
  State.setValue(value | stateUpdater: Any | Function, config?: {selector, patcher});
  ```
- `updateValue`: This is used to update the value of a state
  ```js
  // Signature
  State.updateValue(updater: Function, config?: {selector, patcher});
  ```
- `subscribe`: This is used to listen to all changes from a state
  ```js
  // Signature
  State.subscribe(observer: Function | Subscription: {observer, selector});
  ```
- `select`: This is used to derive another state or select a deeply nested state
  ```js
  // Signature
  State.select(selector: Function);
  ```
  This returns `DerivedState` that you can subscribe to by calling `subscribe` on it as
  ```js
  // Signature
  State.select(selector: Function).subscribe(observer: Function);
  ```

Below is an example showing all of them in action
```js
import { createState } from 'state-pool';

const count = createState(0);

count.getValue()  // This will give 0

count.setValue(1)  // This set the value of count to 1

// This will print whenever count change
const unsubscribe = count.subscribe(val => console.log(val)) 

unsubscribe()  // This will unsubscribe the observer above

// An example for nested state
const user = createState({name: "Yezy", weight: 65});

user.updateValue(user => {user.weight += 1})  // This will increment the weight

// Select user name and subscribe to it,
// this will be printing whenever user name changes
user.select(user => user.name).subscribe(name => console.log(name));
```


:::important

`createState` should be used outside of a react component. 

:::

:::tip

`createState` is used to implement `store.setState` API. 

:::