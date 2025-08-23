import { test } from '../src/index.js'

test('distinguish litteral from wider primitive', t => [
    t.not.equal<number, 1>(),
    t.not.equal<bigint, 1n>(),
    t.not.equal<number & { _tag: 'dollar' }, 1 & { _tag: 'dollar' }>(),
    t.not.equal<bigint & { _tag: 'dollar' }, 1n & { _tag: 'dollar' }>()
])
