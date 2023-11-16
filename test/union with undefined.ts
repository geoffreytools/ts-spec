import { test } from '../src/index.js'

test('type/type', t => t.equal<
    number | undefined,
    number | undefined
>())

test('value/type', t => t.equal
    (1 as number | undefined)
    <number | undefined>()
)