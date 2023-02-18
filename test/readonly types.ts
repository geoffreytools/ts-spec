import { test } from '../src'

test('value/type readonly type', t =>
    t.not.equal ({ a: 1 }) <{ readonly a: number }>()
)

test('type/type readonly type', t =>
    t.not.equal<{ a: number }, { readonly a: number }>()
)

test('optional readonly', t =>
    t.not.equal<{ a?: number }, { readonly a?: number}>()
)