import { test } from '../src'

interface Interface { readonly a: number }

type Type = { readonly a: number }

test('value/type readonly interface', t => t.not.equal
    ({ a: 1 })
    <Interface>()
)

test('value/type readonly type', t => t.not.equal
    ({ a: 1 })
    <Type>()
)

test('type/type readonly interface', t => t.not.equal<
    { a: number },
    Interface
>())

test('type/type readonly type', t => t.not.equal<
    { a: number },
    Type
>())
