import StatePool from '../src/';


const store = StatePool.createStore({ count: 0 });

test('should get user values', () => {
    const inStore = store.has("count");
    const notInStore = store.has("user");

    expect(inStore).toStrictEqual(true);
    expect(notInStore).toStrictEqual(false);
})