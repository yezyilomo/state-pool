import StatePool from '../src/';


const store = StatePool.createStore({
    width: 10,
    height: 15
});

test('should get user values', () => {
    const [item1, item2] = store.items()

    expect(item1).toStrictEqual(["width", 10, false]);
    expect(item2).toStrictEqual(["height", 15, false]);
})