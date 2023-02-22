import { test, _any } from '../src'

test('monomorphic functions', t => [
    t.equal<(a: any) => void, (a: any) => void>(),
    t.extends<(a: any) => void, (a: _any) => void>(),
    t.equal<(a: 1) => void, (a: 1) => void>(),
])