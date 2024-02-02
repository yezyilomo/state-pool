import StatePool, { State } from '../src/';


const store = StatePool.createStore({count: 0});

test('should get user values', () => {
    const isStateInstance = store.getState("count") instanceof State;
    expect(isStateInstance).toStrictEqual(true)
})