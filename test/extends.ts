import { test, _ } from '../src'

test('extends disambiguates A', t => [
    // @ts-expect-error: OK
    t.extends<[1, 2, any], [1, 2, 3]>(),
    // @ts-expect-error: OK
    t.extends<[1, 2, never], [1, 2, 3]>(),
    t.not.extends<[1, 2, any], [1, 2, 3]>(),
    t.not.extends<[1, 2, never], [1, 2, 3]>(),
])

test('extends does not disambiguate B', t => [
    t.extends<[1, 2, 3], [1, 2, unknown]>(),
    t.extends<[1, 2, 3], [1, 2, any]>(),
])
