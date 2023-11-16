import { test } from '../src/index.js'

test('handle intrinsic utility type', t => t.not.equal<
    Uppercase<string>,
    Lowercase<string>
>())
