---
sidebar_position: 7
---

# store.remove
This is used to remove a state from a store if you don't need it anymore or you want to reload/reset it. It accepts a key for a state or a list of keys to remove and a function to run after removal.

:::important

The function runs before components subscribed to removed state(s) re-renders.

:::

```js
// Signature
store.remove(key: String, fn: Function)
```

Below is an example showing how to use it

```jsx
import React from 'react';
import { createStore } from 'state-pool';


const store = createStore();
store.setState("count", 0);

function ClicksCounter(props){
    const [count, setCount, updateCount] = store.useState("count");

    const incrementCount = (e) => {
        setCount(count+1);
    }

    const reinitializeCountState = () => {
        store.setState("count", 0);
    }

    const resetCounter = (e) => {
        store.remove("count", reinitializeCountState)
    }

    return (
        <div>
            Count: {count}
            <br/>
            <button onClick={incrementCount}>Click</button>
            <button onClick={resetCounter}>Reset</button>
        </div>
    );
}

ReactDOM.render(ClicksCounter, document.querySelector("#root"));
```

From an example above, when you click `Reset` button `store.remove` will remove `count` state and create it again by executing `initializeStore`.


**NOTE:** If we had more than one state to delete we could do

```js
store.remove([key1, key2, key3, ...], initializeStore);
```
