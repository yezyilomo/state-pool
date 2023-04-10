---
sidebar_position: 4
---

# Managing Subscriptions
If you want to listen to changes in a store you can subscribe to it by using `store.subscribe`. it accepts an observer function. For example

```js
// Subscribe to store changes
const unsubscribe = store.subscribe(function(key: String, value: Any){
    // key is the key for a state that has changed 
    // value is the new value of a state
})

// You can unsubscribe by calling the result
unsubscribe();
```

If you want to subscribe to a single state you can use 

```js
// Subscribe to store changes
const unsubscribe = store.getState(key).subscribe(function(value){
    // value is the new value of a state
})

// You can unsubscribe by calling the result
unsubscribe();
```

You can even subscribe to a deeply nested state by using a selector as 

```js
store.getState(key).subscribe({
    observer:  function(value){
        // value is the new value of a state 
    },
    selector: function(value){
        return  selected_state
    })
})
```
With this, observer function will only be called when the selected state changes.


Another way to subscribe to nested state or derived state is to call `select` on a state then subscribe to it as

```js
store.getState(key).select(state => selected_state).subscribe(value =>{
        // Do your thing here
    }
)
```