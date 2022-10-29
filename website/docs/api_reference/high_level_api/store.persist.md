---
sidebar_position: 9
---

# store.persist
Sometimes you might want to save your global states in a permanent storage probably because you might not want to lose them when your application is closed(i.e you want to retain them when your application starts).

**State pool** makes it very easy to save your global states in your preferred permanent storage, all you need to do is:

1. Tell state-pool how to save your global state by using `store.persist`
2. Use `persist` configuration to tell state-pool to save your global state in your preferred storage when creating your global state.

When telling **state-pool**  how to save global state to a permanent storage we need to implement four functions which are 

1. `saveState`: This is for saving your global state to your preferred permanent storage, it should accept a `key` as the first parameter, `value` as the second parameter and `isInitialSet` as the third parameter, the third parameter is boolean which tells if the state is being saved for the first time(initial set) or it's just an update. This function is called automatically when `store.setState` is executed and when the  global state changes
2. `loadState`: This is used for loading state from your preferred permanent storage, it should accept a `key` as the first parameter and `noState` as the second parameter which is a constant(empty) to return if the state is not available from your permanent storage. This function is called when `store.setState` needs an initial value from your storage to populate a global state
3. `removeState`: This is used for removing state from a permanent storage, it should accept a `key` as the only parameter. This function is called when `store.remove` is executed
4. `clear`: This is used for clearing an entire permanent storage, it doesn’t accept any parameter. This function is called when `store.clear` is executed.

Now the way to implement these is by calling `store.persist` and pass them as shown below 

```js
store.persist({
    saveState: function(key, value, isInitialSet){/*your code to save state */},
    loadState: function(key, noState){/*your code to load state */},
    removeState: function(key){/*your code to remove state */},
    clear: function(){/*your code to clear storage */}
})
```

After implementing these four functions you're good to go, you won’t need to worry about calling them, **state-pool** will be doing that for you automatically so that you can focus on using your states.

As discussed earlier both `store.setState`, `store.useState` and `store.useReducer` accepts an optional configuration parameter, `persist` being one of configurations, this is the one which is used to tell **state-pool** whether to save your global state to a permanent storage or not. i.e

```js
store.setState(
    key: String,
    initialState: Any,
    config?: {persist: Boolean}
)
```

```js
store.useState(
    key: String,
    config?: {default: Any, persist: Boolean, ...otherConfigs}
)
```

```js
store.useReducer(
    reducer: Function,
    key: String,
    config?: {default: Any, persist: Boolean, ...otherConfigs}
)
```

By default the value of `persist` in all cases is false(which means it doesn't save global states to a permanent storage), so if you want to activate it, you have to set it to be true.

What's even better about **state-pool** is that you get the freedom to choose what to save in your permanent storage and what's not to, so you don't need to save the whole store in your permanent storage, but if you want to save the whole store you can use `PERSIST_ENTIRE_STORE` configuration.

Below is an example showing how you could implement state persistance in local storage.

```js
import { createStore } from 'state-pool';

const store = createStore();

let timerId: any = null
const DEBOUNCE_TIME = 1000  // In milliseconds

store.persist({
    PERSIST_ENTIRE_STORE: true,  // Use this only if you want to persist the entire store
    saveState: function(key, value, isInitialSet){
        const doStateSaving = () => {
            try {
                const serializedState = JSON.stringify(value);
                window.localStorage.setItem(key, serializedState);
            } catch {
                // Ignore write errors
            }
        }

        if(isInitialSet){
            // We don't debounce saving state since it's the initial set
            // so it's called only once and we need our storage to be updated
            // right away
            doStateSaving();
        }
        else {
            // Here we debounce saving state because it's the update and this function
            // is called every time the store state changes. However, it should not
            // be called too often because it triggers the expensive `JSON.stringify` operation.
            clearTimeout(timerId);
            timerId = setTimeout(doStateSaving, DEBOUNCE_TIME);
        }
    },
    loadState: function(key, noState){
        try {
            const serializedState = window.localStorage.getItem(key);
            if (serializedState === null) {
                // No state saved
                return noState
            }
            return JSON.parse(serializedState);
        } catch (err) {
            // Failed to load state
            return undefined
        }
    },
    removeState: function(key){
        window.localStorage.removeItem(key);
    },
    clear: function(){
        window.localStorage.clear();
    }
})

```

:::important

When you set `PERSIST_ENTIRE_STORE = true`, **state-pool** will be persisting all your global states to the permanent storage by default unless you explicitly specify `persist = false` when initializing your global state.

:::