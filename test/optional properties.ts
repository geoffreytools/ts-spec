import { test } from '../src'

test('handle optional properties', t => [
    t.not.equal<{ a: number; b?: string }, { a: number }>(),
    t.not.includes<{ a: number; b?: string }, { a: number }>(),
    t.extends<{ a: number; b?: string }, { a: number }>(),
    t.not.extends<{ a: number }, { a: number; b?: string }>(),
    t.includes<{ a: number }, { a: number; b?: string }>(),
])

test('unknown optional properties are equivalent to no nothing', t => [
    t.equal<{ a: number }, { a: number; b?: unknown }>(),
    t.equal<{}, { b?: unknown }>(),
])