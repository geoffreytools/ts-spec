import { test, _never } from '../src'

test('`_never` allows `never` to extend itself', t => [
    t.includes<[1, 2, _never], [1, 2, never]>(),
    t.extends<[1, 2, never], [1, 2, _never]>(),
])
