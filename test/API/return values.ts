import { test } from '../../src';

test('successful assertion', t =>
    t.pass()
)

test('failing assertion', t =>
    // @ts-expect-error: failing test
    t.fail()
)

test('successful array of assertions', t =>
    [t.pass(), t.pass()]
)

test('failing array of assertions', t => [
    t.pass(),
    // @ts-expect-error: failing test
    t.fail()
])

test(
    'failing array of assertions explicit return',
    // @ts-expect-error: failing function :(
    t => { return [ t.pass(), t.fail()]}
)

test('successful assertion returning function', t =>
    () => t.pass()
)

test('failing assertion returning function', t =>
    // @ts-expect-error: failing function :(
    () => t.fail()
)

test('successful assertion array returning function', t =>
    () => [t.pass(), t.pass()]
)

test('failing assertion array returning function', t =>
    // @ts-expect-error: failing function :(
    () => [t.fail(), t.pass()]
)
        
test('array of successful assertion returning functions', t => [
    () => t.pass(),
    () => t.pass(),
])
        
test('array of failing assertion returning functions', t => [
    () => t.pass(),
    // @ts-expect-error: failing function
    () => t.fail()
])

test('successful promise of assertion', async t =>
    t.pass()
)

test('successful promise of assertion', async t =>
    // @ts-expect-error: failing assertion
    t.fail()
)
    
test('successful promise of array of assertion', async t =>
    [t.pass(), t.pass()]
)
    
test('failing promise of array of assertion', async t => [
    t.pass(),
    // @ts-expect-error: failing assertion
    t.fail()
])

test('successful array of promises of assertion', t =>
    [Promise.resolve(t.pass()), Promise.resolve(t.pass())]
)

test('failing array of promises of assertion', t => [
    Promise.resolve(t.pass()),
    // @ts-expect-error: failing assertion
    Promise.resolve(t.fail())
])

test('successful arbitrary stuff', t => () => [
    () => [t.pass(), Promise.resolve(t.pass())],
    async () => [t.pass(), t.pass()]
])

test('failing arbitrary stuff', t =>
    // @ts-expect-error: failing function :(
    () => [
        () => [t.pass(), Promise.resolve(t.pass())],
        async () => [t.pass(), t.fail()]
    ])

test('failing arbitrary stuff', t =>
    // @ts-expect-error: failing function :(
    () => [
        () => [t.pass(), Promise.resolve(t.pass())],
        async () => [t.pass(), t.fail()]
    ])