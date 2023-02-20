import { test } from '../src'

test('value/type readonly key', t =>
    t.not.equal ({ a: 1 }) <{ readonly a: number }>()
)

test('type/type readonly key', t =>
    t.not.equal<{ a: number }, { readonly a: number }>()
)

test('optional readonly key', t =>
    t.not.equal<{ a?: number }, { readonly a?: number}>()
)

test('extends and includes readonly key', t => [
    t.not.extends<{ readonly a: number }, { a: number }>(),
    t.not.includes<{ a: number }, { readonly a: number }>(),
    t.extends<{ a: number }, { readonly a: number }>(),
    t.includes<{ readonly a: number }, { a: number }>()
])