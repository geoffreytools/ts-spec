import { test, _any } from '../src/index.js'

test('monomorphic functions', t => [
    t.equal<(a: any) => void, (a: any) => void>(),
    t.extends<(a: any) => void, (a: _any) => void>(),
    t.equal<(a: 1) => void, (a: 1) => void>(),
])

test('can detect difference with optional param', t => [
    // TODO
    // t.not.equal<() => void, (a?: number) => void>(),
])

test('works with function overload', t => {
    function foo(v: string): string
    function foo(v: number): number
    function foo(v: unknown) {
        return v
    }
    type F = typeof foo

    return t.force([
        t.equal<F, { (v: string): string, (v: number): number }>(),
        // TODO
        // t.not.equal<F, { (v: string): string, (v: number): string }>(),

        t.not.equal<F, { (v: number): number }>(),
        t.not.equal<F, { (v: string): number }>(),

        t.not.equal<(x: 0, y: null) => void, (x: number, y: string) => void>(),
        t.equal<
            ((x: 0, y: null) => void) & ((x: number, y: string) => void),
            ((x: number, y: string) => void) & ((x: 0, y: null) => void)
        >()
    ]);
})