import { test } from '../src'

test('handle optional properties', t => t.not.equal<
    { a: number; b?: string }, { a: number }
>())