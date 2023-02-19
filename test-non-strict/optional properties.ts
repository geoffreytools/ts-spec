import { test } from '../src'

test('do not handle optional properties', t => [
    t.equal<{ a: number; b?: string }, { a: number }>(),
    t.includes<{ a: number; b?: string }, { a: number }>(),
    t.extends<{ a: number }, { a: number; b?: string }>(),
])