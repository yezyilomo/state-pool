---
sidebar_position: 8
---

# store.clear
This is used to clear an entire store if you don't need all states in it anymore or you want to reload/reset all states. It accepts a function to run after clearing the store. 

:::important

 The function runs before components subscribed to all states in a store rerenders.

:::

```js
// Signature
store.clear(fn: Function)
```

Below is an example showing how to use it

```jsx
import React from 'react';
import { createStore } from 'state-pool';


const store = createStore();

const user = {
    name: "Yezy",
    age: 25,
    email: "yezy@me.com"
}
    
const profile = {
    url: "https://yezyilomo.me",
    rating: 5
}
store.setState("user", user);
store.setState("profile", profile);


function UserInfo(props){
    const [user, setUser, updateUser] = store.useState("user");

    const updateName = (e) => {
        updateUser(user => {
            user.name = e.target.value;
        });
    }

    const reinitializeStore = () => {
        const user = {name: "Yezy", age: 25, email: "yezy@me.com"}
        const profile = {url: "https://yezyilomo.me", rating: 5}
        store.setState("user", user);
        store.setState("profile", profile);
    }

    const resetStore = (e) => {
        store.clear(initializeStore);
    }

    return (
        <div>
            Name: {user.name}
            <br/>
            <input type="text" value={user.name} onChange={updateName}/>
             <button onClick={resetStore}>Reset Store</button>
        </div>
    );
}

ReactDOM.render(UserInfo, document.querySelector("#root"));
```
From the code above, when you click `Reset Store` button `store.clear` will remove all states from the store and create them again by executing `initializeStore`. This might come in handy when you need to clear all data when user logs out of your application.


**NOTE:** both `store.remove` and `store.clear` when executed causes all components subscribed to states which are removed to rerender.
