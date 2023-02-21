import { test } from '../src'

// nullary constructor 

class Foo {
    private value: string
    constructor () {
        this.value = 'foo'
    }
}

test("objects are distinct from their constructor", t => [
    t.not.includes<Foo, new () => Foo>(),
    t.not.extends<Foo, new () => Foo>(),
    t.not.includes<new () => Foo, Foo>(),
    t.not.extends<new () => Foo, Foo>(),
    t.not.equal<new () => Foo, Foo>(),
]);

test("typeof MyClass is a constructor", (t) => [
    t.includes<typeof Foo, new () => Foo>(),
    t.extends<typeof Foo, new () => Foo>(),
    t.extends<new () => Foo, typeof Foo>(),
    t.includes<new () => Foo, typeof Foo>(),
    t.equal<typeof Foo, new () => Foo>()
]);
