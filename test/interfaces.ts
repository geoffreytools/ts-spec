import { test, _ } from '../src'

type Foo = { helloWorld: string };

interface Bar {
    helloWorld: string;
}

interface Qux {
    helloWorld: any;
}

test("interfaces and objects are treated equally", t => [
    t.equal<Foo, Bar>(),
    t.not.equal<Foo, Qux>(),
    t.not.equal<Bar, Qux>()
]);