---
sidebar_position: 1
---

# Intro
State pool API is divided into two parts. 
1. High Level API(Store based API)
2. Low Level API(Non-Store based API)

In a high level API, global states are stored in a container that we call a store. With high level API, State pool allows you to create as many stores as you want and use them anywhere in your application, it doesn't enforce having a single central store.

Here is a simple example using high level API

```jsx
import React from 'react';
import { createStore } from 'state-pool';

// Create a store
const store = createStore();

// Create count global state and initialize it with 0
const count = store.setState("count", 0);

function ClicksCounter(props){
    // Use count global state
    const [count, setCount] = useGlobalState(count);

    const incrementCount = (e) => {
        setCount(count+1);
    }

    return (
        <div>
            Count: {count}
            <br/>
            <button onClick={incrementCount}>Click</button>
        </div>
    );
}

ReactDOM.render(ClicksCounter, document.querySelector("#root"));
```

<br/>

On the other hand, low level API doesn't use the concept of a store, You simply store your global state wherever you want. In low level API **state-pool** doesn't care where you store your global state as long as you can access them, for-instance I could choose to store my global state in a global variable and it would still work just fine.

So basically the low level API gives you a way to create and use global state, it doesn't matter where you store them as long as you can access them.

Here is the same example as the previous one re-written using low level API

```jsx
import React from 'react';
import { createGlobalState, useGlobalState } from 'state-pool';


// Create count global state and initialize it with 0
const count = createGlobalState(0);

function ClicksCounter(props){
    // Use count global state
    const [count, setCount] = useGlobalState(count);

    const incrementCount = (e) => {
        setCount(count+1);
    }

    return (
        <div>
            Count: {count}
            <br/>
            <button onClick={incrementCount}>Click</button>
        </div>
    );
}

ReactDOM.render(ClicksCounter, document.querySelector("#root"));
```

Now let's explore these two APIs
