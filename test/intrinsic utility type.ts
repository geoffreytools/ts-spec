import { test } from '../src'

test('handle intrinsic utility type', t => t.not.equal<
    Uppercase<string>,
    Lowercase<string>
>())
